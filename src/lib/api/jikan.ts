import type {
  AnimeCharacterEdge,
  AnimeFull,
  AnimeGenre,
  AnimeSeason,
  AnimeStaffEdge,
  AnimeSummary,
  JikanListResponse,
  JikanSingleResponse,
  RecentEpisode,
  SearchAnimeParams,
} from "@/lib/types/anime";

const BASE_URL = "https://api.jikan.moe/v4";
const DEFAULT_REVALIDATE = 60 * 30; // 30 minutes, Jikan data doesn't change often.

export class JikanApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "JikanApiError";
    this.status = status;
  }
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Jikan enforces ~3 req/sec & 60 req/min. A single retry with backoff on 429
 * keeps the UI resilient without hammering the API.
 */
async function jikanFetch<T>(path: string, revalidate: number = DEFAULT_REVALIDATE): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const maxAttempts = 3;

  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate },
      });

      if (res.status === 429) {
        lastError = new JikanApiError("Rate limited by Jikan API", 429);
        await sleep(500 * (attempt + 1));
        continue;
      }

      if (res.status === 404) {
        throw new JikanApiError("Not found", 404);
      }

      if (!res.ok) {
        throw new JikanApiError(`Jikan API request failed with status ${res.status}`, res.status);
      }

      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof JikanApiError && (err.status === 404 || err.status === 400)) {
        throw err;
      }
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await sleep(400 * (attempt + 1));
      }
    }
  }

  if (lastError instanceof JikanApiError) throw lastError;
  throw new JikanApiError("Anime information is temporarily unavailable.", 503);
}

export interface PagedResult<T> {
  data: T[];
  hasNextPage: boolean;
  lastPage: number;
}

export async function getTopAnime(
  filter?: "airing" | "upcoming" | "bypopularity" | "favorite",
  page = 1,
  limit = 24,
): Promise<PagedResult<AnimeSummary>> {
  const qs = buildQuery({ filter, page, limit });
  const json = await jikanFetch<JikanListResponse<AnimeSummary>>(`/top/anime${qs}`);
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? page,
  };
}

export async function getTrendingAnime(page = 1, limit = 20): Promise<PagedResult<AnimeSummary>> {
  return getTopAnime("airing", page, limit);
}

export async function getPopularAnime(page = 1, limit = 24): Promise<PagedResult<AnimeSummary>> {
  return getTopAnime("bypopularity", page, limit);
}

export async function getTopRatedAnime(page = 1, limit = 12): Promise<PagedResult<AnimeSummary>> {
  const qs = buildQuery({ page, limit, order_by: "score", sort: "desc" });
  const json = await jikanFetch<JikanListResponse<AnimeSummary>>(`/top/anime${qs}`);
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? page,
  };
}

export async function getUpcomingAnime(page = 1, limit = 12): Promise<PagedResult<AnimeSummary>> {
  return getTopAnime("upcoming", page, limit);
}

export function getCurrentSeason(): { season: AnimeSeason; year: number } {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();
  let season: AnimeSeason;
  if (month >= 1 && month <= 3) season = "winter";
  else if (month >= 4 && month <= 6) season = "spring";
  else if (month >= 7 && month <= 9) season = "summer";
  else season = "fall";
  return { season, year };
}

export async function getSeasonNow(page = 1, limit = 24): Promise<PagedResult<AnimeSummary>> {
  const qs = buildQuery({ page, limit });
  const json = await jikanFetch<JikanListResponse<AnimeSummary>>(`/seasons/now${qs}`, 60 * 60);
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? page,
  };
}

export async function getSeasonAnime(
  year: number,
  season: AnimeSeason,
  page = 1,
  limit = 24,
): Promise<PagedResult<AnimeSummary>> {
  const qs = buildQuery({ page, limit });
  const json = await jikanFetch<JikanListResponse<AnimeSummary>>(
    `/seasons/${year}/${season}${qs}`,
    60 * 60,
  );
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? page,
  };
}

export async function getRecentEpisodes(page = 1): Promise<PagedResult<RecentEpisode>> {
  const qs = buildQuery({ page });
  const json = await jikanFetch<JikanListResponse<RecentEpisode>>(`/watch/episodes${qs}`, 60 * 15);
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? page,
  };
}

export async function searchAnime(params: SearchAnimeParams): Promise<PagedResult<AnimeSummary>> {
  const qs = buildQuery({
    q: params.q,
    page: params.page ?? 1,
    limit: params.limit ?? 24,
    genres: params.genres,
    status: params.status,
    order_by: params.order_by,
    sort: params.sort,
    type: params.type,
    sfw: true,
  });
  const json = await jikanFetch<JikanListResponse<AnimeSummary>>(`/anime${qs}`, 60 * 5);
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? params.page ?? 1,
  };
}

export async function getAnimeById(id: number): Promise<AnimeFull> {
  const json = await jikanFetch<JikanSingleResponse<AnimeFull>>(`/anime/${id}/full`);
  return json.data;
}

export async function getAnimeGenres(): Promise<AnimeGenre[]> {
  const json = await jikanFetch<JikanListResponse<AnimeGenre>>(`/genres/anime`, 60 * 60 * 12);
  return json.data;
}

export async function getAnimeByGenre(
  genreId: number,
  page = 1,
  limit = 24,
): Promise<PagedResult<AnimeSummary>> {
  const qs = buildQuery({ genres: genreId, page, limit, order_by: "popularity", sort: "asc", sfw: true });
  const json = await jikanFetch<JikanListResponse<AnimeSummary>>(`/anime${qs}`, 60 * 30);
  return {
    data: json.data,
    hasNextPage: json.pagination?.has_next_page ?? false,
    lastPage: json.pagination?.last_visible_page ?? page,
  };
}

export async function getAnimeCharacters(id: number): Promise<AnimeCharacterEdge[]> {
  const json = await jikanFetch<JikanListResponse<AnimeCharacterEdge>>(`/anime/${id}/characters`);
  return json.data;
}

export async function getAnimeStaff(id: number): Promise<AnimeStaffEdge[]> {
  const json = await jikanFetch<JikanListResponse<AnimeStaffEdge>>(`/anime/${id}/staff`);
  return json.data;
}

export async function getAnimeRecommendations(id: number): Promise<AnimeSummary[]> {
  const json = await jikanFetch<
    JikanListResponse<{ entry: AnimeSummary; votes: number }>
  >(`/anime/${id}/recommendations`);
  return json.data.map((item) => item.entry);
}

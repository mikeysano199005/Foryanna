// Types for the Jikan API (https://docs.api.jikan.moe/), trimmed to the fields ANIMORA uses.

export interface JikanImageSet {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanImages {
  jpg: JikanImageSet;
  webp?: JikanImageSet;
}

export interface JikanTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images?: {
    image_url?: string | null;
    small_image_url?: string | null;
    medium_image_url?: string | null;
    large_image_url?: string | null;
    maximum_image_url?: string | null;
  };
}

export interface JikanTitle {
  type: string;
  title: string;
}

export interface JikanDateParts {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface JikanAired {
  from: string | null;
  to: string | null;
  prop?: {
    from: JikanDateParts;
    to: JikanDateParts;
  };
  string: string | null;
}

export interface JikanNamedResource {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeSummary {
  mal_id: number;
  url: string;
  images: JikanImages;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  source?: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  duration?: string | null;
  rating?: string | null;
  score: number | null;
  scored_by?: number | null;
  rank: number | null;
  popularity: number | null;
  members?: number | null;
  favorites?: number | null;
  synopsis: string | null;
  year: number | null;
  season?: string | null;
  genres: JikanNamedResource[];
  themes?: JikanNamedResource[];
  demographics?: JikanNamedResource[];
  studios?: JikanNamedResource[];
  producers?: JikanNamedResource[];
  trailer?: JikanTrailer;
  aired?: JikanAired;
}

export interface AnimeFull extends AnimeSummary {
  titles?: JikanTitle[];
  background?: string | null;
  licensors?: JikanNamedResource[];
  broadcast?: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  relations?: {
    relation: string;
    entry: { mal_id: number; type: string; name: string; url: string }[];
  }[];
  external?: { name: string; url: string }[];
  streaming?: { name: string; url: string }[];
}

export interface AnimeCharacterEdge {
  character: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  role: string;
  voice_actors: {
    person: { mal_id: number; url: string; images: JikanImages; name: string };
    language: string;
  }[];
}

export interface AnimeStaffEdge {
  person: {
    mal_id: number;
    url: string;
    images: JikanImages;
    name: string;
  };
  positions: string[];
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

export interface RecentEpisode {
  entry: {
    mal_id: number;
    url: string;
    images: JikanImages;
    title: string;
  };
  episodes: {
    mal_id: number;
    url: string;
    title: string;
    premium: boolean;
  }[];
  region_locked: boolean;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page?: number;
  items?: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanListResponse<T> {
  data: T[];
  pagination?: JikanPagination;
}

export interface JikanSingleResponse<T> {
  data: T;
}

export type AnimeStatus = "airing" | "complete" | "upcoming";
export type AnimeOrderBy =
  | "title"
  | "score"
  | "scored_by"
  | "rank"
  | "popularity"
  | "favorites"
  | "start_date"
  | "episodes";
export type SortDirection = "asc" | "desc";
export type AnimeSeason = "winter" | "spring" | "summer" | "fall";

export interface SearchAnimeParams {
  q?: string;
  page?: number;
  limit?: number;
  genres?: string;
  status?: AnimeStatus;
  order_by?: AnimeOrderBy;
  sort?: SortDirection;
  type?: string;
}

// Lightweight shape used throughout the UI (cards, carousels, grids).
export interface AnimeCardData {
  id: number;
  title: string;
  titleEnglish: string | null;
  image: string;
  score: number | null;
  year: number | null;
  type: string | null;
  episodes: number | null;
  rank: number | null;
  status: string | null;
}

export function toCardData(anime: AnimeSummary): AnimeCardData {
  return {
    id: anime.mal_id,
    title: anime.title,
    titleEnglish: anime.title_english ?? null,
    image:
      anime.images?.webp?.large_image_url ||
      anime.images?.jpg?.large_image_url ||
      anime.images?.jpg?.image_url ||
      "",
    score: anime.score ?? null,
    year: anime.year ?? null,
    type: anime.type ?? null,
    episodes: anime.episodes ?? null,
    rank: anime.rank ?? null,
    status: anime.status ?? null,
  };
}

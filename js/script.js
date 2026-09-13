/* =========================================================
   YANNA — interaction layer
   Vanilla JS, no dependencies. Organized by concern:
   particles -> intro -> photo -> tap effects -> cinematic
   -> secret surprise -> final screen -> music
   ========================================================= */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  /* ---------------------------------------------------
     BACKGROUND PARTICLES
  --------------------------------------------------- */
  const Particles = (() => {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let points = [];
    let rafId = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makePoints() {
      const count = Math.round(Math.min(width, 900) / 14);
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.35 + 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.15 + 0.03,
        vy: (Math.random() - 0.5) * 0.06,
        vx: (Math.random() - 0.5) * 0.04,
      }));
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      points.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 225, 240, ${p.baseAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    let t = 0;
    function tick() {
      t += 1;
      ctx.clearRect(0, 0, width, height);
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;
        const twinkle = Math.sin(t * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = p.baseAlpha * (0.5 + twinkle * 0.5);
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 225, 240, ${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      resize();
      makePoints();
      if (reducedMotion) {
        drawStatic();
      } else {
        tick();
      }
      window.addEventListener('resize', () => {
        resize();
        makePoints();
        if (reducedMotion) drawStatic();
      });
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
    }

    return { start, stop };
  })();

  /* ---------------------------------------------------
     STATE
  --------------------------------------------------- */
  const stages = {
    intro: document.getElementById('stage-intro'),
    main: document.getElementById('stage-main'),
    cinematic: document.getElementById('stage-cinematic'),
    secret: document.getElementById('stage-secret'),
    final: document.getElementById('stage-final'),
  };

  function setState(name) {
    body.dataset.state = name;
  }

  /* ---------------------------------------------------
     INTRO -> OPEN
  --------------------------------------------------- */
  const openBtn = document.getElementById('open-btn');

  openBtn.addEventListener('click', () => {
    stages.intro.classList.add('is-leaving');
    Music.tryStart();

    window.setTimeout(() => {
      stages.intro.hidden = true;
      stages.main.hidden = false;
      setState('main');
      // trigger reveal animations on next frame
      requestAnimationFrame(() => stages.main.classList.add('is-active'));
    }, reducedMotion ? 50 : 1000);
  });

  /* ---------------------------------------------------
     PHOTO: load/placeholder + parallax
  --------------------------------------------------- */
  const photo = document.getElementById('yanna-photo');
  const placeholder = document.getElementById('photo-placeholder');
  const photoFrame = document.getElementById('photo-frame');
  const photoGlow = document.querySelector('.photo-glow');
  const photoWrap = document.getElementById('photo-wrap');

  photo.addEventListener('error', () => {
    photo.dataset.broken = 'true';
    placeholder.classList.add('is-visible');
  });
  photo.addEventListener('load', () => {
    if (photo.naturalWidth > 0) {
      placeholder.classList.remove('is-visible');
    }
  });
  // If the browser already failed to load before listeners attached
  if (photo.complete && photo.naturalWidth === 0) {
    photo.dataset.broken = 'true';
    placeholder.classList.add('is-visible');
  }

  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    photoWrap.addEventListener('mousemove', (e) => {
      const rect = photoWrap.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      photoFrame.style.transform = `rotateY(${relX * 8}deg) rotateX(${relY * -8}deg) translateZ(0)`;
      photoGlow.style.transform = `translate(${relX * 16}px, ${relY * 16}px)`;
    });
    photoWrap.addEventListener('mouseleave', () => {
      photoFrame.style.transform = '';
      photoGlow.style.transform = '';
    });
  }

  if (!reducedMotion) {
    photoWrap.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches.length) return;
      const rect = photoWrap.getBoundingClientRect();
      const t = e.touches[0];
      const relX = (t.clientX - rect.left) / rect.width - 0.5;
      const relY = (t.clientY - rect.top) / rect.height - 0.5;
      photoFrame.style.transform = `rotateY(${relX * 6}deg) rotateX(${relY * -6}deg)`;
      photoGlow.style.transform = `translate(${relX * 12}px, ${relY * 12}px)`;
    }, { passive: true });
  }

  /* ---------------------------------------------------
     TAP / CLICK EFFECTS
  --------------------------------------------------- */
  const tapLayer = document.getElementById('tap-layer');
  const headline = document.getElementById('headline');
  const subline = document.getElementById('subline');

  const phrasePool = [
    'I love you.',
    'I really love you.',
    'I love youuu.',
    'I love you, Yanna.',
    'I love you more.',
    'still you.',
    'always you.',
    '♡',
  ];
  let phraseBag = [];
  function nextPhrase() {
    if (phraseBag.length === 0) phraseBag = [...phrasePool];
    const i = Math.floor(Math.random() * phraseBag.length);
    return phraseBag.splice(i, 1)[0];
  }

  function spawnHeart(x, y) {
    const el = document.createElement('span');
    el.className = 'tap-fx tap-fx--heart';
    el.textContent = '♡';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    tapLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  function spawnSpark(x, y) {
    const el = document.createElement('span');
    el.className = 'tap-fx tap-fx--spark';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    tapLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  function spawnPhrase(x, y) {
    const el = document.createElement('span');
    el.className = 'tap-fx tap-fx--phrase';
    el.textContent = nextPhrase();
    el.style.left = x + 'px';
    el.style.top = Math.max(y - 30, 40) + 'px';
    tapLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  const CINEMATIC_THRESHOLD = 12;
  let tapCount = 0;
  let cinematicFired = false;

  function handleTap(x, y) {
    if (reducedMotion) {
      spawnSpark(x, y);
    } else if (Math.random() < 0.45) {
      spawnHeart(x, y);
    } else {
      spawnSpark(x, y);
    }

    if (tapCount >= 2 && Math.random() < 0.32) {
      spawnPhrase(x, y);
    }

    tapCount += 1;
    if (!cinematicFired && tapCount >= CINEMATIC_THRESHOLD) {
      cinematicFired = true;
      window.setTimeout(triggerCinematic, 260);
    }
  }

  document.addEventListener('pointerdown', (e) => {
    if (body.dataset.state !== 'main') return;
    if (e.target.closest('button')) return;
    handleTap(e.clientX, e.clientY);
  });

  /* ---------------------------------------------------
     CINEMATIC "I LOVE YOU" GROWTH
  --------------------------------------------------- */
  const cinematicText = document.getElementById('cinematic-text');
  const finalAffordance = document.getElementById('final-affordance');

  function triggerCinematic() {
    setState('cinematic');
    stages.cinematic.hidden = false;
    cinematicText.textContent = 'I LOVE YOU';
    cinematicText.className = 'cinematic-text';

    void cinematicText.offsetWidth; // restart animation
    cinematicText.classList.add('is-growing');

    const growDuration = reducedMotion ? 50 : 2800;

    window.setTimeout(() => {
      cinematicText.textContent = 'Yanna,\nI love you.';
      cinematicText.className = 'cinematic-text is-settling';

      const settleDuration = reducedMotion ? 50 : 1600;
      window.setTimeout(() => {
        stages.cinematic.hidden = true;
        setState('main');
        headline.textContent = 'Yanna,';
        subline.textContent = 'I love you.';
        window.setTimeout(() => {
          finalAffordance.hidden = false;
          requestAnimationFrame(() => finalAffordance.classList.add('is-shown'));
        }, 600);
      }, settleDuration);
    }, growDuration);
  }

  /* ---------------------------------------------------
     SECRET SURPRISE — long-press the photo
  --------------------------------------------------- */
  const secretText = document.getElementById('secret-text');
  let pressTimer = null;
  const LONG_PRESS_MS = 1400;

  function startPressTimer() {
    if (body.dataset.state !== 'main') return;
    clearTimeout(pressTimer);
    pressTimer = window.setTimeout(triggerSecret, LONG_PRESS_MS);
  }
  function cancelPressTimer() {
    clearTimeout(pressTimer);
  }

  photoWrap.addEventListener('pointerdown', startPressTimer);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((evt) =>
    photoWrap.addEventListener(evt, cancelPressTimer)
  );

  function triggerSecret() {
    const previousState = body.dataset.state;
    setState('secret');
    stages.secret.hidden = false;

    const lines = ['okay... one more thing.', 'I REALLY REALLY LOVE YOU.', '♡'];
    const holdMs = reducedMotion ? 400 : 1800;
    const fadeMs = reducedMotion ? 50 : 600;

    function showLine(i) {
      secretText.textContent = lines[i];
      secretText.className = 'secret-text is-shown';

      const isLast = i === lines.length - 1;
      const stay = isLast ? holdMs + 400 : holdMs;

      window.setTimeout(() => {
        if (isLast) {
          secretText.className = 'secret-text is-hiding';
          window.setTimeout(() => {
            stages.secret.hidden = true;
            setState(previousState === 'secret' ? 'main' : previousState);
          }, fadeMs);
        } else {
          secretText.className = 'secret-text is-hiding';
          window.setTimeout(() => showLine(i + 1), fadeMs);
        }
      }, stay);
    }

    showLine(0);
  }

  /* ---------------------------------------------------
     FINAL SCREEN
  --------------------------------------------------- */
  const finalTextEl = document.getElementById('final-text');
  const restartDot = document.getElementById('restart-dot');

  finalAffordance.addEventListener('click', () => {
    stages.main.hidden = true;
    stages.final.hidden = false;
    setState('final');

    const lines = ['Yanna', 'I love you.', "That's it.", 'I just wanted you to know. ♡'];
    const holdMs = reducedMotion ? 400 : 2000;
    const fadeMs = reducedMotion ? 50 : 700;

    function showLine(i) {
      finalTextEl.textContent = lines[i];
      finalTextEl.className = 'final-text is-shown';

      const isLast = i === lines.length - 1;

      window.setTimeout(() => {
        if (isLast) {
          restartDot.classList.add('is-shown');
        } else {
          finalTextEl.className = 'final-text is-hiding';
          window.setTimeout(() => showLine(i + 1), fadeMs);
        }
      }, holdMs);
    }

    showLine(0);
  });

  restartDot.addEventListener('click', () => {
    tapCount = 0;
    cinematicFired = false;
    headline.textContent = 'I LOVE YOU';
    subline.textContent = 'Yanna.';
    finalAffordance.classList.remove('is-shown');
    finalAffordance.hidden = true;
    restartDot.classList.remove('is-shown');

    stages.final.hidden = true;
    stages.main.hidden = true;
    stages.main.classList.remove('is-active');
    stages.intro.hidden = false;
    stages.intro.classList.remove('is-leaving');
    setState('intro');
  });

  /* ---------------------------------------------------
     MUSIC (optional — silent no-op if no audio file exists)
  --------------------------------------------------- */
  const Music = (() => {
    const audio = document.getElementById('bg-audio');
    const toggleBtn = document.getElementById('music-toggle');
    let available = false;

    audio.addEventListener('error', () => { available = false; }, true);
    audio.addEventListener('canplaythrough', () => {
      available = true;
      toggleBtn.hidden = false;
    });

    // preload=none by default; nudge a metadata check without forcing playback
    audio.preload = 'metadata';
    audio.load();

    function tryStart() {
      if (!available) return;
      audio.volume = 0.5;
      audio.play().then(() => {
        toggleBtn.setAttribute('aria-pressed', 'true');
      }).catch(() => {
        // autoplay blocked or no source; toggle button still lets her start it
      });
    }

    toggleBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => toggleBtn.setAttribute('aria-pressed', 'true')).catch(() => {});
      } else {
        audio.pause();
        toggleBtn.setAttribute('aria-pressed', 'false');
      }
    });

    return { tryStart };
  })();

  /* ---------------------------------------------------
     BOOT
  --------------------------------------------------- */
  Particles.start();
})();

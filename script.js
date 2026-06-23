/* ==========================================================================
   JUNG-MIN YOON — RESEARCH PORTFOLIO — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------
     0. Smooth-scroll for all in-page anchor links
  ---------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = 68;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  /* ----------------------------------------------------------------------
     1. Scroll progress bar
  ---------------------------------------------------------------------- */
  const progressBar = document.getElementById('progress-bar');
  function updateProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }

  /* ----------------------------------------------------------------------
     2. Navbar: hide on scroll-down, show on scroll-up + active link
  ---------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  let lastScroll = window.pageYOffset;

  function handleNavbarVisibility(){
    const cur = window.pageYOffset;
    if (cur > lastScroll && cur > 140) {
      navbar.classList.add('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastScroll = cur;
  }

  function updateActiveNav(){
    const navH = 80;
    let current = sections[0];
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top - navH <= 0) current = sec;
    }
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
    });
    updateFloatingLabel(current);
  }

  /* ----------------------------------------------------------------------
     3. Floating section label (sticky side indicator)
  ---------------------------------------------------------------------- */
  const floatingLabel = document.getElementById('floatingLabel');
  const labelNames = {
    home:'Home', about:'About Me', 'research-vision':'Research Vision',
    'athletic-foundation':'Athletic Foundation', 'research-focus':'Research Focus',
    trajectory:'Academic Trajectory', experience:'Research Experience',
    publications:'Publications', projects:'Projects', toolbox:'Methodological Toolbox',
    future:'Future Research', poster:'Poster', contact:'Contact'
  };
  function updateFloatingLabel(sec){
    if (!sec) return;
    floatingLabel.textContent = labelNames[sec.id] || '';
    floatingLabel.classList.toggle('show', window.pageYOffset > 200);
  }

  /* ----------------------------------------------------------------------
     4. Mobile hamburger nav
  ---------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  function closeMobileNav(){
    navToggle.classList.remove('open');
    navLinksWrap.classList.remove('open');
  }
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksWrap.classList.toggle('open');
  });

  /* ----------------------------------------------------------------------
     5. Back-to-top button
  ---------------------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');
  function updateBackToTop(){
    backToTop.classList.toggle('show', window.pageYOffset > 700);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ----------------------------------------------------------------------
     6. Master scroll handler (throttled via rAF)
  ---------------------------------------------------------------------- */
  let scrollScheduled = false;
  function onScroll(){
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateProgress();
      handleNavbarVisibility();
      updateActiveNav();
      updateBackToTop();
      scrollScheduled = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ----------------------------------------------------------------------
     7. Generic scroll-reveal (IntersectionObserver)
  ---------------------------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealItems.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------------------
     8. Vision section — line-by-line reveal
  ---------------------------------------------------------------------- */
  const visionLines = document.querySelectorAll('.vision-quote .vline');
  const visionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visionLines.forEach((line, i) => {
          setTimeout(() => line.classList.add('in'), i * 220);
        });
        visionObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (visionLines.length) visionObserver.observe(visionLines[0]);

  /* ----------------------------------------------------------------------
     9. Athletic Foundation — animated number counters
  ---------------------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const isYear = target > 1900;

    if (isYear) {
      // Years are a label, not a quantity — reveal directly with a small punch-in.
      el.textContent = target;
      el.style.transform = 'scale(.7)';
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        el.style.transition = 'transform .5s var(--ease), opacity .5s var(--ease)';
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      });
      return;
    }

    const duration = 1100;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------------------
     10. Academic Trajectory — timeline fill + dot reveal
  ---------------------------------------------------------------------- */
  const timelineFill = document.getElementById('timelineFill');
  const timelineItems = document.querySelectorAll('[data-t]');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (timelineFill) timelineFill.style.width = '100%';
        timelineItems.forEach((item, i) => {
          setTimeout(() => item.classList.add('in'), i * 220 + 200);
        });
        timelineObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (timelineItems.length) timelineObserver.observe(timelineItems[0].closest('.timeline'));

  /* ----------------------------------------------------------------------
     11. Toolbox pipeline — stage reveal + rail fill
  ---------------------------------------------------------------------- */
  const pipelineFill = document.getElementById('pipelineFill');
  const stages = document.querySelectorAll('[data-stage]');
  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (pipelineFill) pipelineFill.style.width = '100%';
        stages.forEach((s, i) => setTimeout(() => s.classList.add('in'), i * 180));
        pipelineObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const pipelineEl = document.getElementById('pipelineStages');
  if (pipelineEl) pipelineObserver.observe(pipelineEl);

  /* ----------------------------------------------------------------------
     12. Projects — accordion expand/collapse
  ---------------------------------------------------------------------- */
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-project]');
      const body = card.querySelector('.proj-body');
      const isOpen = card.classList.contains('open');

      // close all others (single-open accordion) — optional; comment out for multi-open
      document.querySelectorAll('[data-project].open').forEach(openCard => {
        if (openCard !== card) {
          openCard.classList.remove('open');
          openCard.querySelector('.proj-body').style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        card.classList.remove('open');
        body.style.maxHeight = '0px';
      } else {
        card.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // keep open accordion height correct on resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('[data-project].open').forEach(card => {
      const body = card.querySelector('.proj-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  });

  /* ----------------------------------------------------------------------
     12b. Poster Q&A — accordion expand/collapse (independent multi-open)
  ---------------------------------------------------------------------- */
  document.querySelectorAll('[data-qa-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-qa-group]');
      const body = group.querySelector('.qa-group-body');
      const isOpen = group.classList.contains('open');
      if (isOpen) {
        group.classList.remove('open');
        body.style.maxHeight = '0px';
      } else {
        group.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('[data-qa-group].open').forEach(group => {
      const body = group.querySelector('.qa-group-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  });

  /* ----------------------------------------------------------------------
     13. Image modal popup
  ---------------------------------------------------------------------- */
  const imgModal = document.getElementById('imgModal');
  const imgModalSrc = document.getElementById('imgModalSrc');
  const imgModalClose = document.getElementById('imgModalClose');

  document.querySelectorAll('[data-modal-img]').forEach(img => {
    img.addEventListener('click', () => {
      imgModalSrc.src = img.getAttribute('src');
      imgModalSrc.alt = img.getAttribute('alt') || '';
      imgModal.classList.add('open');
    });
  });
  function closeImgModal(){ imgModal.classList.remove('open'); imgModalSrc.src=''; }
  imgModalClose.addEventListener('click', closeImgModal);
  imgModal.addEventListener('click', (e) => { if (e.target === imgModal) closeImgModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeImgModal(); });

  /* ----------------------------------------------------------------------
     14. Video modal / play-overlay (in-place play, not full modal)
  ---------------------------------------------------------------------- */
  document.querySelectorAll('[data-play-target]').forEach(overlay => {
    const videoId = overlay.getAttribute('data-play-target');
    const video = document.getElementById(videoId);
    if (!video) return;
    overlay.addEventListener('click', () => {
      video.play();
      overlay.classList.add('hide');
    });
    video.addEventListener('pause', () => overlay.classList.remove('hide'));
    video.addEventListener('play', () => overlay.classList.add('hide'));
    video.addEventListener('ended', () => overlay.classList.remove('hide'));
  });

  /* ----------------------------------------------------------------------
     15. Cursor micro-interaction (desktop only, CSS handles touch hide)
  ---------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  if (window.matchMedia('(hover:hover) and (min-width:1000px)').matches && cursorDot) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    const growTargets = document.querySelectorAll('a, button, [data-toggle], [data-qa-toggle], .pillar, .badge, .exp-card, .pub-card, .poster-card, .tool-block, img[data-modal-img]');
    growTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
    });
  }

});

/* GROW UP MEDIA — interaction layer. External libraries load from established CDNs. */
document.body.classList.add('is-loading');

window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  const revealPage = () => {
    document.body.classList.remove('is-loading');
    AOS.init({ once: true, offset: 45, duration: 750, easing: 'cubic-bezier(.22,.61,.36,1)' });
    setupSmoothScroll();
  };

  if (window.gsap) {
    const tl = gsap.timeline({ onComplete: revealPage });
    tl.to('.splash-logo', { opacity: 1, scale: 1, rotation: -4, duration: .75, ease: 'back.out(1.9)' })
      .to('.logo-orbit', { opacity: 1, duration: .35 }, '-=.48')
      .to('.orbit-one', { rotation: 360, duration: 2.1, ease: 'none' }, '-=.4')
      .to('.orbit-two', { rotation: -360, duration: 2.4, ease: 'none' }, '-=2.1')
      .to('.splash-name', { opacity: 1, y: -3, duration: .42 }, '-=1.65')
      .to('.splash-tagline', { opacity: 1, duration: .42 }, '-=.18')
      .to('.loader-line span', { width: '100%', duration: 1.1, ease: 'power2.inOut' }, '-=.2')
      .to({}, { duration: 1.05 })
      .to(preloader, { opacity: 0, duration: .7, ease: 'power2.inOut' })
      .set(preloader, { display: 'none' });
  } else { setTimeout(() => { preloader.style.display = 'none'; revealPage(); }, 4000); }
});

function setupSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .85 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { event.preventDefault(); lenis.scrollTo(target, { offset: -72 }); }
    }));
  }
}

// Typed hero alternates three brand-growth phrases.
if (typeof Typed !== 'undefined') new Typed('#typewriter', { strings: ['so you will Grow.'], typeSpeed: 52, backSpeed: 27, backDelay: 1750, loop: false, smartBackspace: true, showCursor: true, cursorChar: '|' });

// A deliberately lightweight particle field, kept behind content for performance.
if (window.particlesJS && innerWidth > 650) particlesJS('particles-js', { particles: { number: { value: 48, density: { enable: true, value_area: 900 } }, color: { value: ['#ffc83d', '#ffffff', '#ec438c'] }, shape: { type: 'circle' }, opacity: { value: .38, random: true }, size: { value: 2.4, random: true }, line_linked: { enable: true, distance: 130, color: '#ffc83d', opacity: .1, width: 1 }, move: { enable: true, speed: 1.05, direction: 'none', out_mode: 'out' } }, interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'grab' }, resize: true }, modes: { grab: { distance: 120, line_linked: { opacity: .22 } } } }, retina_detect: true });

// Small Three.js constellation is paused visually by CSS when a reduced-motion preference is set.
function initThree() {
  if (!window.THREE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
  camera.position.z = 7;
  const group = new THREE.Group(); scene.add(group);
  const geometry = new THREE.IcosahedronGeometry(1.25, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xffc83d, wireframe: true, transparent: true, opacity: .24 });
  const object = new THREE.Mesh(geometry, material); object.position.set(2.6, .15, 0); group.add(object);
  const small = new THREE.Mesh(new THREE.TorusKnotGeometry(.46, .1, 75, 10), new THREE.MeshBasicMaterial({ color: 0xec438c, wireframe: true, transparent: true, opacity: .34 })); small.position.set(-2.8, -1.4, -1); group.add(small);
  const mouse = { x: 0, y: 0 }; window.addEventListener('pointermove', e => { mouse.x = (e.clientX / innerWidth - .5) * .35; mouse.y = (e.clientY / innerHeight - .5) * .24; });
  function resize() { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', resize); resize();
  function render() { group.rotation.y += .0014; object.rotation.x += .002; small.rotation.y -= .009; group.rotation.x += (mouse.y - group.rotation.x) * .015; group.rotation.y += (mouse.x - group.rotation.y) * .009; renderer.render(scene, camera); requestAnimationFrame(render); }
  render();
}
if (innerWidth > 650) initThree();

// Header, section navigation, scroll progress and back-to-top.
const header = document.querySelector('.site-header'); const progress = document.querySelector('.scroll-progress span'); const topButton = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => { const y = window.scrollY; header.classList.toggle('scrolled', y > 40); topButton.classList.toggle('visible', y > 650); const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${max ? y / max * 100 : 0}%`; }, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const navLinks = [...document.querySelectorAll('.nav-link')]; const navSections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)); }), { rootMargin: '-40% 0px -55%' }); navSections.forEach(section => observer.observe(section)); }

// Mobile navigation.
const toggle = document.querySelector('.nav-toggle'), navMenu = document.querySelector('.nav-links');
toggle.addEventListener('click', () => { const open = navMenu.classList.toggle('open'); toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); }); navLinks.forEach(link => link.addEventListener('click', () => { navMenu.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

// Counter animation starts only when visitor reaches the values.
function animateCounter(element) { const end = Number(element.dataset.count); const suffix = element.dataset.suffix || '+'; const duration = 1350; const start = performance.now(); function tick(now) { const amount = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - amount, 3); element.textContent = Math.floor(end * eased); if (amount < 1) requestAnimationFrame(tick); else element.textContent = end; } requestAnimationFrame(tick); }
if ('IntersectionObserver' in window) { const counted = new WeakSet(); const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting && !counted.has(entry.target)) { counted.add(entry.target); animateCounter(entry.target); } }), { threshold: .55 }); document.querySelectorAll('[data-count]').forEach(count => counterObserver.observe(count)); }

// Pointer and magnetic interaction are switched off on touch devices.
if (matchMedia('(pointer:fine)').matches) { const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring'); window.addEventListener('pointermove', e => { dot.style.cssText += `;left:${e.clientX}px;top:${e.clientY}px;opacity:1`; ring.style.cssText += `;left:${e.clientX}px;top:${e.clientY}px;opacity:1`; }); document.querySelectorAll('a,button,input,textarea').forEach(item => { item.addEventListener('mouseenter', () => ring.classList.add('hover')); item.addEventListener('mouseleave', () => ring.classList.remove('hover')); }); document.querySelectorAll('.magnetic').forEach(item => { item.addEventListener('mousemove', e => { const b = item.getBoundingClientRect(), x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2; item.style.transform = `translate(${x * .11}px,${y * .11}px)`; }); item.addEventListener('mouseleave', () => item.style.transform = ''); }); }
document.querySelectorAll('.ripple').forEach(button => button.addEventListener('click', e => { const rect = button.getBoundingClientRect(); button.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`); button.classList.remove('rippling'); void button.offsetWidth; button.classList.add('rippling'); }));

if (typeof Swiper !== 'undefined') new Swiper('.testimonial-swiper', { slidesPerView: 1.12, spaceBetween: 15, loop: true, speed: 700, autoplay: { delay: 4500, disableOnInteraction: false }, navigation: { nextEl: '.swiper-next', prevEl: '.swiper-prev' }, breakpoints: { 651: { slidesPerView: 2, spaceBetween: 22 }, 980: { slidesPerView: 3, spaceBetween: 24 } } });
document.querySelector('#year').textContent = new Date().getFullYear();
// Hover sound hook (intentionally disabled): document.querySelectorAll('.button').forEach(el => el.addEventListener('mouseenter', playHoverSound));

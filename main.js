// Orange Beauty Studio — interactions

// Header shadow on scroll
const hdr = document.getElementById('hdr');
const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const mnav = document.getElementById('mnav');
const openMenu = () => mnav.classList.add('open');
const closeMenu = () => mnav.classList.remove('open');
document.getElementById('burger').addEventListener('click', openMenu);
document.getElementById('mnavClose').addEventListener('click', closeMenu);
mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// Reserve space for sticky mobile call bar
if (window.matchMedia('(max-width: 640px)').matches) {
  document.body.classList.add('has-callbar');
}

// ── Lightbox ──────────────────────────────────────────
var lbEl   = document.getElementById('lb');
var lbImg  = document.getElementById('lbImg');
var lbPrev = document.getElementById('lbPrev');
var lbNext = document.getElementById('lbNext');
var lbItems = [], lbIdx = 0;

function lbShow(arr, i){
  lbItems = arr; lbIdx = i;
  lbImg.src = arr[i];
  lbPrev.style.display = arr.length > 1 ? '' : 'none';
  lbNext.style.display = arr.length > 1 ? '' : 'none';
  lbEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function lbHide(){
  lbEl.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}
function lbStep(d){
  lbIdx = (lbIdx + d + lbItems.length) % lbItems.length;
  lbImg.src = lbItems[lbIdx];
}

if(lbEl){
  document.getElementById('lbClose').addEventListener('click', lbHide);
  lbPrev.addEventListener('click', function(){ lbStep(-1); });
  lbNext.addEventListener('click', function(){ lbStep(1); });
  lbEl.addEventListener('click', function(e){ if(e.target === lbEl) lbHide(); });
}
document.addEventListener('keydown', function(e){
  if(!lbEl || !lbEl.classList.contains('open')) return;
  if(e.key === 'Escape')      lbHide();
  if(e.key === 'ArrowLeft')   lbStep(-1);
  if(e.key === 'ArrowRight')  lbStep(1);
});

// ── Галерея ───────────────────────────────────────────
var galleryEl = document.querySelector('.gallery');
if(galleryEl){
  var galleryLinks = Array.prototype.slice.call(galleryEl.querySelectorAll('.ph'));
  var galleryUrls  = galleryLinks.map(function(a){ return a.getAttribute('href'); });
  galleryEl.addEventListener('click', function(e){
    var link = e.target.closest('.ph');
    if(!link) return;
    e.preventDefault();
    var i = galleryLinks.indexOf(link);
    lbShow(galleryUrls, i >= 0 ? i : 0);
  });
}

// ── Фото майстрів ─────────────────────────────────────
document.querySelectorAll('.master .pic').forEach(function(pic){
  var img = pic.querySelector('img');
  if(!img) return;
  pic.style.cursor = 'pointer';
  pic.addEventListener('click', function(){
    lbShow([img.src.replace('w_600','w_1200')], 0);
  });
});

// ── Картки "Наш простір" ──────────────────────────────
document.querySelectorAll('.pcard-wrap').forEach(function(card){
  var shots = Array.prototype.slice.call(card.querySelectorAll('.pshot'));
  if(!shots.length) return;
  var urls = shots.map(function(s){ return s.src.replace('w_600','w_1200'); });
  var frame = card.querySelector('.pcard-frame');
  if(frame){
    frame.style.cursor = 'pointer';
    frame.addEventListener('click', function(){
      var activeIdx = shots.findIndex(function(s){ return s.classList.contains('active'); });
      lbShow(urls, activeIdx >= 0 ? activeIdx : 0);
    });
  }
});

// ── Відео — повноекранний режим ───────────────────────
var vid = document.querySelector('.prostir-video-wrap video');
if(vid){
  vid.style.cursor = 'pointer';
  vid.title = 'Натисніть для повноекранного перегляду';
  vid.addEventListener('click', function(){
    if(vid.requestFullscreen)          vid.requestFullscreen();
    else if(vid.webkitRequestFullscreen) vid.webkitRequestFullscreen();
    else if(vid.mozRequestFullScreen)    vid.mozRequestFullScreen();
  });
}

// Наш простір — polaroid slideshow
document.querySelectorAll('[data-prostir-slide]').forEach((shots, i) => {
  const photos = shots.querySelectorAll('.pshot');
  if (photos.length <= 1) return;
  const dotsEl = shots.closest('.pcard-wrap')?.querySelector('[data-prostir-dots]');
  const dots = dotsEl ? dotsEl.querySelectorAll('.pcard-dot') : [];
  let current = 0;
  // stagger start so cards don't all change at the same time
  setTimeout(() => {
    setInterval(() => {
      photos[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (current + 1) % photos.length;
      photos[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }, 3200);
  }, i * 900);
});

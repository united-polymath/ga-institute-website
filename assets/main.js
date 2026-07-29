(function(){
  var drawer=document.getElementById('drawer'), burger=document.getElementById('burger');
  function closeDrawer(){ if(drawer){drawer.classList.remove('open'); burger&&burger.setAttribute('aria-expanded','false');} }
  function openDrawer(){ if(drawer){drawer.classList.add('open'); burger&&burger.setAttribute('aria-expanded','true');} }
  function closeModals(){ [].forEach.call(document.querySelectorAll('.modal.open'),function(m){m.classList.remove('open');}); }
  function openModal(id){ closeModals(); var m=document.getElementById(id); if(m) m.classList.add('open'); }
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-member]')){ e.preventDefault(); closeDrawer(); openModal('memberModal'); return; }
    if(e.target.closest('[data-open-login]')){ e.preventDefault(); closeDrawer(); openModal('loginModal'); return; }
    if(e.target.closest('.modal-x') || (e.target.classList && e.target.classList.contains('modal'))){ closeModals(); return; }
    if(e.target.closest('#drawer a')){ closeDrawer(); }
  });
  if(burger) burger.addEventListener('click',function(){ drawer.classList.contains('open')?closeDrawer():openDrawer(); });
  var dc=document.getElementById('drawerClose'); if(dc) dc.addEventListener('click',closeDrawer);
  document.addEventListener('submit',function(e){ e.preventDefault(); closeModals(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeModals(); closeDrawer(); } });
  var file=(location.pathname.split('/').pop()||'index.html'); if(!file) file='index.html';
  [].forEach.call(document.querySelectorAll('nav.menu a[href$=".html"]'),function(a){ if(a.getAttribute('href')===file) a.classList.add('active'); });
})();

/* 추천 도서 표지 자동 로딩 (Google Books API · 키 불필요 · 실패 시 디자인 표지 유지) */
(function(){
  var books=[].slice.call(document.querySelectorAll('.book'));
  books.forEach(function(b){
    var isbn=(b.getAttribute('data-isbn')||'').trim();
    var q=(b.getAttribute('data-q')||'').trim();
    var query=isbn? ('isbn:'+isbn) : q;
    if(!query) return;
    var url='https://www.googleapis.com/books/v1/volumes?maxResults=1&country=KR&q='+encodeURIComponent(query);
    fetch(url).then(function(r){return r.ok?r.json():null;}).then(function(d){
      if(!d||!d.items||!d.items.length) return;
      var info=d.items[0].volumeInfo||{};
      var links=info.imageLinks||{};
      var src=links.thumbnail||links.smallThumbnail;
      if(!src) return;
      src=src.replace(/^http:/,'https:').replace(/&edge=curl/,'').replace(/zoom=\d/,'zoom=1');
      var el=b.querySelector('.bcover-img'); if(!el) return;
      el.onload=function(){ el.classList.add('loaded'); };
      el.src=src;
    }).catch(function(){});
  });
})();

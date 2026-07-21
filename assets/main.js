(function(){
  var modal=document.getElementById('loginModal');
  function openModal(){ if(modal) modal.classList.add('open'); }
  function closeModal(){ if(modal) modal.classList.remove('open'); }
  var drawer=document.getElementById('drawer'), burger=document.getElementById('burger');
  function openDrawer(){ if(drawer){drawer.classList.add('open'); burger&&burger.setAttribute('aria-expanded','true');} }
  function closeDrawer(){ if(drawer){drawer.classList.remove('open'); burger&&burger.setAttribute('aria-expanded','false');} }
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-open-login]')){ e.preventDefault(); closeDrawer(); openModal(); }
    if(e.target.closest('[data-close]') || e.target===modal){ closeModal(); }
    if(e.target.closest('#drawer a[href]')){ closeDrawer(); }
  });
  if(burger) burger.addEventListener('click',function(){ drawer.classList.contains('open')?closeDrawer():openDrawer(); });
  var dc=document.getElementById('drawerClose'); if(dc) dc.addEventListener('click',closeDrawer);
  if(drawer) drawer.addEventListener('click',function(e){ if(e.target===drawer) closeDrawer(); });
  var mf=modal&&modal.querySelector('form'); if(mf) mf.addEventListener('submit',function(e){ e.preventDefault(); closeModal(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeModal(); closeDrawer(); } });
  // active nav by filename
  var file=(location.pathname.split('/').pop()||'index.html'); if(!file) file='index.html';
  [].forEach.call(document.querySelectorAll('nav.menu a[href$=".html"]'),function(a){
    if(a.getAttribute('href')===file) a.classList.add('active');
  });
})();

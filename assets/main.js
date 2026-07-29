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
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeModals(); closeDrawer(); } });

  // ===== 약관 전체동의 연동 =====
  var agreeAll=document.getElementById('agreeAll');
  var items=[].slice.call(document.querySelectorAll('.agree-item'));
  if(agreeAll){
    agreeAll.addEventListener('change',function(){ items.forEach(function(c){ c.checked=agreeAll.checked; }); });
    items.forEach(function(c){ c.addEventListener('change',function(){ agreeAll.checked=items.every(function(x){return x.checked;}); }); });
  }

  // ===== 폼 처리 =====
  function note(el,msg,type){ if(!el) return; el.hidden=false; el.textContent=msg; el.className='form-note '+(type||'info'); }
  function val(f,name){ var el=f.querySelector('[name='+name+']'); return el?el.value.trim():''; }
  document.addEventListener('submit',function(e){
    e.preventDefault();
    var f=e.target;
    if(f.id==='signupForm'){
      var msg=document.getElementById('signupNote');
      if(!val(f,'name')||!val(f,'email')||!val(f,'pw')||!val(f,'pw2')){ note(msg,'필수 정보를 모두 입력해 주세요.','err'); return; }
      if(f.querySelector('[name=pw]').value!==f.querySelector('[name=pw2]').value){ note(msg,'비밀번호가 일치하지 않습니다.','err'); return; }
      var reqs=[].slice.call(f.querySelectorAll('.agree-item[data-required]'));
      if(!reqs.every(function(c){return c.checked;})){ note(msg,'필수 약관에 동의해 주세요.','err'); return; }
      openModal('signupDoneModal'); return;
    }
    if(f.id==='loginForm'){
      note(document.getElementById('loginNote'),'회원가입은 담당자 승인 후 완료됩니다. 승인 전까지는 로그인이 제한됩니다.','info'); return;
    }
    if(f.id==='contactForm'){
      note(document.getElementById('contactNote'),'문의가 접수되었습니다. 확인 후 이메일로 답변드리겠습니다.','ok'); f.reset(); return;
    }
    closeModals();
  });

  // ===== 활성 메뉴 =====
  var file=(location.pathname.split('/').pop()||'index.html'); if(!file) file='index.html';
  [].forEach.call(document.querySelectorAll('nav.menu a[href$=".html"]'),function(a){ if(a.getAttribute('href')===file) a.classList.add('active'); });
})();

/* 추천 도서 표지 자동 로딩 (Open Library · 키 불필요 · 한도 없음 · 실패 시 디자인 표지 유지) */
(function(){
  var books=[].slice.call(document.querySelectorAll('.book'));
  books.forEach(function(b){
    var el=b.querySelector('.bcover-img'); if(!el) return;
    var isbn=(b.getAttribute('data-isbn')||'').trim();
    var q=(b.getAttribute('data-q')||'').trim();
    function setImg(src){ el.onload=function(){ el.classList.add('loaded'); }; el.src=src; }
    if(isbn){ setImg('https://covers.openlibrary.org/b/isbn/'+encodeURIComponent(isbn)+'-M.jpg?default=false'); return; }
    if(!q) return;
    fetch('https://openlibrary.org/search.json?limit=1&fields=cover_i,isbn&q='+encodeURIComponent(q))
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){
        var doc = d && d.docs && d.docs[0]; if(!doc) return;
        if(doc.cover_i){ setImg('https://covers.openlibrary.org/b/id/'+doc.cover_i+'-M.jpg'); }
        else if(doc.isbn && doc.isbn[0]){ setImg('https://covers.openlibrary.org/b/isbn/'+doc.isbn[0]+'-M.jpg?default=false'); }
      }).catch(function(){});
  });
})();

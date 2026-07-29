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

/* 추천 도서 표지 자동 로딩 (Open Library · 여러 판 중 표지 자동 선택 · 중복 제거) */
(function(){
  var books=[].slice.call(document.querySelectorAll('.book'));
  var groups={};
  books.forEach(function(b){
    var key=(b.getAttribute('data-isbn')||'')+'@@'+(b.getAttribute('data-q')||'');
    (groups[key]=groups[key]||[]).push(b);
  });
  Object.keys(groups).forEach(function(key){
    var arr=groups[key], b0=arr[0];
    var isbn=(b0.getAttribute('data-isbn')||'').trim();
    var q=(b0.getAttribute('data-q')||'').trim();
    function apply(src){ arr.forEach(function(b){ var img=b.querySelector('.bcover-img'); if(!img) return; img.onerror=null; img.onload=function(){img.classList.add('loaded');}; img.src=src; }); }
    function searchCover(){
      if(!q) return;
      fetch('https://openlibrary.org/search.json?limit=20&fields=cover_i&q='+encodeURIComponent(q))
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(d){
          var docs=(d&&d.docs)||[];
          for(var i=0;i<docs.length;i++){ if(docs[i].cover_i){ apply('https://covers.openlibrary.org/b/id/'+docs[i].cover_i+'-M.jpg'); return; } }
        }).catch(function(){});
    }
    if(isbn){
      var first=arr[0].querySelector('.bcover-img');
      if(first){ first.onerror=function(){ first.onerror=null; searchCover(); };
        first.onload=function(){ apply('https://covers.openlibrary.org/b/isbn/'+encodeURIComponent(isbn)+'-M.jpg'); };
        first.src='https://covers.openlibrary.org/b/isbn/'+encodeURIComponent(isbn)+'-M.jpg?default=false'; }
    } else { searchCover(); }
  });
})();

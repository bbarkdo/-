(function () {
  'use strict';
  var D = window.DW, info = D.info;
  var DAYS = ['월', '화', '수', '목', '금', '토'];
  var TYPE_LABEL = { baby: '유아반', elem: '초등반', private: '개인·소그룹', adult: '성인반' };
  var $ = function (id) { return document.getElementById(id); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fmtDate(s) { var p = s.split('-'); return +p[1] + '월 ' + +p[2] + '일'; }
  function endTime(t, mins) { var p = t.split(':'), m = +p[0] * 60 + +p[1] + mins; return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // 남은 자리 → 상태
  function seat(cap, cur) {
    var left = cap - cur;
    if (left <= 0) return { k: 'full', left: 0, txt: '마감 · 대기 접수' };
    if (left === 1) return { k: 'few', left: 1, txt: '1자리 남음' };
    return { k: 'open', left: left, txt: left + '자리 남음' };
  }
  var form = $('consultForm'), msg = $('formMsg'), who = 'kids', wishes = [];

  function badge(s) { return '<span class="badge ' + s.k + '"><i class="seat ' + s.k + '"></i>' + s.txt + '</span>'; }

  /* ---------- 기본 정보 채우기 ---------- */
  var telHref = 'tel:' + info.tel.replace(/[^0-9]/g, '');
  ['telBtn', 'dockTel', 'iTel'].forEach(function (id) { $(id).href = telHref; });
  $('iTel').textContent = info.tel;
  $('iAddr').textContent = info.address;
  $('iPark').textContent = info.parking;
  $('iHours').innerHTML = info.hours.map(function (h) { return '<li><b>' + esc(h[0]) + '</b> ' + esc(h[1]) + '</li>'; }).join('');
  $('fInfo').textContent = info.name + ' · ' + info.address + ' · ' + info.tel;
  if (info.kakao) { $('kakaoBtn').href = info.kakao; $('kakaoBtn').hidden = false; }

  /* ---------- 메뉴 ---------- */
  var menuBtn = $('menuBtn'), nav = $('nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); } });

  /* ---------- 시간표 ---------- */
  var tt = { f: 'all', open: false, day: DAYS[(new Date().getDay() + 6) % 7] || '월' };
  if (DAYS.indexOf(tt.day) < 0) tt.day = '월';
  D.classes.forEach(function (c, i) { c.id = i; c.s = seat(c.cap, c.cur); });
  $('ttUpdated').textContent = fmtDate(D.updated) + ' 기준 여석';

  function visible(c) { return (tt.f === 'all' || c.type === tt.f) && (!tt.open || c.s.k !== 'full'); }
  function clsBtn(c, mobile) {
    var days = c.days.join('/') + (c.days.length > 1 ? ' · 주 ' + c.days.length + '회' : '');
    return '<button type="button" class="cls t-' + c.type + (c.s.k === 'full' ? ' is-full' : '') + '" data-id="' + c.id + '" ' +
      'aria-label="' + esc(c.name + ' ' + days + ' ' + c.time + ', ' + c.s.txt + ', 누르면 상담 신청서에 추가') + '">' +
      (mobile ? '<span class="tm">' + c.time + '</span><span><span class="cn">' + esc(c.name) + '</span><span class="cl">' + esc(c.level) + ' · ' + days + '</span></span>' + badge(c.s)
              : '<span class="cn">' + esc(c.name) + '</span><span class="cl">' + esc(c.level) + '</span>' + badge(c.s)) +
      '</button>';
  }
  function renderTT() {
    var list = D.classes.filter(visible);
    var times = D.classes.map(function (c) { return c.time; }).filter(function (t, i, a) { return a.indexOf(t) === i; }).sort();
    // PC 표
    var h = '<thead><tr><th>시간</th>' + DAYS.map(function (d) { return '<th>' + d + '</th>'; }).join('') + '</tr></thead><tbody>';
    times.forEach(function (t) {
      var row = DAYS.map(function (d) {
        return '<td>' + list.filter(function (c) { return c.time === t && c.days.indexOf(d) >= 0; }).map(function (c) { return clsBtn(c); }).join('') + '</td>';
      }).join('');
      h += '<tr><td class="time">' + t + '</td>' + row + '</tr>';
    });
    $('ttGrid').innerHTML = h + '</tbody>';
    // 모바일 탭
    $('ttDays').innerHTML = DAYS.map(function (d) {
      var n = list.filter(function (c) { return c.days.indexOf(d) >= 0 && c.s.k !== 'full'; }).length;
      return '<button type="button" role="tab" aria-selected="' + (d === tt.day) + '" data-d="' + d + '">' + d + '<small>' + (n ? '빈자리 ' + n : '&nbsp;') + '</small></button>';
    }).join('');
    var dl = list.filter(function (c) { return c.days.indexOf(tt.day) >= 0; }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
    $('ttList').innerHTML = dl.length ? dl.map(function (c) { return clsBtn(c, true); }).join('') : '<p class="tt-empty">조건에 맞는 수업이 없어요. 대기 접수로 원하는 시간을 남겨주세요!</p>';
    markPicked();
  }
  $('ttFilter').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    tt.f = b.dataset.f;
    [].forEach.call(this.children, function (x) { x.setAttribute('aria-pressed', x === b); });
    renderTT();
  });
  $('ttOpenOnly').addEventListener('change', function () { tt.open = this.checked; renderTT(); });
  $('ttDays').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { tt.day = b.dataset.d; renderTT(); } });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.cls'); if (!b) return;
    var c = D.classes[+b.dataset.id];
    setWho(c.type === 'adult' || /성인/.test(c.name) ? 'adult' : 'kids');
    var progVal = c.type === 'adult' ? '성인 소그룹' : c.type === 'private' ? '' : '키즈정규반';
    if (progVal) { var box = who === 'kids' ? $('progKids') : $('progAdult'); var cb = box.querySelector('input[value="' + progVal + '"]'); if (cb) { cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); } }
    addWish({ days: c.days.slice(), time: c.time, freq: c.days.length, label: c.name + (c.s.k === 'full' ? ' (대기)' : ''), cid: c.id });
    $('consult').scrollIntoView({ behavior: 'smooth' });
  });
  renderTT();

  /* ---------- 방학특강 ---------- */
  var sp = D.special, td = today();
  var spOn = sp && sp.show && td >= sp.from && td <= sp.to;
  if (spOn) {
    sp.sessions.forEach(function (s) { s.s = seat(s.cap, s.cur); });
    var openCnt = sp.sessions.reduce(function (a, s) { return a + s.s.left; }, 0);
    $('special').hidden = false; $('navSp').hidden = false; $('spRibbon').hidden = false;
    $('spRibbonTag').textContent = sp.badge;
    $('spRibbonTxt').textContent = sp.title + (openCnt ? ' · 남은 자리 ' + openCnt + '석' : ' · 대기 접수 중');
    $('spBadge').textContent = $('spmBadge').textContent = sp.badge;
    $('spTitle').textContent = $('spmTitle').textContent = sp.title;
    $('spPeriod').textContent = $('spmPeriod').textContent = sp.period;
    $('spDesc').textContent = sp.desc;
    $('spUpdated').textContent = fmtDate(sp.updated) + ' 기준 ·';
    $('spNote').textContent = sp.note;
    $('spList').innerHTML = sp.sessions.map(function (s, i) {
      return '<div class="sp-item' + (s.s.k === 'full' ? ' is-full' : '') + '"><span class="nm">' + esc(s.name) + '</span><span class="tm">' + esc(s.time) + '</span>' +
        '<span class="tg">' + esc(s.target) + '</span>' + badge(s.s) +
        '<button type="button" class="mini" data-sp="' + i + '">' + (s.s.k === 'full' ? '대기 접수하기' : '이 시간 신청하기') + '</button></div>';
    }).join('');
    $('spmList').innerHTML = sp.sessions.map(function (s) { return '<li><span><b>' + esc(s.name) + '</b> ' + esc(s.time) + '</span>' + badge(s.s) + '</li>'; }).join('');
    $('spList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-sp]'); if (!b) return;
      var s = sp.sessions[+b.dataset.sp];
      setWho('kids');
      addWish({ text: sp.badge + ' ' + s.name + ' · 평일 ' + s.time + (s.s.k === 'full' ? ' (대기)' : '') });
      $('consult').scrollIntoView({ behavior: 'smooth' });
    });
    // 팝업 (하루 1회)
    var modal = $('spModal');
    function closeModal() { modal.hidden = true; }
    if (sp.popup && store('dw_sp_hide') !== td) setTimeout(function () { modal.hidden = false; }, 700);
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
    $('spmToday').addEventListener('click', function () { store('dw_sp_hide', td); closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------- 가격 ---------- */
  var pIdx = 0;
  function renderPrice() {
    var p = D.prices[pIdx];
    $('pTabs').innerHTML = D.prices.map(function (x, i) { return '<button type="button" role="tab" aria-selected="' + (i === pIdx) + '" data-i="' + i + '">' + esc(x.label) + '</button>'; }).join('');
    $('pBody').innerHTML = '<p class="pd">' + esc(p.desc) + '</p><table class="ptable"><thead><tr>' + p.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + p.rows.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }
  $('pTabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { pIdx = +b.dataset.i; renderPrice(); } });
  $('pNotes').innerHTML = D.priceNotes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('');
  renderPrice();

  /* ---------- 갤러리: 사진이 있으면 자동 교체 ---------- */
  [].forEach.call(document.querySelectorAll('.ph[data-src]'), function (el) {
    var img = new Image();
    img.onload = function () { el.style.backgroundImage = 'url("' + el.dataset.src + '")'; el.classList.add('has-img'); };
    img.src = el.dataset.src;
  });

  /* ==========================================================
     대기 접수 · 상담 신청
     - 휴대폰: 문자 앱을 열고 서식에 맞춘 내용을 자동 입력
     - PC: QR 코드 → 휴대폰으로 찍으면 같은 문자가 작성됨
     ========================================================== */
  var IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  if (!IS_MOBILE) {
    $('consultSub').textContent = '아래 내용을 채우고 버튼을 누르면 QR 코드가 나와요. 휴대폰 카메라로 찍으면 접수 문자가 바로 작성됩니다.';
    $('submitBtn').textContent = '접수 내용 만들기';
  }

  function setWho(w) {
    who = w;
    [].forEach.call(form.querySelectorAll('.form-tabs button'), function (b) { b.setAttribute('aria-selected', b.dataset.who === w); });
    [].forEach.call(form.querySelectorAll('.only-kids'), function (el) { el.hidden = w !== 'kids'; });
    [].forEach.call(form.querySelectorAll('.only-adult'), function (el) { el.hidden = w !== 'adult'; });
    $('progKids').hidden = w !== 'kids'; $('progAdult').hidden = w !== 'adult';
    $('regularBox').hidden = !(w === 'kids' && $('kRegular').checked);
  }
  form.querySelector('.form-tabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setWho(b.dataset.who); });
  $('kRegular').addEventListener('change', function () { $('regularBox').hidden = !this.checked; });
  form.addEventListener('change', function (e) {
    if (e.target.name === 'shuttle') $('k-pickup').hidden = !$('shY').checked;
  });

  // 희망 시간 목록
  var tOpts = '<option value="">시간 선택</option>';
  for (var m = 9 * 60; m <= 21 * 60; m += 30) tOpts += '<option>' + pad(Math.floor(m / 60)) + ':' + pad(m % 60) + '</option>';
  $('wTime').innerHTML = tOpts + '<option value="시간 무관">시간 무관</option>';
  function wishText(w) {
    return w.text || (w.days.join('/') + ' ' + w.time + (w.label ? ' ' + w.label : ''));
  }
  function addWish(w) {
    var key = wishText(w);
    if (wishes.some(function (x) { return wishText(x) === key; })) { flashList(); return; }
    wishes.push(w); renderWish(); flashList();
  }
  function flashList() { var l = $('wishList'); l.style.outline = '3px solid var(--coral)'; l.style.borderRadius = '12px'; setTimeout(function () { l.style.outline = ''; }, 900); }
  function renderWish() {
    var l = $('wishList');
    if (!wishes.length) { l.innerHTML = '<li class="empty">시간표에서 수업을 누르거나, 위에서 요일·시간을 골라 추가하세요.</li>'; markPicked(); return; }
    l.innerHTML = wishes.map(function (w, i) {
      var freq = w.text ? '' : '<select class="freq" data-i="' + i + '" aria-label="주 수업 횟수">' +
        [1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (n === w.freq ? ' selected' : '') + '>주 ' + n + '회</option>'; }).join('') + '</select>';
      return '<li><span class="wl">' + (i + 1) + '순위 · ' + esc(wishText(w)) + '</span>' + freq + '<button type="button" class="x" data-i="' + i + '" aria-label="삭제">×</button></li>';
    }).join('');
    markPicked();
  }
  function markPicked() {
    var ids = wishes.map(function (w) { return w.cid; });
    [].forEach.call(document.querySelectorAll('.cls'), function (b) { b.classList.toggle('picked', ids.indexOf(+b.dataset.id) >= 0); });
  }
  $('wishList').addEventListener('click', function (e) { var b = e.target.closest('.x'); if (b) { wishes.splice(+b.dataset.i, 1); renderWish(); } });
  $('wishList').addEventListener('change', function (e) { if (e.target.classList.contains('freq')) wishes[+e.target.dataset.i].freq = +e.target.value; });
  $('wAdd').addEventListener('click', function () {
    var days = [].slice.call($('wDays').querySelectorAll('input:checked')).map(function (i) { return i.value; });
    var time = $('wTime').value;
    if (!days.length || !time) { showErr('희망 요일과 시간을 골라주세요.'); return; }
    msg.hidden = true;
    addWish({ days: days, time: time, freq: Math.min(days.length, 5) });
    [].forEach.call($('wDays').querySelectorAll('input'), function (i) { i.checked = false; }); $('wTime').value = '';
  });

  function val(id) { return $(id).value.trim(); }
  function radio(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }
  function progs() { return [].slice.call((who === 'kids' ? $('progKids') : $('progAdult')).querySelectorAll('input:checked')).map(function (i) { return i.value; }); }
  function showErr(t) { msg.hidden = false; msg.className = 'form-msg err'; msg.textContent = t; }

  function buildBody() {
    var p = progs().join(', ') || '상담 후 결정';
    var w = wishes.length ? wishes.map(function (x) { return '\n - ' + wishText(x) + (x.text ? '' : ' 주 ' + x.freq + '회'); }).join('') : ' 상담 후 결정';
    var memo = val('f-memo') || '없음';
    if (who === 'kids') {
      var shuttle = radio('shuttle') === '이용' ? '이용 (픽업 장소: ' + (val('k-pickup') || '상담 시 안내') + ')' : '미이용';
      var b = '[다이나믹웨이브 불당점 대기접수 · 유아/어린이]\n' +
        '1. 아동명 / 나이 : ' + val('k-name') + ' / ' + (val('k-age') || '-') + '\n' +
        '2. 보호자 연락처 : ' + val('f-phone') + '\n' +
        '3. 희망 프로그램 : ' + p + '\n' +
        '4. 희망 요일·시간·주 횟수 :' + w + '\n' +
        '5. 선호 개월수 : ' + radio('months') + '\n' +
        '6. 셔틀 이용 : ' + shuttle + '\n' +
        '7. 기타 요청 사항 : ' + memo;
      if ($('kRegular').checked) b += '\n※ 정규반 · 수영 강습 경험 : ' + (radio('k-exp') || '-') + ' / 현재 진도 : ' + (val('k-level') || '-');
      return b;
    }
    return '[다이나믹웨이브 불당점 대기접수 · 성인]\n' +
      '1. 성함 / 생년월일 / 성별 : ' + val('a-name') + ' / ' + (val('a-birth') || '-') + ' / ' + (radio('a-gender') || '-') + '\n' +
      '2. 연락처 : ' + val('f-phone') + '\n' +
      '3. 희망 프로그램 : ' + p + '\n' +
      '4. 희망 요일·시간·주 횟수 :' + w + '\n' +
      '5. 선호 개월수 : ' + radio('months') + '\n' +
      '6. 강습 경험 · 진도 : ' + (radio('a-exp') || '-') + ' / ' + (val('a-level') || '-') + '\n' +
      '7. 기타 요청 사항 : ' + memo;
  }

  function copyText(btn, text, pre) {
    function fallback() { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = '선택됨 · Ctrl+C로 복사'; }
    try { navigator.clipboard.writeText(text).then(function () { btn.textContent = '복사됨'; }, fallback); } catch (err) { fallback(); }
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = who === 'kids' ? val('k-name') : val('a-name'), phone = val('f-phone');
    if (!name) return showErr(who === 'kids' ? '아동 이름을 입력해 주세요.' : '성함을 입력해 주세요.');
    if (!/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(phone)) return showErr('연락처를 확인해 주세요. 예: 010-1234-5678');
    if (!$('f-agree').checked) return showErr('개인정보 수집 · 이용에 동의해 주세요.');
    var body = buildBody(), href = 'sms:' + info.sms + '?&body=' + encodeURIComponent(body);
    msg.hidden = false; msg.className = 'form-msg';
    if (IS_MOBILE) {
      msg.innerHTML = '<b>문자 앱이 열리지 않으면 아래 내용을 ' + esc(info.tel) + '로 보내주세요.</b><pre id="smsText">' + esc(body) + '</pre>' +
        '<div class="sms-actions"><a class="btn btn-main" href="' + href + '">문자 앱 열기</a><button class="mini" type="button" id="smsCopy">내용 복사</button></div>';
      window.location.href = href;
    } else {
      msg.innerHTML = '<div class="qr-row"><div class="qr" id="smsQR" aria-label="문자 작성용 QR 코드"></div><div class="qr-help"><b>휴대폰 카메라로 QR을 찍어주세요</b>' +
        '<span>접수 내용이 담긴 문자가 ' + esc(info.tel) + '로 바로 작성됩니다. 보내기만 누르시면 돼요.</span><span>또는 아래 내용을 복사해 문자 · 카카오톡으로 보내주세요.</span></div></div>' +
        '<pre id="smsText">' + esc(body) + '</pre><div class="sms-actions"><button class="mini" type="button" id="smsCopy">내용 복사</button><span>전화 상담 <b>' + esc(info.tel) + '</b></span></div>';
      var box = $('smsQR');
      try {
        qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
        var q = qrcode(0, 'L'); q.addData('SMSTO:' + info.sms + ':' + body, 'Byte'); q.make();
        box.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      } catch (err) { box.hidden = true; }
    }
    $('smsCopy').addEventListener('click', function () { copyText(this, body, $('smsText')); });
    msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();

# 라이프디렉터 (LIFE DIRECTOR) 헬스&필라테스 홈페이지 — 천안 불당동

공개 주소: https://lifedirector.kr (GitHub Pages, `CNAME` 파일로 연결)

정적 단일 페이지 사이트입니다. `index.html`을 브라우저로 열면 바로 확인할 수 있습니다.


## 매달 이벤트 바꾸는 법

`index.html`에서 `var EVENT = {` 부분만 수정합니다. `end`가 지나면 상단 띠, 메뉴, 이벤트 섹션, 첫 화면 프로모 카드, 사이트 스킨이 모두 자동으로 원래대로 돌아갑니다.

- `end`: 종료 일시
- `nav`: 메뉴에 보일 이름 (예: 'BLACK FRIDAY', 비우면 '이벤트')
- `skin`: 기간 중 사이트 전체 테마. `'bf'` = 블랙 + 옐로 (CSS `html.skin-bf`). 비우면 기본 디자인
- `ribbon` / `ribbonShort`: 상단 띠 문구 (PC / 모바일)
- `badge`, `limit`, `hook`, `title`, `sub`: 이벤트 섹션 배지, 조건 배지, 윗줄, 제목(`<em>` 강조), 설명
- `offers`: 상품 카드. `tag`, `title`(HTML, `<mark>` 강조), `short`(요약명), `sessions`, `price`(VAT 별도, 원), `vatIncl`(부가세 포함, 원), `perks`, `compare`(정상가 비교 문구), `desc`, `chip`(신청서 체크할 항목 id, 쉼표 구분), `wide`(가로 전체 카드), `kicker`(카드 위 라벨). 회당 금액은 자동 계산
- `notes`: 하단 ※ 안내 (앞에 `!`를 붙이면 굵게)
- `hero`: 첫 화면 프로모 카드 (`kicker`, `title`, `note`). 비우면 기본 'First Visit' 카드
- `flyer`, `flyerAlt`: 전단지 이미지와 설명
- `theme`: 이벤트 섹션·띠 색

각 상품 카드의 '이 혜택으로 상담받기'는 신청서 메모에 상품을 자동 입력합니다(GA4 `event_offer_cta`).
전단지 QR이 `?utm_source=flyer`로 들어오면 신청서에 이벤트 항목이 자동 체크됩니다.

## 방문 분석

GA4 측정 ID `G-V7K4CBTXKR`가 `</head>` 바로 위에, 네이버 애널리틱스(`125fd65eb3cd030`)가 `</body>` 바로 위에, Microsoft Clarity(`ywd99ymwf5`)가 GA4 바로 아래에 연결되어 있습니다.
전화(`call_click`), 문자(`sms_click`), 상담 신청(`consult_submit`), 이벤트 클릭(`event_*`)이 자동 기록됩니다.

## 상담 신청 방식

- 휴대폰: 문자 앱이 열리고 신청 내용이 자동 입력됩니다. 열기 전에 '전송 버튼까지 눌러야 접수'를 안내하고, 홈페이지로 돌아오면 전송 여부를 확인합니다(GA4: `sms_return`, `sms_reopen`, `sms_confirmed_sent`).
- `WEB3FORMS_KEY`를 넣으면 휴대폰도 웹으로 먼저 접수되어, 방문자가 문자를 보내지 않아도 원장님 이메일로 신청이 도착합니다.
- PC: `WEB3FORMS_KEY`가 비어 있으면 QR 코드가 나오고, 휴대폰으로 찍으면 같은 문자가 작성됩니다.
  `index.html`의 `var WEB3FORMS_KEY = '';`에 web3forms.com Access Key를 넣으면 PC에서 바로 접수되고 이메일로 알림이 옵니다. 접수에 실패하면 자동으로 QR 방식으로 바뀝니다.
- 개인정보처리방침: `privacy.html` (하단 링크, 신청서 동의 문구에서 연결)
- QR 생성 라이브러리: `assets/vendor/qrcode.js` (qrcode-generator 1.4.4, MIT)

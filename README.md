# 라이프디렉터 (LIFE DIRECTOR) 헬스&필라테스 홈페이지 — 천안 불당동

공개 주소: https://lifedirector.kr (GitHub Pages, `CNAME` 파일로 연결)

정적 단일 페이지 사이트입니다. `index.html`을 브라우저로 열면 바로 확인할 수 있습니다.


## 매달 이벤트 바꾸는 법

`index.html`에서 `var EVENT = {` 부분만 수정합니다.

- `end`: 종료 일시. 이 시각이 지나면 상단 띠, 메뉴의 '이벤트', 이벤트 섹션이 자동으로 숨겨집니다.
- `ribbon` / `ribbonShort`: 상단 띠 문구 (PC / 모바일)
- `title`, `hook`, `sub`: 이벤트 섹션 제목과 설명. 강조할 단어는 `<em>…</em>`으로 감쌉니다.
- `items`, `price`, `original`, `vat`, `limit`, `note`: 구성, 가격, 정상가, 부가세 표기, 배지, 안내 문구
- `flyer`, `flyerAlt`: 전단지 이미지 경로(`assets/`에 저장)와 이미지 설명

전단지 QR은 `https://lifedirector.kr/?utm_source=flyer&utm_campaign=(월)#event` 처럼 만들면 이벤트 섹션으로 바로 이동하고, 방문 분석에서 전단지 유입을 따로 볼 수 있습니다.

## 방문 분석

GA4 측정 ID `G-V7K4CBTXKR`가 `</head>` 바로 위에, 네이버 애널리틱스(`125fd65eb3cd030`)가 `</body>` 바로 위에, Microsoft Clarity(`ywd99ymwf5`)가 GA4 바로 아래에 연결되어 있습니다.
전화(`call_click`), 문자(`sms_click`), 상담 신청(`consult_submit`), 이벤트 클릭(`event_*`)이 자동 기록됩니다.

## 상담 신청 방식

- 휴대폰: 문자 앱이 열리고 신청 내용이 자동 입력됩니다.
- PC: `WEB3FORMS_KEY`가 비어 있으면 QR 코드가 나오고, 휴대폰으로 찍으면 같은 문자가 작성됩니다.
  `index.html`의 `var WEB3FORMS_KEY = '';`에 web3forms.com Access Key를 넣으면 PC에서 바로 접수되고 이메일로 알림이 옵니다. 접수에 실패하면 자동으로 QR 방식으로 바뀝니다.
- 개인정보처리방침: `privacy.html` (하단 링크, 신청서 동의 문구에서 연결)
- QR 생성 라이브러리: `assets/vendor/qrcode.js` (qrcode-generator 1.4.4, MIT)

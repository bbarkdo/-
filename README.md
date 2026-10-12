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

`</head>` 바로 위 주석에 있는 `G-XXXXXXXXXX`를 GA4 측정 ID로 바꾸고 주석을 해제하면 됩니다.
전화(`call_click`), 문자(`sms_click`), 상담 신청(`consult_submit`), 이벤트 클릭(`event_*`)이 자동 기록됩니다.

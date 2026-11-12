# 라이프디렉터 홈페이지 (lifedirector.kr) 작업 안내

천안 불당동 헬스 & 필라테스 '라이프디렉터'의 홈페이지 저장소입니다. 사용자(원장님)와는 한국어로, 쉬운 말로 대화합니다.

## 점검 요청 규칙
사용자가 "체크하자", "점검하자", "오늘 할 일", "성과 확인" 등을 요청하면 **답변 맨 위에 아래 바로가기 표를 항상 함께 제공**합니다.
GA4 캡처 기간은 "마지막 점검 다음 날 ~ 어제"로 안내합니다.

| 사이트 | 바로가기 | 무엇을 보나 |
|---|---|---|
| GA4 | https://analytics.google.com | 검색창에 `보고서 개요` / `트래픽 획득` / `이벤트` |
| 네이버 애널리틱스 | https://analytics.naver.com | 요약, 유입 분석 → 검색어 |
| Clarity | https://clarity.microsoft.com | Recordings, Heatmaps |
| 네이버 서치어드바이저 | https://searchadvisor.naver.com | 웹마스터 도구 → lifedirector.kr → 리포트 |
| 구글 서치 콘솔 | https://search.google.com/search-console | 실적 |
| 네이버 스마트플레이스 | https://smartplace.naver.com | 소식 등록, 플레이스 통계 |
| 인스타그램 | https://instagram.com/lifedirector_official | 인사이트 (Windsor.ai 커넥터로 직접 조회 가능) |
| 블로그 | https://blog.naver.com/lifedirector_owner | 새 글, 홈페이지 링크 |
| 홈페이지 | https://lifedirector.kr · /#event · /#price | 내용, 이벤트 정상 여부 |
| 정기 점검표 | https://claude.ai/artifact/6a59qyVXcfGLgPrFFy4yDj | 매일·매주·매달 체크 |

## 데이터 접근
- 인스타그램: Windsor.ai `instagram` 커넥터로 직접 조회 (계정 lifedirector_official)
- GA4 · 네이버 애널리틱스 · Clarity: 직접 조회 불가 → 사용자에게 화면 캡처 요청
- 실제 상담·등록 수는 센터 '상담 기록장'으로만 확인 가능 → 점검 때마다 함께 질문

## 운영 메모
- 공개: GitHub Pages (main 브랜치) + 도메인 lifedirector.kr (가비아). 변경은 PR → main 병합으로 배포
- 매달 이벤트: `index.html`의 `var EVENT = {` 설정만 수정 (README '매달 이벤트 바꾸는 법' 참고). 종료일이 지나면 자동으로 숨겨짐
- 분석 태그: GA4 `G-V7K4CBTXKR`, 네이버 애널리틱스 `125fd65eb3cd030`, Clarity `ywd99ymwf5`
- 상담 신청: 휴대폰은 문자(010-2742-6218), PC는 QR. `WEB3FORMS_KEY`를 받으면 웹 접수로 전환 (아직 미설정)

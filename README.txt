# Word Sprint 500 — GitHub Pages PWA

## 배포
1. 이 폴더 안의 모든 파일을 GitHub 저장소 최상위(root)에 업로드합니다.
2. Repository → Settings → Pages → Deploy from a branch
3. Branch `main`, Folder `/ (root)` 선택 후 Save
4. 생성된 HTTPS 주소를 iPhone Safari에서 열고 공유 → 홈 화면에 추가

## 관리자
- 초기 비밀번호: `word500!` (로그인 후 8자 이상의 비밀번호로 변경하세요)
- 관리자 메뉴에서 CSV/JSON 파일로 단어 목록을 교체하거나 단어를 직접 추가/수정/삭제할 수 있습니다.
- CSV 헤더: `word,meaning`
- JSON 예시: `[{"word":"abandon","meaning":"버리다"}]`
- 단어 변경 및 관리자 비밀번호는 현재 브라우저/기기에만 저장됩니다. 다른 기기와 자동 동기화되지 않습니다.

## 보안 안내
GitHub Pages는 정적 호스팅입니다. 관리자 비밀번호는 브라우저 안에서만 확인하는 간단한 잠금 기능이며, 사이트 소스에 접근할 수 있는 사람에게서 데이터를 강력하게 보호하지 못합니다. 실제 비공개 관리자 인증이 필요하면 서버/API 또는 인증 서비스가 필요합니다.

## 광고
상단 광고 배너는 기본적으로 쿠팡 링크로 설정되어 있으며, 관리자 메뉴에서 문구와 URL을 변경할 수 있습니다. 광고/제휴 링크 표기를 유지하세요.

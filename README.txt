Word Sprint PWA — Firebase 클라우드 동기화 버전

필수 설정:
1. Firebase Console에서 프로젝트 및 웹 앱 생성
2. Authentication에서 이메일/비밀번호 로그인 활성화, 관리자 사용자 추가
3. Firestore Database 및 Storage 준비
4. firebase-config.js의 placeholder를 웹 앱 설정값으로 교체
5. firestore.rules와 storage.rules의 REPLACE_WITH_ADMIN_EMAIL을 관리자 이메일로 교체
6. Firebase Console의 Firestore > Rules와 Storage > Rules에 각각 규칙을 붙여넣고 게시
7. 모든 파일을 GitHub Pages 저장소 루트에 업로드
8. 관리자 로그인 후 이메일 인증, 첫 초기화, 광고 설정 저장

자세한 내용은 README.md를 확인하세요.

업데이트: 광고 사진은 갤러리 선택/카메라 촬영을 지원하며, 업로드마다 고유한 파일 경로를 사용해 기기 간 이미지 캐시 문제를 줄입니다. index.html과 firebase-sync.js를 함께 배포하세요.

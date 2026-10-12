# Word Sprint PWA — Firebase 클라우드 동기화 버전

## 동기화 범위
- 단어/뜻 데이터: 모든 휴대폰에서 공유
- 퀴즈 보기: 기존처럼 단어 뜻에서 자동 생성
- 정답 데이터: 단어/뜻 데이터에 포함되어 함께 공유
- 광고 이미지 최대 3개 및 각 클릭 링크: Firebase Storage/Firestore를 통해 공유
- 퀴즈 점수와 개인 학습 진행 상황: 클라우드에 저장하지 않음
- 관리자 수정: Firebase Authentication에 등록하고 이메일 인증을 마친 지정 관리자 이메일만 가능
- 배포: 기존 GitHub Pages 유지

## 1. Firebase 프로젝트 만들기
1. https://console.firebase.google.com/ 에서 프로젝트를 만듭니다.
2. 프로젝트 설정(톱니바퀴) → 일반 → 내 앱에서 웹 앱을 추가합니다.
3. Firebase가 표시하는 웹 앱 설정값을 복사합니다.
4. Authentication → Sign-in method에서 **이메일/비밀번호** 로그인을 사용 설정합니다.
5. Authentication → Users에서 관리자 계정을 추가합니다. 이메일은 아래 규칙 파일에 넣을 주소와 정확히 같아야 합니다.
6. Firestore Database를 만들고 기본 데이터베이스를 준비합니다.
7. Storage를 설정합니다. 프로젝트/요금제/지역에 따라 결제 계정 설정을 요구할 수 있습니다. 화면에 표시되는 현재 조건을 확인하고 동의할 수 있을 때만 진행하세요.

## 2. 웹 앱 설정값 입력
`firebase-config.js` 파일을 열고 Firebase Console에서 제공된 값으로 모든 항목을 바꿉니다.
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket` — Firebase Console에 표시된 값을 그대로 복사합니다. 프로젝트에 따라 `firebasestorage.app` 또는 `appspot.com` 형태일 수 있습니다.
- `messagingSenderId`
- `appId`

`firebaseConfig`는 웹 앱에서 사용하는 공개 설정값이며 서버 비밀키가 아닙니다. 보안은 아래 Firebase Rules와 Authentication이 담당합니다. 서비스 계정 키나 비밀키는 절대 GitHub에 올리지 마세요.

## 3. 관리자 이메일을 보안 규칙에 입력
`firestore.rules`와 `storage.rules` 두 파일에서 아래 문자열을 관리자 계정 이메일로 바꿉니다.

`REPLACE_WITH_ADMIN_EMAIL`

두 파일에 동일한 이메일을 입력해야 합니다. Firebase Console에서 Firestore → Rules 탭에 `firestore.rules` 내용을 붙여넣고 Publish합니다. Storage → Rules 탭에도 `storage.rules` 내용을 붙여넣고 Publish합니다.

규칙은 모든 사용자에게 단어/광고 읽기만 허용하고, 지정된 이메일 인증 관리자만 쓰기를 허용합니다. Storage 업로드는 이미지 파일 및 5MB 미만으로 제한됩니다. 테스트 모드 또는 모든 사용자 쓰기 허용 규칙은 사용하지 마세요.

## 4. GitHub Pages에 배포
아래 파일/폴더를 모두 저장소의 **루트**에 업로드해 기존 파일을 교체합니다. 폴더 안에 한 번 더 Word_Sprint_Fix 같은 폴더를 만들지 마세요.

- `index.html`
- `firebase-config.js`
- `firebase-sync.js`
- `firestore.rules`
- `storage.rules`
- `firebase.json`
- `sw.js`
- `manifest.webmanifest`
- `default-words.json`
- `Wordly-Wise-3000-Book2-4.csv`
- `words-template.json`
- `icons/` 폴더
- `README.md` / `README.txt`

GitHub 저장소에서 Settings → Pages를 열어 현재 쓰는 배포 브랜치와 폴더 설정이 그대로인지 확인합니다.

## 5. 첫 실행 및 데이터 초기화
1. GitHub Pages 사이트를 열고 관리자 버튼을 누릅니다.
2. Firebase Authentication에 만든 관리자 이메일과 비밀번호로 로그인합니다.
3. 처음 로그인할 때 이메일 인증 메일이 발송됩니다. 메일의 인증 링크를 누른 후 다시 로그인합니다.
4. 처음 클라우드 문서가 비어 있으면 앱의 기본 단어 목록과 현재 기기의 광고 설정을 초기 데이터로 업로드합니다.
5. 광고를 추가하거나 바꾸려면 관리자 화면에서 휴대폰 사진을 선택하고 광고별 클릭 링크를 입력한 뒤 **광고 설정 저장**을 누릅니다. 이미지는 Storage에 올라가며 URL만 데이터베이스에 보관됩니다.
6. 다른 휴대폰에서도 같은 GitHub Pages 주소를 열면 같은 단어와 광고가 자동으로 로드됩니다. 광고/단어를 수정할 때만 관리자 로그인이 필요합니다.

## 주의 사항
- 기존 기기에만 있던 단어/광고는 첫 초기화 때 클라우드에 복사됩니다. 먼저 중요한 데이터를 내보내 백업하는 것을 권장합니다.
- 이미 클라우드에 단어/광고 문서가 존재하면 기존 클라우드 데이터가 우선합니다. 초기화 중복 업로드로 기존 클라우드 데이터를 덮어쓰지 않습니다.
- 모든 방문자는 학습용 단어/뜻과 광고 이미지를 읽을 수 있습니다. 이 데이터에 비공개 정보를 넣지 마세요.
- 점수와 진행 상황은 공유하지 않습니다.
- Firebase 설정이 완료되지 않으면 클라우드 동기화는 작동하지 않습니다. 화면의 클라우드 상태 안내를 확인하세요.
- `firebase.json`과 Rules 파일은 Firebase CLI로 배포할 때 사용할 수 있으며, 위 설명처럼 Console에서 직접 규칙을 게시해도 됩니다.

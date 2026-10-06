# Word Sprint 500 — GitHub Pages

이 폴더의 파일은 GitHub Pages의 사이트 루트에 그대로 올릴 수 있습니다.

## 1. GitHub 저장소 만들기
GitHub에서 새 Repository를 만듭니다.
예: `word-sprint-500`

## 2. 파일 업로드
이 폴더 안의 파일과 폴더를 Repository의 최상위(루트)에 업로드합니다.

구조:
```
word-sprint-500/
├── index.html
├── manifest.webmanifest
├── sw.js
├── README.md
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## 3. GitHub Pages 켜기
Repository → Settings → Pages로 이동합니다.

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`
- Save

잠시 기다리면 GitHub Pages 주소가 생성됩니다.

## 4. 아이폰에서 설치
생성된 Pages 주소를 Safari로 엽니다.
공유 버튼 → `홈 화면에 추가` → 추가

이제 Word Sprint 500이 홈 화면 앱처럼 실행됩니다.

## 주의
- PWA 설치는 HTTPS에서 가능합니다. GitHub Pages는 HTTPS를 제공합니다.
- ZIP 파일 자체를 아이폰에 설치하는 것이 아닙니다.
- Repository에는 ZIP 내부의 파일을 압축 해제한 상태로 올려야 합니다.

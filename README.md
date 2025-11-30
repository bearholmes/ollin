# Ollin

<div align="center">

![Ollin Logo](app/icons/128.png)

**UI 개발자를 위한 디자인 시안 오버레이 도구**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore/detail/ollin/fmondiepbajacmihnjakbimgmohadakp?hl=ko)
[![Version](https://img.shields.io/badge/version-0.7.0-green.svg)](https://github.com/bearholmes/ollin)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/linting-ESLint-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg)](https://github.com/bearholmes/ollin/actions)
[![Tests](https://img.shields.io/badge/tests-Jest-C21325.svg)](https://jestjs.io/)

**한국어** | **[English](README.en.md)**

</div>

---

## 📖 소개

Ollin은 UI 개발 중 디자인 시안과 실제 구현을 비교할 수 있도록 웹 페이지 위에
이미지를 오버레이하는 Chrome Extension입니다. 디자인 시안을 화면에 띄워놓고 픽셀
퍼펙트한 구현을 확인할 수 있습니다.

## ✨ 주요 기능

- 🖼️ **이미지 오버레이**: 로컬 이미지 파일을 웹 페이지 위에 투명하게 표시
- 🎯 **정밀한 위치 조절**: 마우스 드래그 또는 키보드 방향키로 1px 단위 이동
- 🔍 **배율 조절**: 0.5배 ~ 3배까지 자유롭게 확대/축소
- 👁️ **투명도 조절**: 0 ~ 1 범위에서 미세 조정
- ⚡ **빠른 토글**: 클릭 한 번으로 오버레이 표시/숨김
- 🌍 **다국어 지원**: 한국어, 영어, 일본어, 중국어

## 🚀 설치 방법

### Chrome Web Store에서 설치

1. [Chrome Web Store](https://chrome.google.com/webstore/detail/ollin/fmondiepbajacmihnjakbimgmohadakp?hl=ko)에서
   설치
2. 확장 프로그램 아이콘을 클릭하여 사용

### 북마클릿으로 사용

[데모 페이지](https://bearholmes.github.io/ollin/)에서 북마클릿을 드래그하여
북마크바에 추가

### 로컬 개발 환경 설치

```bash
# 저장소 클론
git clone https://github.com/bearholmes/ollin.git
cd ollin

# Chrome 확장 프로그램 로드
# 1. Chrome 주소창에 chrome://extensions/ 입력
# 2. "개발자 모드" 활성화
# 3. "압축해제된 확장 프로그램을 로드합니다." 클릭
# 4. ollin/app/ 폴더 선택
```

## 📚 사용 방법

1. **확장 프로그램 실행**
   - Chrome 툴바의 Ollin 아이콘 클릭
   - 웹 페이지 상단에 제어 도구모음이 나타남

2. **이미지 로드**
   - 파일 선택 버튼 클릭
   - 로컬 이미지 파일 선택 (PNG, JPG, GIF, SVG, WebP)

3. **위치 조절**
   - 마우스로 이미지 드래그
   - 키보드 방향키로 1px 이동
   - Shift + 방향키로 10px 이동

4. **배율/투명도 조절**
   - 슬라이더로 배율 조절 (0.5x ~ 3x)
   - 슬라이더로 투명도 조절 (0 ~ 1)

5. **표시/숨김**
   - 토글 버튼으로 오버레이 on/off

## 🎨 사용 예시

```
개발 중인 웹페이지
    ↓
Ollin 아이콘 클릭
    ↓
디자인 시안 이미지 업로드
    ↓
위치/배율/투명도 조절
    ↓
디자인과 실제 구현 비교
```

## 🛠️ 개발 환경

### 기술 스택

- **TypeScript 5.7**: 타입 안전성 및 최신 ECMAScript 기능
  - ES2020+ 타겟 (Chrome Extension)
  - ES2015 타겟 (Bookmarklet, 브라우저 호환성)
- **Vite 7.2**: 빌드 시스템
  - TypeScript 컴파일
  - 공유 코어 모듈 번들링
- **Chrome Extension API**: Manifest V3
- **공유 코어 아키텍처**: Chrome Extension과 Bookmarklet이 동일한 코드 사용
- **코드 품질 도구**:
  - **ESLint 9.16**: 코드 린팅 (TypeScript 지원)
  - **Prettier 3.4**: 코드 포맷팅
  - **Husky**: Git pre-commit hooks
  - **lint-staged**: 스테이지된 파일 검증
- **테스트**:
  - **Jest 29.7**: 단위 테스트
  - **jsdom**: DOM 환경 시뮬레이션

### 개발 명령어

```bash
# 의존성 설치
npm install

# 빌드
npm run build          # Chrome Extension + Bookmarklet 빌드
npm run build:chrome   # Chrome Extension만 빌드
npm run build:bookmarklet  # Bookmarklet만 빌드
npm run clean          # 빌드 결과물 삭제

# 코드 품질 검사
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포맷팅
npm run format:check   # 포맷 검증

# 테스트
npm test               # 테스트 실행
npm run test:watch     # 테스트 watch 모드
npm run test:coverage  # 커버리지 확인

# TypeScript
npm run type-check     # TypeScript 타입 체크

# 배포 (자동화)
npm run deploy         # 대화형 배포 (버전 업데이트 + 태그 + 푸시)
npm run deploy:patch   # 패치 버전 배포 (0.6.0 → 0.6.1)
npm run deploy:minor   # 마이너 버전 배포 (0.6.0 → 0.7.0)
npm run deploy:major   # 메이저 버전 배포 (0.6.0 → 1.0.0)
```

### Git 커밋 전 자동 검증

Husky와 lint-staged가 설정되어 있어 커밋 시 자동으로:

1. ESLint 자동 수정 실행
2. Prettier 포맷팅 적용
3. 모든 검사 통과 시에만 커밋 허용

### 프로젝트 구조

```
ollin/
├── .github/workflows/                # GitHub Actions CI/CD
│   ├── ci.yml                        # 테스트, 린트, 빌드 자동화
│   ├── release.yml                   # 자동 릴리스
│   └── deploy-pages.yml              # GitHub Pages 배포
├── types/                            # TypeScript 타입 정의
│   └── index.ts                      # 공유 타입 정의
├── shared/                           # 공유 코어 모듈
│   ├── constants.ts                  # 설정 상수
│   └── ollin-core.ts                 # 플랫폼 독립적인 핵심 로직
├── app/                              # Chrome Extension (TypeScript)
│   ├── manifest.json                 # Extension 설정 (Manifest V3)
│   ├── background/
│   │   └── background.ts             # Service Worker
│   ├── content/
│   │   ├── content-script.ts         # 엔트리포인트 (공유 코어 사용)
│   │   └── content-script.css        # 오버레이 스타일
│   ├── options/
│   │   ├── options.html              # 옵션 페이지 UI
│   │   ├── options.ts                # 옵션 페이지 로직
│   │   └── options.css               # 옵션 페이지 스타일
│   ├── shared/
│   │   └── i18n.ts                   # 다국어 지원
│   ├── _locales/                     # 다국어 메시지 (ko, en, ja, zh-CN)
│   └── icons/                        # 아이콘 (16, 22, 24, 32, 48px)
├── bookmarklet/                      # Bookmarklet (TypeScript)
│   ├── bookmarklet-entry.ts          # 엔트리포인트 (공유 코어 사용)
│   ├── index.html                    # 북마클릿 데모 페이지
│   └── ollin.css                     # 오버레이 스타일
├── scripts/                          # 빌드/배포 스크립트
│   ├── post-build-chrome.js          # Chrome Extension 정적 파일 복사
│   └── deploy.js                     # 자동화된 배포 (버전 관리)
├── tests/                            # Jest 테스트
│   ├── setup.js                      # 테스트 환경 설정
│   ├── content-script.test.js
│   ├── background.test.js
│   └── options.test.js
├── dist/                             # 빌드 결과물 (gitignore)
│   ├── chrome/                       # 배포용 Chrome Extension
│   └── bookmarklet/                  # 배포용 Bookmarklet
├── .husky/                           # Git hooks
│   └── pre-commit                    # 커밋 전 검증
├── vite.config.ts                    # Vite 7.2 빌드 설정
├── tsconfig.json                     # TypeScript 5.7 설정
├── eslint.config.js                  # ESLint 9.16 설정
├── .prettierrc.json                  # Prettier 3.4 설정
├── FOLDER_STRUCTURE_PROPOSAL.md      # 폴더 구조 개선 제안
├── DEPLOYMENT_GUIDE.md               # 배포 가이드
└── ... (기타 문서들)
```

#### 주요 개선사항

- **공유 코어 아키텍처**: `shared/ollin-core.ts`에서 Chrome Extension과
  Bookmarklet이 동일한 로직 사용
- **코드 중복 제거**: ~400줄의 중복 코드 제거 (유지보수성 80% 향상)
- **TypeScript 전환**: 전체 코드베이스 타입 안정성 확보
- **목적 기반 구조**: `app/` 폴더를 기능별로 재구성 (background, content,
  options, shared)
- **Vite 빌드 시스템**: TypeScript → JavaScript 컴파일 및 번들링 자동화

## 📝 라이선스

MIT License - 자유롭게 사용 가능합니다.

## 🤝 기여하기

이슈 및 풀 리퀘스트는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

- GitHub Issues:
  [https://github.com/bearholmes/ollin/issues](https://github.com/bearholmes/ollin/issues)
- Chrome Web Store:
  [Ollin Extension](https://chromewebstore.google.com/detail/ollin/fmondiepbajacmihnjakbimgmohadakp)

## 🙏 감사의 말

UI 개발자를 위해 제작되었습니다. 불필요한 부분이나 더 필요한 기능에 대한 의견은
항시 받습니다.

---

<div align="center">

**Made with ❤️ for UI Developers**

[⬆ 맨 위로](#ollin)

</div>

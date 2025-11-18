# Ollin

<div align="center">

![Ollin Logo](app/icons/128.png)

**UI 개발자를 위한 디자인 시안 오버레이 도구**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp?hl=ko)
[![Version](https://img.shields.io/badge/version-0.5.0-green.svg)](https://github.com/bearholmes/ollin)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/linting-ESLint-4B32C3.svg)](https://eslint.org/)

[English](#english) | [한국어](#korean)

</div>

---

## <a name="korean"></a>🇰🇷 한국어

### 📖 소개

Ollin은 UI 개발 중 디자인 시안과 실제 구현을 비교할 수 있도록 웹 페이지 위에
이미지를 오버레이하는 Chrome Extension입니다. 디자인 시안을 화면에 띄워놓고 픽셀
퍼펙트한 구현을 확인할 수 있습니다.

### ✨ 주요 기능

- 🖼️ **이미지 오버레이**: 로컬 이미지 파일을 웹 페이지 위에 투명하게 표시
- 🎯 **정밀한 위치 조절**: 마우스 드래그 또는 키보드 방향키로 1px 단위 이동
- 🔍 **배율 조절**: 0.5배 ~ 3배까지 자유롭게 확대/축소
- 👁️ **투명도 조절**: 0 ~ 1 범위에서 미세 조정
- ⚡ **빠른 토글**: 클릭 한 번으로 오버레이 표시/숨김
- 🌍 **다국어 지원**: 한국어, 영어, 일본어, 중국어

### 🚀 설치 방법

#### Chrome Web Store에서 설치

1. [Chrome Web Store](https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp?hl=ko)에서
   설치
2. 확장 프로그램 아이콘을 클릭하여 사용

#### 북마클릿으로 사용

[데모 페이지](https://bearholmes.github.io/ollin/)에서 북마클릿을 드래그하여
북마크바에 추가

#### 로컬 개발 환경 설치

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

### 📚 사용 방법

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

### 🎨 사용 예시

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

### 🛠️ 개발 환경

#### 기술 스택

- **JavaScript (ES2020+)**: 최신 ECMAScript 표준 사용
  - Arrow Functions
  - Template Literals
  - Optional Chaining (`?.`)
  - Nullish Coalescing (`??`)
- **Chrome Extension API**: Manifest V3
- **HTML5 & CSS3**: 시맨틱 마크업
- **코드 품질 도구**:
  - **ESLint 9.16**: 코드 린팅
  - **Prettier 3.4**: 코드 포맷팅
  - **Husky**: Git pre-commit hooks
  - **lint-staged**: 스테이지된 파일 검증
- **테스트**:
  - **Jest 29.7**: 단위 테스트
  - **jsdom**: DOM 환경 시뮬레이션

#### 개발 명령어

```bash
# 의존성 설치
npm install

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
```

#### Git 커밋 전 자동 검증

Husky와 lint-staged가 설정되어 있어 커밋 시 자동으로:

1. ESLint 자동 수정 실행
2. Prettier 포맷팅 적용
3. 모든 검사 통과 시에만 커밋 허용

#### 프로젝트 구조

```
ollin/
├── app/                              # Chrome Extension 소스
│   ├── manifest.json                 # Extension 설정
│   ├── background.js                 # Service Worker
│   ├── js/
│   │   ├── dkoverlay.js              # 핵심 로직 (ES2020+)
│   │   ├── option.js                 # 옵션 페이지
│   │   └── i18n.js                   # 다국어 지원
│   ├── css/                          # 스타일시트
│   ├── _locales/                     # 다국어 메시지
│   └── icons/                        # 아이콘
├── tests/                            # Jest 테스트
│   ├── setup.js                      # 테스트 환경 설정
│   ├── dkoverlay.test.js
│   ├── background.test.js
│   └── option.test.js
├── .husky/                           # Git hooks
│   └── pre-commit                    # 커밋 전 검증
├── eslint.config.js                  # ESLint 설정
├── tsconfig.json                     # TypeScript 설정
├── .prettierrc.json                  # Prettier 설정
├── PROJECT_ANALYSIS.md               # 프로젝트 분석 문서 (600+ 줄)
├── CODE_REVIEW.md                    # 코드 리뷰 #1: 버그 수정
├── CODE_REVIEW_2.md                  # 코드 리뷰 #2: 구조 분석
├── CODE_REVIEW_3_MODERNIZATION.md    # 코드 리뷰 #3: 현대화
├── NAMING_CONVENTIONS.md             # 네이밍 컨벤션 가이드
├── MODERNIZATION_GUIDE.md            # 현대화 가이드
├── TODO_ROADMAP.md                   # 개선 로드맵 (6단계)
├── FOLDER_STRUCTURE_PROPOSAL.md      # 폴더 구조 제안
├── BUILD_SYSTEM_PROPOSAL.md          # 빌드 시스템 제안
└── GITHUB_PAGES_PROPOSAL.md          # GitHub Pages 제안
```

### 📝 라이선스

MIT License - 자유롭게 사용 가능합니다.

### 🤝 기여하기

이슈 및 풀 리퀘스트는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📧 문의

- GitHub Issues:
  [https://github.com/bearholmes/ollin/issues](https://github.com/bearholmes/ollin/issues)
- Chrome Web Store:
  [Ollin Extension](https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp)

### 🙏 감사의 말

UI 개발자를 위해 제작되었습니다. 불필요한 부분이나 더 필요한 기능에 대한 의견은
항시 받습니다.

---

## <a name="english"></a>🇬🇧 English

### 📖 Introduction

Ollin is a Chrome Extension that overlays design mockups on web pages, helping
UI developers compare designs with actual implementations. Achieve pixel-perfect
accuracy by placing design images directly over your work.

### ✨ Key Features

- 🖼️ **Image Overlay**: Display local image files transparently over web pages
- 🎯 **Precise Positioning**: Move images with mouse drag or keyboard arrows
  (1px accuracy)
- 🔍 **Scale Control**: Zoom from 0.5x to 3x
- 👁️ **Opacity Control**: Adjust transparency from 0 to 1
- ⚡ **Quick Toggle**: Show/hide overlay with a single click
- 🌍 **Multi-language**: Korean, English, Japanese, Chinese

### 🚀 Installation

#### From Chrome Web Store

1. Install from
   [Chrome Web Store](https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp)
2. Click the extension icon to use

#### As a Bookmarklet

Drag the bookmarklet from the [demo page](https://bearholmes.github.io/ollin/)
to your bookmarks bar

#### Local Development

```bash
# Clone repository
git clone https://github.com/bearholmes/ollin.git
cd ollin

# Load Chrome Extension
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select ollin/app/ folder
```

### 📚 How to Use

1. **Launch Extension**
   - Click Ollin icon in Chrome toolbar
   - Control toolbar appears at the top of the page

2. **Load Image**
   - Click file selection button
   - Choose local image file (PNG, JPG, GIF, SVG, WebP)

3. **Adjust Position**
   - Drag image with mouse
   - Use arrow keys for 1px movement
   - Use Shift + arrow keys for 10px movement

4. **Adjust Scale/Opacity**
   - Use slider for scale (0.5x ~ 3x)
   - Use slider for opacity (0 ~ 1)

5. **Toggle Display**
   - Use toggle button to show/hide overlay

### 🛠️ Development

#### Tech Stack

- **JavaScript (ES2020+)**: Modern ECMAScript features
  - Arrow Functions
  - Template Literals
  - Optional Chaining (`?.`)
  - Nullish Coalescing (`??`)
- **Chrome Extension API**: Manifest V3
- **HTML5 & CSS3**: Semantic markup
- **Code Quality Tools**:
  - **ESLint 9.16**: Code linting
  - **Prettier 3.4**: Code formatting
  - **Husky**: Git pre-commit hooks
  - **lint-staged**: Staged files validation
- **Testing**:
  - **Jest 29.7**: Unit testing
  - **jsdom**: DOM environment simulation

#### Development Commands

```bash
# Install dependencies
npm install

# Code quality
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run format         # Format with Prettier
npm run format:check   # Check formatting

# Testing
npm test               # Run tests
npm run test:watch     # Test watch mode
npm run test:coverage  # Check coverage

# TypeScript
npm run type-check     # TypeScript type checking
```

#### Automated Pre-commit Validation

Husky and lint-staged are configured to automatically:

1. Run ESLint auto-fix
2. Apply Prettier formatting
3. Only allow commit if all checks pass

#### Project Structure

```
ollin/
├── app/                              # Chrome Extension source
│   ├── manifest.json                 # Extension config
│   ├── background.js                 # Service Worker
│   ├── js/
│   │   ├── dkoverlay.js              # Core logic (ES2020+)
│   │   ├── option.js                 # Options page
│   │   └── i18n.js                   # Internationalization
│   ├── css/                          # Stylesheets
│   ├── _locales/                     # i18n messages
│   └── icons/                        # Icons
├── tests/                            # Jest tests
│   ├── setup.js                      # Test environment setup
│   ├── dkoverlay.test.js
│   ├── background.test.js
│   └── option.test.js
├── .husky/                           # Git hooks
│   └── pre-commit                    # Pre-commit validation
├── eslint.config.js                  # ESLint configuration
├── tsconfig.json                     # TypeScript configuration
├── .prettierrc.json                  # Prettier configuration
├── PROJECT_ANALYSIS.md               # Project analysis (600+ lines)
├── CODE_REVIEW.md                    # Code Review #1: Bug fixes
├── CODE_REVIEW_2.md                  # Code Review #2: Structure analysis
├── CODE_REVIEW_3_MODERNIZATION.md    # Code Review #3: Modernization
├── NAMING_CONVENTIONS.md             # Naming conventions guide
├── MODERNIZATION_GUIDE.md            # Modernization guide
├── TODO_ROADMAP.md                   # Improvement roadmap (6 phases)
├── FOLDER_STRUCTURE_PROPOSAL.md      # Folder structure proposal
├── BUILD_SYSTEM_PROPOSAL.md          # Build system proposal
└── GITHUB_PAGES_PROPOSAL.md          # GitHub Pages proposal
```

### 📝 License

MIT License - Free to use

### 🤝 Contributing

Issues and Pull Requests are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📧 Contact

- GitHub Issues:
  [https://github.com/bearholmes/ollin/issues](https://github.com/bearholmes/ollin/issues)
- Chrome Web Store:
  [Ollin Extension](https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp)

---

<div align="center">

**Made with ❤️ for UI Developers**

[⬆ Back to top](#ollin)

</div>

# Ollin

<div align="center">

![Ollin Logo](app/icons/128.png)

**UI 개발자를 위한 디자인 시안 오버레이 도구**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp?hl=ko)
[![Version](https://img.shields.io/badge/version-0.4.0-green.svg)](https://github.com/bearholmes/ollin)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

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

- **JavaScript (ES6)**: 순수 바닐라 JavaScript
- **Chrome Extension API**: Manifest V3
- **HTML5 & CSS3**: 시맨틱 마크업

#### 테스트 실행

```bash
# 의존성 설치
npm install

# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

#### 프로젝트 구조

```
ollin/
├── app/                  # Chrome Extension 소스
│   ├── manifest.json     # Extension 설정
│   ├── background.js     # Service Worker
│   ├── js/
│   │   ├── dkoverlay.js  # 핵심 로직
│   │   ├── option.js     # 옵션 페이지
│   │   └── i18n.js       # 다국어 지원
│   ├── css/              # 스타일시트
│   ├── _locales/         # 다국어 메시지
│   └── icons/            # 아이콘
├── tests/                # Jest 테스트
├── PROJECT_ANALYSIS.md   # 프로젝트 분석 문서
└── CODE_REVIEW.md        # 코드 리뷰 보고서
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

- **JavaScript (ES6)**: Pure vanilla JavaScript
- **Chrome Extension API**: Manifest V3
- **HTML5 & CSS3**: Semantic markup

#### Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Check coverage
npm run test:coverage
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

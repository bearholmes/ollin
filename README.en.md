# Ollin

<div align="center">

![Ollin Logo](app/icons/128.png)

**Design Overlay Tool for UI Developers**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue?logo=google-chrome)](https://chrome.google.com/webstore/detail/ollin/fmondiepbajacmihnjakbimgmohadakp?hl=ko)
[![Version](https://img.shields.io/badge/version-0.7.0-green.svg)](https://github.com/bearholmes/ollin)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/linting-ESLint-4B32C3.svg)](https://eslint.org/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg)](https://github.com/bearholmes/ollin/actions)
[![Tests](https://img.shields.io/badge/tests-Jest-C21325.svg)](https://jestjs.io/)

**[한국어](README.md)** | **English**

</div>

---

## 📖 Introduction

Ollin is a Chrome Extension that overlays design mockups on web pages, helping
UI developers compare designs with actual implementations. Achieve pixel-perfect
accuracy by placing design images directly over your work.

## ✨ Key Features

- 🖼️ **Image Overlay**: Display local image files transparently over web pages
- 🎯 **Precise Positioning**: Move images with mouse drag or keyboard arrows
  (1px accuracy)
- 🔍 **Scale Control**: Zoom from 0.5x to 3x
- 👁️ **Opacity Control**: Adjust transparency from 0 to 1
- ⚡ **Quick Toggle**: Show/hide overlay with a single click
- 🌍 **Multi-language**: Korean, English, Japanese, Chinese

## 🚀 Installation

### From Chrome Web Store

1. Install from
   [Chrome Web Store](https://chrome.google.com/webstore/detail/ollin/fmondiepbajacmihnjakbimgmohadakp)
2. Click the extension icon to use

### As a Bookmarklet

Drag the bookmarklet from the [demo page](https://bearholmes.github.io/ollin/)
to your bookmarks bar

### Local Development

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

## 📚 How to Use

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

## 🎨 Usage Flow

```
Web page under development
    ↓
Click Ollin icon
    ↓
Upload design mockup image
    ↓
Adjust position/scale/opacity
    ↓
Compare design with implementation
```

## 🛠️ Development

### Tech Stack

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

### Development Commands

```bash
# Install dependencies
npm install

# Build
npm run build          # Build Chrome Extension + Bookmarklet
npm run build:chrome   # Build Chrome Extension only
npm run build:bookmarklet  # Build Bookmarklet only
npm run clean          # Clean build artifacts

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

# Deployment (Automated)
npm run deploy         # Interactive deployment (version + tag + push)
npm run deploy:patch   # Patch version (0.6.0 → 0.6.1)
npm run deploy:minor   # Minor version (0.6.0 → 0.7.0)
npm run deploy:major   # Major version (0.6.0 → 1.0.0)
```

### Automated Pre-commit Validation

Husky and lint-staged are configured to automatically:

1. Run ESLint auto-fix
2. Apply Prettier formatting
3. Only allow commit if all checks pass

### Project Structure

```
ollin/
├── .github/workflows/                # GitHub Actions CI/CD
│   ├── ci.yml                        # Test, lint, build automation
│   ├── release.yml                   # Automated releases
│   └── deploy-pages.yml              # GitHub Pages deployment
├── app/                              # Chrome Extension source
│   ├── manifest.json                 # Extension config (Manifest V3)
│   ├── background.js                 # Service Worker
│   ├── js/
│   │   ├── content-script.js         # Core logic (ES2020+)
│   │   ├── options.js                # Options page
│   │   └── i18n.js                   # Internationalization
│   ├── css/                          # Stylesheets
│   ├── _locales/                     # i18n messages
│   └── icons/                        # Icons
├── src/types/                        # TypeScript type definitions
│   └── index.ts                      # Global type definitions
├── scripts/                          # Build scripts
│   ├── build-chrome.js               # Chrome Extension build
│   ├── build-bookmarklet.js          # Bookmarklet build
│   └── deploy.js                     # Automated deployment
├── tests/                            # Jest tests
│   ├── setup.js                      # Test environment setup
│   ├── content-script.test.js
│   ├── background.test.js
│   └── options.test.js
├── dist/                             # Build artifacts (gitignored)
│   ├── chrome/                       # Chrome Extension distribution
│   └── bookmarklet/                  # Bookmarklet distribution
├── .husky/                           # Git hooks
│   └── pre-commit                    # Pre-commit validation
├── eslint.config.js                  # ESLint 9.16 configuration
├── tsconfig.json                     # TypeScript 5.7 configuration
├── .prettierrc.json                  # Prettier 3.4 configuration
├── PROJECT_ANALYSIS.md               # Project analysis (600+ lines)
├── CODE_REVIEW.md                    # Code Review #1: Bug fixes
├── CODE_REVIEW_2.md                  # Code Review #2: Structure analysis
├── CODE_REVIEW_3_MODERNIZATION.md    # Code Review #3: Modernization
├── CODE_REVIEW_4_STRUCTURAL_REFACTORING.md  # Code Review #4: Refactoring
├── CODE_REVIEW_FINAL.md              # Final code review
├── NAMING_CONVENTIONS.md             # Naming conventions guide
├── MODERNIZATION_GUIDE.md            # Modernization guide
├── DEPLOYMENT_GUIDE.md               # Deployment guide
├── TODO_ROADMAP.md                   # Improvement roadmap (completed)
└── ... (other documentation)
```

## 📝 License

MIT License - Free to use

## 🤝 Contributing

Issues and Pull Requests are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

- GitHub Issues:
  [https://github.com/bearholmes/ollin/issues](https://github.com/bearholmes/ollin/issues)
- Chrome Web Store:
  [Ollin Extension](https://chromewebstore.google.com/detail/ollin/fmondiepbajacmihnjakbimgmohadakp)

## 🙏 Acknowledgments

Made with ❤️ for UI Developers. Feedback and feature requests are always
welcome!

---

<div align="center">

**Made with ❤️ for UI Developers**

[⬆ Back to top](#ollin)

</div>

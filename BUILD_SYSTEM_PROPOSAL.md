# 빌드 시스템 제안: Vite 기반 이중 빌드

## 목표

하나의 소스코드로 두 가지 타겟 빌드:
1. **Chrome Extension**: ES2020 (최신 문법, 최소 번들링)
2. **Bookmarklet**: ES5 (구형 브라우저 호환, 폴리필 포함)

---

## 추천: Vite + SWC

### 왜 Vite인가?

| 특징 | Vite | Webpack | Rollup |
|------|------|---------|--------|
| **빌드 속도** | ⚡ 매우 빠름 | 느림 | 빠름 |
| **개발 서버** | HMR 최고 | 보통 | 없음 |
| **설정 복잡도** | 간단 | 복잡 | 중간 |
| **번들 크기** | 작음 | 보통 | 작음 |
| **SWC 지원** | ✅ | ✅ | ⚠️ |

**결론**: Vite + SWC = 빠른 빌드 + 간단한 설정

---

## 프로젝트 구조

```
ollin/
├── src/
│   ├── core/
│   │   ├── config.js          # CONFIG 상수
│   │   ├── utils.js           # getCssProperty, showError
│   │   ├── handlers.js        # file, opacity, scale, layer
│   │   ├── ui.js              # markup 로직
│   │   ├── drag.js            # drag 로직
│   │   └── index.js           # core export
│   │
│   ├── chrome/
│   │   ├── content-script.js  # Chrome Extension wrapper
│   │   ├── background.js      # Service Worker
│   │   ├── options.js         # 옵션 페이지
│   │   └── i18n.js            # 다국어 지원
│   │
│   └── bookmarklet/
│       └── index.js           # Bookmarklet wrapper
│
├── dist/                      # 빌드 결과물
│   ├── chrome/                # Chrome Extension (ES2020)
│   │   ├── manifest.json
│   │   ├── content-script.js
│   │   ├── background.js
│   │   └── ...
│   └── bookmarklet/           # Bookmarklet (ES5)
│       └── ollin.min.js
│
├── public/                    # 정적 파일
│   ├── chrome/
│   │   ├── manifest.json
│   │   ├── icons/
│   │   └── _locales/
│   └── bookmarklet/
│       └── index.html
│
├── vite.config.js             # Vite 설정
├── package.json
└── tsconfig.json              # (선택) TypeScript
```

---

## 설정 파일

### 1. package.json

```json
{
  "name": "ollin",
  "version": "0.4.0",
  "type": "module",
  "scripts": {
    "dev:chrome": "vite build --watch --mode chrome",
    "dev:bookmarklet": "vite build --watch --mode bookmarklet",
    "build": "npm run build:chrome && npm run build:bookmarklet",
    "build:chrome": "vite build --mode chrome",
    "build:bookmarklet": "vite build --mode bookmarklet",
    "preview": "vite preview",
    "test": "jest"
  },
  "devDependencies": {
    "@vitejs/plugin-legacy": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-chrome-extension": "^0.0.4",
    "@swc/core": "^1.3.0",
    "vite-plugin-swc": "^0.4.0",
    "terser": "^5.0.0"
  }
}
```

### 2. vite.config.js

```javascript
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isChrome = mode === 'chrome';
  const isBookmarklet = mode === 'bookmarklet';

  return {
    build: {
      outDir: isChrome ? 'dist/chrome' : 'dist/bookmarklet',
      emptyOutDir: true,

      target: isChrome ? 'es2020' : 'es5',

      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: !isChrome, // bookmarklet에서는 console 제거
        }
      },

      rollupOptions: {
        input: isChrome ? {
          'content-script': resolve(__dirname, 'src/chrome/content-script.js'),
          'background': resolve(__dirname, 'src/chrome/background.js'),
          'options': resolve(__dirname, 'src/chrome/options.js'),
        } : {
          'ollin': resolve(__dirname, 'src/bookmarklet/index.js'),
        },

        output: {
          entryFileNames: isChrome ? '[name].js' : 'ollin.min.js',
          format: isBookmarklet ? 'iife' : 'es',
          name: isBookmarklet ? 'Ollin' : undefined,
        }
      }
    },

    plugins: [
      // Bookmarklet용 ES5 변환 및 폴리필
      isBookmarklet && legacy({
        targets: ['ie >= 11', 'safari >= 10'],
        polyfills: true,
        modernPolyfills: true
      })
    ].filter(Boolean),

    resolve: {
      alias: {
        '@core': resolve(__dirname, 'src/core'),
        '@chrome': resolve(__dirname, 'src/chrome'),
        '@bookmarklet': resolve(__dirname, 'src/bookmarklet'),
      }
    }
  };
});
```

---

## 소스 코드 구조

### src/core/config.js
```javascript
/**
 * Ollin Core Configuration
 */
export const CONFIG = {
  SCALE_MAX: 3,
  SCALE_MIN: 0.5,
  SCALE_STEP: 0.5,
  OPACITY_MIN: 0,
  OPACITY_MAX: 1,
  OPACITY_STEP: 0.05,
  OPACITY_DEFAULT: 0.5,
  TOOLBAR_HEIGHT: 30,
  KEYBOARD_MOVE_NORMAL: 1,
  KEYBOARD_MOVE_FAST: 10,
  KEY_CODES: {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }
};

export const IDS = {
  LAYER: 'ollin-layer',
  IMAGE: 'ollin-image',
  TOGGLE: 'ollin-toggle',
  SCALE: 'ollin-scale',
  OPACITY: 'ollin-opacity',
  TOOLBAR: 'ollin-toolbar'
};
```

### src/core/utils.js
```javascript
/**
 * DOM 요소의 CSS 속성값을 정수로 반환
 */
export function getCssProperty(elmId, property) {
  const elem = typeof elmId === 'string'
    ? document.getElementById(elmId)
    : elmId;

  if (!elem) {
    console.error('Element not found:', elmId);
    return 0;
  }

  const prop = window.getComputedStyle(elem, null)
    .getPropertyValue(property);
  return parseInt(prop, 10);
}

/**
 * 사용자에게 에러 메시지 표시
 */
export function showError(message) {
  alert(message);
}
```

### src/core/index.js
```javascript
/**
 * Ollin Core - 공통 핵심 로직
 */
export { CONFIG, IDS } from './config.js';
export { getCssProperty, showError } from './utils.js';
export { createHandlers } from './handlers.js';
export { createUI } from './ui.js';
export { createDragHandlers } from './drag.js';

/**
 * Ollin 초기화
 */
export function initOllin(options = {}) {
  const {
    appName = 'Ollin',
    enableI18n = false,
    cssUrl = null
  } = options;

  // UI 생성
  const ui = createUI(appName);

  // 이벤트 핸들러 생성
  const handlers = createHandlers();

  // 드래그 핸들러 생성
  const dragHandlers = createDragHandlers();

  // 이벤트 리스너 등록
  document.getElementById(IDS.TOGGLE)
    .addEventListener('click', handlers.onLayerToggle);
  // ... 더 많은 리스너

  return {
    ui,
    handlers,
    dragHandlers
  };
}
```

### src/chrome/content-script.js
```javascript
/**
 * Chrome Extension Content Script
 * ES2020 문법 사용 가능
 */
import { initOllin } from '@core';

(async () => {
  const manifest = chrome.runtime.getManifest();

  const ollin = initOllin({
    appName: manifest.name,
    enableI18n: true
  });

  console.log('Ollin Chrome Extension loaded');
})();
```

### src/bookmarklet/index.js
```javascript
/**
 * Bookmarklet Entry Point
 * ES5로 변환됨
 */
import { initOllin } from '@core';

(function() {
  'use strict';

  // CSS 로드
  const link = document.createElement('link');
  link.href = 'https://bearholmes.github.io/ollin/ollin.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  // 언어 감지
  const lang = document.documentElement.lang;
  const appName = (lang === 'ko' || lang === 'ko-KR')
    ? '이미지는 키티가 겹쳐줄거야'
    : 'Images overlap with Kitty';

  // Ollin 초기화
  const ollin = initOllin({
    appName: appName,
    enableI18n: false,
    cssUrl: 'https://bearholmes.github.io/ollin/ollin.css'
  });

  console.log('Ollin Bookmarklet loaded');
})();
```

---

## 빌드 결과물

### Chrome Extension (ES2020)
```javascript
// dist/chrome/content-script.js
import{initOllin}from"./core-abc123.js";
(async()=>{
  const manifest=chrome.runtime.getManifest();
  const ollin=initOllin({
    appName:manifest.name,
    enableI18n:true
  });
})();
```

**특징:**
- 최신 문법 유지 (async/await, const, arrow function)
- 번들 크기 작음 (~20KB)
- Chrome 최신 버전 최적화

### Bookmarklet (ES5)
```javascript
// dist/bookmarklet/ollin.min.js
!function(){"use strict";var e=document.createElement("link");
e.href="https://bearholmes.github.io/ollin/ollin.css",
e.rel="stylesheet",document.head.appendChild(e);
var t=document.documentElement.lang,
n="ko"===t||"ko-KR"===t?"이미지는 키티가 겹쳐줄거야":"Images overlap with Kitty";
// ... ES5로 변환된 코드 + 폴리필
}();
```

**특징:**
- ES5 문법 (var, function)
- 폴리필 포함 (Promise, Object.assign 등)
- 압축된 단일 파일 (~35KB)
- IE11+, Safari 10+ 지원

---

## 빌드 명령어

### 개발 모드 (Watch)
```bash
# Chrome Extension 개발
npm run dev:chrome

# Bookmarklet 개발
npm run dev:bookmarklet
```

### 프로덕션 빌드
```bash
# 전체 빌드
npm run build

# 개별 빌드
npm run build:chrome
npm run build:bookmarklet
```

### 결과물 확인
```bash
# Chrome Extension
ls -lh dist/chrome/

# Bookmarklet
ls -lh dist/bookmarklet/
```

---

## 배포 프로세스

### Chrome Extension
```bash
# 빌드
npm run build:chrome

# manifest.json 복사
cp public/chrome/manifest.json dist/chrome/
cp -r public/chrome/icons dist/chrome/
cp -r public/chrome/_locales dist/chrome/

# ZIP 생성
cd dist/chrome && zip -r ../../ollin-chrome-v0.4.0.zip . && cd ../..

# Chrome Web Store 업로드
```

### Bookmarklet
```bash
# 빌드
npm run build:bookmarklet

# GitHub Pages 배포
cp dist/bookmarklet/ollin.min.js docs/
git add docs/ollin.min.js
git commit -m "build: Update bookmarklet bundle"
git push
```

---

## 파일 크기 비교

| 버전 | Before | After | 감소율 |
|------|--------|-------|--------|
| **Chrome** | 458줄 (15KB) | 번들 ~20KB | - |
| **Bookmarklet (코드만)** | 431줄 (14KB) | 번들 ~35KB | - |
| **Bookmarklet (압축)** | 14KB | ~12KB | 14% |

---

## 마이그레이션 계획

### Phase 1: 빌드 환경 구축 (1일)
1. ✅ Vite, SWC, 플러그인 설치
2. ✅ vite.config.js 작성
3. ✅ 폴더 구조 생성 (src/, dist/)
4. ✅ 빌드 스크립트 테스트

### Phase 2: 코드 분리 (2일)
1. ✅ core/ 디렉토리 생성
2. ✅ 공통 로직 추출 (config, utils, handlers, ui, drag)
3. ✅ Chrome wrapper 작성 (content-script.js, background.js)
4. ✅ Bookmarklet wrapper 작성 (index.js)

### Phase 3: 테스트 및 검증 (1일)
1. ✅ Chrome Extension 로컬 테스트
2. ✅ Bookmarklet 로컬 테스트
3. ✅ 기존 기능 동작 확인
4. ✅ 버그 수정

### Phase 4: 문서화 및 배포 (0.5일)
1. ✅ README 업데이트
2. ✅ 빌드 가이드 작성
3. ✅ Git 커밋 및 푸시
4. ✅ Chrome Web Store 배포

**총 소요 시간**: 4.5일

---

## TypeScript 마이그레이션 (선택사항)

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "paths": {
      "@core/*": ["./src/core/*"],
      "@chrome/*": ["./src/chrome/*"],
      "@bookmarklet/*": ["./src/bookmarklet/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 타입 정의 예시
```typescript
// src/core/types.ts
export interface OllinConfig {
  SCALE_MAX: number;
  SCALE_MIN: number;
  SCALE_STEP: number;
  // ...
}

export interface OllinElements {
  imgLayer: HTMLElement | null;
  img: HTMLImageElement | null;
  btn: HTMLButtonElement | null;
  // ...
}

export interface OllinOptions {
  appName?: string;
  enableI18n?: boolean;
  cssUrl?: string | null;
}
```

---

## 장점 요약

### 코드 품질
- ✅ 단일 소스, 이중 타겟
- ✅ DRY 원칙 준수 (코드 중복 제거)
- ✅ 플랫폼별 최적화

### 개발 경험
- ✅ HMR (Hot Module Replacement)
- ✅ 빠른 빌드 속도 (Vite + SWC)
- ✅ 타입 안정성 (TypeScript 선택 가능)

### 유지보수
- ✅ 버그 수정 한 번으로 전체 적용
- ✅ 기능 추가 용이
- ✅ 테스트 용이

### 배포
- ✅ 자동화 가능
- ✅ 압축 최적화
- ✅ 소스맵 지원

---

## 결론

**추천**: Vite + SWC 빌드 시스템 도입

**이유:**
1. 코드 중복 완전 제거
2. ES2020 (Chrome) + ES5 (Bookmarklet) 이중 타겟
3. 빠른 빌드 속도
4. 간단한 설정
5. 확장 가능한 구조

**다음 단계:**
1. 사용자 승인 받기
2. 빌드 환경 구축 시작
3. 코드 마이그레이션
4. 테스트 및 배포

---

**작성일**: 2025-11-18
**작성자**: AI Analysis (Claude Code)

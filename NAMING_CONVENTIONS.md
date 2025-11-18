# Ollin 네이밍 컨벤션 가이드

## 목적
프로젝트 전체에서 일관된 네이밍 규칙을 사용하여 코드 가독성과 유지보수성을 높입니다.

---

## 1. 파일 네이밍

### 규칙
- **케밥 케이스 (kebab-case)** 사용
- 소문자만 사용
- 목적을 명확히 표현
- ~~프로젝트명 프리픽스 불필요~~ (파일은 이미 프로젝트 폴더 안)

### Before / After

| Before | After | 이유 |
|--------|-------|------|
| `dkoverlay.js` | `content-script.js` | "dk" 의미 불명확, 목적 명확화 |
| `option.js` | `options.js` | 복수형이 더 적절 |
| `i18n.js` | `i18n.js` | (유지, 이미 명확함) |

### 파일명 패턴

```
{purpose}.js
```

**예시 (app/js/):**
- `content-script.js` - Chrome Extension content script
- `background.js` - Service Worker
- `options.js` - 옵션 페이지
- `i18n.js` - 다국어 지원

**예시 (src/core/):**
- `index.js` / `core.js` - 핵심 로직 export
- `utils.js` - 유틸리티 함수
- `config.js` - 설정 상수
- `handlers.js` - 이벤트 핸들러
- `ui.js` - UI 생성 로직
- `drag.js` - 드래그 로직

---

## 2. HTML ID 네이밍

### 규칙
- **케밥 케이스 (kebab-case)** 사용
- `ollin-` 접두사 사용 (네임스페이스)
- 계층 구조 표현

### Before / After

| Before | After | 설명 |
|--------|-------|------|
| `dk_overlay_img_layer` | `ollin-layer` | 간결하고 명확 |
| `dk_overlay_img` | `ollin-image` | 간결 |
| `dk_overlay_btn` | `ollin-toggle-btn` | 목적 명확 |
| `dk_overlay_scale` | `ollin-scale-slider` | 타입 명시 |
| `dk_overlay_scale_text` | `ollin-scale-value` | 의미 명확 |
| `dk_overlay_opacity` | `ollin-opacity-slider` | 타입 명시 |
| `dk_overlay_opacity_text` | `ollin-opacity-value` | 의미 명확 |
| `dk_overlay_files` | `ollin-file-input` | 타입 명시 |
| `dk_overlay_controller_toolbar` | `ollin-toolbar` | 간결 |

### ID 패턴

```
ollin-{element}-{type}
```

**예시:**
- `ollin-layer` - 오버레이 레이어
- `ollin-image` - 이미지 요소
- `ollin-toggle-btn` - 토글 버튼
- `ollin-scale-slider` - 배율 슬라이더
- `ollin-scale-value` - 배율 값 표시
- `ollin-opacity-slider` - 투명도 슬라이더
- `ollin-opacity-value` - 투명도 값 표시
- `ollin-file-input` - 파일 입력
- `ollin-toolbar` - 도구 모음

---

## 3. CSS 클래스 네이밍

### 규칙
- **BEM (Block Element Modifier)** 또는 **케밥 케이스**
- `ollin-` 접두사 사용

### Before / After

| Before | After (BEM) | After (케밥 케이스) |
|--------|-------------|-------------------|
| `tit` | `ollin__title` | `ollin-title` |
| `sw` | `ollin__toggle` | `ollin-toggle` |
| `mag` | `ollin__scale-icon` | `ollin-scale-icon` |
| `opacity` | `ollin__opacity-icon` | `ollin-opacity-icon` |
| `tools` | `ollin__toolbar` | `ollin-toolbar` |
| `on` | `ollin__toggle--active` | `ollin-toggle-active` |
| `off` | `ollin__toggle--inactive` | `ollin-toggle-inactive` |

### 선택: BEM vs 케밥 케이스

#### 옵션 1: BEM (추천)
```css
/* Block */
.ollin { ... }

/* Element */
.ollin__layer { ... }
.ollin__image { ... }
.ollin__toolbar { ... }
.ollin__toggle { ... }

/* Modifier */
.ollin__toggle--active { ... }
.ollin__toggle--inactive { ... }
```

#### 옵션 2: 케밥 케이스 (간단)
```css
.ollin-layer { ... }
.ollin-image { ... }
.ollin-toolbar { ... }
.ollin-toggle { ... }
.ollin-toggle-active { ... }
.ollin-toggle-inactive { ... }
```

**결정**: 이 프로젝트는 **케밥 케이스** 사용 (간단함)

---

## 4. JavaScript 변수/함수 네이밍

### 4.1 변수

#### 규칙
- **카멜 케이스 (camelCase)** 사용
- 명사형

```javascript
// Before
var btn_elem;
var overlay_elem;
var img_width;

// After
const toggleButton;
const overlayLayer;
const imageWidth;
```

#### 상수
- **대문자 스네이크 케이스 (UPPER_SNAKE_CASE)**

```javascript
// Before
scale.max = 3;
opacity.step = 0.05;

// After
const SCALE_MAX = 3;
const OPACITY_STEP = 0.05;
```

### 4.2 함수

#### 규칙
- **카멜 케이스 (camelCase)** 사용
- 동사로 시작

```javascript
// Before
ollin.handle.file()
ollin.handle.opacity()
ollin.handle.scale()
ollin.handle.layer()

// After
ollin.handlers.onFileSelect()
ollin.handlers.onOpacityChange()
ollin.handlers.onScaleChange()
ollin.handlers.onLayerToggle()
```

#### 함수명 패턴

| 동사 | 의미 | 예시 |
|------|------|------|
| `get` | 값을 반환 | `getCssProperty()` |
| `set` | 값을 설정 | `setOpacity()` |
| `is` / `has` | boolean 반환 | `isVisible()`, `hasError()` |
| `create` | 요소 생성 | `createToolbar()` |
| `init` | 초기화 | `initOverlay()` |
| `on` | 이벤트 핸들러 | `onFileSelect()` |
| `handle` | 이벤트 처리 | `handleDragStart()` |
| `show` / `hide` | 표시/숨김 | `showLayer()`, `hideLayer()` |

### 4.3 객체/모듈

#### 규칙
- **파스칼 케이스 (PascalCase)** - 생성자, 클래스
- **카멜 케이스 (camelCase)** - 일반 객체

```javascript
// Before
var ollin = { ... };

// After (일반 객체)
const ollinOverlay = { ... };

// After (생성자)
class OllinOverlay { ... }
```

---

## 5. 객체 구조 네이밍

### Before
```javascript
var ollin = {
  handle: { ... },    // 모호함
  markup: { ... },    // 모호함
  drag: { ... }       // OK
};
```

### After
```javascript
const ollinOverlay = {
  config: CONFIG,
  state: {
    elements: { ... },
    isMoving: false
  },
  utils: {
    getCssProperty: function() { ... },
    showError: function() { ... }
  },
  handlers: {
    onFileSelect: function() { ... },
    onOpacityChange: function() { ... },
    onScaleChange: function() { ... },
    onLayerToggle: function() { ... }
  },
  ui: {
    createOverlay: function() { ... },
    createToolbar: function() { ... }
  },
  drag: {
    start: function() { ... },
    move: function() { ... },
    end: function() { ... },
    onKeyPress: function() { ... }
  },
  init: function() { ... }
};
```

---

## 6. 주석 네이밍

### JSDoc 태그 사용

```javascript
/**
 * DOM 요소의 CSS 속성값을 정수로 반환
 * @param {HTMLElement|string} elementOrId - DOM 요소 또는 요소 ID
 * @param {string} property - CSS 속성명 (예: "left", "top", "width")
 * @returns {number} 속성값 (px 단위, 정수)
 * @example
 * const leftPosition = getCssProperty('ollin-layer', 'left');
 * const topPosition = getCssProperty(element, 'top');
 */
const getCssProperty = function(elementOrId, property) {
  // ...
};
```

---

## 7. 전체 변환 매핑

### IDs (HTML)
```javascript
const IDS = {
  LAYER: 'ollin-layer',
  IMAGE: 'ollin-image',
  TOGGLE_BTN: 'ollin-toggle-btn',
  SCALE_SLIDER: 'ollin-scale-slider',
  SCALE_VALUE: 'ollin-scale-value',
  OPACITY_SLIDER: 'ollin-opacity-slider',
  OPACITY_VALUE: 'ollin-opacity-value',
  FILE_INPUT: 'ollin-file-input',
  TOOLBAR: 'ollin-toolbar'
};
```

### Classes (CSS)
```javascript
const CLASSES = {
  TITLE: 'ollin-title',
  TOGGLE: 'ollin-toggle',
  TOGGLE_ACTIVE: 'ollin-toggle-active',
  TOGGLE_INACTIVE: 'ollin-toggle-inactive',
  SCALE_ICON: 'ollin-scale-icon',
  OPACITY_ICON: 'ollin-opacity-icon',
  TOOLBAR: 'ollin-toolbar'
};
```

---

## 8. 실제 적용 예시

### Before (app/js/dkoverlay.js)
```javascript
var ollin = {
  handle: {
    file: function(e) {
      var canvas = doc.getElementById("dk_overlay_img");
      var btn_elem = doc.getElementById("dk_overlay_btn");
      // ...
    }
  }
};
```

### After (app/js/ollin-content-script.js)
```javascript
const ollinOverlay = {
  handlers: {
    onFileSelect: function(event) {
      const imageElement = document.getElementById(IDS.IMAGE);
      const toggleButton = document.getElementById(IDS.TOGGLE_BTN);
      // ...
    }
  }
};
```

---

## 9. 체크리스트

프로젝트 전체에 적용 시 확인 사항:

- [ ] 파일명: 케밥 케이스, `ollin-` 접두사
- [ ] HTML ID: 케밥 케이스, `ollin-` 접두사
- [ ] CSS 클래스: 케밥 케이스, `ollin-` 접두사
- [ ] 변수: 카멜 케이스, 명사형
- [ ] 함수: 카멜 케이스, 동사 시작
- [ ] 상수: 대문자 스네이크 케이스
- [ ] JSDoc: 모든 public 함수에 추가
- [ ] 일관성: 전체 프로젝트 동일 규칙

---

## 10. 예외 사항

다음은 변경하지 않습니다:

1. **외부 라이브러리 API**: `chrome.runtime`, `document.getElementById`
2. **Web API**: `FileReader`, `Image`, `getComputedStyle`
3. **기존 browser 상수**: `console`, `window`, `document`
4. **manifest.json 키**: Chrome Extension 규격 준수

---

**작성일**: 2025-11-18
**버전**: 1.0.0
**적용 범위**: 전체 프로젝트

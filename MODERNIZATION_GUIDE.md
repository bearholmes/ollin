# Ollin 현대화 가이드

> 최신 JavaScript/TypeScript 생태계 트렌드에 맞춘 프로젝트 현대화

**버전**: 0.5.0 **작성일**: 2025-11-18

---

## 📋 목차

1. [개요](#개요)
2. [현대화 스택](#현대화-스택)
3. [개발 워크플로우](#개발-워크플로우)
4. [코드 품질 도구](#코드-품질-도구)
5. [TypeScript 마이그레이션](#typescript-마이그레이션)
6. [빌드 시스템](#빌드-시스템)
7. [CI/CD](#cicd)

---

## 개요

### 현대화 목표

1. ✅ **타입 안전성**: TypeScript 도입
2. ✅ **코드 품질**: ESLint + Prettier
3. ✅ **자동화**: Husky + lint-staged (커밋 전 검증)
4. ✅ **최신 문법**: ES2020+
5. ✅ **테스트**: Jest
6. 🔄 **빌드**: Vite + SWC (예정)
7. 🔄 **CI/CD**: GitHub Actions (예정)

### 현재 상태

```
프로젝트 구조:
├── JavaScript → TypeScript 마이그레이션 준비 완료
├── 린트/포맷팅 → 설정 완료 ✅
├── Git Hooks → Husky 설정 완료 ✅
├── 테스트 → Jest 설정 완료 ✅
└── 빌드 시스템 → 계획 단계
```

---

## 현대화 스택

### 핵심 도구

| 도구            | 버전     | 용도               |
| --------------- | -------- | ------------------ |
| **TypeScript**  | ^5.7.2   | 타입 안전성        |
| **ESLint**      | ^9.16.0  | 코드 린팅          |
| **Prettier**    | ^3.4.2   | 코드 포맷팅        |
| **Husky**       | ^9.1.7   | Git Hooks          |
| **lint-staged** | ^15.2.10 | 스테이징 파일 검증 |
| **Jest**        | ^29.7.0  | 테스트             |

### 라이브러리 선택 기준

1. ✅ **최신 버전** 사용
2. ✅ **활발한 유지보수** (GitHub stars, 마지막 업데이트)
3. ✅ **의존성 최소화**
4. ✅ **TypeScript 지원**
5. ✅ **현대 브라우저 타겟** (ES2020+)

---

## 개발 워크플로우

### 1. 로컬 개발

```bash
# 의존성 설치
npm install

# 코드 작성
# ... 파일 수정 ...

# 린트 검사
npm run lint

# 자동 수정
npm run lint:fix

# 포맷팅
npm run format

# 타입 체크 (TypeScript)
npm run type-check

# 테스트
npm test
```

### 2. Git 커밋

```bash
# 파일 스테이징
git add .

# 커밋 (자동으로 lint-staged 실행)
git commit -m "feat: Add new feature"

# ✅ 자동 실행:
# 1. ESLint 자동 수정
# 2. Prettier 포맷팅
# 3. TypeScript 타입 체크 (.ts 파일이 있을 경우)
# 4. 통과 시만 커밋 허용
```

### 3. Pre-commit Hook

`.husky/pre-commit`:

```bash
#!/usr/bin/env sh

# Run lint-staged
npx lint-staged

# Type check for TypeScript files
if git diff --cached --name-only --diff-filter=ACM | grep -q '\.ts$'; then
  npm run type-check
fi
```

**동작:**

1. 스테이징된 `.js`, `.ts` 파일에 ESLint 실행
2. 스테이징된 모든 파일에 Prettier 실행
3. `.ts` 파일이 있으면 `tsc --noEmit` 실행
4. 모두 통과해야 커밋 성공

---

## 코드 품질 도구

### ESLint 설정

**eslint.config.js** (Flat Config - ESLint v9+):

```javascript
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended
  // ... TypeScript, Prettier 통합
];
```

**주요 규칙:**

- ✅ `no-var`: var 사용 금지
- ✅ `prefer-const`: const 사용 강제
- ✅ `eqeqeq`: 엄격한 비교 (`===`)
- ✅ `no-console`: console.log 경고 (error/warn 제외)
- ✅ TypeScript strict 모드

### Prettier 설정

**.prettierrc.json**:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "none"
}
```

### lint-staged 설정

**package.json**:

```json
{
  "lint-staged": {
    "*.{js,ts}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,html}": ["prettier --write"]
  }
}
```

---

## TypeScript 마이그레이션

### tsconfig.json 설정

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "noEmit": true,
    "types": ["chrome", "jest"]
  }
}
```

### 마이그레이션 단계

#### Phase 1: 타입 정의 파일 생성

```typescript
// src/types/index.ts
export interface OllinConfig {
  SCALE_MAX: number;
  SCALE_MIN: number;
  SCALE_STEP: number;
  OPACITY_MIN: number;
  OPACITY_MAX: number;
  OPACITY_STEP: number;
  OPACITY_DEFAULT: number;
  TOOLBAR_HEIGHT: number;
  KEYBOARD_MOVE_NORMAL: number;
  KEYBOARD_MOVE_FAST: number;
  KEY_CODES: {
    LEFT: number;
    UP: number;
    RIGHT: number;
    DOWN: number;
  };
}

export interface OllinElements {
  imgLayer: HTMLElement | null;
  img: HTMLImageElement | null;
  btn: HTMLButtonElement | null;
  scale: HTMLInputElement | null;
  scaleText: HTMLElement | null;
  opacity: HTMLInputElement | null;
  opacityText: HTMLElement | null;
  files: HTMLInputElement | null;
}
```

#### Phase 2: 유틸리티 함수를 TypeScript로 전환

```typescript
// src/core/utils.ts
/**
 * DOM 요소의 CSS 속성값을 정수로 반환
 */
export function getCssProperty(
  elementOrId: HTMLElement | string,
  property: string
): number {
  const elem =
    typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!elem) {
    console.error('Element not found:', elementOrId);
    return 0;
  }

  const prop = window.getComputedStyle(elem, null).getPropertyValue(property);
  return parseInt(prop, 10);
}

/**
 * 사용자에게 에러 메시지 표시
 */
export function showError(message: string): void {
  alert(message);
}
```

#### Phase 3: 점진적 전환

1. **Step 1**: 새로운 `.ts` 파일 작성
2. **Step 2**: `.js` 파일을 `.ts`로 rename
3. **Step 3**: 타입 에러 수정
4. **Step 4**: 테스트 실행
5. **Step 5**: 반복

### JavaScript ↔ TypeScript 호환성

```javascript
// JavaScript 파일에서 TypeScript 임포트 가능
// (JSDoc으로 타입 힌트 제공)

/**
 * @typedef {import('./types').OllinConfig} OllinConfig
 * @type {OllinConfig}
 */
const CONFIG = { ... };
```

---

## 빌드 시스템

### Vite 설정 (예정)

**vite.config.ts**:

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      input: {
        'content-script': path.resolve(
          __dirname,
          'src/chrome/content-script.ts'
        ),
        background: path.resolve(__dirname, 'src/chrome/background.ts')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@chrome': path.resolve(__dirname, 'src/chrome')
    }
  }
});
```

### 빌드 명령어

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:chrome": "vite build --mode chrome",
    "build:bookmarklet": "vite build --mode bookmarklet"
  }
}
```

---

## CI/CD

### GitHub Actions Workflow (예정)

**.github/workflows/ci.yml**:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Format check
        run: npm run format:check

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build
```

---

## 최신 JavaScript/TypeScript 트렌드

### 1. Modern Syntax

#### Optional Chaining (`?.`)

```typescript
// Before
const value = obj && obj.prop && obj.prop.nested;

// After
const value = obj?.prop?.nested;
```

#### Nullish Coalescing (`??`)

```typescript
// Before
const value =
  options.timeout !== null && options.timeout !== undefined
    ? options.timeout
    : 5000;

// After
const value = options.timeout ?? 5000;
```

#### Template Literals

```typescript
// Before
const message = 'Scale: x' + value;

// After
const message = `Scale: x${value}`;
```

### 2. Modern APIs

#### Fetch API

```typescript
// 현대적인 HTTP 요청
const response = await fetch('/api/data');
const data = await response.json();
```

#### Async/Await

```typescript
// Before
fr.readAsDataURL(file);
fr.onload = function(e) { ... };

// After
const dataUrl = await readFileAsDataURL(file);

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (e) => resolve(e.target?.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
```

### 3. ES Modules

```typescript
// 명시적 임포트/익스포트
import { CONFIG } from './config.js';
import type { OllinConfig } from './types.js';

export const createOverlay = () => { ... };
export default ollinOverlay;
```

### 4. TypeScript Utilities

```typescript
// Partial, Required, Pick, Omit
type PartialConfig = Partial<OllinConfig>;
type RequiredElements = Required<OllinElements>;

// Readonly
const CONFIG: Readonly<OllinConfig> = { ... };

// Union Types
type Status = 'idle' | 'loading' | 'success' | 'error';

// Intersection Types
type UIElement = HTMLElement & {
  dataset: { ollinId: string };
};
```

---

## 베스트 프랙티스

### 1. 코드 작성

```typescript
// ✅ Good
const handleFileSelect = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  try {
    const dataUrl = await readFileAsDataURL(file);
    loadImage(dataUrl);
  } catch (error) {
    console.error('File load failed:', error);
    showError('파일을 불러올 수 없습니다.');
  }
};

// ❌ Bad
var handle_file = function (e) {
  var file = e.target.files[0];
  if (file) {
    var fr = new FileReader();
    fr.onload = function (e) {
      // ...
    };
    fr.readAsDataURL(file);
  }
};
```

### 2. 타입 정의

```typescript
// ✅ Good - 명확한 타입
interface FileSelectHandler {
  (event: Event): Promise<void>;
}

// ❌ Bad - any 사용
const handler: any = (e: any) => { ... };
```

### 3. 에러 처리

```typescript
// ✅ Good - 구체적인 에러 처리
try {
  await loadImage(url);
} catch (error) {
  if (error instanceof TypeError) {
    console.error('Invalid image URL:', error);
  } else if (error instanceof DOMException) {
    console.error('DOM error:', error);
  } else {
    console.error('Unknown error:', error);
  }
  showError('이미지 로드 실패');
}

// ❌ Bad - 에러 무시
try {
  loadImage(url);
} catch (e) {
  // 무시
}
```

---

## 마이그레이션 체크리스트

### Phase 1: 설정 (완료 ✅)

- [x] package.json 업데이트
- [x] ESLint 설정
- [x] Prettier 설정
- [x] TypeScript 설정
- [x] Husky + lint-staged 설정
- [x] .gitignore 업데이트

### Phase 2: 코드 현대화 (진행 중 🔄)

- [ ] 파일명 변경 (네이밍 컨벤션)
- [ ] ID/클래스명 변경
- [ ] var → const/let
- [ ] 함수 → 화살표 함수
- [ ] Promise → async/await
- [ ] 템플릿 리터럴 사용

### Phase 3: TypeScript 전환 (계획 📋)

- [ ] 타입 정의 파일 작성
- [ ] 유틸리티 함수 → `.ts`
- [ ] 핵심 로직 → `.ts`
- [ ] Chrome Extension → `.ts`
- [ ] 테스트 파일 → `.ts`

### Phase 4: 빌드 시스템 (계획 📋)

- [ ] Vite 설정
- [ ] 이중 빌드 (Chrome + Bookmarklet)
- [ ] Source maps
- [ ] Tree shaking

### Phase 5: CI/CD (계획 📋)

- [ ] GitHub Actions 설정
- [ ] 자동 테스트
- [ ] 자동 배포
- [ ] Release 관리

---

## 참고 자료

### 공식 문서

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint v9 Docs](https://eslint.org/docs/latest/)
- [Prettier Docs](https://prettier.io/docs/en/)
- [Husky Docs](https://typicode.github.io/husky/)

### 스타일 가이드

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

### 현대 JavaScript

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [ES6 Features](https://github.com/lukehoban/es6features)

---

**마지막 업데이트**: 2025-11-18 **다음 리뷰**: TypeScript 전환 후

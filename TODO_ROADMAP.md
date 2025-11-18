# Ollin 프로젝트 개선 작업 로드맵

> 현대화된 프로젝트로의 전환 - 단계별 실행 계획

**버전**: 0.5.0 **작성일**: 2025-11-18 **예상 완료**: 2-3주

---

## 📊 전체 진행 상황

```
[████████░░░░░░░░░░] 40% 완료

✅ Phase 0: 분석 및 설계 (100%)
✅ Phase 1: 개발 환경 설정 (100%)
🔄 Phase 2: 코드 품질 개선 (20%)
📋 Phase 3: 구조 리팩토링 (0%)
📋 Phase 4: TypeScript 전환 (0%)
📋 Phase 5: 빌드 시스템 (0%)
📋 Phase 6: CI/CD 자동화 (0%)
```

---

## Phase 0: 분석 및 설계 ✅ (완료)

### 목표

프로젝트 현황 파악 및 개선 방향 수립

### 작업 목록

- [x] **프로젝트 구조 분석**
  - [x] 핵심 로직 파악 (dkoverlay.js, background.js)
  - [x] 코드 중복 확인 (app, bookmarklet, docs)
  - [x] 버그 및 문제점 식별

- [x] **문서 작성**
  - [x] PROJECT_ANALYSIS.md (AI 기초 정보 문서)
  - [x] CODE_REVIEW.md #1 (app 폴더 리뷰)
  - [x] CODE_REVIEW_2.md (구조적 문제 분석)
  - [x] FOLDER_STRUCTURE_PROPOSAL.md (구조 개선 제안)
  - [x] BUILD_SYSTEM_PROPOSAL.md (Vite+SWC 빌드)
  - [x] GITHUB_PAGES_PROPOSAL.md (Svelte + CI/CD)
  - [x] NAMING_CONVENTIONS.md (네이밍 가이드)
  - [x] MODERNIZATION_GUIDE.md (현대화 가이드)
  - [x] TODO_ROADMAP.md (본 문서)

- [x] **개선 방향 결정**
  - [x] 현대화된 트렌드 적용 (TypeScript, ESLint, Prettier)
  - [x] 빌드 시스템 도입 (Vite + SWC)
  - [x] CI/CD 자동화 (GitHub Actions)

**소요 시간**: 1일 **완료일**: 2025-11-18

---

## Phase 1: 개발 환경 설정 ✅ (완료)

### 목표

린트, 포맷팅, 타입 체크 환경 구축

### 작업 목록

- [x] **패키지 설정**
  - [x] package.json 업데이트 (최신 버전 라이브러리)
  - [x] ESLint 9.x 설정 (Flat Config)
  - [x] Prettier 3.x 설정
  - [x] TypeScript 5.7 설정
  - [x] Jest 설정 유지

- [x] **코드 품질 도구**
  - [x] ESLint + TypeScript 통합
  - [x] ESLint + Prettier 통합
  - [x] JSDoc 플러그인 추가

- [x] **Git Hooks**
  - [x] Husky 9.x 설정
  - [x] lint-staged 설정
  - [x] pre-commit hook (lint + format + type-check)

- [x] **설정 파일**
  - [x] eslint.config.js
  - [x] .prettierrc.json
  - [x] .prettierignore
  - [x] tsconfig.json
  - [x] .gitignore 업데이트

**소요 시간**: 0.5일 **완료일**: 2025-11-18

---

## Phase 2: 코드 품질 개선 🔄 (진행 중)

### 목표

기존 코드의 버그 수정 및 코드 스타일 통일

### 작업 목록

#### 2.1 버그 수정 ✅

- [x] getCssProperty 논리 오류 수정
- [x] 에러 처리 추가 (FileReader, Image)
- [x] 파일 타입 검증 추가

#### 2.2 코드 스타일 현대화 📋

- [ ] **var → const/let 변경**
  - [ ] app/js/dkoverlay.js
  - [ ] app/background.js
  - [ ] app/js/option.js
  - [ ] app/js/i18n.js

- [ ] **console.log 제거** (에러 로그만 유지)
  - [ ] app/js/dkoverlay.js (현재 57, 62, 84줄)
  - [ ] bookmarklet/ollin.js (69, 74줄 등)

- [ ] **화살표 함수 전환**

  ```javascript
  // Before
  function getCssProperty() { ... }

  // After
  const getCssProperty = () => { ... };
  ```

- [ ] **템플릿 리터럴 사용**

  ```javascript
  // Before
  'x' +
    value
    // After
    `x${value}`;
  ```

- [ ] **Optional Chaining 사용**

  ```javascript
  // Before
  img.naturalWidth || img.width;

  // After
  img.naturalWidth ?? img.width;
  ```

#### 2.3 JSDoc 강화 📋

- [x] app/js/dkoverlay.js (완료)
- [x] app/background.js (완료)
- [x] app/js/option.js (완료)
- [ ] app/js/i18n.js
- [ ] bookmarklet/ollin.js

**예상 소요 시간**: 1일 **우선순위**: 높음

---

## Phase 3: 구조 리팩토링 📋 (계획)

### 목표

파일명, ID, 클래스명을 네이밍 컨벤션에 맞게 변경

### 작업 목록

#### 3.1 파일명 변경

- [ ] `app/js/dkoverlay.js` → `app/js/content-script.js`
- [ ] `app/js/option.js` → `app/js/options.js`
- [ ] `app/js/i18n.js` → (유지, 이미 명확함)
- [ ] `app/background.js` → (유지, 이미 명확함)

#### 3.2 ID 변경 (HTML/JavaScript)

```javascript
const IDS = {
  // Before → After
  'dk_overlay_img_layer' → 'ollin-layer',
  'dk_overlay_img' → 'ollin-image',
  'dk_overlay_btn' → 'ollin-toggle-btn',
  'dk_overlay_scale' → 'ollin-scale-slider',
  'dk_overlay_scale_text' → 'ollin-scale-value',
  'dk_overlay_opacity' → 'ollin-opacity-slider',
  'dk_overlay_opacity_text' → 'ollin-opacity-value',
  'dk_overlay_files' → 'ollin-file-input',
  'dk_overlay_controller_toolbar' → 'ollin-toolbar'
};
```

#### 3.3 클래스명 변경 (CSS)

```javascript
const CLASSES = {
  // Before → After
  'tit' → 'ollin-title',
  'sw' → 'ollin-toggle',
  'mag' → 'ollin-scale-icon',
  'opacity' → 'ollin-opacity-icon',
  'tools' → 'ollin-toolbar',
  'on' → 'ollin-toggle-active',
  'off' → 'ollin-toggle-inactive'
};
```

#### 3.4 변수/함수명 변경

```javascript
// Before
var ollin = {
  handle: {
    file: function () {},
    opacity: function () {},
    scale: function () {},
    layer: function () {}
  }
};

// After
const ollinOverlay = {
  handlers: {
    onFileSelect: () => {},
    onOpacityChange: () => {},
    onScaleChange: () => {},
    onLayerToggle: () => {}
  }
};
```

#### 3.5 CSS 파일 업데이트

- [ ] app/css/dkoverlay.css
- [ ] bookmarklet/ollin.css
- [ ] docs/ollin.css

**예상 소요 시간**: 2일 **우선순위**: 중간 **의존성**: Phase 2 완료 후

---

## Phase 4: TypeScript 전환 📋 (계획)

### 목표

점진적으로 TypeScript로 마이그레이션

### 작업 목록

#### 4.1 타입 정의 파일 작성

- [ ] `src/types/index.ts`
  - [ ] OllinConfig 인터페이스
  - [ ] OllinElements 인터페이스
  - [ ] OllinHandlers 인터페이스
  - [ ] OllinState 인터페이스

#### 4.2 유틸리티 함수 전환

- [ ] `src/core/utils.ts`
  - [ ] getCssProperty
  - [ ] showError
  - [ ] 기타 공통 함수

#### 4.3 설정 파일 전환

- [ ] `src/core/config.ts`
  - [ ] CONFIG 상수
  - [ ] IDS 상수
  - [ ] CLASSES 상수

#### 4.4 핵심 로직 전환

- [ ] `src/core/handlers.ts`
- [ ] `src/core/ui.ts`
- [ ] `src/core/drag.ts`
- [ ] `src/core/index.ts`

#### 4.5 Chrome Extension 전환

- [ ] `src/chrome/content-script.ts`
- [ ] `src/chrome/background.ts`
- [ ] `src/chrome/options.ts`
- [ ] `src/chrome/i18n.ts`

#### 4.6 테스트 전환

- [ ] `tests/setup.ts`
- [ ] `tests/*.test.ts`

**예상 소요 시간**: 3일 **우선순위**: 중간 **의존성**: Phase 3 완료 후

---

## Phase 5: 빌드 시스템 📋 (계획)

### 목표

Vite + SWC로 이중 빌드 (Chrome + Bookmarklet)

### 작업 목록

#### 5.1 Vite 설정

- [ ] `vite.config.ts` 작성
- [ ] Chrome Extension 빌드 설정
- [ ] Bookmarklet 빌드 설정 (ES5 변환)
- [ ] Path alias 설정 (@core, @chrome 등)

#### 5.2 SWC 설정

- [ ] `.swcrc` 작성
- [ ] ES2020 타겟 (Chrome)
- [ ] ES5 타겟 (Bookmarklet + 폴리필)

#### 5.3 빌드 스크립트

```json
{
  "scripts": {
    "dev:chrome": "vite build --watch --mode chrome",
    "dev:bookmarklet": "vite build --watch --mode bookmarklet",
    "build": "npm run build:all",
    "build:all": "npm run build:chrome && npm run build:bookmarklet",
    "build:chrome": "tsc && vite build --mode chrome",
    "build:bookmarklet": "tsc && vite build --mode bookmarklet"
  }
}
```

#### 5.4 공통 코어 모듈 생성

```
src/
├── core/           # 공통 핵심 로직
│   ├── config.ts
│   ├── utils.ts
│   ├── handlers.ts
│   ├── ui.ts
│   ├── drag.ts
│   └── index.ts
├── chrome/         # Chrome Extension wrapper
│   ├── content-script.ts
│   ├── background.ts
│   └── options.ts
└── bookmarklet/    # Bookmarklet wrapper
    └── index.ts
```

#### 5.5 결과물 검증

- [ ] Chrome Extension 테스트 (dist/chrome/)
- [ ] Bookmarklet 테스트 (dist/bookmarklet/)
- [ ] 번들 크기 확인
- [ ] 브라우저 호환성 테스트

**예상 소요 시간**: 2일 **우선순위**: 높음 **의존성**: Phase 4 완료 후

---

## Phase 6: CI/CD 자동화 📋 (계획)

### 목표

GitHub Actions로 자동 테스트/빌드/배포

### 작업 목록

#### 6.1 GitHub Actions Workflows

- [ ] `.github/workflows/ci.yml`
  - [ ] Lint
  - [ ] Type check
  - [ ] Test
  - [ ] Build

- [ ] `.github/workflows/deploy.yml`
  - [ ] Chrome Extension 빌드
  - [ ] Bookmarklet 빌드
  - [ ] GitHub Pages 배포

#### 6.2 GitHub Pages 현대화 (선택)

- [ ] SvelteKit 설정
- [ ] 메인 페이지 (Svelte)
- [ ] 데모 페이지 (Ollin 통합)
- [ ] 문서 페이지

#### 6.3 Release 자동화

- [ ] 버전 태깅
- [ ] Release Notes 생성
- [ ] Chrome Extension ZIP 업로드

**예상 소요 시간**: 2일 **우선순위**: 낮음 **의존성**: Phase 5 완료 후

---

## 우선순위 정리

### 즉시 (이번 주)

1. ✅ Phase 0: 분석 및 설계
2. ✅ Phase 1: 개발 환경 설정
3. 🔄 Phase 2: 코드 품질 개선

### 단기 (1주일)

4. Phase 3: 구조 리팩토링
5. Phase 4: TypeScript 전환 (일부)

### 중기 (2주)

6. Phase 4: TypeScript 전환 (완료)
7. Phase 5: 빌드 시스템

### 장기 (3주+)

8. Phase 6: CI/CD 자동화
9. 추가 기능 개발

---

## 예상 일정

```
Week 1
├── Phase 0 ✅ (1일)
├── Phase 1 ✅ (0.5일)
├── Phase 2 🔄 (1일)
└── Phase 3 📋 (2일)

Week 2
├── Phase 4 📋 (3일)
└── Phase 5 📋 (2일)

Week 3
└── Phase 6 📋 (2일)
```

**총 소요 시간**: 약 12일 (2.5주)

---

## 체크리스트

### ✅ 완료된 항목

- [x] 프로젝트 분석 문서 작성
- [x] 코드 리뷰 보고서 작성
- [x] 제안서 작성 (구조, 빌드, CI/CD)
- [x] 네이밍 컨벤션 가이드 작성
- [x] 현대화 가이드 작성
- [x] ESLint 설정
- [x] Prettier 설정
- [x] TypeScript 설정
- [x] Husky + lint-staged 설정
- [x] 버그 수정 (app 폴더)
- [x] 버그 수정 (bookmarklet 폴더)
- [x] JSDoc 추가 (app 폴더)

### 🔄 진행 중

- [ ] 코드 스타일 현대화 (var → const/let 등)
- [ ] console.log 제거
- [ ] 화살표 함수 전환

### 📋 대기 중

- [ ] 파일명/ID/클래스명 변경
- [ ] TypeScript 전환
- [ ] 빌드 시스템 구축
- [ ] CI/CD 설정

---

## 다음 단계

### 즉시 실행

1. **커밋 및 푸시**

   ```bash
   git add .
   git commit -m "chore: Add modernization setup (ESLint, Prettier, TypeScript, Husky)"
   git push
   ```

2. **npm install 실행**

   ```bash
   npm install
   ```

3. **린트/포맷 테스트**
   ```bash
   npm run lint
   npm run format
   npm run type-check
   ```

### 이번 주 목표

1. Phase 2 완료 (코드 품질 개선)
2. Phase 3 시작 (구조 리팩토링)

---

## 참고 문서

### 이 프로젝트의 문서

- [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) - 프로젝트 분석
- [CODE_REVIEW.md](./CODE_REVIEW.md) - 코드 리뷰 #1
- [CODE_REVIEW_2.md](./CODE_REVIEW_2.md) - 코드 리뷰 #2
- [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md) - 네이밍 가이드
- [MODERNIZATION_GUIDE.md](./MODERNIZATION_GUIDE.md) - 현대화 가이드
- [BUILD_SYSTEM_PROPOSAL.md](./BUILD_SYSTEM_PROPOSAL.md) - 빌드 제안
- [GITHUB_PAGES_PROPOSAL.md](./GITHUB_PAGES_PROPOSAL.md) - CI/CD 제안

---

**작성자**: AI Analysis (Claude Code) **마지막 업데이트**: 2025-11-18 **버전**:
1.0.0

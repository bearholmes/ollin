# GitHub Pages 현대화 및 CI/CD 제안

## 현재 상태

```
docs/
├── index.html         # 정적 HTML
└── ollin.js          # 북마클릿과 동일한 코드
```

**문제점:**
- 정적 HTML 유지보수 어려움
- 북마클릿 설명 페이지만 존재
- 반응형 디자인 부족
- SEO 최적화 없음
- 자동 배포 없음 (수동 업데이트)

---

## 제안 1: Svelte로 GitHub Pages 현대화

### 왜 Svelte인가?

| 프레임워크 | 번들 크기 | 학습 곡선 | 성능 | GitHub Pages 적합성 |
|-----------|----------|----------|------|-------------------|
| **Svelte** | ⭐⭐⭐⭐⭐ 작음 | ⭐⭐⭐⭐ 쉬움 | ⭐⭐⭐⭐⭐ | ✅ 최적 |
| React | ⭐⭐ 큼 | ⭐⭐⭐ 보통 | ⭐⭐⭐⭐ | △ |
| Vue | ⭐⭐⭐ 보통 | ⭐⭐⭐⭐ 쉬움 | ⭐⭐⭐⭐ | ✅ 좋음 |
| Vanilla JS | ⭐⭐⭐⭐⭐ 최소 | ⭐⭐ 어려움 | ⭐⭐⭐ | △ |

**Svelte 장점:**
- ✅ 컴파일 타임 최적화 → 런타임 번들 최소
- ✅ 간단한 문법 (HTML + CSS + JS)
- ✅ 반응형 기본 내장
- ✅ Vite와 완벽 호환
- ✅ GitHub Pages 최적화 (SvelteKit 어댑터)

---

## 프로젝트 구조 (Svelte 도입 후)

```
ollin/
├── src/
│   ├── core/                    # 공통 핵심 로직
│   ├── chrome/                  # Chrome Extension
│   ├── bookmarklet/             # Bookmarklet
│   └── pages/                   # 🆕 GitHub Pages (Svelte)
│       ├── routes/
│       │   ├── +page.svelte     # 메인 페이지
│       │   ├── +layout.svelte   # 레이아웃
│       │   ├── demo/
│       │   │   └── +page.svelte # 데모 페이지
│       │   └── docs/
│       │       └── +page.svelte # 문서 페이지
│       ├── lib/
│       │   ├── components/
│       │   │   ├── Header.svelte
│       │   │   ├── Footer.svelte
│       │   │   └── Demo.svelte
│       │   └── stores/
│       │       └── overlay.js
│       └── app.html
│
├── static/                      # 정적 파일
│   ├── ollin.css
│   ├── icons/
│   └── robots.txt
│
├── dist/
│   ├── chrome/                  # Chrome Extension 빌드
│   ├── bookmarklet/             # Bookmarklet 빌드
│   └── pages/                   # 🆕 GitHub Pages 빌드
│
├── .github/
│   └── workflows/
│       └── deploy.yml           # 🆕 CI/CD 설정
│
├── vite.config.js               # Vite (Chrome + Bookmarklet)
├── svelte.config.js             # 🆕 SvelteKit 설정
└── package.json
```

---

## SvelteKit 설정

### svelte.config.js
```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'dist/pages',
      assets: 'dist/pages',
      fallback: null,
      precompress: true,
      strict: true
    }),

    paths: {
      base: process.env.NODE_ENV === 'production' ? '/ollin' : ''
    },

    prerender: {
      entries: ['/', '/demo', '/docs']
    }
  }
};

export default config;
```

### package.json (업데이트)
```json
{
  "scripts": {
    "dev:chrome": "vite build --watch --mode chrome",
    "dev:bookmarklet": "vite build --watch --mode bookmarklet",
    "dev:pages": "vite dev",

    "build": "npm run build:all",
    "build:all": "npm run build:chrome && npm run build:bookmarklet && npm run build:pages",
    "build:chrome": "vite build --mode chrome",
    "build:bookmarklet": "vite build --mode bookmarklet",
    "build:pages": "vite build",

    "preview": "vite preview",
    "test": "jest"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## Svelte 페이지 예시

### src/pages/routes/+page.svelte (메인 페이지)
```svelte
<script>
  import { onMount } from 'svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let isLoaded = false;

  onMount(() => {
    isLoaded = true;
  });
</script>

<svelte:head>
  <title>Ollin - UI 개발자를 위한 디자인 오버레이 도구</title>
  <meta name="description" content="웹 페이지 위에 디자인 시안을 오버레이하여 픽셀 퍼펙트 구현을 도와주는 도구" />
</svelte:head>

<Header />

<main class:loaded={isLoaded}>
  <section class="hero">
    <h1>Ollin</h1>
    <p>UI 개발자를 위한 디자인 오버레이 도구</p>

    <div class="cta-buttons">
      <a href="https://chrome.google.com/webstore/..." class="btn btn-primary">
        Chrome Extension 설치
      </a>
      <a href="/demo" class="btn btn-secondary">
        온라인 데모 보기
      </a>
    </div>
  </section>

  <section class="features">
    <div class="feature-card">
      <h3>🖼️ 이미지 오버레이</h3>
      <p>디자인 시안을 웹 페이지 위에 투명하게 표시</p>
    </div>

    <div class="feature-card">
      <h3>🎯 정밀한 위치 조절</h3>
      <p>마우스 드래그 또는 키보드로 1px 단위 이동</p>
    </div>

    <!-- 더 많은 기능 카드 -->
  </section>
</main>

<Footer />

<style>
  main {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }

  main.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.2s;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
  }
</style>
```

### src/pages/routes/demo/+page.svelte (데모 페이지)
```svelte
<script>
  import { onMount } from 'svelte';
  import { initOllin } from '@core';

  let ollinInstance;

  onMount(() => {
    // Ollin 초기화
    ollinInstance = initOllin({
      appName: 'Ollin Demo',
      enableI18n: false
    });

    return () => {
      // 클린업
    };
  });
</script>

<svelte:head>
  <title>Ollin Demo - 온라인 데모</title>
</svelte:head>

<div class="demo-container">
  <aside class="sidebar">
    <h2>사용 방법</h2>
    <ol>
      <li>이미지 파일 선택</li>
      <li>드래그로 위치 조절</li>
      <li>슬라이더로 배율/투명도 조절</li>
    </ol>
  </aside>

  <main class="demo-content">
    <h1>데모 페이지</h1>
    <p>이 페이지에서 Ollin을 직접 체험해보세요!</p>

    <!-- 샘플 콘텐츠 -->
    <div class="sample-box"></div>
  </main>
</div>

<style>
  .demo-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .sidebar {
    background: #f5f5f5;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
</style>
```

---

## 제안 2: GitHub Actions로 자동 배포

### .github/workflows/deploy.yml
```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build Chrome Extension
        run: npm run build:chrome

      - name: Build Bookmarklet
        run: npm run build:bookmarklet

      - name: Build GitHub Pages
        run: npm run build:pages
        env:
          NODE_ENV: production

      - name: Upload Chrome Extension artifact
        uses: actions/upload-artifact@v4
        with:
          name: chrome-extension
          path: dist/chrome/

      - name: Upload Bookmarklet artifact
        uses: actions/upload-artifact@v4
        with:
          name: bookmarklet
          path: dist/bookmarklet/

      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/pages
          cname: ollin.yoursite.com  # (선택) 커스텀 도메인

  release:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && contains(github.event.head_commit.message, '[release]')

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download Chrome Extension artifact
        uses: actions/download-artifact@v4
        with:
          name: chrome-extension
          path: dist/chrome/

      - name: Create ZIP for Chrome Web Store
        run: |
          cd dist/chrome
          zip -r ../../ollin-chrome-${{ github.sha }}.zip .

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: ollin-chrome-${{ github.sha }}.zip
          tag_name: v${{ github.event.head_commit.timestamp }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 배포 워크플로우

### 개발 중
```bash
# 로컬 개발
npm run dev:pages
# → http://localhost:5173 에서 미리보기

# Chrome Extension 개발
npm run dev:chrome

# Bookmarklet 개발
npm run dev:bookmarklet
```

### PR 생성 시
```bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature
```

**GitHub Actions 자동 실행:**
1. ✅ 테스트 실행
2. ✅ 빌드 검증
3. ✅ 아티팩트 생성 (미리보기 가능)

### Main 브랜치 머지 시
```bash
git checkout main
git merge feature/new-feature
git push origin main
```

**GitHub Actions 자동 실행:**
1. ✅ 전체 빌드
2. ✅ GitHub Pages 자동 배포
3. ✅ 아티팩트 업로드
4. (선택) Release 생성

### 릴리즈 배포 시
```bash
git commit -m "chore: [release] v0.5.0"
git push origin main
```

**GitHub Actions 자동 실행:**
1. ✅ 빌드
2. ✅ GitHub Pages 배포
3. ✅ GitHub Release 생성
4. ✅ Chrome Extension ZIP 업로드

---

## GitHub Pages URL 구조

```
https://bearholmes.github.io/ollin/

├── /                    # 메인 페이지 (Svelte)
├── /demo                # 데모 페이지 (Ollin 체험)
├── /docs                # 문서 페이지
├── /ollin.min.js        # Bookmarklet 번들
└── /ollin.css           # CSS 파일
```

---

## SEO 최적화

### src/pages/app.html
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- SEO -->
    <meta name="description" content="UI 개발자를 위한 디자인 오버레이 도구. 웹 페이지 위에 디자인 시안을 표시하여 픽셀 퍼펙트 구현을 도와줍니다." />
    <meta name="keywords" content="UI, 디자인, 오버레이, 개발도구, Chrome Extension" />

    <!-- Open Graph -->
    <meta property="og:title" content="Ollin - UI 개발자를 위한 디자인 오버레이 도구" />
    <meta property="og:description" content="웹 페이지 위에 디자인 시안을 오버레이하여 픽셀 퍼펙트 구현" />
    <meta property="og:image" content="%sveltekit.assets%/og-image.png" />
    <meta property="og:url" content="https://bearholmes.github.io/ollin/" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Ollin" />
    <meta name="twitter:description" content="UI 개발자를 위한 디자인 오버레이 도구" />

    %sveltekit.head%
  </head>
  <body>
    <div>%sveltekit.body%</div>
  </body>
</html>
```

---

## 성능 최적화

### Svelte 번들 크기
```
Before (정적 HTML):  ~5KB
After (Svelte):      ~15KB (압축 후)
```

**최적화 기법:**
- ✅ 코드 스플리팅 (라우트별 분리)
- ✅ Tree shaking (미사용 코드 제거)
- ✅ Prerendering (정적 HTML 생성)
- ✅ Asset 압축 (Brotli, Gzip)
- ✅ Image 최적화 (WebP, AVIF)

---

## 비교표

| 항목 | 현재 (정적 HTML) | Svelte + CI/CD |
|------|-----------------|----------------|
| **유지보수** | 어려움 | 쉬움 |
| **반응형** | 수동 | 자동 |
| **SEO** | 기본 | 최적화 |
| **배포** | 수동 | 자동 |
| **번들 크기** | 5KB | 15KB |
| **개발 경험** | 낮음 | 높음 |
| **확장성** | 낮음 | 높음 |

---

## 마이그레이션 계획

### Phase 1: SvelteKit 설정 (0.5일)
1. ✅ SvelteKit 설치
2. ✅ svelte.config.js 작성
3. ✅ 기본 라우트 생성
4. ✅ 빌드 테스트

### Phase 2: 페이지 마이그레이션 (1일)
1. ✅ 메인 페이지 (Svelte 컴포넌트)
2. ✅ 데모 페이지 (Ollin 통합)
3. ✅ 문서 페이지
4. ✅ 레이아웃 및 스타일

### Phase 3: CI/CD 설정 (0.5일)
1. ✅ GitHub Actions 워크플로우 작성
2. ✅ 자동 배포 테스트
3. ✅ 브랜치 보호 규칙 설정

### Phase 4: 테스트 및 최적화 (0.5일)
1. ✅ 성능 측정 (Lighthouse)
2. ✅ SEO 검증
3. ✅ 크로스 브라우저 테스트

**총 소요 시간**: 2.5일

---

## 대안: 경량 프레임워크

Svelte가 부담스럽다면:

### 옵션 1: Astro (추천)
- 정적 사이트 생성에 최적화
- 번들 크기 더 작음 (Svelte보다)
- Svelte 컴포넌트 사용 가능

### 옵션 2: 11ty (Eleventy)
- 가장 가벼움
- 템플릿 엔진 기반
- 학습 곡선 낮음

### 옵션 3: 현재 유지 + 자동화
- HTML은 그대로
- GitHub Actions만 추가
- 가장 간단

---

## 결론

**추천**: Svelte + GitHub Actions

**이유:**
1. ✅ 유지보수 용이 (컴포넌트 기반)
2. ✅ 자동 배포 (main 머지 시)
3. ✅ 현대적인 개발 경험
4. ✅ SEO 최적화
5. ✅ 확장 가능한 구조

**우선순위:**
1. **즉시**: GitHub Actions 설정 (자동 배포)
2. **단기**: Svelte 마이그레이션
3. **중기**: 데모 페이지 강화
4. **장기**: 문서 사이트 확장

---

**작성일**: 2025-11-18
**작성자**: AI Analysis (Claude Code)

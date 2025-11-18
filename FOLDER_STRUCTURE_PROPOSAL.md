# 폴더 구조 개선 제안

## 현재 문제점

### 코드 중복
현재 동일한 핵심 로직이 3곳에 중복되어 있습니다:

```
ollin/
├── app/js/dkoverlay.js      # Chrome Extension용 (458줄)
├── bookmarklet/ollin.js     # 북마클릿용 (431줄)
└── docs/ollin.js            # GitHub Pages 데모용 (431줄, bookmarklet과 동일)
```

**문제점:**
- 버그 수정 시 3곳을 모두 수정해야 함
- 기능 추가 시 3곳에 동일한 코드 작성
- 유지보수 비용 증가
- 일관성 유지 어려움

---

## 해결 방안

### 방안 1: 공통 코어 모듈 추출 (권장)

```
ollin/
├── core/
│   └── ollin-core.js        # 공통 핵심 로직
├── app/                     # Chrome Extension
│   ├── manifest.json
│   ├── background.js
│   └── js/
│       └── dkoverlay.js     # Chrome API wrapper만 포함
├── bookmarklet/
│   ├── index.html
│   └── ollin.js             # core + 북마클릿 초기화
└── docs/
    ├── index.html
    └── ollin.js             # core + 데모 초기화
```

**장점:**
- 단일 책임 원칙 (Single Responsibility)
- 버그 수정 한 번으로 전체 적용
- 테스트 용이성
- 코드 재사용성

**단점:**
- 빌드 프로세스 필요 (webpack, rollup 등)
- 초기 구조 변경 작업 필요

---

### 방안 2: 심볼릭 링크 (간단한 방법)

```
ollin/
├── shared/
│   └── ollin-shared.js      # 공통 로직
├── app/js/
│   └── dkoverlay.js -> ../../shared/ollin-shared.js
├── bookmarklet/
│   └── ollin.js -> ../shared/ollin-shared.js
└── docs/
    └── ollin.js -> ../shared/ollin-shared.js
```

**장점:**
- 빌드 프로세스 불필요
- 즉시 적용 가능

**단점:**
- 플랫폼별 차이 처리 어려움
- Windows에서 심볼릭 링크 권한 문제
- Git에서 심볼릭 링크 처리 복잡

---

### 방안 3: 스크립트 기반 동기화

```bash
# sync.sh
#!/bin/bash
# bookmarklet/ollin.js를 기준으로 다른 파일들 동기화
cp bookmarklet/ollin.js docs/ollin.js
# app/js/dkoverlay.js는 Chrome Extension 전용 로직 유지
```

**장점:**
- 현재 구조 유지
- 간단한 스크립트로 동기화

**단점:**
- 수동 실행 필요
- app/js/dkoverlay.js는 별도 관리 필요
- 근본적인 해결책 아님

---

## 권장 구조 (방안 1 상세)

### Phase 1: 공통 모듈 추출

```javascript
// core/ollin-core.js
(function(global) {
    'use strict';

    // CONFIG, getCssProperty, showError 등 공통 로직
    var OllinCore = {
        CONFIG: { ... },
        utils: {
            getCssProperty: function() { ... },
            showError: function() { ... }
        },
        handle: { ... },
        markup: { ... },
        drag: { ... }
    };

    // UMD 패턴으로 export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = OllinCore;
    } else {
        global.OllinCore = OllinCore;
    }
})(this);
```

### Phase 2: 플랫폼별 Wrapper

#### Chrome Extension (app/js/dkoverlay.js)
```javascript
(function() {
    'use strict';

    var manifest = chrome.runtime.getManifest();
    var OllinChrome = Object.assign({}, OllinCore);

    // Chrome Extension 전용 기능 추가
    OllinChrome.init = function() {
        OllinCore.init();
        // Chrome 전용 초기화
    };

    OllinChrome.init();
})();
```

#### Bookmarklet (bookmarklet/ollin.js)
```javascript
(function() {
    'use strict';

    // OllinCore import
    var script = document.createElement('script');
    script.src = 'https://bearholmes.github.io/ollin/core/ollin-core.js';
    script.onload = function() {
        var OllinBookmarklet = Object.assign({}, OllinCore);

        // 북마클릿 전용 기능 (CSS 로드 등)
        OllinBookmarklet.markup.css = function() { ... };

        OllinBookmarklet.init();
    };
    document.head.appendChild(script);
})();
```

---

## 구현 로드맵

### 즉시 실행 가능 (현재 구조 유지)
1. ✅ docs/ollin.js를 bookmarklet/ollin.js와 동일하게 유지
2. ✅ 변경 시 두 파일 동시 업데이트

### 단기 (1-2주)
1. core/ollin-core.js 생성
2. 공통 로직 추출
3. 플랫폼별 wrapper 작성
4. 테스트 및 검증

### 중기 (1개월)
1. webpack/rollup 빌드 설정
2. ES6 모듈로 전환
3. TypeScript 마이그레이션 고려
4. 자동화된 빌드 파이프라인

---

## 비교표

| 항목 | 현재 | 방안 1 (권장) | 방안 2 | 방안 3 |
|------|------|---------------|--------|--------|
| **코드 중복** | 3곳 | 없음 | 없음 | 2곳 |
| **유지보수** | 어려움 | 쉬움 | 보통 | 어려움 |
| **빌드 필요** | 불필요 | 필요 | 불필요 | 불필요 |
| **플랫폼 커스터마이징** | 가능 | 쉬움 | 어려움 | 가능 |
| **즉시 적용** | - | X | O | O |
| **장기 유지보수** | X | O | △ | X |

---

## 결론 및 추천

### 즉시 조치
현재는 **방안 3 (스크립트 동기화)** 사용:
```bash
# bookmarklet과 docs 동기화
cp bookmarklet/ollin.js docs/ollin.js
```

### 장기 목표
**방안 1 (공통 코어 모듈)** 으로 전환:
- 시간 투자: 2-3일
- 장기적 이익: 유지보수 비용 80% 절감
- 확장성: 새로운 플랫폼 추가 용이 (Firefox Extension, Safari Extension 등)

---

## 다음 단계

### 1단계: 현재 상태 유지
- docs/ollin.js = bookmarklet/ollin.js (동일)
- app/js/dkoverlay.js = Chrome Extension 전용

### 2단계: 공통 로직 식별
- 100% 동일한 로직 추출
- 플랫폼별 차이점 문서화

### 3단계: 리팩토링 계획 수립
- 빌드 도구 선택 (webpack vs rollup)
- 모듈 시스템 결정 (UMD vs ES6)
- 마이그레이션 일정 수립

---

**작성일**: 2025-11-18
**작성자**: AI Analysis (Claude Code)

# Ollin 프로젝트 분석 문서

> AI 개발 시작을 위한 기초 정보

## 📋 프로젝트 개요

### 프로젝트 정보
- **이름**: Ollin (The name is set by Kitty)
- **버전**: 0.4.0
- **타입**: Chrome Extension (Manifest V3) + Bookmarklet
- **목적**: UI 개발자를 위한 디자인 시안 오버레이 도구
- **개발 기간**: 2017.01.20 ~ 현재 (유지보수 중)
- **라이선스**: Not specified

### 핵심 기능
웹 페이지 위에 디자인 시안 이미지를 오버레이하여 개발 중인 UI와 디자인을 비교할 수 있는 도구

1. **이미지 오버레이**: 로컬 이미지 파일을 웹 페이지 위에 표시
2. **위치 조절**: 마우스 드래그 및 키보드 방향키로 정밀 위치 조정
3. **배율 조절**: 0.5배 ~ 3배 (0.5 단위)
4. **투명도 조절**: 0 ~ 1 (0.05 단위)
5. **표시/숨김 토글**: 오버레이 레이어 on/off
6. **다국어 지원**: 한국어, 영어, 일본어, 중국어

---

## 🏗️ 프로젝트 구조

```
ollin/
├── app/                        # Chrome Extension 소스코드
│   ├── manifest.json           # Extension 설정 (MV3)
│   ├── background.js           # Service Worker (27줄)
│   ├── option.html/css/js      # 옵션 페이지
│   ├── js/
│   │   ├── dkoverlay.js        # ⭐ 핵심 로직 (304줄)
│   │   ├── option.js           # 옵션 페이지 스크립트 (12줄)
│   │   └── i18n.js             # 다국어 지원 (37줄)
│   ├── css/
│   │   ├── dkoverlay.css       # 오버레이 UI 스타일
│   │   └── option.css          # 옵션 페이지 스타일
│   ├── _locales/               # 다국어 메시지 (ko, en, ja, zh-CN)
│   └── icons/                  # 확장 아이콘 (16~128px)
│
├── bookmarklet/                # 북마클릿 버전
│   ├── index.html
│   ├── ollin.js                # bookmarklet 로직 (308줄)
│   └── ollin.css
│
├── docs/                       # GitHub Pages 데모
│   ├── index.html
│   ├── ollin.js
│   └── ollin.css
│
├── README.md
├── privacy_policy.md           # 개인정보처리방침
└── .git/                       # Git 저장소 (64 commits)
```

---

## 🔧 기술 스택

### 언어 및 런타임
- **JavaScript (ES6)**: const/let, arrow functions, IIFE
- **HTML5**: Semantic markup
- **CSS3**: Grid, Flexbox, Transform

### Chrome APIs
- **Manifest V3**: 최신 Extension API
- **chrome.runtime**: 확장 메타데이터 관리
- **chrome.scripting**: Content script 동적 삽입
- **chrome.i18n**: 다국어 메시지 관리
- **chrome.action**: Toolbar 아이콘 제어

### Web APIs
- **FileReader API**: 로컬 이미지 파일 읽기
- **Image API**: 이미지 로드 및 크기 계산
- **DOM API**: 동적 요소 생성 및 조작
- **Event API**: 마우스/키보드 이벤트 처리

### 개발 도구
- **외부 의존성 없음**: npm, webpack, babel 불필요
- **Vanilla JS**: 순수 JavaScript 구현
- **JSHint**: 코드 품질 검사 (주석으로 설정)

---

## 📁 핵심 파일 상세 분석

### 1. `app/js/dkoverlay.js` (304줄) ⭐⭐⭐

**전체 로직의 80%를 차지하는 핵심 파일**

#### 구조
```javascript
(function() {
    "use strict";
    const manifest = chrome.runtime.getManifest();
    const doc = document;

    // 유틸리티
    const getCssProperty = function(elmId, property) {...};

    // 전역 상태
    let clickX, clickY, beforeX, beforeY, elemOffsetX, elemOffsetY;

    const ollin = {
        handle: {...},    // 이벤트 핸들러
        markup: {...},    // DOM 생성
        drag: {...},      // 드래그 로직
        init: function()  // 초기화
    };

    ollin.init();
})();
```

#### 주요 객체 및 메서드

##### `ollin.handle` - 이벤트 핸들러
| 메서드 | 역할 | 트리거 |
|--------|------|--------|
| `file(e)` | 이미지 파일 로드 및 오버레이 활성화 | file input change |
| `opacity()` | 투명도 조절 (0~1) | range input change |
| `scale()` | 배율 조절 (0.5~3) 및 위치 보정 | range input change |
| `layer()` | 오버레이 표시/숨김 토글 | button click |

##### `ollin.markup` - DOM 생성
| 메서드 | 역할 | 생성 요소 |
|--------|------|-----------|
| `overlay()` | 이미지 레이어 생성 | `#dk_overlay_img_layer > #dk_overlay_img` |
| `control()` | 제어 도구모음 생성 | `#dk_overlay_controller_toolbar` + 하위 요소들 |

##### `ollin.drag` - 드래그 및 키보드 이동
| 메서드 | 역할 | 이벤트 |
|--------|------|--------|
| `click(e, elem)` | 드래그 시작 좌표 저장 | mousedown |
| `move(e, elem)` | 드래그 중 위치 계산 및 적용 | drag |
| `key(e, elem)` | 화살표 키로 1px/10px 이동 | keydown |
| `init()` | Drag 프로토타입 생성 및 이벤트 바인딩 | - |

##### `ollin.init()` - 초기화
실행 순서:
1. `ollin.markup.overlay()` - 이미지 레이어 DOM 생성
2. `ollin.markup.control()` - 제어 도구모음 DOM 생성
3. `ollin.drag.init()("dk_overlay_img_layer")` - 드래그 이벤트 설정
4. 이벤트 리스너 등록 (button, range inputs, file input)

#### 주요 로직 흐름

**파일 선택 시:**
```
사용자가 파일 선택
  ↓
ollin.handle.file() 실행
  ↓
FileReader로 파일 읽기
  ↓
Image 객체 생성 및 src 설정
  ↓
img.onload에서 canvas에 이미지 설정
  ↓
오버레이 레이어 display: block
  ↓
토글 버튼 및 슬라이더 활성화
```

**드래그 시:**
```
mousedown → ollin.drag.click()
  ↓
클릭 좌표 및 요소 offset 저장
  ↓
drag 이벤트 → ollin.drag.move()
  ↓
이동 거리 계산 (현재 좌표 - 클릭 좌표)
  ↓
elem.style.left/top 업데이트
```

**배율 조절 시:**
```
range input change → ollin.handle.scale()
  ↓
transform: scale() 적용
  ↓
이미지 크기 계산
  ↓
중앙 정렬 유지를 위한 top/left 보정
  (배율에 따라 다른 계산식 적용)
```

---

### 2. `app/background.js` (27줄)

**Service Worker 역할**

#### 주요 기능

1. **첫 설치 시 옵션 페이지 열기**
```javascript
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: "option.html" });
    }
});
```

2. **확장 아이콘 클릭 시 스크립트 주입**
```javascript
chrome.action.onClicked.addListener(function(tab) {
    // Chrome 내부 페이지 차단
    if (tab.url.indexOf("chrome://") === 0 || ...) {
        alert("크롬 내부 페이지에서는 작동하지 않습니다.");
        return;
    }

    // Content script 주입
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/dkoverlay.js']
    });

    // CSS 주입
    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['css/dkoverlay.css']
    });
});
```

#### 보안 고려사항
- Chrome 내부 페이지 (`chrome://`, `chrome.google.com`) 차단
- `activeTab` 권한으로 최소 권한 원칙 준수

---

### 3. `app/js/option.js` (12줄)

**옵션 페이지 초기화**

```javascript
var manifest = chrome.runtime.getManifest();
var name = manifest.name;
var ver = manifest.version;

window.onload = function() {
    document.title = name + "- Option";
    document.getElementById("dk_title").innerText = name;
    document.getElementById("dk_ver").innerText = ver;
}
```

**역할:**
- manifest.json에서 앱 이름 및 버전 읽기
- 옵션 페이지 제목 및 UI에 반영

---

### 4. `app/js/i18n.js` (37줄)

**다국어 지원 구현**

```javascript
const i18n = chrome.i18n.getMessage;

// HTML 요소의 data-i18n 속성 읽기
// 형식: "attribute=@@message_key" 또는 "@@message_key"
let localeText = document.querySelectorAll("[data-i18n]");
localeText.forEach(elt => {
    let term = elt.getAttribute("data-i18n").split("=");
    if (term.length > 1) {
        // 속성 설정 (예: title=@@tooltip_text)
        elt.setAttribute(term[0], i18n(term[1].replace("@@", "")));
    } else {
        // 텍스트 콘텐츠 설정
        elt.innerHTML = i18n(term[0].replace("@@", ""));
    }
});
```

**지원 언어:**
- `_locales/ko/messages.json` - 한국어
- `_locales/en/messages.json` - 영어
- `_locales/ja/messages.json` - 일본어
- `_locales/zh-CN/messages.json` - 중국어 (간체)

---

### 5. `app/manifest.json`

**Extension 설정 (Manifest V3)**

```json
{
  "manifest_version": 3,
  "name": "__MSG_application_title__",
  "version": "0.4.0",
  "default_locale": "ko",

  "background": {
    "service_worker": "background.js"
  },

  "action": {
    "default_icon": {
      "16": "icons/16.png",
      "22": "icons/22.png",
      "24": "icons/24.png",
      "32": "icons/32.png",
      "48": "icons/48.png",
      "128": "icons/128.png"
    },
    "default_title": "__MSG_application_default_title__"
  },

  "permissions": [
    "activeTab",
    "contextMenus",
    "scripting"
  ],

  "options_page": "option.html",
  "homepage_url": "https://bearholmes.github.io/ollin/"
}
```

**주요 설정:**
- **MV3**: 최신 Manifest Version 3 사용
- **Service Worker**: background.js를 service worker로 실행
- **최소 권한**: activeTab, contextMenus, scripting만 요청
- **다국어**: i18n 메시지 파일 사용

---

## 🔍 코드 품질 분석

### ✅ 강점

1. **경량성**: 외부 의존성 없음, 번들 크기 최소화
2. **보안**: 최소 권한 원칙, Chrome 내부 페이지 차단
3. **다국어**: 4개 언어 완전 지원
4. **접근성**: 키보드 네비게이션 지원
5. **스코프 격리**: IIFE 패턴으로 전역 오염 방지
6. **크로스 브라우징**: bookmarklet 버전으로 Safari/Firefox 지원 가능

### ⚠️ 개선 필요 사항

#### 1. 버그 (심각도: 높음)

**`getCssProperty` 함수 논리 오류 (dkoverlay.js:16)**
```javascript
// 현재 (잘못됨)
const getCssProperty = function (elmId, property) {
    let elem = elmId ? elmId : doc.getElementById(elmId);
    // elmId가 truthy면 elmId 자체 반환
    // elmId가 falsy면 getElementById(falsy값) 호출 → 버그!
    ...
};

// 올바른 구현
const getCssProperty = function (elmId, property) {
    let elem = typeof elmId === 'string'
        ? doc.getElementById(elmId)
        : elmId;
    ...
};
```

#### 2. 에러 처리 부재 (심각도: 중)

**파일 로드 실패 처리 없음 (dkoverlay.js:30-44)**
```javascript
// 현재: 에러 처리 없음
fr.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
        canvas.src = e.target.result;
        // 이미지 로드 실패 시 아무 반응 없음
    }
};

// 개선안
fr.onload = function (e) {
    const img = new Image();
    img.onerror = function() {
        console.error('이미지 로드 실패');
        alert('이미지 파일을 불러올 수 없습니다.');
    };
    img.src = e.target.result;
    ...
};
fr.onerror = function() {
    console.error('파일 읽기 실패');
    alert('파일을 읽을 수 없습니다.');
};
```

#### 3. 성능 이슈 (심각도: 중)

**DOM 요소 반복 조회**
```javascript
// 현재: 매번 getElementById 호출
doc.getElementById("dk_overlay_img_layer").style.opacity = this.value;
doc.getElementById("dk_overlay_opacity_text").innerText = this.value;

// 개선안: 요소 캐싱
const elements = {
    imgLayer: null,
    opacityText: null,
    // ...
};

// init 시점에 한 번만 조회
elements.imgLayer = doc.getElementById("dk_overlay_img_layer");
elements.opacityText = doc.getElementById("dk_overlay_opacity_text");

// 사용 시
elements.imgLayer.style.opacity = this.value;
elements.opacityText.innerText = this.value;
```

#### 4. 하드코딩된 매직 넘버 (심각도: 낮음)

```javascript
// 현재
scale.max = 3;           // 왜 3?
scale.min = 0.5;         // 왜 0.5?
scale.step = 0.5;
opacity.step = 0.05;     // 왜 0.05?
body.style.setProperty("transform", "translateY(30px)", "important"); // 30px?

// 개선안
const CONFIG = {
    SCALE_MAX: 3,
    SCALE_MIN: 0.5,
    SCALE_STEP: 0.5,
    OPACITY_MIN: 0,
    OPACITY_MAX: 1,
    OPACITY_STEP: 0.05,
    TOOLBAR_HEIGHT: 30,
    KEYBOARD_MOVE_NORMAL: 1,
    KEYBOARD_MOVE_FAST: 10
};
```

#### 5. 일관성 없는 변수 선언 (심각도: 낮음)

```javascript
// dkoverlay.js: const/let 사용 (ES6)
const manifest = chrome.runtime.getManifest();
let clickX = 0;

// option.js: var 사용 (ES5)
var manifest = chrome.runtime.getManifest();
var name = manifest.name;

// 전체를 const/let으로 통일 필요
```

#### 6. 문서화 부족 (심각도: 중)

- JSDoc 주석 없음
- 함수 매개변수 타입 불명확
- 반환값 설명 없음

```javascript
// 개선 예시
/**
 * DOM 요소의 CSS 속성값을 정수로 반환
 * @param {HTMLElement|string} elmId - DOM 요소 또는 요소 ID
 * @param {string} property - CSS 속성명 (예: "left", "top", "width")
 * @returns {number} 속성값 (px 단위, 정수)
 * @example
 * const leftPos = getCssProperty('myElement', 'left');
 * const leftPos2 = getCssProperty(document.getElementById('myElement'), 'left');
 */
const getCssProperty = function (elmId, property) {
    ...
};
```

#### 7. 디버깅 코드 (심각도: 낮음)

프로덕션 코드에 console.log가 남아있음
```javascript
// dkoverlay.js에 다수 존재
console.log('opacity', this.value);     // line 57
console.log('scale', this.value);       // line 62
console.log('off')                      // line 84
console.log("left");                    // line 218
// ... 등등
```

#### 8. 테스트 부재 (심각도: 높음)

- 단위 테스트 없음
- 통합 테스트 없음
- E2E 테스트 없음

---

## 🎯 개선 우선순위 로드맵

### Phase 1: 버그 수정 및 안정성 강화 (필수)

1. ✅ `getCssProperty` 논리 오류 수정
2. ✅ 에러 처리 추가 (FileReader, Image 로드)
3. ✅ DOM 요소 캐싱으로 성능 개선
4. ✅ console.log 제거 또는 development 모드로 제한

### Phase 2: 코드 품질 개선 (권장)

1. ✅ JSDoc 주석 추가
2. ✅ 매직 넘버를 상수로 추출
3. ✅ var → const/let 통일
4. ✅ ESLint + Prettier 설정

### Phase 3: 테스트 및 문서화 (권장)

1. ✅ Jest 설정 및 단위 테스트 작성
2. ✅ Puppeteer로 E2E 테스트 추가
3. ✅ README.md 개선
4. ✅ API 문서 자동 생성 (JSDoc → HTML)

### Phase 4: 기능 확장 (선택)

1. ⬜ 다중 이미지 오버레이 지원
2. ⬜ 이미지 회전 기능
3. ⬜ 그리드 오버레이 옵션
4. ⬜ 저장/불러오기 기능 (위치, 배율 등)
5. ⬜ 단축키 커스터마이징

---

## 📝 개발 가이드

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone https://github.com/bearholmes/ollin.git
cd ollin
```

2. **Chrome Extension 로드**
- Chrome 주소창에 `chrome://extensions/` 입력
- "개발자 모드" 활성화
- "압축해제된 확장 프로그램을 로드합니다." 클릭
- `ollin/app/` 폴더 선택

3. **테스트**
- 아무 웹페이지 열기
- 확장 아이콘 클릭
- 파일 선택 버튼으로 이미지 업로드
- 드래그, 슬라이더로 기능 테스트

### 파일 수정 시 재로드

**방법 1: 확장 프로그램 페이지에서**
- `chrome://extensions/` 접속
- Ollin 확장의 "새로고침" 아이콘 클릭

**방법 2: background.js 수정 시**
- Service Worker 재시작 필요
- 확장 재로드 필수

**방법 3: content script (dkoverlay.js) 수정 시**
- 확장 재로드 후
- 테스트 페이지 새로고침

### 디버깅

**Content Script 디버깅:**
```javascript
// dkoverlay.js에 디버거 추가
debugger;

// 또는
console.log('debug:', variable);
```
- Chrome DevTools (F12) → Console 탭에서 확인

**Background Script 디버깅:**
- `chrome://extensions/` → Ollin → "Service Worker" 링크 클릭
- DevTools 팝업 창에서 로그 확인

**옵션 페이지 디버깅:**
- 옵션 페이지에서 F12로 DevTools 열기

---

## 🧪 테스트 시나리오

### 기본 기능 테스트

1. **파일 선택 및 로드**
   - [ ] PNG 이미지 로드
   - [ ] JPG 이미지 로드
   - [ ] GIF 이미지 로드 (애니메이션 정지)
   - [ ] SVG 이미지 로드
   - [ ] 비이미지 파일 선택 시 에러 처리
   - [ ] 매우 큰 이미지 (10MB+) 로드

2. **드래그 기능**
   - [ ] 마우스 드래그로 이미지 이동
   - [ ] 빠른 드래그 시 정확도
   - [ ] 화면 밖으로 드래그 시 동작

3. **키보드 이동**
   - [ ] 방향키로 1px 이동
   - [ ] Shift + 방향키로 10px 이동
   - [ ] 연속 키 입력 시 성능

4. **배율 조절**
   - [ ] 0.5배 축소
   - [ ] 1배 (원본)
   - [ ] 3배 확대
   - [ ] 배율 변경 시 중앙 정렬 유지

5. **투명도 조절**
   - [ ] 0 (완전 투명)
   - [ ] 0.5 (반투명)
   - [ ] 1 (불투명)

6. **표시/숨김 토글**
   - [ ] 버튼 클릭으로 on/off
   - [ ] 상태에 따른 아이콘 변경

### 다국어 테스트

- [ ] Chrome 언어 설정: 한국어
- [ ] Chrome 언어 설정: 영어
- [ ] Chrome 언어 설정: 일본어
- [ ] Chrome 언어 설정: 중국어 (간체)

### 브라우저 호환성

- [ ] Chrome (최신 버전)
- [ ] Chrome (이전 버전)
- [ ] Edge (Chromium)

### 보안 테스트

- [ ] Chrome 내부 페이지에서 실행 차단 확인
- [ ] chrome:// 페이지
- [ ] chrome.google.com 페이지

---

## 🚀 배포 가이드

### Chrome Web Store 배포

1. **빌드 준비**
```bash
cd ollin/app
zip -r ../ollin-v0.4.0.zip .
```

2. **Chrome Web Store Developer Dashboard**
- https://chrome.google.com/webstore/devconsole 접속
- "항목 추가" 또는 기존 항목 업데이트
- ZIP 파일 업로드
- 스크린샷, 설명 업데이트
- 검토 제출

3. **버전 관리**
- manifest.json의 version 필드 업데이트 필요
- 시맨틱 버저닝 권장 (예: 0.4.1, 0.5.0, 1.0.0)

---

## 📚 참고 자료

### Chrome Extension 개발
- [Chrome Extensions MV3 공식 문서](https://developer.chrome.com/docs/extensions/mv3/)
- [Manifest V3 마이그레이션 가이드](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/)

### Web APIs
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

### 코드 스타일
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

---

## 🐛 알려진 이슈

1. **getCssProperty 논리 오류** (dkoverlay.js:16)
   - 현재 elmId가 falsy일 때 잘못된 동작
   - 해결: 타입 체크 추가 필요

2. **에러 처리 부재**
   - 파일 로드 실패 시 피드백 없음
   - 해결: try-catch 및 에러 콜백 추가

3. **반복적인 DOM 조회**
   - 성능 저하 가능성
   - 해결: 요소 캐싱

4. **프로덕션 디버깅 코드**
   - console.log가 다수 존재
   - 해결: 제거 또는 development 모드로 제한

---

## 💡 AI 개발 시 주의사항

1. **기존 기능 유지**: 모든 개선은 기존 기능을 깨뜨리지 않는 선에서 진행
2. **테스트 우선**: 코드 수정 전에 테스트 시나리오 작성
3. **점진적 개선**: 한 번에 너무 많은 변경 피하기
4. **호환성 유지**: Chrome Extension MV3 요구사항 준수
5. **사용자 경험**: UI/UX 일관성 유지
6. **문서 동기화**: 코드 변경 시 이 문서도 함께 업데이트

---

## 📞 연락처 및 지원

- **GitHub**: https://github.com/bearholmes/ollin
- **Chrome Web Store**: https://chrome.google.com/webstore/detail/the-name-is-set-by-kitty/fmondiepbajacmihnjakbimgmohadakp
- **Demo Page**: https://bearholmes.github.io/ollin/

---

**마지막 업데이트**: 2025-11-18
**작성자**: AI Analysis (Claude Code)
**버전**: 1.0.0

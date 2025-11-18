// @ts-check
/*jshint browser: true */
/**
 * @file Ollin Content Script - Design Overlay Tool
 * @description Chrome Extension content script for overlaying design mockups
 * @author bearholmes
 * @version 0.6.0
 * @license MIT
 */

/// <reference path="../../src/types/index.ts" />

(function () {
  'use strict';

  /**
   * Configuration constants
   * @type {import('../../src/types/index').OllinConfig}
   */
  const CONFIG = {
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

  /** @type {import('../../src/types/index').ChromeManifest} */
  const manifest = chrome.runtime.getManifest();
  /** @type {string} */
  const extension_name = manifest.name;

  /** @type {Document} */
  const doc = document;
  /** @type {HTMLElement} */
  const html = doc.getElementsByTagName('html')[0];
  /** @type {HTMLElement} */
  const body = doc.getElementsByTagName('BODY')[0];

  /**
   * Cached DOM elements
   * @type {import('../../src/types/index').OllinElements}
   */
  const elements = {
    imgLayer: null,
    img: null,
    btn: null,
    scale: null,
    scaleText: null,
    opacity: null,
    opacityText: null,
    files: null
  };

  /**
   * DOM 요소의 CSS 속성값을 정수로 반환
   * @param {HTMLElement|string} elmId - DOM 요소 또는 요소 ID
   * @param {string} property - CSS 속성명 (예: "left", "top", "width")
   * @returns {number} 속성값 (px 단위, 정수)
   */
  const getCssProperty = (elmId, property) => {
    const elem = typeof elmId === 'string' ? doc.getElementById(elmId) : elmId;
    if (!elem) {
      console.error('Element not found:', elmId);
      return 0;
    }
    const prop = window.getComputedStyle(elem, null).getPropertyValue(property);
    return parseInt(prop, 10);
  };

  /**
   * 사용자에게 에러 메시지 표시
   * @param {string} message - 에러 메시지
   */
  const showError = (message) => {
    const i18nMessage = chrome.i18n ? chrome.i18n.getMessage(message) : message;
    alert(i18nMessage || message);
  };

  // 드래그 상태 변수
  /** @type {number} */
  let clickX = 0;
  /** @type {number} */
  let clickY = 0;
  /** @type {number} */
  let beforeX = 0;
  /** @type {number} */
  let beforeY = 0;
  /** @type {number} */
  let elemOffsetX = 0;
  /** @type {number} */
  let elemOffsetY = 0;

  /**
   * Main Ollin object
   * @type {import('../../src/types/index').Ollin}
   */
  const ollin = {
    handlers: {
      /**
       * 이미지 파일 로드 및 오버레이 활성화
       * @param {Event} e - File input change event
       */
      file: (e) => {
        const canvas = elements.img;
        const file = e.target?.files?.[0];

        if (!file) {
          return;
        }

        // 이미지 파일 타입 검증
        if (!file.type.match(/image\/(png|jpe?g|gif|svg\+xml|webp)/i)) {
          showError('이미지 파일만 선택할 수 있습니다.');
          return;
        }

        const fr = new FileReader();

        fr.onerror = () => {
          console.error('파일 읽기 실패:', file.name);
          showError('파일을 읽을 수 없습니다.');
        };

        fr.onload = (e) => {
          const img = new Image();

          img.onerror = () => {
            console.error('이미지 로드 실패:', file.name);
            showError('이미지 파일을 불러올 수 없습니다.');
          };

          img.onload = () => {
            canvas.src = e.target?.result;
            canvas.width = img.naturalWidth ?? img.width;
            canvas.height = img.naturalHeight ?? img.height;

            // 오버레이 활성화
            ollin.activateOverlay();
          };

          img.src = e.target?.result;
        };

        fr.readAsDataURL(file);
      },

      /**
       * 오버레이 레이어 및 컨트롤 활성화
       */
      activateOverlay: () => {
        if (elements.btn.disabled === true) {
          elements.imgLayer.style.display = 'block';
          elements.btn.childNodes[0].className = 'on';
          elements.btn.disabled = false;
          elements.scale.disabled = false;
          elements.opacity.disabled = false;
        }
      },

      /**
       * 투명도 조절
       * @param {Event} e - Input change event
       */
      opacity: (e) => {
        const value = e.target.value;
        elements.imgLayer.style.opacity = value;
        elements.opacityText.innerText = value;
      },

      /**
       * 배율 조절 및 위치 보정
       * @param {Event} e - Input change event
       */
      scale: (e) => {
        const value = parseFloat(e.target.value);
        elements.imgLayer.style.transform = `scale(${value}, ${value})`;
        elements.scaleText.innerText = `x${value}`;

        const img_width = getCssProperty(elements.img, 'width');
        const img_height = getCssProperty(elements.img, 'height');

        // 배율 변경 시 중앙 정렬 유지를 위한 위치 보정
        if (value === CONFIG.SCALE_MIN) {
          elements.imgLayer.style.top = `${img_height * (value * 0.5) * -1 + CONFIG.TOOLBAR_HEIGHT}px`;
          elements.imgLayer.style.left = `${img_width * (value * 0.5) * -1}px`;
        } else {
          elements.imgLayer.style.top = `${img_height * (1 - value) * -0.5 + CONFIG.TOOLBAR_HEIGHT}px`;
          elements.imgLayer.style.left = `${img_width * (1 - value) * -0.5}px`;
        }
      },

      /**
       * 오버레이 레이어 표시/숨김 토글
       */
      layer: () => {
        const overlay_elem = elements.imgLayer;
        const btn_elem = elements.btn;

        if (overlay_elem.style.display === 'block') {
          overlay_elem.style.display = 'none';
          btn_elem.childNodes[0].className = 'off';
        } else {
          overlay_elem.style.display = 'block';
          btn_elem.childNodes[0].className = 'on';
        }
      }
    },

    ui: {
      /**
       * 이미지 오버레이 레이어 DOM 생성
       */
      overlay: () => {
        const div = doc.createElement('div');
        const img = doc.createElement('img');

        div.id = 'ollin-img-layer';
        div.style.display = 'none';

        img.id = 'ollin-img';
        img.src = '';
        img.alt = '';
        img.draggable = true;

        div.appendChild(img);
        html.appendChild(div);
      },

      /**
       * 제어 도구모음 DOM 생성
       */
      control: () => {
        const div = doc.createElement('div');
        const tit = doc.createElement('span');

        div.id = 'ollin-controller-toolbar';
        tit.className = 'tit';
        tit.innerText = extension_name;

        // 토글 버튼
        const sw = doc.createElement('button');
        const sw_icon = doc.createElement('i');

        sw.id = 'ollin-btn';
        sw.className = 'sw';
        sw.disabled = true;
        sw_icon.className = 'off';
        sw.appendChild(sw_icon);

        div.appendChild(sw);
        div.appendChild(tit);

        // 파일 입력
        const file = doc.createElement('input');
        file.id = 'ollin-files';
        file.setAttribute('type', 'file');
        file.setAttribute('accept', 'image/*');
        div.appendChild(file);

        // 도구모음 컨테이너
        const sub = doc.createElement('div');
        sub.className = 'tools';

        // 배율 조절
        const s_icon = doc.createElement('i');
        const scale = doc.createElement('input');
        const s_txt = doc.createElement('span');

        s_icon.className = 'mag';
        s_icon.title = 'ratio';
        scale.id = 'ollin-scale';
        scale.setAttribute('type', 'range');
        scale.max = CONFIG.SCALE_MAX;
        scale.min = CONFIG.SCALE_MIN;
        scale.step = CONFIG.SCALE_STEP;
        scale.value = 1;
        scale.disabled = true;
        s_txt.id = 'ollin-scale-text';
        s_txt.innerText = 'x1';

        sub.appendChild(s_icon);
        sub.appendChild(scale);
        sub.appendChild(s_txt);

        // 투명도 조절
        const o_icon = doc.createElement('i');
        const opacity = doc.createElement('input');
        const o_txt = doc.createElement('span');

        o_icon.className = 'opacity';
        o_icon.title = 'opacity';
        opacity.id = 'ollin-opacity';
        opacity.setAttribute('type', 'range');
        opacity.max = CONFIG.OPACITY_MAX;
        opacity.min = CONFIG.OPACITY_MIN;
        opacity.step = CONFIG.OPACITY_STEP;
        opacity.value = CONFIG.OPACITY_DEFAULT;
        opacity.disabled = true;
        o_txt.id = 'ollin-opacity-text';
        o_txt.innerText = CONFIG.OPACITY_DEFAULT.toString();

        sub.appendChild(o_icon);
        sub.appendChild(opacity);
        sub.appendChild(o_txt);

        div.appendChild(sub);

        // body를 아래로 밀어서 도구모음 공간 확보
        body.style.setProperty('transform', `translateY(${CONFIG.TOOLBAR_HEIGHT}px)`, 'important');
        html.appendChild(div);
      }
    },

    drag: {
      /**
       * 드래그 시작: 클릭 좌표 및 요소 오프셋 저장
       * @param {MouseEvent} e - mousedown event
       * @param {HTMLElement} elem - 드래그할 요소
       * @returns {boolean} false (이벤트 전파 중단)
       */
      click: (e, elem) => {
        clickX = e.clientX;
        clickY = e.clientY;

        elemOffsetX = getCssProperty(elem, 'left');
        elemOffsetY = getCssProperty(elem, 'top');
        return false;
      },

      /**
       * 드래그 중: 요소 위치 업데이트
       * @param {DragEvent} e - drag event
       * @param {HTMLElement} elem - 드래그 중인 요소
       * @returns {boolean} false (이벤트 전파 중단)
       */
      move: (e, elem) => {
        const moveX = e.clientX;
        const moveY = e.clientY;
        const resultX = moveX - clickX;
        const resultY = moveY - clickY;

        // 유효한 이동인지 확인
        if (!(beforeX === resultX && beforeY === resultY) && !(moveX === 0 && moveY === 0)) {
          const left = resultX + elemOffsetX;
          const top = resultY + elemOffsetY;

          elem.style.left = `${left}px`;
          elem.style.top = `${top}px`;

          beforeX = resultX;
          beforeY = resultY;
        }
        return false;
      },

      /**
       * 키보드 방향키로 요소 이동
       * @param {KeyboardEvent} e - keydown event
       * @param {HTMLElement} elem - 이동할 요소
       */
      key: (e, elem) => {
        elemOffsetX = getCssProperty(elem, 'left');
        elemOffsetY = getCssProperty(elem, 'top');

        const moveStep = e.shiftKey ? CONFIG.KEYBOARD_MOVE_FAST : CONFIG.KEYBOARD_MOVE_NORMAL;

        switch (e.keyCode) {
          case CONFIG.KEY_CODES.LEFT:
            elem.style.left = `${elemOffsetX - moveStep}px`;
            e.preventDefault();
            break;

          case CONFIG.KEY_CODES.UP:
            elem.style.top = `${elemOffsetY - moveStep}px`;
            e.preventDefault();
            break;

          case CONFIG.KEY_CODES.RIGHT:
            elem.style.left = `${elemOffsetX + moveStep}px`;
            e.preventDefault();
            break;

          case CONFIG.KEY_CODES.DOWN:
            elem.style.top = `${elemOffsetY + moveStep}px`;
            e.preventDefault();
            break;
        }
      },

      /**
       * 드래그 기능 초기화: 이벤트 리스너 등록
       * @returns {Function} Drag 생성자 함수
       */
      init: () => {
        /**
         * Drag 생성자
         * @class
         * @param {string} elemId - 드래그 가능하게 만들 요소의 ID
         */
        function Drag(elemId) {
          Drag.prototype.init(elemId);
          Drag.prototype.initEvent();
        }

        /**
         * Drag 프로토타입 초기화
         * @param {string} elemId - 요소 ID
         */
        Drag.prototype.init = function (elemId) {
          this.elem = doc.getElementById(elemId);
          if (!this.elem) {
            console.error('Drag target element not found:', elemId);
          }
        };

        /**
         * Drag 이벤트 리스너 등록
         */
        Drag.prototype.initEvent = function () {
          const that = this;

          if (!this.elem) return;

          this.elem.addEventListener(
            'mousedown',
            (e) => {
              ollin.drag.click(e, that.elem);
              return false;
            },
            false
          );

          this.elem.addEventListener(
            'drag',
            (e) => {
              ollin.drag.move(e, that.elem);
              return false;
            },
            false
          );

          body.addEventListener('keydown', (e) => {
            ollin.drag.key(e, that.elem);
          });
        };

        return Drag;
      }
    },

    /**
     * Ollin 초기화: DOM 생성 및 이벤트 리스너 등록
     */
    init: () => {
      // DOM 생성
      ollin.ui.overlay();
      ollin.ui.control();

      // DOM 요소 캐싱
      elements.imgLayer = doc.getElementById('ollin-img-layer');
      elements.img = doc.getElementById('ollin-img');
      elements.btn = doc.getElementById('ollin-btn');
      elements.scale = doc.getElementById('ollin-scale');
      elements.scaleText = doc.getElementById('ollin-scale-text');
      elements.opacity = doc.getElementById('ollin-opacity');
      elements.opacityText = doc.getElementById('ollin-opacity-text');
      elements.files = doc.getElementById('ollin-files');

      // 드래그 기능 초기화
      ollin.drag.init()('ollin-img-layer');

      // 이벤트 리스너 등록
      elements.btn.addEventListener('click', ollin.handlers.layer);
      elements.opacity.addEventListener('change', ollin.handlers.opacity);
      elements.scale.addEventListener('change', ollin.handlers.scale);
      elements.files.addEventListener('change', ollin.handlers.file);
    }
  };

  // 초기화 실행
  ollin.init();
})();

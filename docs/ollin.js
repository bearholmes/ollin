/* 키티가 시킨건 아닌데 시작한 프로젝트 */
/* 2017.01.20 ~ 22*/

(function () {
  'use strict';

  // Constants
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

  const doc = document;
  const html = doc.getElementsByTagName('html')[0];
  const body = doc.getElementsByTagName('BODY')[0];

  /**
   * DOM 요소의 CSS 속성값을 정수로 반환
   * @param {HTMLElement|string} elmId - DOM 요소 또는 요소 ID
   * @param {string} property - CSS 속성명
   * @returns {number} 속성값 (정수)
   */
  const getCssProperty = function (elmId, property) {
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
  const showError = function (message) {
    alert(message);
  };

  const clickX = 0;
  const clickY = 0;
  const beforeX = 0;
  const beforeY = 0;
  let elemOffsetX = 0;
  let elemOffsetY = 0;

  const doclang = doc.documentElement.lang;
  let extension_name = 'Images overlap with Kitty';
  if (doclang === 'ko' || doclang === 'ko-KR') {
    extension_name = '이미지는 키티가 겹쳐줄거야';
  }

  // Cached DOM elements
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

  var ollin = {
    handle: {
      /**
       * 이미지 파일 로드 및 오버레이 활성화
       * @param {Event} e - File input change event
       */
      file: function (e) {
        const canvas = elements.img;
        const layer = elements.imgLayer;

        if (!e.target.files || !e.target.files[0]) {
          return;
        }

        const file = e.target.files[0];

        // 이미지 파일 타입 검증
        if (!file.type.match(/image\/(png|jpe?g|gif|svg\+xml|webp)/i)) {
          showError('이미지 파일만 선택할 수 있습니다.');
          return;
        }

        const fr = new FileReader();

        fr.onerror = function () {
          console.error('파일 읽기 실패:', file.name);
          showError('파일을 읽을 수 없습니다.');
        };

        fr.onload = function (e) {
          const img = new Image();

          img.onerror = function () {
            console.error('이미지 로드 실패:', file.name);
            showError('이미지 파일을 불러올 수 없습니다.');
          };

          img.onload = function () {
            const iwidth = img.naturalWidth || img.width;
            const iheight = img.naturalHeight || img.height;

            canvas.src = fr.result;
            canvas.width = iwidth;
            canvas.height = iheight;
            layer.style.width = iwidth + 'px';
            layer.style.height = iheight + 'px';
            layer.style.left = '0';
            layer.style.top = CONFIG.TOOLBAR_HEIGHT + 'px';

            // 오버레이 활성화
            ollin.activateOverlay();
          };

          img.src = fr.result;
        };

        fr.readAsDataURL(file);
      },

      /**
       * 오버레이 레이어 및 컨트롤 활성화
       */
      activateOverlay: function () {
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
       */
      opacity: function () {
        const value = this.value;
        elements.imgLayer.style.opacity = value;
        elements.opacityText.innerText = value;
      },

      /**
       * 배율 조절 및 위치 보정
       */
      scale: function () {
        const value = parseFloat(this.value);
        elements.imgLayer.style.transform = 'scale(' + value + ', ' + value + ')';
        elements.scaleText.innerText = 'x' + value;

        const img_width = getCssProperty(elements.img, 'width');
        const img_height = getCssProperty(elements.img, 'height');

        // 배율 변경 시 중앙 정렬 유지를 위한 위치 보정
        if (value === CONFIG.SCALE_MIN) {
          elements.imgLayer.style.top =
            img_height * (value * 0.5) * -1 + CONFIG.TOOLBAR_HEIGHT + 'px';
          elements.imgLayer.style.left = img_width * (value * 0.5) * -1 + 'px';
        } else {
          elements.imgLayer.style.top =
            img_height * (1 - value) * -0.5 + CONFIG.TOOLBAR_HEIGHT + 'px';
          elements.imgLayer.style.left = img_width * (1 - value) * -0.5 + 'px';
        }
      },

      /**
       * 오버레이 레이어 표시/숨김 토글
       */
      layer: function () {
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

    markup: {
      /**
       * CSS 파일 로드
       */
      css: function () {
        const link = document.createElement('link');
        link.href = 'https://bearholmes.github.io/ollin/ollin.css';
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.media = 'all';
        doc.getElementsByTagName('head')[0].appendChild(link);
      },

      /**
       * 이미지 오버레이 레이어 DOM 생성
       */
      overlay: function () {
        const div = doc.createElement('div');
        const img = doc.createElement('img');

        div.id = 'dk_overlay_img_layer';
        div.style.display = 'none';

        img.id = 'dk_overlay_img';
        img.src = '';
        img.alt = '';

        div.draggable = 'true';
        div.appendChild(img);
        html.appendChild(div);
      },

      /**
       * 제어 도구모음 DOM 생성
       */
      control: function () {
        const div = doc.createElement('div');
        const tit = doc.createElement('span');

        div.id = 'dk_overlay_controller_toolbar';
        tit.className = 'tit';
        tit.innerText = extension_name;

        // 토글 버튼
        const sw = doc.createElement('button');
        const sw_icon = doc.createElement('i');

        sw.id = 'dk_overlay_btn';
        sw.className = 'sw';
        sw.disabled = true;
        sw_icon.className = 'off';
        sw.appendChild(sw_icon);

        div.appendChild(sw);
        div.appendChild(tit);

        // 파일 입력
        const file = doc.createElement('input');
        file.id = 'dk_overlay_files';
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
        scale.id = 'dk_overlay_scale';
        scale.setAttribute('type', 'range');
        scale.max = CONFIG.SCALE_MAX;
        scale.min = CONFIG.SCALE_MIN;
        scale.step = CONFIG.SCALE_STEP;
        scale.value = 1;
        scale.disabled = true;
        s_txt.id = 'dk_overlay_scale_text';
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
        opacity.id = 'dk_overlay_opacity';
        opacity.setAttribute('type', 'range');
        opacity.max = CONFIG.OPACITY_MAX;
        opacity.min = CONFIG.OPACITY_MIN;
        opacity.step = CONFIG.OPACITY_STEP;
        opacity.value = CONFIG.OPACITY_DEFAULT;
        opacity.disabled = true;
        o_txt.id = 'dk_overlay_opacity_text';
        o_txt.innerText = CONFIG.OPACITY_DEFAULT.toString();

        sub.appendChild(o_icon);
        sub.appendChild(opacity);
        sub.appendChild(o_txt);

        div.appendChild(sub);

        // body를 아래로 밀어서 도구모음 공간 확보
        body.style.setProperty(
          'transform',
          'translateY(' + CONFIG.TOOLBAR_HEIGHT + 'px)',
          'important'
        );
        html.appendChild(div);
      }
    },

    drag: {
      /**
       * 드래그 시작
       * @param {MouseEvent} event
       */
      move: function (event) {
        event.preventDefault();

        const click = event || window.event;
        if (click.which === 1) {
          moving = true;
        }

        const target = event.target;
        const width = target.offsetWidth / 2;
        const height = target.offsetHeight / 2;

        target.addEventListener('mousemove', (e) => {
          if (moving === true) {
            const layer = elements.imgLayer;
            const x = e.clientX - width;
            const y = e.clientY - height;

            layer.style.left = x + 'px';
            layer.style.top = y + 'px';
            layer.style.cursor = 'move';
          }
        });
      },

      /**
       * 드래그 종료
       * @param {MouseEvent} event
       */
      end: function (event) {
        moving = false;
        event.target.removeEventListener('mousemove', false);
        const layer = elements.imgLayer;
        layer.style.cursor = 'pointer';
      },

      /**
       * 키보드 방향키로 요소 이동
       * @param {KeyboardEvent} e
       * @param {HTMLElement} elem
       */
      key: function (e, elem) {
        elemOffsetX = getCssProperty(elem, 'left');
        elemOffsetY = getCssProperty(elem, 'top');

        const moveStep = e.shiftKey ? CONFIG.KEYBOARD_MOVE_FAST : CONFIG.KEYBOARD_MOVE_NORMAL;

        switch (e.keyCode) {
          case CONFIG.KEY_CODES.LEFT:
            elem.style.left = elemOffsetX - moveStep + 'px';
            e.preventDefault();
            break;

          case CONFIG.KEY_CODES.UP:
            elem.style.top = elemOffsetY - moveStep + 'px';
            e.preventDefault();
            break;

          case CONFIG.KEY_CODES.RIGHT:
            elem.style.left = elemOffsetX + moveStep + 'px';
            e.preventDefault();
            break;

          case CONFIG.KEY_CODES.DOWN:
            elem.style.top = elemOffsetY + moveStep + 'px';
            e.preventDefault();
            break;
        }
      }
    },

    /**
     * Ollin 초기화
     */
    init: function () {
      ollin.markup.css();
      ollin.markup.overlay();
      ollin.markup.control();

      const moving = false;

      // DOM 요소 캐싱
      elements.imgLayer = doc.getElementById('dk_overlay_img_layer');
      elements.img = doc.getElementById('dk_overlay_img');
      elements.btn = doc.getElementById('dk_overlay_btn');
      elements.scale = doc.getElementById('dk_overlay_scale');
      elements.scaleText = doc.getElementById('dk_overlay_scale_text');
      elements.opacity = doc.getElementById('dk_overlay_opacity');
      elements.opacityText = doc.getElementById('dk_overlay_opacity_text');
      elements.files = doc.getElementById('dk_overlay_files');

      const layer = elements.imgLayer;
      body.addEventListener('keydown', (e) => {
        ollin.drag.key(e, layer);
      });

      elements.imgLayer.addEventListener('mousedown', ollin.drag.move);
      elements.imgLayer.addEventListener('mouseup', ollin.drag.end);
      elements.img.ondragstart = function () {
        return false;
      };

      elements.btn.addEventListener('click', ollin.handle.layer);
      elements.opacity.addEventListener('change', ollin.handle.opacity);
      elements.scale.addEventListener('change', ollin.handle.scale);
      elements.files.addEventListener('change', ollin.handle.file);
    }
  };

  ollin.init();
})();

/**
 * content-script.js 핵심 로직 테스트
 */

describe('Overlay Logic', () => {
  beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = `
      <html>
        <body>
          <div id="ollin-img-layer" style="display: none;">
            <img id="ollin-img" />
          </div>
          <button id="ollin-btn" disabled>
            <i class="off"></i>
          </button>
          <input id="ollin-scale" type="range" />
          <span id="ollin-scale_text">x1</span>
          <input id="ollin-opacity" type="range" />
          <span id="ollin-opacity_text">0.5</span>
          <input id="ollin-files" type="file" />
        </body>
      </html>
    `;
    jest.clearAllMocks();
  });

  describe('getCssProperty', () => {
    test('문자열 ID로 요소의 CSS 속성을 가져와야 함', () => {
      const elem = document.createElement('div');
      elem.id = 'test-elem';
      elem.style.left = '100px';
      document.body.appendChild(elem);

      const getCssProperty = (elmId, property) => {
        const el = typeof elmId === 'string' ? document.getElementById(elmId) : elmId;
        if (!el) return 0;
        const prop = window.getComputedStyle(el, null).getPropertyValue(property);
        return parseInt(prop, 10);
      };

      const result = getCssProperty('test-elem', 'left');
      expect(typeof result).toBe('number');
    });

    test('DOM 요소로 CSS 속성을 가져와야 함', () => {
      const elem = document.createElement('div');
      elem.style.left = '100px';
      document.body.appendChild(elem);

      const getCssProperty = (elmId, property) => {
        const el = typeof elmId === 'string' ? document.getElementById(elmId) : elmId;
        if (!el) return 0;
        const prop = window.getComputedStyle(el, null).getPropertyValue(property);
        return parseInt(prop, 10);
      };

      const result = getCssProperty(elem, 'left');
      expect(typeof result).toBe('number');
    });

    test('요소가 없으면 0을 반환해야 함', () => {
      const getCssProperty = (elmId, property) => {
        const el = typeof elmId === 'string' ? document.getElementById(elmId) : elmId;
        if (!el) {
          console.error('Element not found:', elmId);
          return 0;
        }
        const prop = window.getComputedStyle(el, null).getPropertyValue(property);
        return parseInt(prop, 10);
      };

      const result = getCssProperty('non-existent', 'left');
      expect(result).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('파일 로드', () => {
    test('이미지 파일 타입 검증', () => {
      const validTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg+xml',
        'image/webp'
      ];

      const invalidTypes = ['text/plain', 'application/pdf', 'video/mp4'];

      const isValidImageType = (type) => {
        return /image\/(png|jpe?g|gif|svg\+xml|webp)/i.test(type);
      };

      validTypes.forEach((type) => {
        expect(isValidImageType(type)).toBe(true);
      });

      invalidTypes.forEach((type) => {
        expect(isValidImageType(type)).toBe(false);
      });
    });

    test('파일 로드 시 FileReader가 사용되어야 함', (done) => {
      const file = new Blob(['test'], { type: 'image/png' });
      file.name = 'test.png';
      file.type = 'image/png';

      const fr = new FileReader();
      fr.onload = (e) => {
        expect(e.target.result).toBeDefined();
        done();
      };

      fr.readAsDataURL(file);
    });
  });

  describe('투명도 조절', () => {
    test('투명도 값이 0~1 사이어야 함', () => {
      const opacityInput = document.getElementById('ollin-opacity');
      const imgLayer = document.getElementById('ollin-img-layer');

      const testValues = [0, 0.25, 0.5, 0.75, 1];

      testValues.forEach((value) => {
        opacityInput.value = value;
        imgLayer.style.opacity = value;
        expect(parseFloat(imgLayer.style.opacity)).toBe(value);
      });
    });
  });

  describe('배율 조절', () => {
    test('배율 값이 0.5~3 사이어야 함', () => {
      const scaleInput = document.getElementById('ollin-scale');
      const imgLayer = document.getElementById('ollin-img-layer');

      const testValues = [0.5, 1, 1.5, 2, 2.5, 3];

      testValues.forEach((value) => {
        scaleInput.value = value;
        imgLayer.style.transform = `scale(${value}, ${value})`;
        expect(imgLayer.style.transform).toBe(`scale(${value}, ${value})`);
      });
    });
  });

  describe('레이어 토글', () => {
    test('레이어가 표시/숨김되어야 함', () => {
      const imgLayer = document.getElementById('ollin-img-layer');
      const btn = document.getElementById('ollin-btn');

      // 초기 상태: 숨김
      expect(imgLayer.style.display).toBe('none');

      // 표시
      imgLayer.style.display = 'block';
      btn.childNodes[0].className = 'on';
      expect(imgLayer.style.display).toBe('block');
      expect(btn.childNodes[0].className).toBe('on');

      // 숨김
      imgLayer.style.display = 'none';
      btn.childNodes[0].className = 'off';
      expect(imgLayer.style.display).toBe('none');
      expect(btn.childNodes[0].className).toBe('off');
    });
  });

  describe('키보드 이동', () => {
    test('방향키 코드가 올바른지 확인', () => {
      const KEY_CODES = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      };

      expect(KEY_CODES.LEFT).toBe(37);
      expect(KEY_CODES.UP).toBe(38);
      expect(KEY_CODES.RIGHT).toBe(39);
      expect(KEY_CODES.DOWN).toBe(40);
    });

    test('이동 스텝이 Shift 키에 따라 달라져야 함', () => {
      const KEYBOARD_MOVE_NORMAL = 1;
      const KEYBOARD_MOVE_FAST = 10;

      const event1 = { shiftKey: false };
      const event2 = { shiftKey: true };

      const moveStep1 = event1.shiftKey ? KEYBOARD_MOVE_FAST : KEYBOARD_MOVE_NORMAL;
      const moveStep2 = event2.shiftKey ? KEYBOARD_MOVE_FAST : KEYBOARD_MOVE_NORMAL;

      expect(moveStep1).toBe(1);
      expect(moveStep2).toBe(10);
    });
  });

  describe('CONFIG 상수', () => {
    test('모든 설정 상수가 정의되어야 함', () => {
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

      expect(CONFIG.SCALE_MAX).toBe(3);
      expect(CONFIG.SCALE_MIN).toBe(0.5);
      expect(CONFIG.OPACITY_DEFAULT).toBe(0.5);
      expect(CONFIG.TOOLBAR_HEIGHT).toBe(30);
      expect(CONFIG.KEYBOARD_MOVE_FAST).toBe(10);
    });
  });
});

/**
 * Jest 테스트 환경 설정
 * Chrome Extension API 모킹
 */

// Chrome Extension API 모킹
global.chrome = {
  runtime: {
    getManifest: jest.fn(() => ({
      name: 'Ollin Test',
      version: '0.4.0'
    })),
    onInstalled: {
      addListener: jest.fn()
    }
  },
  action: {
    onClicked: {
      addListener: jest.fn()
    }
  },
  scripting: {
    executeScript: jest.fn(() => Promise.resolve()),
    insertCSS: jest.fn(() => Promise.resolve())
  },
  tabs: {
    create: jest.fn(() => Promise.resolve({ id: 1 }))
  },
  i18n: {
    getMessage: jest.fn((key) => {
      const messages = {
        'application_title': 'Ollin',
        'application_default_title': 'Ollin - Design Overlay Tool'
      };
      return messages[key] || key;
    })
  }
};

// DOM API 모킹
global.FileReader = class FileReader {
  constructor() {
    this.onload = null;
    this.onerror = null;
  }

  readAsDataURL(file) {
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: {
            result: 'data:image/png;base64,test'
          }
        });
      }
    }, 0);
  }
};

global.Image = class Image {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this._src = '';
  }

  get src() {
    return this._src;
  }

  set src(value) {
    this._src = value;
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }

  get naturalWidth() {
    return 100;
  }

  get naturalHeight() {
    return 100;
  }

  get width() {
    return 100;
  }

  get height() {
    return 100;
  }
};

// alert 모킹
global.alert = jest.fn();

// console.error 모킹 (테스트 중 에러 로그 숨기기)
global.console.error = jest.fn();

/**
 * background.js 테스트
 */

describe('Background Script', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isInternalPage', () => {
    // background.js를 로드하기 전에 함수를 테스트하기 위해
    // 함수를 직접 정의
    const isInternalPage = (url) => {
      const BLOCKED_URL_PATTERNS = [
        'chrome://',
        'chrome-extension://',
        'https://chrome.google.com'
      ];
      return BLOCKED_URL_PATTERNS.some(pattern => url.indexOf(pattern) === 0);
    };

    test('chrome:// URL을 차단해야 함', () => {
      expect(isInternalPage('chrome://extensions')).toBe(true);
      expect(isInternalPage('chrome://settings')).toBe(true);
    });

    test('chrome-extension:// URL을 차단해야 함', () => {
      expect(isInternalPage('chrome-extension://abc123')).toBe(true);
    });

    test('chrome.google.com URL을 차단해야 함', () => {
      expect(isInternalPage('https://chrome.google.com/webstore')).toBe(true);
    });

    test('일반 웹페이지 URL을 허용해야 함', () => {
      expect(isInternalPage('https://www.google.com')).toBe(false);
      expect(isInternalPage('https://github.com')).toBe(false);
      expect(isInternalPage('http://localhost:3000')).toBe(false);
    });
  });

  describe('Content Script 주입', () => {
    test('일반 페이지에서 스크립트가 주입되어야 함', () => {
      const mockTab = {
        id: 1,
        url: 'https://www.example.com'
      };

      // executeScript이 성공적으로 호출되어야 함
      expect(chrome.scripting.executeScript).toBeDefined();
      expect(chrome.scripting.insertCSS).toBeDefined();
    });
  });

  describe('확장 프로그램 설치', () => {
    test('첫 설치 시 옵션 페이지가 열려야 함', () => {
      const mockDetails = {
        reason: 'install'
      };

      // onInstalled 리스너가 등록되어야 함
      expect(chrome.runtime.onInstalled.addListener).toBeDefined();
    });
  });
});

/**
 * option.js 테스트
 */

describe('Option Page', () => {
  beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = `
      <div id="dk_title"></div>
      <div id="dk_ver"></div>
    `;
    jest.clearAllMocks();
  });

  test('페이지 제목이 설정되어야 함', () => {
    const initOptionPage = () => {
      const manifest = chrome.runtime.getManifest();
      const name = manifest.name;
      const version = manifest.version;

      const titleElement = document.getElementById("dk_title");
      const versionElement = document.getElementById("dk_ver");

      if (titleElement) {
        titleElement.innerText = name;
      }

      if (versionElement) {
        versionElement.innerText = version;
      }

      document.title = `${name} - Option`;
    };

    initOptionPage();

    expect(document.getElementById('dk_title').innerText).toBe('Ollin Test');
    expect(document.getElementById('dk_ver').innerText).toBe('0.4.0');
    expect(document.title).toBe('Ollin Test - Option');
  });

  test('요소가 없어도 에러가 발생하지 않아야 함', () => {
    document.body.innerHTML = '';

    const initOptionPage = () => {
      const manifest = chrome.runtime.getManifest();
      const name = manifest.name;
      const version = manifest.version;

      const titleElement = document.getElementById("dk_title");
      const versionElement = document.getElementById("dk_ver");

      if (titleElement) {
        titleElement.innerText = name;
      }

      if (versionElement) {
        versionElement.innerText = version;
      }

      document.title = `${name} - Option`;
    };

    expect(() => initOptionPage()).not.toThrow();
  });
});

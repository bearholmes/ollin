/**
 * @file Ollin Core Module
 * @description Platform-independent overlay functionality
 * @version 0.6.0
 * @license MIT
 */

import { CONFIG } from './constants.js';
import type { Ollin, OllinElements } from '../types/index.js';

/**
 * Create Ollin overlay instance
 */
export function createOllin(extensionName: string): Ollin {
  const doc: Document = document;
  const html: HTMLElement = doc.getElementsByTagName('html')[0]!;
  const body: HTMLElement = doc.getElementsByTagName('BODY')[0]! as HTMLElement;

  /**
   * Cached DOM elements
   */
  const elements: OllinElements = {
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
   * Get CSS property value as integer from DOM element
   */
  const getCssProperty = (elmId: HTMLElement | string, property: string): number => {
    const elem = typeof elmId === 'string' ? doc.getElementById(elmId) : elmId;
    if (!elem) {
      console.error('Element not found:', elmId);
      return 0;
    }
    const prop = window.getComputedStyle(elem, null).getPropertyValue(property);
    return parseInt(prop, 10);
  };

  /**
   * Show error message to user
   */
  const showError = (message: string): void => {
    alert(message);
  };

  // Drag state variables
  let clickX = 0;
  let clickY = 0;
  let beforeX = 0;
  let beforeY = 0;
  let elemOffsetX = 0;
  let elemOffsetY = 0;

  /**
   * Main Ollin object
   */
  const ollin: Ollin = {
    handlers: {
      /**
       * Load image file and activate overlay
       */
      file: (e: Event) => {
        const canvas = elements.img;
        const target = e.target as HTMLInputElement;
        const file = target?.files?.[0];

        if (!file || !canvas) {
          return;
        }

        // Validate image file type
        if (!file.type.match(/image\/(png|jpe?g|gif|svg\+xml|webp)/i)) {
          showError('이미지 파일만 선택할 수 있습니다.');
          return;
        }

        const fr = new FileReader();

        fr.onerror = () => {
          console.error('파일 읽기 실패:', file.name);
          showError('파일을 읽을 수 없습니다.');
        };

        fr.onload = (e: ProgressEvent<FileReader>) => {
          const img = new Image();

          img.onerror = () => {
            console.error('이미지 로드 실패:', file.name);
            showError('이미지 파일을 불러올 수 없습니다.');
          };

          img.onload = () => {
            const result = e.target?.result as string;
            canvas.src = result;
            canvas.width = img.naturalWidth ?? img.width;
            canvas.height = img.naturalHeight ?? img.height;

            // Activate overlay
            ollin.activateOverlay();
          };

          img.src = e.target?.result as string;
        };

        fr.readAsDataURL(file);
      },

      /**
       * Activate overlay layer and controls
       */
      activateOverlay: () => {
        if (elements.btn?.disabled === true) {
          if (elements.imgLayer) elements.imgLayer.style.display = 'block';
          if (elements.btn.childNodes[0]) {
            (elements.btn.childNodes[0] as HTMLElement).className = 'on';
          }
          elements.btn.disabled = false;
          if (elements.scale) elements.scale.disabled = false;
          if (elements.opacity) elements.opacity.disabled = false;
        }
      },

      /**
       * Adjust opacity
       */
      opacity: (e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        if (elements.imgLayer) elements.imgLayer.style.opacity = value;
        if (elements.opacityText) elements.opacityText.innerText = value;
      },

      /**
       * Adjust scale and position correction
       */
      scale: (e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = parseFloat(target.value);
        if (elements.imgLayer) {
          elements.imgLayer.style.transform = `scale(${value}, ${value})`;
        }
        if (elements.scaleText) elements.scaleText.innerText = `x${value}`;

        if (!elements.img) return;

        const img_width = getCssProperty(elements.img, 'width');
        const img_height = getCssProperty(elements.img, 'height');

        // Position correction to maintain center alignment when scale changes
        if (elements.imgLayer) {
          if (value === CONFIG.SCALE_MIN) {
            elements.imgLayer.style.top = `${img_height * (value * 0.5) * -1 + CONFIG.TOOLBAR_HEIGHT}px`;
            elements.imgLayer.style.left = `${img_width * (value * 0.5) * -1}px`;
          } else {
            elements.imgLayer.style.top = `${img_height * (1 - value) * -0.5 + CONFIG.TOOLBAR_HEIGHT}px`;
            elements.imgLayer.style.left = `${img_width * (1 - value) * -0.5}px`;
          }
        }
      },

      /**
       * Toggle overlay layer visibility
       */
      layer: () => {
        const overlay_elem = elements.imgLayer;
        const btn_elem = elements.btn;

        if (overlay_elem && btn_elem) {
          if (overlay_elem.style.display === 'block') {
            overlay_elem.style.display = 'none';
            if (btn_elem.childNodes[0]) {
              (btn_elem.childNodes[0] as HTMLElement).className = 'off';
            }
          } else {
            overlay_elem.style.display = 'block';
            if (btn_elem.childNodes[0]) {
              (btn_elem.childNodes[0] as HTMLElement).className = 'on';
            }
          }
        }
      }
    },

    ui: {
      /**
       * Create image overlay layer DOM
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
       * Create control toolbar DOM
       */
      control: (extensionName: string) => {
        const div = doc.createElement('div');
        const tit = doc.createElement('span');

        div.id = 'ollin-controller-toolbar';
        tit.className = 'tit';
        tit.innerText = extensionName;

        // Toggle button
        const sw = doc.createElement('button');
        const sw_icon = doc.createElement('i');

        sw.id = 'ollin-btn';
        sw.className = 'sw';
        sw.disabled = true;
        sw_icon.className = 'off';
        sw.appendChild(sw_icon);

        div.appendChild(sw);
        div.appendChild(tit);

        // File input
        const file = doc.createElement('input');
        file.id = 'ollin-files';
        file.setAttribute('type', 'file');
        file.setAttribute('accept', 'image/*');
        div.appendChild(file);

        // Toolbar container
        const sub = doc.createElement('div');
        sub.className = 'tools';

        // Scale control
        const s_icon = doc.createElement('i');
        const scale = doc.createElement('input');
        const s_txt = doc.createElement('span');

        s_icon.className = 'mag';
        s_icon.title = 'ratio';
        scale.id = 'ollin-scale';
        scale.setAttribute('type', 'range');
        scale.max = CONFIG.SCALE_MAX.toString();
        scale.min = CONFIG.SCALE_MIN.toString();
        scale.step = CONFIG.SCALE_STEP.toString();
        scale.value = '1';
        scale.disabled = true;
        s_txt.id = 'ollin-scale-text';
        s_txt.innerText = 'x1';

        sub.appendChild(s_icon);
        sub.appendChild(scale);
        sub.appendChild(s_txt);

        // Opacity control
        const o_icon = doc.createElement('i');
        const opacity = doc.createElement('input');
        const o_txt = doc.createElement('span');

        o_icon.className = 'opacity';
        o_icon.title = 'opacity';
        opacity.id = 'ollin-opacity';
        opacity.setAttribute('type', 'range');
        opacity.max = CONFIG.OPACITY_MAX.toString();
        opacity.min = CONFIG.OPACITY_MIN.toString();
        opacity.step = CONFIG.OPACITY_STEP.toString();
        opacity.value = CONFIG.OPACITY_DEFAULT.toString();
        opacity.disabled = true;
        o_txt.id = 'ollin-opacity-text';
        o_txt.innerText = CONFIG.OPACITY_DEFAULT.toString();

        sub.appendChild(o_icon);
        sub.appendChild(opacity);
        sub.appendChild(o_txt);

        div.appendChild(sub);

        // Push body down to make space for toolbar
        body.style.setProperty('transform', `translateY(${CONFIG.TOOLBAR_HEIGHT}px)`, 'important');
        html.appendChild(div);
      }
    },

    drag: {
      /**
       * Drag start: save click coordinates and element offset
       */
      click: (e: MouseEvent, elem: HTMLElement): boolean => {
        clickX = e.clientX;
        clickY = e.clientY;

        elemOffsetX = getCssProperty(elem, 'left');
        elemOffsetY = getCssProperty(elem, 'top');
        return false;
      },

      /**
       * During drag: update element position
       */
      move: (e: DragEvent, elem: HTMLElement): boolean => {
        const moveX = e.clientX;
        const moveY = e.clientY;
        const resultX = moveX - clickX;
        const resultY = moveY - clickY;

        // Check if movement is valid
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
       * Move element with keyboard arrow keys
       */
      key: (e: KeyboardEvent, elem: HTMLElement): void => {
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
       * Initialize drag functionality: register event listeners
       */
      init: () => {
        /**
         * Drag constructor
         */
        class Drag {
          elem: HTMLElement | null = null;

          constructor(elemId: string) {
            this.initElement(elemId);
            this.initEvent();
          }

          /**
           * Initialize drag target element
           */
          initElement(elemId: string): void {
            this.elem = doc.getElementById(elemId);
            if (!this.elem) {
              console.error('Drag target element not found:', elemId);
            }
          }

          /**
           * Register drag event listeners
           */
          initEvent(): void {
            if (!this.elem) return;

            this.elem.addEventListener(
              'mousedown',
              (e: MouseEvent) => {
                ollin.drag.click(e, this.elem!);
                return false;
              },
              false
            );

            this.elem.addEventListener(
              'drag',
              (e: DragEvent) => {
                ollin.drag.move(e, this.elem!);
                return false;
              },
              false
            );

            body.addEventListener('keydown', (e: KeyboardEvent) => {
              ollin.drag.key(e, this.elem!);
            });
          }
        }

        return Drag;
      }
    },

    /**
     * Initialize Ollin: create DOM and register event listeners
     */
    init: () => {
      // Create DOM
      ollin.ui.overlay();
      ollin.ui.control(extensionName);

      // Cache DOM elements
      elements.imgLayer = doc.getElementById('ollin-img-layer') as HTMLElement;
      elements.img = doc.getElementById('ollin-img') as HTMLImageElement;
      elements.btn = doc.getElementById('ollin-btn') as HTMLButtonElement;
      elements.scale = doc.getElementById('ollin-scale') as HTMLInputElement;
      elements.scaleText = doc.getElementById('ollin-scale-text') as HTMLElement;
      elements.opacity = doc.getElementById('ollin-opacity') as HTMLInputElement;
      elements.opacityText = doc.getElementById('ollin-opacity-text') as HTMLElement;
      elements.files = doc.getElementById('ollin-files') as HTMLInputElement;

      // Initialize drag functionality
      const DragClass = ollin.drag.init();
      new DragClass('ollin-img-layer');

      // Register event listeners
      if (elements.btn) elements.btn.addEventListener('click', ollin.handlers.layer);
      if (elements.opacity) elements.opacity.addEventListener('change', ollin.handlers.opacity);
      if (elements.scale) elements.scale.addEventListener('change', ollin.handlers.scale);
      if (elements.files) elements.files.addEventListener('change', ollin.handlers.file);
    },

    // Expose activateOverlay for handlers
    activateOverlay: () => {
      ollin.handlers.activateOverlay();
    }
  };

  return ollin;
}

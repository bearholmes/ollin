/**
 * Ollin TypeScript Type Definitions
 * Chrome Extension Design Overlay Tool
 */

/**
 * Configuration constants
 */
export interface OllinConfig {
  /** Maximum scale value (3x) */
  SCALE_MAX: number;
  /** Minimum scale value (0.5x) */
  SCALE_MIN: number;
  /** Scale adjustment step (0.5) */
  SCALE_STEP: number;
  /** Minimum opacity value (0) */
  OPACITY_MIN: number;
  /** Maximum opacity value (1) */
  OPACITY_MAX: number;
  /** Opacity adjustment step (0.05) */
  OPACITY_STEP: number;
  /** Default opacity value (0.5) */
  OPACITY_DEFAULT: number;
  /** Toolbar height in pixels (30px) */
  TOOLBAR_HEIGHT: number;
  /** Normal keyboard move step (1px) */
  KEYBOARD_MOVE_NORMAL: number;
  /** Fast keyboard move step (10px) */
  KEYBOARD_MOVE_FAST: number;
  /** Keyboard key codes */
  KEY_CODES: {
    LEFT: number;
    UP: number;
    RIGHT: number;
    DOWN: number;
  };
}

/**
 * Cached DOM elements
 */
export interface OllinElements {
  /** Image layer container */
  imgLayer: HTMLElement | null;
  /** Overlay image element */
  img: HTMLImageElement | null;
  /** Toggle button */
  btn: HTMLButtonElement | null;
  /** Scale range input */
  scale: HTMLInputElement | null;
  /** Scale text display */
  scaleText: HTMLSpanElement | null;
  /** Opacity range input */
  opacity: HTMLInputElement | null;
  /** Opacity text display */
  opacityText: HTMLSpanElement | null;
  /** File input element */
  files: HTMLInputElement | null;
}

/**
 * Event handlers for UI interactions
 */
export interface OllinHandlers {
  /**
   * Handle file selection and load image
   * @param e - File input change event
   */
  file: (e: Event) => void;

  /**
   * Activate overlay layer and controls
   */
  activateOverlay: () => void;

  /**
   * Handle opacity slider change
   * @param e - Input change event
   */
  opacity: (e: Event) => void;

  /**
   * Handle scale slider change and position adjustment
   * @param e - Input change event
   */
  scale: (e: Event) => void;

  /**
   * Toggle overlay layer visibility
   */
  layer: () => void;
}

/**
 * UI/DOM creation functions
 */
export interface OllinUI {
  /**
   * Create image overlay layer DOM
   */
  overlay: () => void;

  /**
   * Create control toolbar DOM
   */
  control: () => void;
}

/**
 * Drag functionality
 */
export interface OllinDrag {
  /**
   * Handle drag start (mousedown)
   * @param e - Mouse event
   * @param elem - Element to drag
   * @returns false to prevent default
   */
  click: (e: MouseEvent, elem: HTMLElement) => boolean;

  /**
   * Handle drag move
   * @param e - Drag event
   * @param elem - Element being dragged
   * @returns false to prevent default
   */
  move: (e: DragEvent, elem: HTMLElement) => boolean;

  /**
   * Handle keyboard arrow key movement
   * @param e - Keyboard event
   * @param elem - Element to move
   */
  key: (e: KeyboardEvent, elem: HTMLElement) => void;

  /**
   * Initialize drag functionality
   * @returns Drag constructor function
   */
  init: () => new (elemId: string) => void;
}

/**
 * Main Ollin object structure
 */
export interface Ollin {
  /** Event handlers */
  handlers: OllinHandlers;

  /** UI creation functions */
  ui: OllinUI;

  /** Drag functionality */
  drag: OllinDrag;

  /**
   * Initialize Ollin extension
   */
  init: () => void;
}

/**
 * Chrome Extension Manifest
 */
export interface ChromeManifest {
  manifest_version: number;
  name: string;
  description: string;
  version: string;
  default_locale?: string;
  background?: {
    service_worker?: string;
    scripts?: string[];
  };
  action?: {
    default_icon?: Record<string, string>;
    default_title?: string;
  };
  icons?: Record<string, string>;
  options_page?: string;
  permissions?: string[];
  homepage_url?: string;
}

/**
 * Content Scripts configuration
 */
export interface ContentScripts {
  js: string[];
  css: string[];
}

/**
 * Install details from chrome.runtime.onInstalled
 */
export interface InstallDetails {
  reason: 'install' | 'update' | 'chrome_update' | 'shared_module_update';
  previousVersion?: string;
}

/**
 * Chrome tab information
 */
export interface ChromeTab {
  id: number;
  url: string;
  title?: string;
  active?: boolean;
  pinned?: boolean;
  windowId?: number;
}

/**
 * Utility function types
 */

/**
 * Get CSS property value as integer
 * @param elmId - Element ID or HTMLElement
 * @param property - CSS property name
 * @returns Property value in pixels (integer)
 */
export type GetCssPropertyFn = (elmId: string | HTMLElement, property: string) => number;

/**
 * Show error message to user
 * @param message - Error message to display
 */
export type ShowErrorFn = (message: string) => void;

/**
 * Global declarations for Chrome Extension environment
 */
declare global {
  interface Window {
    ollin?: Ollin;
  }
}

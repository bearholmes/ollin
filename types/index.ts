/**
 * @file Ollin Type Definitions
 * @description Shared type definitions for all platforms
 */

export interface OllinElements {
  imgLayer: HTMLElement | null;
  img: HTMLImageElement | null;
  btn: HTMLButtonElement | null;
  scale: HTMLInputElement | null;
  scaleText: HTMLElement | null;
  opacity: HTMLInputElement | null;
  opacityText: HTMLElement | null;
  files: HTMLInputElement | null;
}

export interface OllinHandlers {
  file: (e: Event) => void;
  activateOverlay: () => void;
  opacity: (e: Event) => void;
  scale: (e: Event) => void;
  layer: () => void;
}

export interface OllinUI {
  overlay: () => void;
  control: (extensionName: string) => void;
}

export interface OllinDrag {
  click: (e: MouseEvent, elem: HTMLElement) => boolean;
  move: (e: DragEvent, elem: HTMLElement) => boolean;
  key: (e: KeyboardEvent, elem: HTMLElement) => void;
  init: () => new (elemId: string) => void;
}

export interface Ollin {
  handlers: OllinHandlers;
  ui: OllinUI;
  drag: OllinDrag;
  init: () => void;
  activateOverlay: () => void;
}

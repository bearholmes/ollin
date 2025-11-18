/**
 * @file Ollin Configuration Constants
 * @description Shared configuration for all platforms
 */

export interface OllinConfig {
  SCALE_MAX: number;
  SCALE_MIN: number;
  SCALE_STEP: number;
  OPACITY_MIN: number;
  OPACITY_MAX: number;
  OPACITY_STEP: number;
  OPACITY_DEFAULT: number;
  TOOLBAR_HEIGHT: number;
  KEYBOARD_MOVE_NORMAL: number;
  KEYBOARD_MOVE_FAST: number;
  KEY_CODES: {
    LEFT: number;
    UP: number;
    RIGHT: number;
    DOWN: number;
  };
}

export const CONFIG: OllinConfig = {
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

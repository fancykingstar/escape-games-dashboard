import {
  SAVE_GAME
} from "constants/index";

export const saveGame = (payload) => ({
  type: SAVE_GAME,
  payload: payload
});
import {
  SAVE_GAME
} from "constants/index";

const INIT_STATE = {
  game: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SAVE_GAME:
      return {
        ...state,
        game: action.payload
      }
    default:
      return { ...state }
  }
};

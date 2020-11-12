import { all } from "redux-saga/effects"
import gameSaga from "./game/saga"

export default function* rootSaga(getState) {
  yield all([
    gameSaga(),
  ])
}

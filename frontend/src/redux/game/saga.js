import { all, call, fork, put, takeEvery } from "redux-saga/effects"

// export function* watchRegisterUser() {
//   yield takeEvery(REGISTER_USER, registerWithEmailPassword)
// }

export default function* rootSaga() {
  yield all([
    // fork(watchLoginUser)
  ])
}

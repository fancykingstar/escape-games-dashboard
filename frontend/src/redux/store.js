import { createStore, applyMiddleware, compose } from "redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import createSagaMiddleware from "redux-saga"
import reducers from "./reducers"
import sagas from "./sagas"

const persistConfig = {
  key: "root",
  storage,
}

export function configureStore(initialState) {
  const persistedReducer = persistReducer(persistConfig, reducers)

  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [sagaMiddleware]
  let store = createStore(
    persistedReducer,
    initialState,
    compose(applyMiddleware(...middlewares))
  )

  store.__PERSISTOR = persistStore(store)

  sagaMiddleware.run(sagas)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers")
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

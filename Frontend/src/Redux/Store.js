import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import registerReducers from "./Slices/RegisterSlice";
import loginReducers from "./Slices/LoginSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  login: loginReducers,
  register: registerReducers,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

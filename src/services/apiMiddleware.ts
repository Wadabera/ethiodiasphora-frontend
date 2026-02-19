import type { Middleware } from "@reduxjs/toolkit";
import api from "./api";

const apiMiddleware: Middleware = (store) => (next) => async (action) => {
  if (typeof action === "function") {
    return action(api, store.dispatch, store.getState);
  }
  return next(action);
};

export default apiMiddleware;

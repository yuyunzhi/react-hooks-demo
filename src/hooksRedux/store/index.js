import bookReducer from "./bookReducer";
import movieReducer from "./movieReducer";
import userReducer from "./userReducer";

/**
 *使用useReducer useContext 代替redux
 */

// 初始化store
export const initialStore = {
  user: null,
  books: null,
  movies: null
};

// 模块化 reducer
const obj = {
  ...bookReducer,
  ...movieReducer,
  ...userReducer
}

export function reducer(state, action) {
  const fn = obj[action.type];
  if (fn) {
    return fn(state, action);
  } else {
    console.error("wrong type");
  }
}

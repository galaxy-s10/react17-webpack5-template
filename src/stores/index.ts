import { configureStore } from '@reduxjs/toolkit';

import { reducer } from './counter';

// 导出全局状态https://redux-toolkit.js.org/api/configureStore
export const store = configureStore({
  reducer: {
    counter: reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

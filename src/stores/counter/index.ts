import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const ajaxGetUserInfo = createAsyncThunk(
  'ajax/getUserInfo',
  async () => {
    const response = await new Promise((res, rej) => {
      setTimeout(() => {
        res(1);
      }, 1000);
    });
    return response;
  }
);

// 创建store
const counterSlice = createSlice({
  name: 'counter',
  initialState: { num: 10, age: 12 },
  reducers: {
    addNum(state, { payload }) {
      console.log('addNum', state, payload);
      state.num += payload;
    },
    delNum(state, { payload }) {
      console.log('delNum', state, payload);
      state.num -= payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(ajaxGetUserInfo.pending, (state, action) => {
        console.log('ajaxGetUserInfo.pending', state, action);
      })
      .addCase(ajaxGetUserInfo.fulfilled, (state, action) => {
        console.log('ajaxGetUserInfo.fulfilled', JSON.stringify(state), action);
        state.age = 1000;
      })
      .addCase(ajaxGetUserInfo.rejected, (state, action) => {
        console.log('ajaxGetUserInfo.rejected', state, action);
      });
  },
});

// 返回actions
export const { addNum, delNum } = counterSlice.actions;
// 返回reducer
export const { reducer } = counterSlice;
// 返回slice
export default counterSlice;

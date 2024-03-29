import { createSlice } from '@reduxjs/toolkit';

// 创建store
const counterSlice = createSlice({
  name: 'counter',
  initialState: { num: 10 },
  reducers: {
    addNum(state, { payload }) {
      console.log('reducers-addNum', state, payload);
      state.num += payload;
    },
    delNum(state, { payload }) {
      console.log('reducers-delNum', state, payload);
      state.num -= payload;
    },
  },
  extraReducers() {
    console.log('extraReducers');
  },
});

// 返回actions
export const { addNum, delNum } = counterSlice.actions;
// 返回reducer
export const { reducer } = counterSlice;
// 返回slice
export default counterSlice;

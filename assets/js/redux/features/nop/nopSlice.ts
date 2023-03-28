import {createSlice} from '@reduxjs/toolkit';

export type NopSliceState = {};

const initialState: NopSliceState = {};

export const nopSlice = createSlice({
  name: 'nop',
  initialState,
  reducers: {},
});

export const {} = nopSlice.actions;

export default nopSlice.reducer;

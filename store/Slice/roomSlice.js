import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    room: null,
    group: null
  },
  reducers: {
    setRoom: (state, action) => {
        state.room = action.payload;
    },
    
    setGroup: (state, action) => {
        state.group = action.payload
    }
  },
});

export const { setRoom, setGroup } = authSlice.actions;
export default authSlice.reducer;

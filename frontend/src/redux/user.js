import { createSlice } from '@reduxjs/toolkit'



export const User = createSlice({
  name: 'user',
  initialState: {
    fullname: '',
    email : '',
    username: '',
    id : ''
  },
  reducers: {
    setUser: (state, action) => {
      state.fullname = action.payload.full_name
      state.id = action.payload.id
      state.username = action.payload.username
    }
  }
}) 

export const { setUser } = User.actions

export default User.reducer
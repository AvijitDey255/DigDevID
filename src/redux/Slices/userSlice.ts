import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import mongoose from 'mongoose';

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  userName:string;
  email: string;
  mobile?: string;
  image?:string
}



interface UserState {
  userData:IUser | null
}
const initialState: UserState = {
  userData:null
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        setUserData:(state, action)=>{
             state.userData = action.payload
        },
        logout:(state)=>{
             state.userData = null
        }

    }
})

export const { setUserData,logout } = userSlice.actions
export default userSlice.reducer
import  {createSlice} from '@reduxjs/toolkit'

const initialState = {
    activeRoomId:null,
    activeRoomValue:null,
    activeRoom:false,
}

const roomsSlice = createSlice({
    name:'rooms',
    initialState,
    reducers:{
        setActiveRoom:(state,action)=>{
            state.activeRoom = true;
            state.activeRoomId = action.payload.id;
            state.activeRoomValue = action.payload.value
        },
        deleteActiveRoom:()=>initialState
    }
})

export const {setActiveRoom,deleteActiveRoom} = roomsSlice.actions;

export default roomsSlice.reducer;
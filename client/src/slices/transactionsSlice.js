import  {createSlice} from '@reduxjs/toolkit'

const initialState = {
    activeTransactionId:null,
    activeTransactionValue:{
        name:null,
        price:null,
        credit:null
    },
    activeTransaction:false,
}

const transactionsSlice = createSlice({
    name:'rooms',
    initialState,
    reducers:{
        setActiveTransaction:(state,action)=>{
            state.activeTransaction = true;
            state.activeTransactionValue = action.payload.activeTransactionValue
            state.activeTransactionId = action.payload.activeTransactionId
        },
        deleteActiveTransaction:()=>initialState
    }
})

export const {setActiveTransaction,deleteActiveTransaction} = transactionsSlice.actions;

export default transactionsSlice.reducer;   
import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';
import { apiSlice } from './slices/apiSlice';
import roomsReducer from './slices/roomsSlice';
import transactionsReducer from './slices/transactionsSlice'
const store = configureStore({
    reducer:{
        auth:authReducer,
        rooms:roomsReducer,
        transactions:transactionsReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
    DevTools:true
})

export default  store;
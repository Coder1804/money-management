import { apiSlice } from './apiSlice';
const USERS_URL = '/api/transactions';

export const transactionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllTransactions: builder.query({
        query: (data) => ({
          url: `${USERS_URL}/all/${data}`,
          method: 'GET',
        }),
        providesTags: ["Transactions"]
      }),
      createTransaction: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}`,
          method: 'POST',
          body:data,
        }),
        invalidatesTags: ["Transactions"]
      }),
      updateTransaction: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/${data.transactionId}`,
          method: 'PUT',
          body: {
            roomName:data.roomName,
            name:data.name,
            price:data.price,
            credit:data.credit
          }
        }),
        invalidatesTags: ["Transactions"]
      }),
      deleteTransaction: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/${data.transactionId}`,
          method: 'DELETE',
          body:{
            roomName:data.roomName
          }
        }),
        invalidatesTags: ["Transactions"]
      }),
    }),
  });


  export const {
    useGetAllTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation
  } = transactionsApiSlice
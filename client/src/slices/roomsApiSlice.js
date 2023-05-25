import { apiSlice } from './apiSlice';
const USERS_URL = '/api/rooms';


export const roomApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllRooms: builder.query({
        query: () => ({
          url: `${USERS_URL}`,
          method: 'GET',
        }),
        transformResponse:res=>({
          ...res,
          rooms:res.rooms.sort((a,b)=>{
            return (new Date(b.updatedAt)) - (new Date(a.updatedAt)) 
          }),
        }),
        providesTags: ["Rooms"]
      }),
      createRoom: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}`,
          method: 'POST',
          body:data,
        }),
        invalidatesTags: ["Rooms"]
      }),
      updateRoom: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/${data.roomName}`,
          method: 'PUT',
          body: {
            newRoomName : data.newRoomName
          }
        }),
        invalidatesTags: ["Rooms"]
      }),
      deleteRoom: builder.mutation({
        query: (data) => ({
          url: `${USERS_URL}/${data.roomName}`,
          method: 'DELETE',
        }),
        invalidatesTags: ["Rooms"]
      }),
    }),
  });
  

export const {
    useGetAllRoomsQuery,
    useCreateRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation
}  = roomApiSlice;
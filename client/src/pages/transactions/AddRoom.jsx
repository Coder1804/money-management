import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  useCreateRoomMutation,
  useUpdateRoomMutation,
} from "../../slices/roomsApiSlice";
import { ToastContainer, toast } from "react-toastify";
import { deleteActiveRoom } from "../../slices/roomsSlice.js";
import { useDispatch, useSelector } from "react-redux";

const AddRoom = () => {
  const dispatch = useDispatch();
  const { activeRoom, activeRoomId, activeRoomValue } = useSelector(
    (state) => state.rooms
  );
  const validationSchema = yup.object({
    roomName: yup
      .string()
      .trim()
      .min(4, "Xona nomi 4 ta harfdan kam bo'lmasligi lozim")
      .required("Xona nomi kiritilishi shart!"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ 
    resolver: yupResolver(validationSchema),
  });

  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();

  useEffect(() => {
    if (activeRoomValue !== null) {
      setValue("roomName", activeRoomValue);
    } else if (activeRoomValue == null) {
      setValue("roomName", "");
    }
  }, [activeRoomId]);

  const handleSubmitForm = async (form) => {
    try {
      if (!activeRoom) {
        await createRoom({
          roomName: form.roomName,
        }).unwrap();
        toast.success("Xona yaratildi!");
        setValue("roomName", "");
      } else {
        if (form.roomName === activeRoomValue) {
          toast.warning(
            "Yangi xona nomi eskisi bilan bir xil bo'lmasligi lozim"
          );
          return;
        }
        await updateRoom({
          roomName: activeRoomValue,
          newRoomName: form.roomName,
        }).unwrap();
        dispatch(deleteActiveRoom());
        toast.success("Xona muvaffaqiaytli o'zgartirildi!");
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };
  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex p-2 gap-4 bg-stone-700 items-center"
      >
        <div className="flex flex-col gap-2 tracking-wider items-center">
          <label htmlFor="roomName">Xona nomi:</label>
          <input
            {...register("roomName")}
            className="h-8 min-w-[350px] bg-stone-800"
            name="roomName"
            type="text"
          />
          {errors.roomName && (
            <p className="text-red-500 text-sm">{errors.roomName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          {activeRoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteActiveRoom());
              }}
              className="p-2  rounded font-semibold border-2 border-red-500"
            >
              Bekor qilish
            </button>
          )}
          <button
            type="submit"
            className="p-2 bg-green-500 rounded font-semibold"
          >
            {activeRoom ? "Saqlash" : "Yangi xona qo'shish"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddRoom;

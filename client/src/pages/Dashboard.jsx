import React from "react";
import { BiLineChartDown, BiLineChart } from "react-icons/bi";
import AddRoom from "../pages/transactions/AddRoom";
import {
  useGetAllRoomsQuery,
  useDeleteRoomMutation,
} from "../slices/roomsApiSlice";
import { format } from "date-fns";
import { BsPencilSquare } from "react-icons/bs";
import { GoTrashcan } from "react-icons/go";
import { setActiveRoom, deleteActiveRoom } from "../slices/roomsSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { activeRoomId } = useSelector((state) => state.rooms);
  const { isLoading, isFetching, error, isError, data } = useGetAllRoomsQuery();
  const [deleteRoom] = useDeleteRoomMutation();

  const handleDeleteRoom = async (roomName) => {
    confirmAlert({
      title: `${roomName.slice(
        0,
        10
      )}... nomli xonani o\'chirishni istaysizmi?`,
      buttons: [
        {
          label: "Ha",
          onClick: async () => {
            try {
              await deleteRoom({ roomName }).unwrap();
              dispatch(deleteActiveRoom());
              toast.success("Xona muvafaqqiyatli o'chirildi!");
            } catch (error) {
              toast.error(error?.data?.message);
            }
          },
        },
        {
          label: "Yo'q",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="w-[80%] mx-auto max-w-[1200px] p-4">
      <div className="flex justify-end">
        <AddRoom />
      </div>
      <div className="rounded-md bg-stone-700 min-w-[250px] w-max p-4 flex flex-col gap-4">
        <h1 className="text-3xl font-medium">O'tkazmalar</h1>
        {isLoading ? (
          <p>Yuklanyapti...</p>
        ) : (
          <>
            <div className="flex gap-2 items-center text-2xl text-green-500">
              <NumericFormat
                name="transactionPrice"
                displayType="text"
                decimalScale={2}
                decimalSeparator="."
                suffix=" SO'M"
                thousandsGroupStyle="thousand"
                thousandSeparator=" "
                value={data?.statistics?.allDebitsPrice}
                renderText={(value) => <h1>{value}</h1>}
              />
              <BiLineChart />
            </div>
            <div className="flex gap-2 items-center text-2xl text-red-500">
              
            <NumericFormat
                name="transactionPrice"
                displayType="text"
                decimalScale={2}
                decimalSeparator="."
                suffix=" SO'M"
                thousandsGroupStyle="thousand"
                thousandSeparator=" "
                value={data?.statistics?.allCreditsPrice}
                renderText={(value) => <h1>{value}</h1>}
              />
              <BiLineChartDown />
            </div>
          </>
        )}
      </div>
      <div className="mt-8">
        <h1 className="text-6xl font-bold my-4">Xonalar</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          {isError ? (
            <div>{error}</div>
          ) : isLoading || isFetching ? (
            <div>Yuklanyabdi...</div>
          ) : (
            data &&
            data?.rooms.map((room) => (
              <Link
                to={`./${room.name}`}
                reloadDocument={false}
                key={room._id}
                className={`${
                  activeRoomId === room._id ? "bg-stone-700/60" : "bg-stone-700"
                }  text-2xl font-medium p-4 w-[300px]  rounded-md cursor-pointer`}
              >
                <div className="flex justify-end gap-2 text-sm items-center">
                  <h3 className="mr-auto text-2xl max-w-[70%] overflow-x-auto">
                    {room.name}
                  </h3>
                  <BsPencilSquare
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(
                        setActiveRoom({
                          id: room._id,
                          value: room.name,
                        })
                      );
                    }}
                  />
                  <GoTrashcan
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteRoom(room.name);
                    }}
                  />
                </div>
                <div className="text-sm text-slate-400 mt-3">
                  Yaratilgan sana:{" "}
                  <strong className="text-white">
                    {format(new Date(room.createdAt), "yyyy-MM-dd kk:mm")}
                  </strong>
                </div>
                <span className="text-sm text-slate-400">
                  Taxrirlangan sana:{" "}
                  <strong className="text-white">
                    {format(new Date(room.updatedAt), "yyyy-MM-dd kk:mm")}
                  </strong>
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

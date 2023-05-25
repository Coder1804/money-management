import React, { useEffect, useState } from 'react'
import {BiLineChartDown,BiLineChart} from 'react-icons/bi'
import {BsPencilSquare} from 'react-icons/bs'
import {GoTrashcan} from 'react-icons/go'
import AddTransaction from './AddTransaction'
import { NumericFormat } from 'react-number-format';
import {useGetAllTransactionsQuery , useDeleteTransactionMutation} from '../../slices/transactionsApiSlice'
import { useParams } from 'react-router-dom'
import {format} from 'date-fns'
import { useDispatch, useSelector } from "react-redux";
import {setActiveTransaction , deleteActiveTransaction} from "../../slices/transactionsSlice.js";
import {confirmAlert} from 'react-confirm-alert'
import { toast } from 'react-toastify';
import {GiPayMoney , GiReceiveMoney} from 'react-icons/gi'


const Transaction = () => {
  const dispatch = useDispatch();
  const {activeTransactionId} = useSelector(state=>state.transactions);
 
  const {roomName} = useParams();
  const {isLoading , data} = useGetAllTransactionsQuery(roomName);
  
  const [deleteTransaction] = useDeleteTransactionMutation()
  const handleDeleteTransaction = transactionId =>{
    confirmAlert({
      title: `${roomName.slice(0,10)}... nomli xonani o\'chirishni istaysizmi?`,
      buttons: [
        {
          label: 'Ha',
          onClick: async () => {
            try {
              await deleteTransaction({
                roomName,
                transactionId:transactionId
              }).unwrap();
              dispatch(deleteActiveTransaction());
              toast.success("O'tkazma muvafaqqiyatli o'chirildi!")
            } catch (error) {
              toast.error(error?.data?.message);
            }
          }
        },
        {
          label: 'Yo\'q',
          onClick: () => {}
        }
      ]
    });
  }
  return (
    <div className="w-[80%] mx-auto max-w-[1200px] p-4">
      <div className="flex justify-end sticky top-5 ">
        <AddTransaction />
      </div>
      <div className="flex gap-4">
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
                  renderText={(value) => <h1>{value} SO'M</h1>}
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
                  renderText={(value) => <h1>{value} SO'M</h1>}
                />
                <BiLineChartDown />
              </div>
            </>
          )}
        </div>

        <div className="rounded-md bg-stone-700 min-w-[250px] w-max p-4 flex flex-col gap-4">
        <h1 className="text-3xl font-medium">Hisobot</h1>

           <div className="flex items-center gap-1 "> 
            <GiReceiveMoney className="w-9 h-9 rounded-sm bg-violet-500 p-.5"/>
              <div>
                <h3 className='text-sm'>Kirimlar soni</h3>
                <span>{data?.count?.debits}</span>
              </div>
            </div>   

            <div className="flex items-center gap-1 "> 
            <GiPayMoney className="w-9 h-9 rounded-sm p-.5 bg-sky-600"/>
              <div>
                <h3 className='text-sm'>Chiqimlar soni</h3>
                <span>{data?.count?.credits}</span>
              </div>
            </div>  
        </div>
      </div>

      <div className="mt-8">
        <h1 className="text-6xl font-bold my-4">O'tkazmalar</h1>
        <div className="flex gap-2 flex-wrap ">
          {isLoading ? (
            <p>yuklanyapti...</p>
          ) : (
            data &&
            data?.transactions?.map((transaction) => (
              <div
                key={transaction.createdAt}
                className={`${
                  transaction.credit ? "border-red-500" : "border-green-500"
                } group relative p-4 ${
                  activeTransactionId === transaction._id
                    ? "bg-stone-800"
                    : "bg-stone-700"
                } rounded-md border-l-8  flex items-between justify-between min-w-[700px]`}
              >
                <div className="absolute right-4 flex gap-2 duration-300 opacity-0 group-hover:opacity-100 cursor-pointer ">
                  <BsPencilSquare
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(
                        setActiveTransaction({
                          activeTransactionId: transaction._id,
                          activeTransactionValue: {
                            name: transaction.name,
                            price: transaction.price,
                            credit: transaction.credit,
                          },
                          activeTransaction: true,
                        })
                      );
                    }}
                  />
                  <GoTrashcan
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteTransaction(transaction._id);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">{transaction.name}</h1>
                  <span className="text-sm text-white/80">
                    Yaratilgan:{" "}
                    <strong>
                      {format(
                        new Date(transaction.createdAt),
                        "dd.MM.yyyy kk:mm"
                      )}
                    </strong>
                  </span>
                  <span className="text-sm text-white/80">
                    Taxrirlangan:{" "}
                    <strong>
                      {format(
                        new Date(transaction.updatedAt),
                        "dd.MM.yyyy kk:mm"
                      )}
                    </strong>
                  </span>
                </div>
                <NumericFormat
                  name="transactionPrice"
                  className="text-4xl font-bold ml-auto my-auto"
                  displayType="text"
                  decimalScale={2}
                  decimalSeparator="."
                  suffix=" SO'M"
                  thousandsGroupStyle="thousand"
                  thousandSeparator=" "
                  value={transaction.price}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Transaction
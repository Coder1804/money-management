import React, { useEffect, useRef , useState } from "react";
import { NumericFormat} from "react-number-format";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateTransactionMutation ,useUpdateTransactionMutation } from "../../slices/transactionsApiSlice";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteActiveTransaction } from "../../slices/transactionsSlice.js";
import { min } from "date-fns";

const AddTransaction = () => {
  const [createTransasction,{isLoading}] = useCreateTransactionMutation()
  const [updateTransasction] = useUpdateTransactionMutation()
  const {roomName} = useParams();
  const priceRef = useRef(null);
  const dispatch = useDispatch();
  const {activeTransaction,activeTransactionValue,activeTransactionId} = useSelector(state=>state.transactions);
  const [priceInput,setPriceInput] = useState(null);

  const validationSchema = yup.object({
    transactionName: yup
      .string()
      .trim()
      .min(4, "o'tkazma nomi 4 ta harfdan kam bo'lmasligi lozim")
      .required("O'tkazma nomi kiritili shart!"),
    transactionPrice: yup
      .number()
      .min(1,"Eng kichik o'tkazma 1 so'm")
      .max(100000000000, "Pul miqdori  oshib kedi!")
      .required("Pul miqdori kiritlishi shart!"),
  });
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(
    {
      resolver: yupResolver(validationSchema),
    }
  );

  const handleSubmitForm = async (form) => {
    try {
      if(!activeTransaction)
      {
        await createTransasction({
          name:form.transactionName,
          price:form.transactionPrice,
          credit:form.transactionStatus,
          roomName:roomName
        }).unwrap()
        reset();
        setPriceInput(null);
        toast.success("O'tkazma muvofaqqiyatli yarataildi!")
        }
      else
      {       
        await updateTransasction({
          transactionId: activeTransactionId,
          roomName: roomName,
          name: form.transactionName,
          price: form.transactionPrice,
          credit: form.transactionStatus,
        }).unwrap();
        dispatch(deleteActiveTransaction());
        toast.success("o'tkazma muvaffaqiaytli o'zgartirildi!");
      }
    } catch (error) {
      toast.error(error?.data?.message)
    }
  };
  const handleNumericFormat = values=>{
    setValue('transactionPrice' , values.floatValue)
    if(!activeTransaction)
    {
      setPriceInput(values.floatValue);
    }            
  }

  useEffect(()=>{
    if(activeTransaction !==null){
      setValue("transactionName" , activeTransactionValue.name)
      setValue('transactionStatus' , activeTransactionValue.credit)
    }else if(activeTransaction === null)
    {
      setValue("transactionName" , "")
      setValue('transactionStatus' , true)
    }
  },[activeTransactionId])
  return (
    <>
    <form
      
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-col p-4 gap-4 bg-stone-700 items-center w-[410px] rounded-md h-max"
    >
      <div className="flex w-full flex-col gap-2 tracking-wider">
        <label htmlFor="transactionName">O'tkazma nomi:</label>
        <input
          {...register("transactionName")}
          className="h-8 w-full bg-stone-800"
          name="transactionName"
          type="text"
        />
        {errors?.transactionName && (
          <p className="text-red-500">{errors?.transactionName?.message}</p>
        )}
      </div>
      <div className="flex w-full flex-col gap-2 tracking-wider">
        <label htmlFor="transactionPrice">O'tkazma summasi:</label>
        <NumericFormat
          getInputRef={priceRef}
          name="transactionPrice"
          className="h-8 w-full bg-stone-800"
          decimalScale={2}
          decimalSeparator="."
          suffix=" SO'M"  
          allowNegative={false}
          thousandsGroupStyle="thousand"
          thousandSeparator=" "
          value={priceInput || activeTransactionValue.price || ""}
          onValueChange={handleNumericFormat}
        />

         {errors?.transactionPrice && (
          <p className="text-red-500">{errors?.transactionPrice?.message}</p>
        )}
      </div>
      <div className="flex flex-row-reverse gap-2 tracking-wider items-center mr-auto">
        <label htmlFor="transactionStatus">Chiqim</label>
        <input
          className="h-8 w-8 text-stone-800 bg-stone-800"
          type="checkbox"
          name="transactionStatus"
          {...register("transactionStatus")}
        />
      </div >
      <div className="flex gap-2 items-center">
      {activeTransaction && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteActiveTransaction());
              }}
              className="p-1.5 rounded font-semibold border-2 border-red-500"
            >
              Bekor qilish
            </button>
          )}
      <button disabled={isLoading} className={`${isLoading && 'bg-slate-500'} p-2 bg-green-500 rounded font-semibold mt-auto`}>
        {isLoading ? "O'tkazma yaratilmoqda..." : activeTransaction ? "Saqlash" : "Yangi o'tkazma qo'shish"}
      </button>
      </div>
    </form>

    </>
  );
};

export default AddTransaction;

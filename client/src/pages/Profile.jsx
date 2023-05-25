import React, { useEffect } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { useUpdateUserMutation } from '../slices/usersApiSlice'
import { setUserInfo } from '../slices/authSlice'
import  {toast} from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import  {yupResolver} from '@hookform/resolvers/yup'

const Profile = () => {
 const dispatch = useDispatch();
    const navigate = useNavigate();

    const[updateForm,{isLoading}] = useUpdateUserMutation();
   
    const {userInfo} = useSelector((state)=>state.auth);

    const validationSchema = yup.object().shape({
        name:yup.string().notRequired()
        .when('name', {
            is: (value) =>  value?.length,
            then: (rule) => rule.min(3,"Eng kamida 3 ta belgi bo'lishi kerak"),
        }),
        email:yup.string().notRequired()
        .when('email', {
            is: (value) =>  value?.length,
            then: (rule) => rule.email("Email to'g'ri kiritilamadi"),
        }),
        password:yup.string().notRequired()
        .when('password', {
            is: (value) =>  value?.length,
            then: (rule) => rule.min(4 , "Parol 4 tadan kam bo'lishi mumkin emas"),
        }),
        newPassword:yup.string().notRequired()
        .when('newPassword', {
            is: (value) =>  value?.length,
            then: (rule) => rule.min(4 , "Parol 4 tadan kam bo'lishi mumkin emas"),
        }),
    },
    [
        // Add Cyclic deps here because when require itself
        ['name', 'name'],
        ['email', 'email'],
        ['password' , 'password'],
        ['newPassword' , 'newPassword']
    ]
    )

    const {register,handleSubmit, reset , formState:{errors}} =useForm({
        resolver:yupResolver(validationSchema)
    })


    const handleSubmitForm = async(form)=>{
        try {
            const res = await updateForm({
                name:form.name,
                email:form.email,
                password:form.password,
                newPassword:form.newPassword,
            }).unwrap()
            dispatch(setUserInfo({...res}))
            toast.success('Ma\'lumotlar o\'zgartirildi!')
            reset();
        } catch (error) {
            toast.error(error?.data?.message)
        }
    }   

  return (
    <div className="flex w-full h-screen items-center justify-center">
        <ToastContainer/>
        <form 
            onSubmit={handleSubmit(handleSubmitForm)}
            className="min-w-[500px] flex flex-col items-center justify-center gap-4 p-4 bg-stone-700"
        >
            <h1 className='text-3xl font-bold'>Profilni taxrirlash</h1>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="name">Ismingiz</label>
                <input {...register('name')} defaultValue={userInfo.name} className="h-10  p-2 text-black outline-[#6C5752]" type="text" name='name'/>
                {errors?.name && <p className='text-red-500'>{errors?.name?.message}</p>}

            </div>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="email">Email</label>
                <input {...register('email')} defaultValue={userInfo.email} className="h-10  p-2 text-black outline-[#6C5752]" type="email" name='email'/>
                {errors?.email && <p className='text-red-500'>{errors?.email?.message}</p>}

            </div>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="password">Eski parol</label>
                <input {...register('password')} className="h-10  p-2 text-black outline-[#6C5752]" type='password' name='password'/>
                {errors?.password && <p className='text-red-500'>{errors?.password?.message}</p>}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="newPassword">Yangi Parol</label>
                <input {...register('newPassword')} className="h-10  p-2 text-black outline-[#6C5752]" type='password' name='newPassword'/>
                {errors?.newPassword && <p className='text-red-500'>{errors?.newPassword?.message}</p>}
            </div>
            <button disabled={isLoading}  className="bg-stone-600 border-2 border-stone-900 text-2xl  py-3  w-full mt-4 disabled:bg-slate-500 disabled:cursor-none" type='submit'>{isLoading ? "Taxrirlanmoqda..." : "Saqlash"}</button>
        </form>
    </div>
  )
}

export default Profile
import React, { useEffect } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setUserInfo } from '../slices/authSlice'
import  {toast} from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import  {yupResolver} from '@hookform/resolvers/yup'



const Register = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[registerForm,{isLoading}] = useRegisterMutation();
   
    const {userInfo} = useSelector((state)=>state.auth);

    const validationSchema = yup.object({
        name:yup.string().min(3,"Eng kamida 3 ta belgi bo'lishi kerak").required("Ism bo'sh joy bo'la olmaydi"),
        email:yup.string().email("Email to'g'ri kiritilamadi").required("Email kiritilishi talab qilinadi"),
        password:yup.string().min(4 , "Parol 4 tadan kam bo'lishi mumkin emas").required('Parol talab qilinadi'),
    })

    const {register,handleSubmit , formState:{errors}} =useForm({
        resolver:yupResolver(validationSchema)
    })

    useEffect(()=>{
        if(userInfo)
        {
            navigate('/')
        }
    },[navigate,userInfo]) 

    const handleSubmitForm = async(form)=>{
        try {
            const res = await registerForm({
                name:form.name,
                email:form.email,
                password:form.password
            }).unwrap()
            dispatch(setUserInfo({...res}))
        } catch (error) {
            toast.error(error?.data?.message)
        }
    }   

  return (
    <div className="flex w-full h-screen">
        <ToastContainer/>
        <div className='flex-1 h-full'>
            <img className='object-cover w-full h-full' 
            src="https://images.unsplash.com/photo-1463171379579-3fdfb86d6285?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        />
            </div>
        <form 
            onSubmit={handleSubmit(handleSubmitForm)}
            className="min-w-[500px] bg-[#BFA79D] flex flex-col items-center justify-center gap-8 px-12"
        >
            <h1 className='text-5xl font-bold'>Ro'yxatdan o'tish</h1>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="name">Ismingiz</label>
                <input {...register('name')} className="h-10  p-2 text-black outline-[#6C5752]" type="text" name='name'/>
                {errors?.name && <p className='text-red-500'>{errors?.name?.message}</p>}

            </div>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="email">Email</label>
                <input {...register('email')} className="h-10  p-2 text-black outline-[#6C5752]" type="email" name='email'/>
                {errors?.email && <p className='text-red-500'>{errors?.email?.message}</p>}

            </div>
            <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-medium tracking-wider " htmlFor="password">Parol</label>
                <input {...register('password')} className="h-10  p-2 text-black outline-[#6C5752]" type='password' name='password'/>
                {errors?.password && <p className='text-red-500'>{errors?.password?.message}</p>}

            </div>
            <p className="text-[#4A3631] self-start">Sizda allaqachon akkaunt bormi? <Link className="underline underline-offset-1 text-white " to='/login'> Kirish</Link></p>
            <button disabled={isLoading}  className="bg-[#4A3631] text-2xl  py-3  w-full mt-4 disabled:bg-slate-500 disabled:cursor-none" type='submit'>{isLoading ? "Royxatga olinmoqda" : "Ro'yxatdan o'tish"}</button>
        </form>
    </div>
  )
}

export default Register
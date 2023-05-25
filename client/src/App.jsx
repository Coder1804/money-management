import React from 'react'
import { Link, Outlet , useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector, useDispatch } from 'react-redux'
import {deleteUserInfo} from './slices/authSlice';
import { useLogoutMutation } from './slices/usersApiSlice'


const App = () => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userInfo} = useSelector(state=>state.auth);
  const [logoutApiCAll] = useLogoutMutation();
  
  const handleLogout = async()=>{
    console.log("running logut")
    try {
      await logoutApiCAll().unwrap();
      dispatch(deleteUserInfo());
      navigate('/');
      toast.success("Profildan muvaffaqoyatli chqiqildi")
    } catch (error) {
      toast.error(error?.data?.message)
    }
  }
  return (
    <div className="flex flex-col w-full h-screen">
      <ToastContainer/>
      <header className="bg-stone-700"> 
        <nav className="w-[80%] max-w-[1200px] mx-auto p-4 text-white text-xl font-bold justify-between flex items-center">
        <Link to='/'>
          RAKHIMOV ORZUBEK
          <h4 className="mt-0.5 text-sm">Money Management App</h4>
        </Link>
          <ul className="flex gap-4 items-center ">
            {['dashboard' , 'debits'].map(route=>(
              <li key={route}>
                <Link to={"./"+route}>{route.toUpperCase()}</Link>
              </li>
            ))}
              {
                userInfo ? 
                <>
                  <li onClick={handleLogout} className="text-md font-light text-center cursor-pointer"><span className="text-sm text-slate-400">Profildan</span><p>Chiqish</p></li>
                  <li className="text-md font-light text-center cursor-pointer"><span className="text-sm text-slate-400">Foydalanuvchi</span><p>{userInfo?.name.length < 11 ? userInfo?.name : userInfo?.name.slice(0,11)+'...'}</p></li>
                  <li className="text-md font-light text-center cursor-pointer"><Link to="/profile" ><span className="text-sm text-slate-400">Profilni</span><p>Tahrirlash</p></Link></li>
                </> :
                 <>
                 <li className="text-md font-light text-center cursor-pointer"><Link to="/login" ><span className="text-sm text-slate-400">Profilga</span><p>Kirish</p></Link></li>
                 <li className="text-md font-light text-center cursor-pointer"><Link to="/register" ><span className="text-sm text-slate-400">Ro'yxatdan</span><p>O'tish</p></Link></li>
               </>

              }
            </ul>
        </nav>
      </header>
      <div className="w-full h-screen">
      <Outlet/>
      </div>
    </div>
  )
}

export default App

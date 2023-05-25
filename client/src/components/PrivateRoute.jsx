import React from 'react'
import { useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
const PrivateRoute = () => {
    const {userInfo} = useSelector(state=>state.auth);
  return (
    <div>
        {userInfo ? <Outlet/> : <Navigate to='/' replace/>}
    </div>
  )
}

export default PrivateRoute
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter , RouterProvider , createRoutesFromElements, Route , Routes } from 'react-router-dom'
import App from './App.jsx'
import {Home,Login,Register , Profile, Dashboard, Debits, Transaction} from './pages/index.js'
import {PrivateRoute} from './components/index.js'
import store from './store.js'
import {Provider} from 'react-redux'
import './index.css'


const router = createBrowserRouter(createRoutesFromElements(
    <>
    <Route path='/' element={<App/>}>
        <Route index={true} path='/' element={<Home/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/dashboard/:roomName' element={<Transaction/>}/>
          <Route path='/debits' element={<Debits/>}/>
        </Route>
    </Route>  
    <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>


    </>
))


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
  </Provider>

)

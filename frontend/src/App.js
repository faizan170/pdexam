import React, { Suspense, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route, Routes,
} from "react-router-dom";
import HomePage from './pages/Home';
import PDExam from './pages/PDExam';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

import PublicRoute from "./core/routes/PublicRoute"
import PrivateRoute from "./core/routes/PrivateRoute"
import LoadingIcon from './assets/images/loading.gif'

import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from './redux/authentication';
import { setUser } from './redux/user';
import instance from './auth/jwt/useJwt';


function App() {
  
  const user = useSelector(state => state.authentication)

  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = async () => {
    try {
      instance.get(`/user`).then(res => {
        dispatch(setUser(res.data.data))
        
      setIsLoading(false)
    }).catch(err=> {
      setIsLoading(false)
      dispatch(handleLogout())
      })
      
    } catch (error) {
      //console.log(error)
      dispatch(handleLogout())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}><img src={LoadingIcon} /></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path='/pd-exam' element={<PDExam />} />
        </Route> 

        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
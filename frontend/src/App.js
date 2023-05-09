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
import Reports from './pages/Reports';
import ReportDetails from './pages/Reports/ReportDetails';
import AdminPage from './pages/Admin';
import AdminReportDetails from './pages/Admin/AdminReportDetails';
import PinPage from './pages/PinPage';


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
          <Route path='/reports' element={<Reports />} />
          <Route path='/reports/:id' element={<ReportDetails />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/admin/report/:id' element={<AdminReportDetails />} />
        </Route> 
        
        <Route path='/pd-exam' element={<PDExam />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/pin' element={<PinPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
// ** React Imports
import { Navigate, Outlet } from "react-router-dom"
import { isUserLoggedIn } from "../../auth/utils" 
const PrivateRoute = () => {
  const userLoggedIn = isUserLoggedIn()
  return (
    userLoggedIn ? <Outlet /> : <Navigate to='/login' />
  )
}


export default PrivateRoute

// ** React Imports
import { Suspense } from "react"
import { Navigate } from "react-router-dom"

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "../../auth/utils"

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = getUserData()

    if (user) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute

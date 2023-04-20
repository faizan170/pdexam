// ** React Imports
import { Fragment, lazy } from "react"
import { Navigate } from "react-router-dom"
// ** Layouts

// ** Route Components
import PublicRoute from "../core/routes/PublicRoute"
import PrivateRoute from "../core/routes/PrivateRoute"


import BlankLayout from "../core/layouts/BlankLayout"
import LayoutWrapper from "../core/layouts/LayoutWrapper"

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template"

// ** Default Route
const DefaultRoute = "/"

const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))


const isObjEmpty = (obj) => Object.keys(obj).length === 0
// ** Merge Routes
export const allRoutes = [
  {
    path: "/",
    element: <Home />,
    meta: {
      isPrivate: true,
    }
  },
  
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank"
    }
  },

]

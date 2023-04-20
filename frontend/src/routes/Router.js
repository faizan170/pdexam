// ** Router imports
import { useRoutes } from "react-router-dom"

// ** GetRoutes
import { allRoutes } from "./allRoutes"


const Router = () => {
  // ** Hooks

  //const allRoutes = getRoutes()
  const routes = useRoutes([...allRoutes])

  return routes
}

export default Router

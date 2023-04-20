// ** React Imports
import { Fragment, useEffect, memo } from "react"


const LayoutWrapper = (props) => {
  // ** Props
  const { children, routeMeta } = props

  

  return (
    <div
      className={"app-content content overflow-hidden"}
    >
      <div className="content-overlay"></div>
      {/* <div className="header-navbar-shadow" /> */}
      <div
        className={"content-wrapper"}
      >
        
          {children}
      </div>
    </div>
  )
}

export default memo(LayoutWrapper)

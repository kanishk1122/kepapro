import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import Routing from './utils/Routing'
import Loading from './components/Loding'
import { detailsContext } from './utils/Context'

const App = () => {
  
  const {loading} = useContext(detailsContext)

  return (
   <>
   <span className={`${loading ? 'fixed z-50 w-full h-screen':'hidden'}`}><Loading/></span>
   <Routing/>
   </>
  )
}

export default App
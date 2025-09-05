import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import InstallPrompt from '../components/InstallPrompt'

const Layouts = () => {
  return (
    <div>
        <Outlet />
        <div>
             <BottomNav />
        </div>
        <div>
          <InstallPrompt />
        </div>
    </div>
  )
}

export default Layouts
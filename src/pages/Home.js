import React from 'react'
import { Navbar } from '../components/Navbar'
import { Actionsbar } from '../components/Actionsbar'
import { Footer } from '../components/Footer'
export const Home = () => {
  return (
    <div>
      <Navbar/>
      <Actionsbar/>
      <Footer/>
    </div>
  )
}

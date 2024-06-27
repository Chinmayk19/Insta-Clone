"use client"
import React from 'react'
import SideBar from "../Components/SideBar"
import InstaFeed from "../Components/InstaFeed"

const page = () => {
  return (
    <div style={{display:"flex"}}>
    <SideBar/>
    <InstaFeed/>
    </div>
  )
}

export default page
"use client"
import React from 'react'
import SideBar from "../Components/SideBar"
import InstaFeed from "../Components/InstaFeed"
import SearchUser from "../Components/SearchUser"


const page = () => {
  return (
    <div style={{display:"flex"}}>
    <SideBar/>
    <InstaFeed/>
    <SearchUser/>
    </div>
  )
}

export default page
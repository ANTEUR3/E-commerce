import React from 'react'
import { CiMenuBurger } from "react-icons/ci";
import { FaPhone } from "react-icons/fa";

const MdSmNavbar = () => {
  return (
    <div className='w-full  lg:hidden'>
         <div className="w-full py-1 px-[100px] bg-gray-100 flex justify-between items-center border">
                    <div className="flex justify-start items-center gap-x-2">
                      <FaPhone className="text-black text-md" />
                      <p className="text-black text-md">+213 656149785</p>
                    </div>
                    <div className="flex justify-between items-center gap-x-5">
                      <p className="text-black text-md ">Get 50% of selected items</p>
                      <p className="text-black text-md ">|</p>
                      <p className="text-black text-md ">Shop Now</p>
                    </div>
                   
                    <div className='group cursor-pointer flex flex-col justify-start items-start  '>
                     <CiMenuBurger className='text-3xl '/>
                     <div className="relative hidden group-hover:block z-10 ">
                        <div className="absolute flex flex-col justify-start items-start  pr-[100px] gap-y-3   py-1 bg-gray-100">
                             <p className='text-md   px-1   rounded-md w-full'>lang</p>
                             <p className='text-md  px-1   rounded-md w-full'>Location</p>
                        </div>
                     </div>

                    </div>

                  </div>
    </div>
  )
}

export default MdSmNavbar
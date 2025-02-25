import React from 'react'
import { useNavigate } from 'react-router-dom';

const Failed = () => {

    const navigate = useNavigate();
    function redirectPricing() {
      navigate("/pricing");
    }

  return (
    <div className='font-poppins font-extralight my-12'>
        <p className='text-2xl text-center my-4 font-semibold '>Payment Failed</p>
        <p className='text-base text-center my-2 '>Your payment failed<br></br>You can start the payment process again</p>
        <div className="flex justify-center my-8">
              <button className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-44 py-2.5 " onClick={redirectPricing}>
                Redirect
              </button>
            </div>
    </div>
  )
}

export default Failed
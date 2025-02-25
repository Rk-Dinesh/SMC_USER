import React, { useEffect, useState } from "react";
import Profiles from "../../assets/profile.png";
import UpdateProfile from "./UpdateProfile";
import UpdatePhone from "./UpdatePhone";
import UpdateImage from "./UpdateImage";
import axios from "axios";
import { API } from "../../Host";

const Profile = () => {
  const [isModal, setIsModal] = useState(false);
  const [isPhoneModal, setIsPhoneModal] = useState(false);
  const [isProfileModal, setIsProfileModal] = useState(false);
  const user = localStorage.getItem("user");

  const [userData, setUserData] = useState({});
  const [userImage, setUserImage] = useState({});

  useEffect(() => {
    fetchUser();
    fetchImage();
  }, [isProfileModal]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/api/getusersbyid?id=${user}`);
      const responseData = response.data.user;
      setUserData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axios.get(`${API}/api/getimagebyid?user=${user}`);
      const responseData = response.data.user;
      setUserImage(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const CloseEmailModal = () => {
    setIsModal(!isModal);
  };

  const ClosePhoneModal = () => {
    setIsPhoneModal(!isPhoneModal);
  };

  const CloseProfileModal = () => {
    setIsProfileModal(!isProfileModal);
  };

  return (
    <>
      <div className="mx-5 my-6 font-poppins">
        <div className=" flex flex-col mx-6">
          <img
            src={userImage?.image ? userImage.image : Profiles}
            alt="Profile"
            className={`w-40 h-40 ${userImage?.image ? ' rounded-3xl object-cover' : ''}`}
          />
          <button
            className={` text-base  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-40 md:w-40 w-40 py-2.5 my-5 `}
            onClick={() => setIsProfileModal(true)}
          >
            Change Image
          </button>
        </div>
        <div className="my-5">
          <p className="font-extralight text-normal">Personal Information</p>
          <hr className="my-3 border-1 border-gray-600 " />
          <div className="grid grid-cols-12 gap-10 font-poppins text-normal font-extralight my-5 mx-2 text-gray-400">
            <div className="lg:col-span-4 md:col-span-4 col-span-12 ">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                className=" text-white py-3 pe-0 ps-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-gray-400 outline-none  disabled:pointer-events-none"
                placeholder="John"
                defaultValue={userData?.fname || ''}
              />
            </div>
            <div className="lg:col-span-4 md:col-span-4 col-span-12 ">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                className="text-white py-3 pe-0 ps-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-gray-400 outline-none  disabled:pointer-events-none"
                placeholder="Doe"
                defaultValue={userData?.lname || ''}
              />
            </div>
            <div className="lg:col-span-4 md:col-span-4 col-span-12 ">
              <label htmlFor="dob">Date Of Birth</label>
              <input
                type="text"
                className="text-white py-3 pe-0 ps-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-gray-400 outline-none  disabled:pointer-events-none"
                placeholder="25-12-2024"
                defaultValue={userData?.dob || ''}
              />
            </div>
          </div>
        </div>
        <div className="my-8">
          <p className="font-extralight text-normal">Contact Information</p>
          <hr className="my-3 border-1 border-gray-600 " />
          <div className="grid grid-cols-12 gap-10 font-poppins text-normal font-extralight my-5 mx-2 text-white">
            <div className="lg:col-span-4 md:col-span-4 col-span-12 ">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className=" py-3 pe-0 ps-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-white outline-none  disabled:pointer-events-none text-white"
                  placeholder="johndoe@gmail.com"
                  value={localStorage.getItem("email") || ''}
                />
              </div>
              <div className="flex justify-center my-2">
                <button
                  className={` text-base  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center px-10 py-2.5 my-3 `}
                  onClick={() => setIsModal(true)}
                >
                  Update
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 md:col-span-4 col-span-12 ">
              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  className=" py-3 pe-0 ps-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-white outline-none  disabled:pointer-events-none text-white"
                  placeholder="1234567890"
                  value={localStorage.getItem("phone") || ''}
                />
              </div>
              <div className="flex justify-center my-2">
                <button
                  className={` text-base  bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center px-10 py-2.5 my-3 `}
                  onClick={() => setIsPhoneModal(true)}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModal && <UpdateProfile CloseEmailModal={CloseEmailModal} />}
      {isPhoneModal && <UpdatePhone ClosePhoneModal={ClosePhoneModal} />}
      {isProfileModal && <UpdateImage CloseProfileModal={CloseProfileModal} />}
    </>
  );
};

export default Profile;

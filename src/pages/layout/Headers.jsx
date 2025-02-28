import React, { useContext, useEffect, useState } from "react";
import PMCLogo from "../../assets/PMC_Logo.png";
import { IoNotifications } from "react-icons/io5";
import profile from "../../assets/profile.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { API } from "../../Host";
import axios from "axios";
import { ThemeContext } from "../../App";
import { RxHamburgerMenu } from "react-icons/rx";

const Headers = ({ Menus,show }) => {
  const navigate = useNavigate();
  const { global, setGlobal } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notify, setNotify] = useState(false);
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();
  const user = localStorage.getItem("user");

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotification();
    }, 2000);
    return () => clearTimeout(timer);
  }, [refresh, global]);

  const fetchNotification = async () => {
    try {
      const response = await axios.get(`${API}/api/getnotifybyid?user=${user}`);
      const responseData = response.data.notify;
      const reverseData = responseData.reverse();
      const filteredCount = responseData.filter(
        (count) => count.read === "no"
      ).length;
      setNotification(reverseData);
      setCount(filteredCount);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const togglenotify = () => {
    setNotify(!notify);
  };

  const redirectnotify = () => {
    setNotify(!notify);
    setRefresh(!refresh);
    navigate("/notify");
  };

  return (
    <div className="flex justify-between items-center px-3 bg-gradient-to-r from-[#110038] to-[#08006B] z-50 fixed w-full">
      <div className="flex gap-3 items-center">

      
      <img src={PMCLogo} alt="SeekMyCourse" className="lg:w-42 lg:h-14 md:w-42 md:h-14 w-40 h-12 mx-1" />
      {show === 'yes' && (
      <p
        className="text-2xl text-white md:block lg:hidden block"
        onClick={toggleDropdown}
      >
        <RxHamburgerMenu />
      </p>
      )}

      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 top-14 w-full bg-[#200098] text-white shadow-md lg:hidden md:block block">
          <div className="flex gap-2 items-center pt-3 mx-3">
            <img src={profile} alt="User" className="w-14 h-14" />
            <div>
              <p className="text-xl font-extralight">Hello! John Doe</p>
              <p className="text-xs font-extralight pt-1">Subscription: Gold</p>
              <p className="text-xs font-extralight whitespace-nowrap py-1">
                Subscription Expiry: 12/12/26
              </p>
            </div>
          </div>
          <ul className="flex flex-wrap py-5 max-h-[600px] overflow-y-auto  ">
            {Menus.map((menu, index) => (
              <NavLink to={menu.to} onClick={menu.onClick} key={index}>
                <li
                  className={`cursor-pointer text-md flex items-center gap-x-3 p-2 mt-1 pl-3 transition-all duration-700 ${
                    location.pathname === menu.to
                      ? "text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]"
                      : "text-white"
                  }`}
                  onClick={toggleDropdown}
                >
                  <div className="flex items-center gap-x-6 px-2">
                    <img src={menu.icon} alt="icons" className="w-6 h-6" />
                    <span className="font-poppins text-lg flex-1 duration-300 whitespace-nowrap">
                      {menu.title}
                    </span>
                  </div>
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
      )}

      <div className="relative mr-5" onClick={togglenotify}>
        <IoNotifications className="lg:w-7 lg:h-7 md:w-6 md:h-6 w-5 h-5 text-white cursor-pointer" />
        <p className="absolute text-white bg-red-500 rounded-full px-2 -top-2 -right-3 cursor-pointer">
          {" "}
          {count}
        </p>
      </div>
      {notify && (
        <div
          className="absolute text-black right-2 top-10 bg-white w-80 h-fit pt-3 font-poppins font-extralight"
          onClick={() => redirectnotify()}
        >
          <p className="px-2">Notifications</p>
          {notification &&
            notification.slice(0, 3).map((data, index) => (
              <div key={index}>
                <hr />
                <span className=" flex gap-1 justify-between px-3 py-2">
                  <p className="text-normal text-slate-600">
                    <strong>Subject:</strong> {data.subject}
                  </p>
                  <button className="text-sm text-black font-normal ">
                    View
                  </button>
                </span>
              </div>
            ))}
          <button
            className="w-full bg-slate-400 text-lg py-1"
            onClick={redirectnotify}
          >
            See all
          </button>
        </div>
      )}
    </div>
  );
};

export default Headers;

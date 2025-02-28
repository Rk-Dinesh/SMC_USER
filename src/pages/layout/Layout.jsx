import React, { Suspense, useContext, useEffect, useState } from "react";
import Headers from "./Headers";
import profile from "../../assets/profile.png";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Loading from "../../Loading";
import dashoard from "../../assets/dashboard.png";
import course from "../../assets/courses.png";
import generate from "../../assets/generatecourse.png";
import subscription from "../../assets/subscription.png";
import support from "../../assets/support.png";
import faq from "../../assets/faq.png";
import terms from "../../assets/terms.png";
import privacy from "../../assets/privacy.png";
import logout from "../../assets/logout.png";
import bin from "../../assets/bin.png";
import LogOut from "../auth/LogOut";
import DeleteAccount from "../auth/DeleteAccount";
import axios from "axios";
import { API, formatDate1 } from "../../Host";
import { ThemeContext } from "../../App";

const Layout = ({ setIsLoggedIn }) => {
  const { global, setGlobal } = useContext(ThemeContext);
  const location = useLocation();
  const fname = localStorage.getItem("fname");
  const lname = localStorage.getItem("lname");
  const user = localStorage.getItem("user");
  const type = localStorage.getItem("type");
  const [isLogOutModalOpen, setLogOutModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userImage, setUserImage] = useState({});
  const [activeplans, setActiveplans] = useState([]);

  useEffect(() => {
    const fetchSubs = async () => {
      const postURL = API + `/api/getsubsbyid?user=${user}`;
      try {
        const response = await axios.get(postURL);
        setActiveplans(response.data.sub);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubs();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${API}/api/getimagebyid?user=${user}`
        );
        const responseData = response.data.user;
        setUserImage(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    const timer = setTimeout(() => {
      fetchImage();
    }, 2000);
    return () => clearTimeout(timer);
  }, [global]);

  const lastActivePlan =
    activeplans.length > 0 ? activeplans[activeplans.length - 1] : null;

  const calculateExpiryDate = (date) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 30);
    localStorage.setItem("expiry", currentDate);
    return currentDate;
  };

  const Menus = [
    { title: "Dashboard", icon: dashoard, to: "/dashboard" },
    { title: "My Courses", icon: course, to: "/course" },
    { title: "Generate Course", icon: generate, to: "/create" },
    { title: "My Subscription", icon: subscription, to: "/subscription" },
    { title: "My Certificates", icon: subscription, to: "/certificate" },
    { title: "Help & Support ", icon: support, to: "/support" },
    { title: "FAQ", icon: faq, to: "/faq" },
    { title: "Notifications", icon: subscription, to: "/notify" },
    { title: "Terms of Service", icon: terms, to: "/terms" },
    { title: "Privacy Policy", icon: privacy, to: "/policy" },
    { title: "Profile", icon: profile, to: "/profile" },
    {
      title: "Logout",
      icon: logout,
      to: "#",
      onClick: () => setLogOutModalOpen(true),
    },
    {
      title: "Delete Account",
      icon: bin,
      to: "#",
      onClick: () => setDeleteModalOpen(true),
    },
  ];

  const handleCloseModal = () => {
    setLogOutModalOpen(false);
  };

  const handleDeleteCloseModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <div className="">
      <Headers Menus={Menus} show={'yes'} />
      <div className="flex w-full h-screen  pt-14 font-poppins   ">
        <div className="w-2/12  bg-[#200098] text-white lg:block md:hidden hidden overflow-auto  ">
          <div className="flex gap-2 items-center pt-3 flex-wrap justify-center ml-2 ">
            <img
              src={userImage?.image ? userImage.image : profile}
              alt="Profile"
              className={`w-14 h-14 ${
                userImage?.image ? " rounded-xl object-cover" : ""
              }`}
            />
            <div className="mx-1">
              <p className="text-xl font-extralight">
                {`Hello! ${fname} ${lname}`}{" "}
              </p>
              <p className="text-xs font-extralight pt-1">
                Subscription : {type}
              </p>
              {lastActivePlan ? (
                <p className="text-xs font-extralight whitespace-nowrap py-1">
                  Subscription Expiry :{" "}
                  {formatDate1(calculateExpiryDate(lastActivePlan.date))}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className=" my-1 ">
            <ul className="pt-2">
              {Menus.map((menu, index) => (
                <React.Fragment key={index}>
                  <NavLink to={menu.to} onClick={menu.onClick}>
                    <li
                      className={` cursor-pointer text-md flex items-center gap-x-3 p-1.5 mt-1 pl-4 transition-all duration-700 hover:bg-gradient-to-r from-[#110038] to-[#08006B] font-extralight   ${
                        location.pathname === menu.to
                          ? "bg-gradient-to-r from-[#110038] to-[#08006B]  transition-all duration-500"
                          : " "
                      }`}
                    >
                      <div className="flex items-center gap-x-3 ">
                        <img src={menu.icon} alt="icons" className="w-4 h-4" />
                        <span
                          className={`font-poppins text-lg flex-1 duration-300 `}
                        >
                          {menu.title}
                        </span>
                      </div>
                    </li>
                  </NavLink>
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
        <div className=" lg:w-10/12 md:w-full w-full bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] text-white overflow-auto ">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
      {/* <footer className="bg-gradient-to-r from-[#110038] to-[#08006B] py-3 px-6">
        <p className=" text-white text-sm  lg:text-end md:text-end text-center font-extralight  ">
          &#169; SeekMyCourse Developed with{" "}
          <span className="text-red-700">&#x2764;</span> by SeenIT Pty Ltd
        </p>
      </footer> */}
      {isLogOutModalOpen && (
        <LogOut
          handleCloseModal={handleCloseModal}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteAccount
          handleDeleteCloseModal={handleDeleteCloseModal}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </div>
  );
};

export default Layout;

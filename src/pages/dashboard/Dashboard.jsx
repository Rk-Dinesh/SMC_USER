import React, { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "./style.css";
import assest from "../../assets/assest.png";
import { useNavigate } from "react-router-dom";
import { API, formatDate1 } from "../../Host";
import axios from "axios";
import { PieChart, Pie, ResponsiveContainer, Cell,Legend } from 'recharts';

const Dashboard = () => {
  const userId = localStorage.getItem("user");
  const packagename = localStorage.getItem("type");
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState(0)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCourses = async () => {
      const postURL = API + `/api/courses?userId=${userId}`;
      try {
        const response = await axios.get(postURL);
        setCourses(response.data);
        setProcessing(false);
      } catch (error) {
        //fetchUserCourses();
      }
    };

    fetchUserCourses();
    fetchSubscriptionPlan();
  }, []);

  const fetchSubscriptionPlan = async () => {
    try {
      const response = await axios.get(`${API}/api/getsubscriptionplan`);
      const responseData = response.data.plans;
      const filteredPlan = responseData.find(plan => plan.packagename === packagename);
  
      if (filteredPlan) {
        setPlans(filteredPlan.course);
       
        
      } else {
        //console.log("No matching plan found for the given package name.");
        setPlans(10); 
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    }
  };

  const data02 = [
    { name: 'Image', value: (courses && courses.length > 0) ? 
      courses.filter((course) => course.type === "text & image course").length : 0 },
    { name: 'Video', value: (courses && courses.length > 0) ? 
      courses.filter((course) => course.type === "video & text course").length : 0 },
];
  
  const COLORS = ['#ffffff'];

  const handleCourse = (content, mainTopic, type, courseId, completed, end) => {
    const jsonData = JSON.parse(content);
    localStorage.setItem("courseId", courseId);
    localStorage.setItem("first", completed);
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
    let ending = "";
    if (completed) {
      ending = end;
    }
    navigate("/content", {
      state: {
        jsonData: jsonData,
        mainTopic: mainTopic.toUpperCase(),
        type: type.toLowerCase(),
        courseId: courseId,
        end: ending,
      },
    });
  };

  const redirectcourse = () => {
    navigate("/course");
  };

const currentDate = new Date();
const currentMonth = currentDate.getMonth(); 
const currentYear = currentDate.getFullYear(); 

const coursesThisMonthCount = courses.filter((course) => {
  const courseDate = new Date(course.date);
  return (
    courseDate.getMonth() === currentMonth &&
    courseDate.getFullYear() === currentYear
  );
}).length;

const completedThisMonthCount = courses.filter((course) => {
  const courseDate = new Date(course.date);
  return (
    course.completed &&
    courseDate.getMonth() === currentMonth &&
    courseDate.getFullYear() === currentYear
  );
}).length;

const ActiveThisMonthCount = courses.filter((course) => {
  const courseDate = new Date(course.date);
  return (
    course.completed === false &&
    courseDate.getMonth() === currentMonth &&
    courseDate.getFullYear() === currentYear
  );
}).length;




  return (
    <div className=" mx-5 my-6 font-poppins font-extralight">
      <div className="flex gap-4 flex-wrap ">
        <div className="lg:w-52 lg:h-56 md:w-48 md:h-56 w-full h-52 bg-black my-1 lg:mx-0 ">
          <p className="mx-3 text-normal text-center mt-6">
            Total Courses Generated{" "}
          </p>
          <p className="text-center lg:text-7xl md:text-7xl text-7xl my-4">
            {courses && courses.length}
          </p>
          <button
            className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2.5 "
            onClick={redirectcourse}
          >
            View
          </button>
        </div>
        <div className="lg:w-52 lg:h-56 md:w-48 md:h-56 w-full h-52 bg-black  my-1">
          <p className="mx-3 text-normal text-center mt-6">
            Video Courses Generated{" "}
          </p>
          <p className="text-center lg:text-7xl md:text-7xl text-7xl my-4">
            {courses &&
              courses.filter((course) => course.type === "video & text course")
                .length}
          </p>
          <button
            className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2.5 "
            onClick={redirectcourse}
          >
            View
          </button>
        </div>
        <div className="lg:w-52 lg:h-56 md:w-48 md:h-56 w-full h-52 bg-black  my-1">
          <p className="mx-3 text-normal text-center mt-6 ">
            Theory Courses Generated{" "}
          </p>
          <p className="text-center lg:text-7xl md:text-7xl text-7xl my-4">
            {courses &&
              courses.filter((course) => course.type === "text & image course")
                .length}
          </p>
          <button
            className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2.5 "
            onClick={redirectcourse}
          >
            View
          </button>
        </div>
        <div className="lg:w-52 md:w-48 w-full h-56 bg-black  my-1">
          <p className="mx-3 text-normal text-center mt-8 ">Active Courses </p>
          <p className="text-center lg:text-7xl md:text-7xl text-7xl my-6">
            {courses &&
              courses.filter((course) => course.completed === false).length}
          </p>
          <button
            className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2.5 "
            onClick={redirectcourse}
          >
            View
          </button>
        </div>
        <div className="lg:w-52 md:w-48 w-full h-56 bg-black  my-1">
          <p className="mx-3 text-normal text-center mt-8 ">
            Completed Courses{" "}
          </p>
          <p className="text-center lg:text-7xl md:text-7xl text-7xl my-6">
            {courses &&
              courses.filter((course) => course.completed === true).length}
          </p>
          <button
            className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2.5  "
            onClick={redirectcourse}
          >
            View
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 ">
      <div className="my-6 lg:col-span-6 md:col-span-6 col-span-12">
        <p className="text-lg my-3">Monthly Activity Progress</p>
        <span>
          <p className="w-3/4 text-end mx-4 text-xl">{coursesThisMonthCount}/{plans}</p>
          <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700 mx-5">
            <div
              className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] h-4 rounded-full"
              style={{ width: `${(coursesThisMonthCount / plans) * 100}%` }} 
            ></div>
          </div>
          <p className="mx-6 text-sm">Courses Generated this month</p>
        </span>
        <span>
          <p className="w-3/4 text-end mx-4 text-xl">{ActiveThisMonthCount}/{plans}</p>
          <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700 mx-5">
            <div
              className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] h-4 rounded-full"
              style={{ width: `${(ActiveThisMonthCount / plans) * 100}%` }}
            ></div>
          </div>
          <p className="mx-6 text-sm">Active Courses this month</p>
        </span>
        <span>
          <p className="w-3/4 text-end mx-4 text-xl">{completedThisMonthCount}/{plans}</p>
          <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700 mx-5">
            <div
              className="bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] h-4 rounded-full"
              style={{ width: `${(completedThisMonthCount / plans) * 100}%` }}
            ></div>
          </div>
          <p className="mx-6 text-sm">Completed Courses this month</p>
        </span>
      </div>
      <div className='lg:col-span-6 md:col-span-6 col-span-12 my-6' style={{ width: '100%', height: '300px' }}>
        <p  className="text-lg ">Course Type</p>
      <ResponsiveContainer>
        <PieChart>
          <defs>
            <linearGradient id="gradientColor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3D03FA" />
              <stop offset="100%" stopColor="#A71CD2" />
            </linearGradient>
          </defs>
          <Pie
            data={data02}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={1} 
            label
            stroke="none"
          >
            {data02.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? 'url(#gradientColor)' : COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend/>
        </PieChart>
      </ResponsiveContainer>
    </div>
      </div>
      <p className="text-lg mt-2 ">Recent Courses</p>
      <div className="flex gap-4 flex-wrap">
        {courses.slice(-4).map((data, index) => (
          <div className="lg:w-52 md:w-52 w-full h-60 bg-black my-8" key={index}>
            <img src={data.photo} alt="Image" className="w-full h-40" />
            <p className="text-lg mx-2 my-0.5 truncate">{data.mainTopic}</p>
            <p className="text-sm mx-2 my-0.5">{data.type}</p>
            <p className="text-sm mx-2 mb-1">{formatDate1(data.date)}</p>
            <button
              className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-1.5 "
              onClick={() => handleCourse(data.content, data.mainTopic, data.type, data._id, data.completed, data.end)}
            >
              Continue
            </button>
          </div>
        ))}
      </div>     
    </div>
  );
};

export default Dashboard;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API, formatDate1 } from "../../Host";

const Certificate = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user");
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchUserCourses = async () => {
      const postURL = API + `/api/courses?userId=${userId}`;
      try {
        const response = await axios.get(postURL);
        setCourses(response.data);
      } catch (error) {
       // fetchUserCourses();
      }
    };

    fetchUserCourses();
  }, []);

  const handleCertificate = (mainTopic, end) => {
    const ending = new Date(end).toLocaleDateString();
    navigate("/viewcertificate", {
      state: { courseTitle: mainTopic, end: ending },
    });
  };

  const filteredCourses = courses.filter(
    (certify) =>
      certify.completed === true &&
      certify.mainTopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-4 my-6 font-poppins">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="text-lg font-extralight">My Certificates</p>
        <div className="flex items-center gap-3 bg-white w-96 px-6 py-1.5 rounded-md mr-3">
          <FaSearch className="text-black text-xl" />
          <input
            type="text"
            placeholder="Search By Topic Name"
            className="bg-transparent w-full outline-none text-center font-extralight text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <hr className="my-2" />
      {filteredCourses.reverse().map((certify, index) => (
        <div key={index}>
          <div
            className="flex justify-between mx-2 flex-wrap font-extralight"
            
          >
            <div className="flex flex-col gap-1">
              <p className="text-lg">Topic Name : {certify.mainTopic}</p>
              <p>Start Date : {formatDate1(certify.date)}</p>
              <p>End Date : {formatDate1(certify.end)}</p>
            </div>
            <div>
              <button
                className={`text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-48 py-2 my-5`}
                onClick={() =>
                  handleCertificate(certify.mainTopic, certify.end)
                }
              >
                View Certificate
              </button>
            </div>
          </div>
          <hr className="my-3 " />
        </div>
      ))}
    </div>
  );
};

export default Certificate;

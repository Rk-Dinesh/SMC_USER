import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API, formatDate1 } from "../../Host";

const Subscription = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user");
  const [activeplans, setActiveplans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubs = async () => {
      const postURL = API + `/api/getsubsbyid?user=${userId}`;
      try {
        const response = await axios.get(postURL);
        setActiveplans(response.data.sub);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubs();
  }, [userId]);

  const redirectinvoice = () => {
    navigate("/invoice");
  };

  const redirectPricing = () => {
    navigate("/pricing");
  };

  const lastActivePlan =
    activeplans.length > 0 ? activeplans[activeplans.length - 1] : null;

    const calculateExpiryDate = (date,duration) => {
      const daysToAdd = {
        monthly: 30,
        quarterly: 90,
        halfYearly: 180,
        annual: 365
      }[duration] || 30;
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() + daysToAdd);
      return currentDate;
    };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter active plans based on the search query
  const filteredPlans = activeplans.filter((plan) =>
    plan.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-5 my-6 font-poppins font-extralight">
      <div className="max-w-sm h-auto bg-black pt-2 my-5">
        {lastActivePlan ? (
          <>
            <p className="text-2xl mx-5">Active Subscription</p>
            <p className="text-normal mx-5">
              Subscription : {lastActivePlan.plan}
            </p>
            <p className="text-normal mx-5">
              Subscription Expiry :{" "}
              {formatDate1(calculateExpiryDate(lastActivePlan.date, lastActivePlan.duration))}
            </p>
            <p className="text-normal mx-5 mb-2">
              No Of Courses : {lastActivePlan.course}
            </p>
            <button
              className={`text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2`}
              onClick={redirectPricing}
            >
              Change / Upgrade Plan
            </button>
          </>
        ) : (
          <>
            <p className="text-2xl mx-5">Active Subscription</p>
            <p className="text-normal mx-5">Subscription : Free</p>
            <p className="text-normal mx-5 mb-2">No Of Courses : 1</p>
            <button
              className={`text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2`}
              onClick={redirectPricing}
            >
              Change / Upgrade Plan
            </button>
          </>
        )}
      </div>
      <div className="flex justify-between items-center flex-wrap gap-3 my-2 mx-3">
        <p className="text-lg font-normal">Subscription History</p>
        <div className="flex items-center gap-3 bg-white w-96 px-6 py-1.5 rounded-md mr-3">
          <FaSearch className="text-black text-xl" />
          <input
            type="text"
            placeholder="Search By Date/ Plan Name"
            className="bg-transparent w-full outline-none text-center font-extralight text-black"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <hr className="my-2" />
      {filteredPlans.map((plan, index) => (
        <div key={index}>
          <div className="flex justify-between mx-2 flex-wrap" >
            <div className="flex flex-col gap-0 .5">
              <p className="text-xl">Subscription : {plan.plan}</p>
              <p>Subscription Start Date : {formatDate1(plan.date)}</p>
              <p>
                Subscription End Date :{" "}
                {formatDate1(calculateExpiryDate(plan.date,plan.duration))}
              </p>
              <p>No Of Courses Generated : {plan.course} </p>
            </div>
            <div>
              <button
                className={`text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-48 py-2 my-5 font-normal`}
                onClick={redirectinvoice}
              >
                View Invoice
              </button>
            </div>
          </div>
          <hr className="my-3" />
        </div>
      ))}
    </div>
  );
};

export default Subscription;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { API } from "../../Host";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const countryCode = localStorage.getItem('countryCode')

  useEffect(() => {
    fetchSubscriptionPlan();
  }, []);

  const fetchSubscriptionPlan = async () => {
    try {
      const response = await axios.get(`${API}/api/getsubscriptionplan`);
      const responseData = response.data.plans;
      setPlans(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 m-8">
      {plans &&
        plans.map((plan, index) => (
          <div
            className="lg:col-span-3 md:col-span-4 col-span-12 font-poppins font-extralight"
            key={index}
          >
            <div className="flex flex-col p-6 text-center text-white bg-[#000928]   shadow outline-none">
              <h3 className="mb-2 text-xl">{plan.packagename}</h3>
              <div className="flex justify-center items-baseline my-2">
                <span className="mr-2 text-2xl font-semibold"> {countryCode === "91"
                  ? `₹${plan.inr}`
                  : `$${plan.price}`}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" className="mb-8 space-y-1 text-left">
                <li className="flex items-center space-x-3">
                  {plan.course === "1" ? (
                    <span>Generate 1 free course</span>
                  ) : (
                    <span>Generate {plan.course} Courses/month</span>
                  )}
                </li>
                <li className="flex items-center space-x-3">
                  <span>Up to {plan.subtopic} subtopics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span>AI Teacher</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span>Theory & Image Course</span>
                </li>
                <li
                  className={`flex items-center space-x-3 ${
                    plan.coursetype === "Video & Text Course"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <span>Theory & Video Course </span>
                </li>
              </ul>
              <button
                className="text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-full py-2 "
                onClick={() => {
                  navigate("/payment", {
                    state: {
                      usd: plan.price,
                      inr:plan.inr,
                      receipt:plan.packagename,
                      course:plan.course,
                      planId:plan.stripeId,
                      tax:plan.tax,
                    },
                  });
                }}
              >
                Get started
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Pricing;

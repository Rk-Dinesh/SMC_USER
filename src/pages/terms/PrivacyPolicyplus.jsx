import React, { useEffect, useState } from "react";
import { API } from "../../Host";
import axios from "axios";
import StyledText from "../../components/StyledText";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/PMC_Logo.png";


const PrivacyPolicyplus = () => {
  const [policy, setPolicy] = useState({});
   const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicy = async () => {
      const postURL = API + `/api/policies`;
      try {
        const response = await axios.get(postURL);
        const responseData = response.data.data;

        setPolicy(responseData);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchPolicy();
  }, []);

  const redirectSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] text-white  h-screen overflow-auto">
      <div className="flex justify-between items-center mx-4">
        <img src={Logo} alt="Logo" className="w-1/4" />
        <button
          className="text-xl bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 h-14 "
          onClick={redirectSignUp}
        >
          SignUp
        </button>
      </div>
      <div className="mx-5 py-6 font-poppins font-extralight">
        <p className="text-2xl font-semibold">Privacy Policy</p>
        <hr className="my-2 " />
        {policy?.privacy !== "" ? (
          <StyledText text={policy.privacy} />
        ) : (
          <p className="text-center mt-8 text-white text-xl">No Privacy Policy Found</p>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyplus;

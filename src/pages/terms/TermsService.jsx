import React, { useEffect, useState } from "react";
import StyledText from "../../components/StyledText";
import { API } from "../../Host";
import axios from "axios";

const TermsService = () => {
  const [policy, setPolicy] = useState({});

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
  return (
    <div className="bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] text-white">
      <div className="mx-5 py-3 font-poppins font-extralight">
        <p className="text-lg">Terms of Service</p>
        <hr className="my-2 " />
        {policy?.terms !== "" ? (
          <StyledText text={policy.terms} />
        ) : (
          <p className="text-center mt-8">No Terms & Conditions Found</p>
        )}
      </div>
    </div>
  );
};

export default TermsService;

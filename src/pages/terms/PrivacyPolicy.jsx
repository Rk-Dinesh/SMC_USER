import React, { useEffect, useState } from "react";
import { API } from "../../Host";
import axios from "axios";
import StyledText from "../../components/StyledText";

const PrivacyPolicy = () => {
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
      <div className="mx-5 py-6 font-poppins font-extralight">
        <p className="text-lg">Privacy Policy</p>
        <hr className="my-2 " />
        {policy?.privacy !== "" ? (
          <StyledText text={policy.privacy} />
        ) : (
          <p className="text-center mt-8">No Privacy Policy Found</p>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;

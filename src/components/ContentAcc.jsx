import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const ContentAcc = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="accordion-item ">
      <div
        className={`accordion-title flex items-center justify-between p-1 cursor-pointer px-5 font-poppins font-extralight ${isActive === true ? 'bg-gradient-to-r from-[#110038] to-[#08006B]' : ''}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div>{title}</div>
        <FaCaretDown className={`text-4xl ${isActive ? " rotate-180 " : ""}`} />
      </div>
      {isActive && (
        <div className="accordion-content text-white font-poppins font-extralight p-0.5 mx-3">
          <p>{content[0]}</p>
          <p>{content[1]}</p>
          <p>{content[2]}</p>
          <p>{content[3]}</p>
          <p>{content[4]}</p>
          <p>{content[5]}</p>
        </div>
      )}
    </div>
  );
};

export default ContentAcc;

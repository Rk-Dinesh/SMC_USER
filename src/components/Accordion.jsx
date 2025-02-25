import React, { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa';

const Accordion = ({ title, content }) => {
    const [isActive, setIsActive] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-title flex items-center justify-between p-1 cursor-pointer mx-3 font-poppins font-extralight" onClick={() => setIsActive(!isActive)}>
        <div>{title}</div>
        <FaCaretDown
                  className={`text-4xl ${
                   isActive ? " rotate-180 " : ""
                  }`}
                />
      </div>
      {isActive && <div className="accordion-content text-white font-poppins font-extralight p-2 mx-3">{content}</div>}
      <hr className="my-2 " />
    </div>
  )
}

export default Accordion
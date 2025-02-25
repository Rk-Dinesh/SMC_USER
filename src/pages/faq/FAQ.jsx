import React, { useEffect, useState } from "react";
import Accordion from "../../components/Accordion";
import axios from "axios";
import { API } from "../../Host";

const FAQ = () => {
  const [Accdata, setAccdata] = useState([]);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await axios.get(`${API}/api/getfaq`);
        const responseData = response.data.faq;

        setAccdata(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFAQ();
  }, []);

  return (
    <div className="mx-4 my-6 font-poppins">
      <div className="flex justify-between items-center flex-wrap gap-3 mx-2">
        <p className="text-lg font-extralight">FAQ</p>
      </div>
      <hr className="my-2 " />
      {Accdata &&
        Accdata.map(({ title, content }, index) => (
          <Accordion key={index} title={title} content={content} />
        ))}
    </div>
  );
};

export default FAQ;

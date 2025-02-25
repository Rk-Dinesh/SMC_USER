import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { API, formatDate } from "../../Host";
import { ThemeContext } from "../../App";

const Notification = () => {
  const {global,setGlobal} = useContext(ThemeContext);
  const user = localStorage.getItem("user");
  const [notify, setNotify] = useState([]);


  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(
          `${API}/api/getnotifybyid?user=${user}`
        );
        const responseData = response.data.notify;
        const reverseData = responseData.reverse();
        setNotify(reverseData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchNotificationUpdate = async () => {
      try {
        const response = await axios.put(
          `${API}/api/updatenotify?user=${user}`
        );
        setGlobal(!global)
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotification();
    fetchNotificationUpdate();
  }, []);

  return (
    <div className="mx-5 my-6 font-poppins font-extralight">
      <p className="text-lg">Notifications</p>
      <hr className="my-2 " />
      {notify &&
        notify.map((data, index) => (
          <div className="my-5" key={index}>
            <p>
              <span className="font-normal">Date :</span>{" "}
              {formatDate(data.createdAt)}
            </p>
            <p>
              <span className="font-normal">Subject :</span> {data.subject}
            </p>
            <p className="my-3">
              <span className="font-normal">Description :</span>{" "}
              {data.description}
            </p>
            <hr className="my-4 " />
          </div>
        ))}
    </div>
  );
};

export default Notification;

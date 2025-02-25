import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API, formatDate1 } from "../../Host";

const HelpSupport = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user  = localStorage.getItem('user')

  const redirectnewticket = () => {
    navigate("/newticket");
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${API}/api/getticketuserbyid?user=${user}`);
      const responseData = await response.data.ticket;
      const reverseData = responseData.reverse()      
      setTicket(reverseData);
    } catch (error) {
      console.log(error);
    }
  };


  const filteredTickets = ticket.filter(t => 
    t.ticketId.toString().includes(searchQuery) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-4 my-6 font-poppins">
      <button
        className={`text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-52 py-2.5 my-5`}
        onClick={redirectnewticket}
      >
        Raise Ticket
      </button>
      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="text-lg font-extralight">Your Support Tickets</p>
        <div className="flex items-center gap-3 bg-white w-96 px-6 py-1.5 rounded-md mr-3">
          <FaSearch className="text-black text-xl" />
          <input
            type="text"
            placeholder="Search By Date/Ticket #"
            className="bg-transparent w-full outline-none text-center font-extralight text-black"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>
      <hr className="my-2" />
      {filteredTickets.map((ticket, index) => (
        <div key={index}>
        <div className="flex justify-between mx-2 flex-wrap" >
          <div className="flex flex-col gap-1">
            <p>Ticket No: {ticket.ticketId}</p>
            <p>Category: {ticket.category}</p>
            <p>Date: {formatDate1(ticket.createdAt)}</p>
            <p>
              Status:{" "}
              <span
                className={`px-3 rounded-md ${
                  ticket.status === "New Ticket"
                    ? "bg-green-700"
                    : ticket.status === "In Progress"
                    ? "bg-yellow-500"
                    : ticket.status === "On Hold"
                    ? "bg-red-400"
                    : "bg-blue-400"
                }`}
              >
                {ticket.status}
              </span>
            </p>
          </div>
          <div>
            <button
              className={`text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-48 py-2 my-5`}
              onClick={() =>
                navigate(`/viewticket`, {
                  state: { ticketId: ticket.ticketId },
                })
              }
            >
              View Ticket
            </button>
          </div>
        </div>
        <hr className="my-3 " />
        </div>
      ))}
    </div>
  );
};

export default HelpSupport;
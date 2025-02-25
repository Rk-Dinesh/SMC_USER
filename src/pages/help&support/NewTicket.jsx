import React, { useContext, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import { ThemeContext } from "../../App";

const ticketSchema = yup.object().shape({
  category: yup
    .string()
    .test(
      "not-select",
      "Please select an Category",
      (value) => value !== "" && value !== "Select  Category"
    ),
  subject: yup.string().required("subject is required"),
  desc1: yup.string().required("Description is required"),
  priority: yup
    .string()
    .test(
      "not-select",
      "Please select an Priority",
      (value) => value !== "" && value !== "Select  Priority"
    ),
});

const NewTicket = () => {
  const { global, setGlobal } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [priority, setPriority] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ticketSchema),
  });

  useEffect(() => {
    fetchCategory();
    fetchPriorty();
  }, []);

  const OnSubmit = async (data) => {
    const formData = {
      ...data,
      user: localStorage.getItem("user"),
      fname: localStorage.getItem("fname"),
      lname: localStorage.getItem("lname"),
      email: localStorage.getItem("email"),
      phone: localStorage.getItem("phone"),
    };

    try {
      setProcessing(true);
      const response = await axios.post(`${API}/api/ticket`, formData);
      if (response.status === 200) {
        const ticketId = response.data.Ticket;
        toast.success("Ticket Raised");
        selectedFiles.length > 0 ? setProcessing(true) : setProcessing(false);
        if (selectedFiles.length > 0) {
          const ticketId = response.data.Ticket;
          const uploadData = new FormData();
          uploadData.append("user", localStorage.getItem("user"));
          uploadData.append("ticketId", ticketId);
          uploadData.append("createdby", "user");
          selectedFiles.forEach((file) => {
            uploadData.append("files", file);
          });

          const uploadResponse = await axios.post(`${API}/post`, uploadData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (uploadResponse.status === 200) {
            toast.success("Files uploaded successfully");
            setProcessing(false);
          } else {
            toast.error("Failed to upload files");
          }
        }
        const formData = {
          user: localStorage.getItem("user"),
          subject: ` Ticket Confirmation`,
          description: `Your ticket ${ticketId} has been received. We'll be in touch soon! Thank you for contacting support. Here are some resources that might help while you wait: https://helpcenter.SeekMyCourseai.support`,
        };
        await axios.post(`${API}/api/notify`, formData);
        setGlobal(!global);
        navigate("/support");
      } else {
        toast.error("Failed to raise ticket");
        setProcessing(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
      setProcessing(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${API}/api/getcategory`);
      const responseData = await response.data.cate;
      setCategory(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPriorty = async () => {
    try {
      const response = await axios.get(`${API}/api/getpriority`);
      const responseData = await response.data.priority;
      setPriority(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="font-poppins font-extralight my-5 lg:mx-6 md:mx-6 mx-2">
      <p className="text-center ">Raise Ticket</p>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <div className="grid grid-cols-12 gap-1 mt-8 mx-3">
          <div className="lg:col-span-6 md:col-span-6 col-span-12 ">
            <div className="flex flex-col">
              <label htmlFor="" className="my-1 font-normal">
                Select Category <span className="text-red-700">*</span>
              </label>
              <div className="relative inline-block lg:w-3/4 md:w-3/4 w-full">
                <select
                  className="block w-full text-black px-3 py-2 pr-10 outline-none rounded-lg cursor-pointer "
                  {...register("category")}
                >
                  <option value="" hidden>
                    Select Category
                  </option>
                  {category &&
                    category.map((cate, index) => (
                      <option key={index} value={cate.category}>
                        {cate.category}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 bg-gray-300 px-4 rounded-lg pointer-events-none outline-none">
                  <FaCaretDown className="text-black text-2xl" />
                </div>
              </div>
            </div>
            <p className="text-red-300 mt-3">{errors.category?.message}</p>
            <div className="flex flex-col py-8 gap-1 ">
              <label htmlFor="subject" className="font-normal">
                Subject <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Subject"
                {...register("subject")}
                className="py-2 px-4  rounded-md  text-black shadow-md outline-none lg:w-3/4 md:w-3/4 w-full"
              />
              <p className="text-red-300 mt-3">{errors.subject?.message}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="desc" className="font-normal">
                Description <span className="text-red-700">*</span>
              </label>
              <textarea
                name=""
                id=""
                rows={8}
                className="lg:w-3/4 md:w-3/4 w-full text-black p-3 rounded-3xl outline-none"
                placeholder="Describe your issue"
                {...register("desc1")}
              ></textarea>
              <p className="text-red-300 mt-3">{errors.desc1?.message}</p>
            </div>
            <div className="my-5 font-normal flex flex-col">
              <label htmlFor="file-input">
                Attachments (you can select multiple files)
              </label>
              <div className="relative my-1 lg:w-3/4 md:w-3/4 w-full bg-white rounded-lg">
                <label className="block ">
                  <span className="sr-only">Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    id="file-input"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(e) =>
                      setSelectedFiles(Array.from(e.target.files))
                    }
                  />
                </label>
                <p
                  className="bg-gray-300 text-black w-2/6 py-1.5 text-center rounded-md"
                  htmlFor="file-input"
                  onClick={openFileDialog}
                >
                  Choose Files
                </p>

                <span
                  className="absolute top-1/2 -translate-y-1/2 lg:right-4 md:right-4 right-16 text-normal text-black "
                  id="file-name"
                >
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} Files Selected`
                    : "No Files Chosen"}
                </span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 md:col-span-6 col-span-12">
            <div className="flex flex-col">
              <label htmlFor="" className="my-1 font-normal">
                Select Priority <span className="text-red-700">*</span>
              </label>
              <div className="relative inline-block lg:w-3/4 md:w-3/4 w-full">
                <select
                  className="block w-full text-black px-3 py-2 pr-10 outline-none rounded-lg cursor-pointer "
                  {...register("priority")}
                >
                  <option value="" hidden>
                    Select Priority
                  </option>
                  {priority &&
                    priority.map((priority, index) => (
                      <option key={index} value={priority.priority}>
                        {priority.priority}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-5 bg-gray-300 px-4 rounded-lg pointer-events-none outline-none">
                  <FaCaretDown className="text-black text-2xl" />
                </div>
              </div>
              <p className="text-red-300 mt-3">{errors.priority?.message}</p>
            </div>
            <div className="block text-center  lg:mr-36 md:mr-36 mx-auto">
              <button
                className={` text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]   px-6 py-2.5 my-5 cursor-pointer `}
              >
                {processing ? (
                  <span className="flex justify-center gap-3">
                    {" "}
                    <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                    <p>Creating a Ticket....</p>
                  </span>
                ) : (
                  "Raise a Ticket"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;

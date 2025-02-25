import React, { useState } from "react";
import Logo from "../../assets/PMC_Logo.png";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import cover from "../../assets/bgimage.png";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";

const UserSchema = yup.object().shape({
  fname: yup.string().required("fname is required"),
  lname: yup.string().required("lname is required"),
  // phone: yup.number().required("Phone Number is required"),
  email: yup.string().email().required("Email Id  is required"),
  dob: yup.string().required("Date of birth is required"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data.dialCode);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserSchema),
  });

  const onSubmit = async (data) => {
    if (!isCheckboxChecked) {
      toast.error("Please accept the terms and privacy policies to continue.");
      return;
    }

    const localPhone = phone.slice(countryCode.length);
    const formData = {
      ...data,
      phone: localPhone,
      type: "free",
      company: "seenIt",
    };
    try {
      setProcessing(true);
      const response = await axios.post(`${API}/api/usersignup`, formData);
      if (response.status === 200) {
        const newuser = response.data.userId._id;
        toast.success("Account Created Successfully");
        const formData = {
          user: newuser,
          subject: `Welcome message`,
          description: `Welcome to Pick My Course! Start creating your personalized learning journey today.`,
        };
        await axios.post(`${API}/api/notify`, formData);
        setProcessing(false);
        navigate("/");
      } else {
        toast.error("Failed To Upload");
        setProcessing(false);
        console.log("Error in posting Data");
      }
    } catch (error) {
      console.log(error);
      toast.error("User Already exists");
      setProcessing(false);
    }
  };

  const redirectTrems = () => {
    navigate("/termsplus");
  };

  const redirectprivacy = () => {
    navigate("/policyplus");
  };

  return (
    <div className="bg-[#300080] h-screen flex justify-center items-center font-poppins text-white  ">
      <div className="w-[430px] mx-1  bg-[#200098]  px-4 py-1 flex flex-col justify-center shadow-black shadow-lg relative">
        <img
          src={cover}
          alt="Image"
          className="absolute top-2 right-1 w-[420px] opacity-20"
        />
        <form className="z-0" onSubmit={handleSubmit(onSubmit)}>
          <img src={Logo} alt="Logo" className="w-full " />
          <p className="text-center text-lg my-2">Create an account</p>
          <div className="flex flex-col gap-1 mx-4 my-2 font-extralight">
            <label htmlFor="fname">
              First Name<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g John"
              {...register("fname")}
              className="py-2  rounded-md px-4 text-black shadow-md outline-none"
            />
            <p className="text-center text-red-300">{errors.fname?.message}</p>
            <label htmlFor="lname">
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g Doe"
              {...register("lname")}
              className="py-2 px-4 rounded-md  text-black shadow-md outline-none"
            />
            <p className="text-center text-red-300">{errors.lname?.message}</p>
            <label htmlFor="phone">
              Phone <span className="text-red-600">*</span>
            </label>

            <PhoneInput
              country={"in"}
              value={phone}
              onChange={handlePhoneChange}
              className="w-full py-1 text-black font-poppins font-extralight rounded-md shadow-md outline-none bg-white "
              inputStyle={{
                border: "none",
                textAlign: "",
                fontSize: "16px",
                marginLeft: "34px",
              }}
              placeholder="9999999999"
              buttonStyle={{
                width: "70px",
                borderRadius: "8px",
                marginLeft: "10px",
                border: "none",
                background: "white",
              }}
            />

            <label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              {...register("email")}
              className="py-2  rounded-md text-center text-black  shadow-md outline-none"
            />
            <p className="text-center text-red-300">{errors.email?.message}</p>
            <label htmlFor="dob">
              Date of Birth <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              placeholder="dd/mm/yy"
              {...register("dob")}
              className="py-2 px-4  rounded-md text-center text-black shadow-md outline-none"
            />
            <p className="text-center text-red-300">{errors.dob?.message}</p>
            <div className="flex gap-2 items-center my-4">
              <input
                type="checkbox"
                name=""
                id=""
                className="outline-none "
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
              />
              <p className="text-sm font-extralight">
                I agree to the{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={redirectTrems}
                >
                  Terms of Service
                </span>{" "}
                &{" "}
                <span
                  className="text-blue-400 cursor-pointer"
                  onClick={redirectprivacy}
                >
                  Privacy Policy
                </span>
              </p>
            </div>
            <div className="flex justify-center my-1">
              <button
                className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2.5 "
                type="submit"
              >
                {processing ? (
                  <span className="flex justify-center gap-3">
                    {" "}
                    <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                    <p>Creating....</p>
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>

          <p className="text-sm mt-3 text-center font-extralight">
            &#169; SeekMyCourse Developed with{" "}
            <span className="text-red-700">&#x2764;</span> by SeenIT Pty Ltd
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

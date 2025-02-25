import React, { useState } from "react";
import Modal from "../../components/Modal";
import { API } from "../../Host";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

const otpSchema = yup.object().shape({
  otp: yup
    .number()
    .typeError("OTP must be a number")
    .test("len", "OTP must be exactly 6 digits", (val) => val && val.toString().length === 6)
    .required("OTP is required"),
});


const UpdateProfile = ({ CloseEmailModal }) => {
  const phone = localStorage.getItem("phone");
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Validate OTP
  const [processing, setProcessing] = useState(false);
  const [newEmail, setNewEmail] = useState(null);

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  const handleSendOtp = async (data) => {
    setNewEmail(data.email);
    const formData = {
      email: data.email,
      fname: localStorage.getItem("fname"),
      lname: localStorage.getItem("lname"),
    };

    try {
      setProcessing(true);
      const response = await axios.post(`${API}/api/otp`, formData);
      if (response.status === 200) {
        toast.success("OTP sent successfully!");
        setProcessing(false);
        setStep(2); // Move to step 2
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response?.data?.error === "EMAIL_ALREADY_EXISTS") {
        toast.error("This email is already associated with another account.");
        setNewEmail(null);
        CloseEmailModal();
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setProcessing(false);
    }
  };

  const handleValidateOtp = async (data) => {
    const formData = {
      email: newEmail,
      otp: data.otp,
    };

    try {
      setProcessing(true);
      const response = await axios.post(`${API}/api/validate-otp`, formData);
      if (response.status === 200) {
        const updateResponse = await axios.post(
          `${API}/api/emailupdate?phone=${phone}`,
          { email: newEmail }
        );
        if (updateResponse.status === 200) {
          localStorage.setItem("email", newEmail);
          toast.success("Email updated successfully!");
          setNewEmail(null)
          CloseEmailModal();
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error validating OTP:", error);
      if (error.response?.data?.error === "INVALID_OTP") {
        toast.error("Invalid OTP.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      setProcessing(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Modal>
        <div className="w-[550px] min-h-[330px] my-4 mx-8 font-extralight font-poppins">
          <p
            className="text-end text-2xl font-medium"
            onClick={() => CloseEmailModal()}
          >
            x
          </p>
          {step === 1 && (
            <>
              <p className="text-center text-lg my-4">Update Email</p>
              <p className="text-center text-sm lg:mx-12 md:mx-12 mx-4 my-8">
                Enter your new email address. A verification OTP will be sent to
                this email.
              </p>
              <form onSubmit={handleEmailSubmit(handleSendOtp)}>
                <div className="lg:mx-6 md:mx-6 mx-1">
                  <label htmlFor="email" className="text-lg">
                    New Email
                  </label>
                  <input
                    type="text"
                    className={`py-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-gray-400 outline-none my-3 ${
                      emailErrors.email ? "border-red-500" : ""
                    }`}
                    placeholder="johndoe@gmail.com"
                    {...emailRegister("email")}
                  />
                  {emailErrors.email && (
                    <p className="text-red-500 text-sm">
                      {emailErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-center my-8">
                  <button
                    className={`font-normal bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2 ${
                      processing ? "opacity-50 pointer-events-none" : ""
                    }`}
                    type="submit"
                  >
                    {processing ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-center text-lg my-4">Validate OTP</p>
              <p className="text-center text-sm lg:mx-12 md:mx-12 mx-4 my-8">
                Enter the OTP sent to your new email to update your profile.
              </p>
              <form onSubmit={handleOtpSubmit(handleValidateOtp)}>
                <div className="lg:mx-6 md:mx-6 mx-1">
                  <label htmlFor="otp" className="text-lg">
                    OTP
                  </label>
                  <input
                    type="text"
                    className={`py-2 block w-full bg-transparent border-t-transparent border-b border-x-transparent border-b-gray-400 outline-none my-3 ${
                      otpErrors.otp ? "border-red-500" : ""
                    }`}
                    placeholder="Enter OTP"
                    {...otpRegister("otp")}
                  />
                  {otpErrors.otp && (
                    <p className="text-red-500 text-sm">
                      {otpErrors.otp.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-center my-8">
                  <button
                    className={`font-normal bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-48 py-2.5 my-2 ${
                      processing ? "opacity-50 pointer-events-none" : ""
                    }`}
                    type="submit"
                  >
                    {processing ? "Validating..." : "Validate & Update"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UpdateProfile;

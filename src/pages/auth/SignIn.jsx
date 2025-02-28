import React, { useEffect, useState } from "react";
import Logo from "../../assets/PMC_Logo.png";
import { useNavigate } from "react-router-dom";
import cover from "../../assets/bgimage.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../Host";
import { AiOutlineLoading } from "react-icons/ai";

const SignIn = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    };
  }, []);

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data.dialCode);
  };

  const redirectSignUp = () => {
    navigate("/signup");
  };

  const setUpRecaptcha = () => {
    if (window.recaptchaVerifier) {
      return;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA verified");
        },
      }
    );
  };

  const handleSendOtp = async (e) => {
    setProcessing(true);
    e.preventDefault();
    const localPhone = phone.slice(countryCode.length);
    const formData = {
      phone: localPhone,
    };

    try {
      const response = await axios.post(`${API}/api/usersignin`, formData);

      if (response.status !== 200 || !response.data.userId) {
        toast.error("User not found");
        return;
      }

      const responseData = response.data.userId;

      localStorage.setItem("user", responseData._id);
      localStorage.setItem("fname", responseData.fname);
      localStorage.setItem("lname", responseData.lname);
      localStorage.setItem("email", responseData.email);
      localStorage.setItem("phone", responseData.phone);
      localStorage.setItem("type", responseData.type);
      localStorage.setItem("countryCode", countryCode);

      setUpRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith("+") ? phone : "+" + phone;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;

      toast.success("OTP sent successfully!");
      setProcessing(false);
      navigate("/otp");
    } catch (error) {
      console.error("Invalid sign-in process", error);

      if (error.code === "auth/invalid-phone-number") {
        toast.error(
          "Invalid phone number format. Please enter a valid number."
        );
        setProcessing(false);
      } else if (error.code === "auth/quota-exceeded") {
        toast.error("SMS quota exceeded. Try again later.");
        setProcessing(false);
      } else if (error.code === "auth/billing-not-enabled") {
        toast.error(
          "Billing is not enabled in your Firebase project. Please enable it."
        );
        setProcessing(false);
      } else {
        setProcessing(false);
        toast.error("Invalid sign-in process");
      }
    }
  };

  return (
    <div className="bg-[#300080] h-screen flex justify-center items-center font-poppins text-white">
      <div className="lg:w-[430px] md:w-[430px] w-[400px] mx-1 bg-[#200098] p-4 flex flex-col justify-center shadow-black shadow-lg relative">
        <img
          src={cover}
          alt="Image"
          className="absolute top-2 right-1 lg:w-[420px] md:w-[420px] w-[390px] opacity-20"
        />
        <form className="z-0" onSubmit={handleSendOtp}>
          <img src={Logo} alt="Logo" className="w-full" />
          <p className="text-center text-xl my-2">Login</p>
          <div className="flex flex-col gap-3 mx-2 my-4 ">
            <label htmlFor="phone" className="mx-6">
              Phone <span className="text-red-600">*</span>
            </label>
            <div className="lg:w-5/6 md:w-5/6 w-full mx-6 lg:px-0 md:px-0 px-3">
              <PhoneInput
                country={"in"}
                value={phone}
                onChange={handlePhoneChange}
                className="w-full py-1  text-black rounded-md shadow-md outline-none bg-white "
                inputStyle={{
                  border: "none",
                  // textAlign: "center",
                  fontSize: "16px",
                  marginLeft: "4px",
                }}
                placeholder="9999999999"
                buttonStyle={{
                  // background: "linear-gradient(to right, #3D03FA, #A71CD2)",
                  width: "30px",
                  borderRadius: "8px",
                  marginLeft: "10px",
                  border: "none",
                  background: "white",
                }}
              />
            </div>

            <div className="flex justify-center my-6">
              <button
                type="submit"
                className="text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-36 py-2.5"
              >
                {processing ? (
                  <span className="flex justify-center gap-3">
                    {" "}
                    <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                    <p>Verifying....</p>
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
          <p
            className="text-center text-lg my-2 cursor-pointer"
            onClick={redirectSignUp}
          >
            Don't have an account?
          </p>
          <p
            className="text-center text-lg mb-16 cursor-pointer"
            onClick={redirectSignUp}
          >
            Create an account
          </p>
          <p className="text-sm mt-10 text-center font-extralight">
            &#169; SeekMyCourse Developed with{" "}
            <span className="text-red-700">&#x2764;</span>
          </p>
        </form>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default SignIn;

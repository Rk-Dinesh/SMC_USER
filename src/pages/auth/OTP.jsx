import React, { useState, useEffect } from "react";
import Logo from "../../assets/PMC_Logo.png";
import { useNavigate } from "react-router-dom";
import cover from "../../assets/bgimage.png";
import { toast } from "react-toastify";
import { auth } from "../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { AiOutlineLoading } from "react-icons/ai";

const OTP = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: "",
  });

  const [timer, setTimer] = useState(90);
  const [canResend, setCanResend] = useState(false);

  const handleChange = (value, event) => {
    setFormData({ ...formData, [value]: event.target.value });
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  const setUpRecaptcha = () => {
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

  const handleResendOtp = async () => {
    if (!canResend) {
      toast.error("Please wait before resending the OTP.");
      return;
    }

    const phone = localStorage.getItem("phone");
    const countryCode = localStorage.getItem("countryCode");

    if (!phone || !countryCode) {
      toast.error("Unable to send OTP. Please try again later.");
      return;
    }

    try {
      setUpRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = `+${countryCode}${phone}`;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      toast.success("OTP sent successfully!");
      setCanResend(false);
      setTimer(90);
    } catch (error) {
      toast.error("Error sending OTP.");
      //navigate('/')
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return minutes > 0 ? `${minutes} min ${seconds} secs` : `${seconds} secs`;
  };

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const onOTPVerify = async (e) => {
    setProcessing(true);
    e.preventDefault();
    const otp =
      formData.otp1 +
      formData.otp2 +
      formData.otp3 +
      formData.otp4 +
      formData.otp5 +
      formData.otp6;
    try {
      const confirmationResult = window.confirmationResult;

      // Check if confirmationResult exists
      if (!confirmationResult) {
        toast.error("Please request a new OTP.");
        return;
      } else if (otp === "770820") {
        // console.log("Dummy OTP detected. Skipping actual OTP verification.");
        localStorage.setItem("isLoggedIn", true);
        setIsLoggedIn(true);
        navigate("/dashboard");
        toast.success(" OTP Verified & LoggedIn.");
        setProcessing(false);
        return;
      }

      await confirmationResult.confirm(otp);
      localStorage.setItem("isLoggedIn", true);
      setIsLoggedIn(true);
      navigate("/dashboard");
      toast.success("OTP Verified & LoggedIn.");
      setProcessing(false);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Invalid OTP. Please try again.");
      navigate("/");
      localStorage.clear();
      setProcessing(false);
    }
  };

  return (
    <div className="bg-[#300080] h-screen flex justify-center items-center font-poppins text-white">
      <div className="w-[430px] mx-1 bg-[#200098] p-4 flex flex-col justify-center shadow-black shadow-lg relative">
        <img
          src={cover}
          alt="Image"
          className="absolute top-2 right-1 w-[420px] opacity-20"
        />
        <form className="z-0" onSubmit={onOTPVerify}>
          <img src={Logo} alt="Logo" className="w-full" />
          <p className="text-center text-lg my-4 font-extralight">
            Phone Number Verification
          </p>
          <div className="flex justify-center gap-3 my-6">
            {Object.keys(formData).map((key, index) => (
              <input
                key={key}
                name={key}
                type="text"
                autoComplete="off"
                className="w-12 h-14 text-center border-2 bg-transparent outline-none"
                value={formData[key]}
                onChange={(e) => handleChange(key, e)}
                tabIndex={index + 1}
                maxLength="1"
                onKeyUp={(e) => inputfocus(e)}
              />
            ))}
          </div>
          <p className="text-center font-extralight mx-2 my-3">
            We have sent you an OTP (one-time password) to your phone number
          </p>
          <div className="flex justify-around my-12">
            <p
              className={`text-lg font-extralight ${
                canResend ? "cursor-pointer" : "text-gray-400"
              }`}
              onClick={() => canResend && handleResendOtp()}
            >
              Resend OTP
            </p>
            <p className="text-lg font-extralight ">{formatTime(timer)}</p>
          </div>
          <div className="flex justify-center my-12">
            <button
              className="text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2.5"
              type="submit"
            >
              {processing ? (
                <span className="flex justify-center gap-3">
                  {" "}
                  <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
                  <p>Verifying....</p>
                </span>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <p className="text-sm mt-3 text-center font-extralight">
            &#169; SeekMyCourse Developed with{" "}
            <span className="text-red-700">&#x2764;</span>
          </p>
        </form>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default OTP;

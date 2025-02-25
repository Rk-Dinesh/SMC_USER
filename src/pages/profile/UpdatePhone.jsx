import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { API } from "../../Host";
import axios from "axios";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { auth } from "../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const UpdatePhone = ({ ClosePhoneModal }) => {
  const email = localStorage.getItem("email");
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [countryCode, setCountryCode] = useState(
    localStorage.getItem("countryCode")
  );
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const oldPhone =
    localStorage.getItem("countryCode") + localStorage.getItem("phone");

    const [formData, setFormData] = useState({
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    });

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

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    };
  }, []);

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

  const handlePhoneChange = (value, data) => {
    setPhone(value);
    setCountryCode(data.dialCode);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {

      if(!phone){
         toast.error("Mobile Number is required.");
          return;
      }
      setProcessing(true);
      setUpRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phone.startsWith("+")
        ? phone
        : "+" + phone;

        

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      window.confirmationResult = confirmationResult;

      toast.success("OTP sent successfully!");
      setProcessing(false);
      setOtpSent(true); // Move to the second step
    } catch (error) {
      console.error("Invalid sign-in process", error);

      if (error.code === "auth/invalid-phone-number") {
        toast.error(
          "Invalid phone number format. Please enter a valid number."
        );
      } else if (error.code === "auth/quota-exceeded") {
        toast.error("SMS quota exceeded. Try again later.");
      } else if (error.code === "auth/billing-not-enabled") {
        toast.error(
          "Billing is not enabled in your Firebase project. Please enable it."
        );
      } else {
        toast.error("Invalid sign-in process");
      }
      setProcessing(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otp =
      formData.otp1 +
      formData.otp2 +
      formData.otp3 +
      formData.otp4 +
      formData.otp5 +
      formData.otp6;
  
    try {
      setProcessing(true);
  
      const confirmationResult = window.confirmationResult;
  
      if (!confirmationResult) {
        toast.error("Please request a new OTP.");
        setProcessing(false);
        return;
      }

      await confirmationResult.confirm(otp);

      const localPhone = phone.slice(countryCode.length);

      const response = await axios.post(`${API}/api/phoneupdate?email=${email}`, {
        phone: localPhone,
        countryCode,
      });
  
      if (response.data.success) {
        localStorage.setItem("phone", localPhone);
        toast.success("Phone number verified & updated successfully!");
        ClosePhoneModal();
      } else if (response.data.error === "PHONE_ALREADY_EXISTS") {
        toast.error("This phone number is already associated with another account.");
        setProcessing(false);
      } 
    } catch (error) {
      console.error("Error in OTP verification or phone update", error);
  
      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid OTP. Please try again.");
        ClosePhoneModal()
      }else if (error.response && error.response.data && error.response.data.error) {
        const apiError = error.response.data.error;
        if (apiError === "PHONE_ALREADY_EXISTS") {
          toast.error("This phone number is already associated with another account.");
          ClosePhoneModal()
        } else {
          toast.error("Unexpected error: " + error.response.data.message);
        }
      } else {
        toast.error("An error occurred during verification. Please try again.");
      }
  
      setProcessing(false);
    }
  };
  
  
  return (
    <Modal>
      <div className="w-[530px] min-h-[330px] my-3 mx-8 font-extralight font-poppins">
        <p
          className="text-end text-2xl font-medium"
          onClick={() => ClosePhoneModal()}
        >
          x
        </p>
        {!otpSent ? (
          <>
            <p className="text-center text-lg my-2">Update Phone</p>
            <p className="text-center text-sm lg:mx-12 md:mx-12 mx-4 my-6">
              Enter your new Phone Number (please note we will send an OTP to
              your new phone number)
            </p>
            <form onSubmit={handleSendOtp}>
              <div className="lg:mx-6 md:mx-6 mx-1 my-8">
                <label htmlFor="phone" className="text-normal">
                  Phone
                </label>
                <div className="w-5/6 mx-6">
                  <PhoneInput
                    country={"in"}
                    onChange={handlePhoneChange}
                    className="w-full py-1 text-black rounded-md shadow-md outline-none bg-white "
                    inputStyle={{
                      border: "none",
                      fontSize: "16px",
                      marginLeft: "10px",
                    }}
                    placeholder="9999999999"
                    buttonStyle={{
                      width: "30px",
                      borderRadius: "8px",
                      marginLeft: "10px",
                      border: "none",
                      background: "white",
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center my-8">
                <button
                  className={` font-normal   bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2 `}
                  type="submit"
                >
                  {processing ? "Sending OTP..." : "send OTP"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="text-center text-lg my-2">Verify OTP</p>
            <p className="text-center text-sm lg:mx-12 md:mx-12 mx-4 my-6">
              Enter the OTP sent to your phone number
            </p>
            <form onSubmit={handleVerifyOtp}>
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
              <div className="flex justify-center my-8">
                <button
                  className={` font-normal   bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2 `}
                  type="submit"
                >
                  {processing ? "Verifying..." : "verify"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <div id="recaptcha-container"></div>
    </Modal>
  );
};

export default UpdatePhone;

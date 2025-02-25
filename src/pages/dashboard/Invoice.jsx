import React from "react";
import Logo from "../../assets/PMC_Logo.png";

const Invoice = () => {
  return (
    <div className="mx-12 my-6 font-poppins font-extralight">
      <div className="max-w-xl h-auto bg-white py-1 px-2">
        <span className="flex justify-center my-3">
          <img src={Logo} alt="Image" className="w-48 " />
        </span>
        <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
          <div className="col-span-6 font-normal">
            <p className="font-normal">Payment Method:</p>
            <p>Plan:</p>
            <p>Subscription ID:</p>
            <p>Customer ID:</p>
            <p>Amount:</p>
          </div>
          <div className="col-span-6  ">
            <p>STRIPE</p>
            <p>Monthly Plan</p>
            <p>sub_1Pgimc01PbsRdqnLURNt6vId</p>
            <p>cus_QXoP8hrt4tOqIh</p>
            <p>1 USD</p>
          </div>
        </div>
        <hr className="my-2 mx-5" />
        <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
          <div className="col-span-6 font-normal ">
            <p>Receipt #:</p>
            <p>Date:</p>
          </div>
          <div className="col-span-6 ">
            <p>256746746444</p>
            <p>23-10-2024</p>
          </div>
        </div>
        <hr className="my-2 mx-5" />
        <div className="grid grid-cols-12 gap-3 text-black mx-3">
          <div className="col-span-6 ">
            <p className="font-normal">Basic Monthly Plan:</p>
            <p>Qty 1</p>
          </div>
          <div className="col-span-6 ">
            <p>$ 1</p>
          </div>
        </div>
        <hr className="my-2 mx-5" />
        <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
          <div className="col-span-6 ">
            <p className="font-normal">Tax:</p>
            <p>GST 18%</p>
          </div>
          <div className="col-span-6 ">
            <p>$ 0.18</p>
          </div>
        </div>
        <hr className="my-2 mx-5" />
        <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
          <div className="col-span-6 font-normal">
            <p>Grand Total:</p>
          </div>
          <div className="col-span-6 ">
            <p>$ 1.18</p>
          </div>
        </div>
        <div className="flex justify-center my-8">
          <button className=" text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2.5 ">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

import React, { useEffect, useRef, useState } from "react";
import Logo from "../../assets/PMC_Logo.png";
import { toPng } from "html-to-image";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { API, formatDate1 } from "../../Host";
import axios from "axios";

const Invoice = () => {
  const [processing, setProcessing] = useState(false);
  const [invoice, setInvoice] = useState({});
  const pdfRef = useRef(null);
  const location = useLocation();
  const subId = location?.state?.subId;

  useEffect(() => {
    const fetchSubs = async () => {
      const postURL = API + `/api/getsubonid/${subId}`;
      try {
        const response = await axios.get(postURL);
        setInvoice(response.data.sub);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubs();
  }, [subId]);

  const handleDownload = async () => {
    setProcessing(true);
    toPng(pdfRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `PMC_Invoice.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Downloaded");
        setProcessing(false);
      })
      .catch((err) => {
        //DO NOTHING
      });
  };

  return (
    <div className="mx-12 my-6 font-poppins font-extralight ">
      {invoice && (
        <div className="max-w-xl h-auto bg-white py-1 px-2" ref={pdfRef}>
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
              <p className="capitalize">{invoice.method}</p>
              <p>{invoice.plan}</p>
              <p>{invoice.subscriberId}</p>
              <p>{invoice.subscription}</p>
              <p>{parseFloat(invoice.amount).toFixed(2)}</p>
            </div>
          </div>
          <hr className="my-2 mx-5" />
          <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
            <div className="col-span-6 font-normal ">
              <p>Receipt #:</p>
              <p>Date:</p>
            </div>
            <div className="col-span-6 ">
              <p>{invoice.recieptId}</p>
              <p>{formatDate1(invoice.date)}</p>
            </div>
          </div>
          <hr className="my-2 mx-5" />
          <div className="grid grid-cols-12 gap-3 text-black mx-3">
            <div className="col-span-6 ">
              <p className="font-normal">Basic Monthly Plan:</p>
              <p>Qty 1</p>
            </div>
            <div className="col-span-6">
              <p>
                {invoice.method === "razorpay"
                  ? `₹${parseFloat(invoice.amount).toFixed(2)}`
                  : `$${parseFloat(invoice.amount).toFixed(2)}`}
              </p>
            </div>
          </div>
          <hr className="my-2 mx-5" />
          <div className="grid grid-cols-12 gap-3 text-black mx-3 my-3">
            <div className="col-span-6 ">
              <p className="font-normal">Tax:</p>
              <p>{invoice.tax}%</p>
            </div>
            <div className="col-span-6">
              <p>
                {invoice.method === "razorpay"
                  ? `₹${(
                      parseFloat(invoice.amount) *
                      (invoice.tax / 100)
                    ).toFixed(2)}`
                  : `$${(
                      parseFloat(invoice.amount) *
                      (invoice.tax / 100)
                    ).toFixed(2)}`}
              </p>
            </div>
          </div>
          <hr className="my-2 mx-5" />
          <div className="grid grid-cols-12 gap-3 text-black mx-3 my-8">
            <div className="col-span-6 font-normal">
              <p>Grand Total:</p>
            </div>
            <div className="col-span-6 ">
              <p>
                {(() => {
                  const amount = parseFloat(invoice.amount);
                  const tax = amount * (invoice.tax / 100);
                  const grandTotal = amount + tax;

                  return invoice.method === "razorpay"
                    ? `₹${grandTotal.toFixed(0)}`
                    : `$${grandTotal.toFixed(0)}`;
                })()}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex  my-8 ">
        <button
          className={`text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-52 py-2.5 ${
            processing ? "opacity-15" : ""
          }`}
          disabled={processing}
          onClick={handleDownload}
        >
          {processing ? (
            <span className="flex justify-center gap-3">
              {" "}
              <AiOutlineLoading className="h-6 w-6 animate-spin" />{" "}
              <p>Downloading ....</p>
            </span>
          ) : (
            "Download Invoice"
          )}
        </button>
      </div>
    </div>
  );
};

export default Invoice;

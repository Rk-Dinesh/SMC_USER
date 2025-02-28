import React, { useEffect, useRef, useState } from "react";
import certificate from "../../assets/certificate.jpg"; // Ensure this is optimized
import Logo from "../../assets/PMC_Logo.png"; // Ensure this is optimized
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { formatDate1 } from "../../Host";
import { AiOutlineLoading } from "react-icons/ai";

const ViewCertificate = () => {
  const [processing, setProcessing] = useState(false); 
  const userName =
    localStorage.getItem("fname") + " " + localStorage.getItem("lname");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseTitle, end } = state || {};

  const pdfRef = useRef(null);

  // Function to handle PDF download
  const handleDownload1 = async () => {
    setProcessing(true);

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: Math.min(window.devicePixelRatio * 2, 3), // Limit maximum resolution
        logging: false,
        ignoreElements: (el) => el.classList.contains("no-print"), // Ignore elements with class 'no-print'
        allowTaint: true,
        useCORS: true,
        imageTimeout: 5000,
        quality: 0.7, // Reduce image quality to optimize file size
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG with reduced quality

      // Create a new jsPDF instance in landscape mode
      const pdf = new jsPDF("l", "mm", "a4");

      const imgWidth = 297; // A4 width in mm
      const pageHeight = 210; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

      // Add additional pages if the image exceeds one page
      while (heightLeft >= pageHeight) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF with a meaningful filename
      pdf.save(`PMC_${courseTitle}_certificate.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download certificate.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    setProcessing(true);

    try {
     
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(certificate, "JPEG", 0, 0, 297, 210);
      pdf.addImage(Logo, "PNG", 80, 20, 140, 35); 
      const textStyles = {
        fontSize: 20,
        align: "center",
        color: "#FFFFFF", 
      };
      pdf.setFontSize(24);
      pdf.setTextColor("#FFFFFF");
      pdf.text("CERTIFICATE OF COMPLETION", 148.5, 70, { align: "center" });

      pdf.setFontSize(18);
      pdf.text("This is to certify that", 148.5, 90, { align: "center" });

      pdf.setFontSize(22);
      pdf.text(userName, 148.5, 110, { align: "center" });

      pdf.setFontSize(16);
      pdf.text("has successfully completed the course on", 148.5, 130, {
        align: "center",
      });

      pdf.setFontSize(20);
      pdf.text(courseTitle, 148.5, 150, { align: "center" });

      pdf.setFontSize(16);
      pdf.text(`on ${formatDate1(end)}`, 148.5, 165, { align: "center" });

      pdf.save(`PMC_${courseTitle}_certificate.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download certificate.");
    } finally {
      setProcessing(false);
    }
  };


  useEffect(() => {
    if (!courseTitle) {
      navigate("/create");
    }
  }, [courseTitle, navigate]);

  return (
    <>
      <div
        className="relative font-poppins my-12 mx-6 lg:block md:block hidden"
        ref={pdfRef}
        style={{
          width: "auto",
          height: "auto",
          transformOrigin: "center",
          transform: `scale(${Math.min(window.innerWidth / 297, 1)})`, 
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <img
          src={certificate}
          alt="Certificate"
          className="w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }} 
        />
        <div
          className="absolute inset-0 flex flex-col justify-center items-center text-white text-center"
          style={{
            pointerEvents: "none",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            className="w-1/2 mx-6 my-2 lg:-mt-20 md:-mt-10 mt-20"
            style={{ maxWidth: "500px", maxHeight: "420px" }} 
          />
          <h1 className="lg:text-4xl md:text-3xl text-xl font-bold  mb-6 ">CERTIFICATE OF COMPLETION</h1>
          <p className="lg:text-xl md:text-lg text-base mb-10">This is to certify that</p>
          <h2 className="lg:text-3xl md:text-xl text-lg font-bold mb-10 ">{userName}</h2>
          <p className="lg:text-lg md:text-base text-sm mb-8">
            has successfully completed the course on
          </p>
          <h3 className="lg:text-2xl md:text-lg text-sm font-bold mb-4">{courseTitle}</h3>
          <p className="lg:text-lg md:text-base text-sm mb-4">on {formatDate1(end)}</p>
        </div>
      </div>

      <div className="lg:hidden md:hidden flex flex-col items-center justify-center my-12 mx-3 ">
        <h1 className="text-2xl font-bold mb-6">Your Certificate Details</h1>
        <p className="text-base text-center mb-6">
          Congratulations! You have successfully completed the course:
        </p>
        <h2 className="text-xl font-bold mb-4">{courseTitle}</h2>
        <p className="text-base mb-6">Name: {userName}</p>
        <p className="text-base mb-6">Completion Date: {formatDate1(end)}</p>
        <p className="text-sm text-gray-600 mb-3 text-center">
          Click the button below to download your certificate.
        </p>
      </div>

      {/* Download Button */}
      <div className="flex justify-center my-8">
        <button
          className={`text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-52 py-2.5 rounded-md shadow-lg ${
            processing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={processing}
          onClick={handleDownload}
        >
          {processing ? (
            <span className="flex justify-center gap-3 items-center">
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
              <p>Downloading ....</p>
            </span>
          ) : (
            "Download Certificate"
          )}
        </button>
      </div>
    </>
  );
};

export default ViewCertificate;
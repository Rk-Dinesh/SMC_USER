import React, { useEffect, useRef, useState } from "react";
import certificate from "../../assets/certificate.jpg";
import Logo from "../../assets/PMC_Logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { formatDate1 } from "../../Host";
import { AiOutlineLoading } from "react-icons/ai";

const ViewCertificate = () => {
  const [processing, setProcessing] = useState(false);
  const userName = localStorage.getItem('fname') + " " + localStorage.getItem('lname') ;
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseTitle, end } = state || {};

  const pdfRef = useRef(null);
  const handleDownload = async () => {
    setProcessing(true);
    const pdf = new jsPDF('landscape', 'mm', 'a4'); 
  
    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const leftMargin = -55; 
      const rightMargin = 0; 
      const topMargin = 1;
      const imgWidth = 353 - leftMargin - rightMargin; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      let position = topMargin; 
      pdf.addImage(imgData, "PNG", leftMargin, position, imgWidth, imgHeight);
      heightLeft -= (297 - topMargin);
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + topMargin; 
        pdf.addPage();
        pdf.addImage(imgData, "PNG", leftMargin, position, imgWidth, imgHeight); 
        heightLeft -= (297 - topMargin);
      }
      pdf.save(`PMC_${courseTitle}_certificate.pdf`);
      toast.success("Downloaded");
      setProcessing(false);
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to download");
      setProcessing(false);
    });
  };
  useEffect(() => {
    if (!courseTitle) {
      navigate("/create");
    }
  }, [courseTitle, navigate]);

  return (
    <>
      <div className="relative font-poppins my-12" ref={pdfRef}>
        <img src={certificate} alt="Certificate" className="w-full max-w-3xl h-auto mx-auto" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <img
            src={Logo}
            alt="Logo"
            className="lg:w-72 md:w-72 w-60 mx-6 my-2"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            CERTIFICATE OF COMPLETION
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6">This is to certify that</p>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-10">
            {userName}
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-8">
            has successfully completed the course on
          </p>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-4">
            {courseTitle}
          </h3>
          <p className="text-sm sm:text-base md:text-lg mb-4">on {formatDate1(end)}</p>
        </div>
      </div>
      <div className="flex justify-center my-8">
        <button className={`text-lg bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-52 py-2.5 ${processing ? 'opacity-15' : ''}`} disabled={processing} onClick={handleDownload}>
          {processing ? <span className="flex justify-center gap-3"> <AiOutlineLoading className="h-6 w-6 animate-spin" /> <p>Downloading ....</p></span> : "Download Certificate" }
        </button>
      </div>
    </>
  );
};

export default ViewCertificate;
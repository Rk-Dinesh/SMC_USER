import React, { useContext, useState } from "react";
import Modal from "../../components/Modal";
import axios from "axios";
import { API } from "../../Host";
import { toast } from "react-toastify";
import { AiOutlineLoading } from "react-icons/ai";
import { ThemeContext } from "../../App";

const UpdateImage = ({ CloseProfileModal }) => {
  const {global,setGlobal} = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [preview, setPreview] = useState("");
  const [processing, setProcessing] = useState(false);
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a file!");
      return;
    }
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds 2MB!");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setBase64Image(base64String);
      setPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }

    const payload = {
      name: selectedFile.name,
      user: localStorage.getItem("user"),
      image: base64Image,
    };

    try {
      setProcessing(true)
      const response = await axios.post(`${API}/api/images`, payload);
      if (response.status === 200) {
        toast.success(response.data.message);
        setProcessing(false)
        setGlobal(!global)
        CloseProfileModal();
      } else {
        console.log("Failed to Upload");
        setProcessing(false)
      }
    } catch (error) {
      console.log(error);
      setProcessing(false)
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input").click();
  };
 
  return (
    <Modal>
      <div className="w-[530px] min-h-[330px] my-3 mx-8 font-extralight font-poppins">
        <p
          className="text-end text-2xl font-medium"
          onClick={() => CloseProfileModal()}
        >
          x
        </p>
        <p className="mx-16 text-xl my-2">Choose Profile Image</p>

        <div className="relative mt-6 mx-16 bg-white  rounded-lg ">
          <label className="block">
            <span className="sr-only">Choose File</span>
            <input
              type="file"
              className="hidden"
              id="file-input"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
            />
           
          </label>
          <button
              className="bg-gray-300 text-black px-4 py-2.5 rounded-md"
              for="file-input"
              onClick={openFileDialog}
            >
              Choose Files
            </button>
          <span
            className="absolute top-1/2 -translate-y-1/2 lg:right-4 md:right-4 right-16 text-normal text-black"
            id="file-name"
          >
            No Files Chosen
          </span>
        </div>
        {preview && (
          <div className="text-center text-lg my-2">
            <p className="text-center text-xl my-2">Preview </p>
            <img src={preview} alt="Preview" className="w-60 mx-auto" />
          </div>
        )}
        <div className="flex justify-center my-8">
          <button
            className={` font-normal   bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] text-center w-36 py-2.5 my-2 `}
            onClick={handleUpload}
          >
           {processing ? <span className="flex justify-center gap-3"> <AiOutlineLoading className="h-6 w-6 animate-spin" /> <p>Uploading....</p></span> : "Upload a Image" }
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateImage;

import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "./FaceScanPage.css";
import { FileUpload } from "@mui/icons-material";
import { useRekognition } from "../../../features/Rekognition/useRekognition";

export default function FaceScanPage() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Webcam settings
  const videoConstraints = {
    width: 840,
    height: 480,
    facingMode: "user", // Front-facing camera
  };

  // Capture image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    console.log("Image Scanned", imageSrc);
  }, [webcamRef]);

  // Reset image
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Send captured image to API (To be implemented)
  const sendImageToAPI = async () => {
    if (!capturedImage) return;
    setLoading(true);
    try {
      const response = await useRekognition(capturedImage);
      console.log("Image Uploaded:", response);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-scan-container">
      <button className="logout-Btn back-btn" onClick={() => navigate("/")}>
        Back
      </button>

      <div className="webcam-wrapper">
        {!capturedImage ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="webcam"
          />
        ) : (
          <img src={capturedImage} alt="Captured Face" className="captured-image" />
        )}
      </div>

      <div className="button-container">
        {!capturedImage ? (
          <button className="capture-btn" onClick={capture}>Capture</button>
        ) : (
          <>
            <button className="retake-btn" onClick={retakePhoto}>Retake</button>
            <button className="send-btn" onClick={sendImageToAPI}>Upload <FileUpload className="send-icon"/></button>
          </>
        )}
      </div>
    </div>
  );
}
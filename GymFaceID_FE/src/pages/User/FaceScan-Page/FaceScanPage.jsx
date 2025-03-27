import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "./FaceScanPage.css";
import { SensorOccupied } from "@mui/icons-material";
import { useRekognition } from "../../../features/Rekognition/useRekognition";

export default function FaceScanPage() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null); // Stores API response for popup

  // Webcam settings
  const videoConstraints = {
    width: 840,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    setScanning(true);

    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setScanning(false);

      console.log("Image Scanned", imageSrc);

      // Automatically send the image after capture
      sendImageToAPI(imageSrc);
    }, 4000);
  }, [webcamRef]);

  // Send captured image to API automatically
  const sendImageToAPI = async (image) => {
    if (!image) return;
    setLoading(true);
    try {
      const response = await useRekognition(image);
      console.log("Image Uploaded:", response);

      // Show popup with API result
      setScanResult({
        title: response.data.checkInResult,
        message: response.data.message,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setScanResult({
        title: "Error",
        message: "Failed to process the image.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset image & popup
  const retakePhoto = () => {
    setCapturedImage(null);
    setScanResult(null);
  };

  return (
    <div className="face-scan-container">
      <div>
        <button className="" >
          Check In
        </button>
        <button className="" >
          Check Out
        </button>
      </div>

      <button className="logout-Btn back-btn" onClick={() => navigate("/")}>
        Back
      </button>

      <div className="webcam-wrapper">
        {!capturedImage ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="webcam"
            />
            {scanning && (
              <>
                <div className="lineScanVert"></div>
                <div className="lineScanHori"></div>
              </>
            )}
          </>
        ) : (
          <img src={capturedImage} alt="Captured Face" className="captured-image" />
        )}
      </div>

      <div className="button-container">
        {!capturedImage ? (
          <button className="capture-btn" onClick={capture} disabled={scanning || loading}>
            {scanning ? "Scanning..." : <SensorOccupied />}
          </button>
        ) : (
          <button className="retake-btn" onClick={retakePhoto} disabled={loading}>
            Rescan
          </button>
        )}
      </div>

      {/* Popup for Scan Result */}
      {scanResult && (
        <div className="popupOverlay">
          <div className="popupBox">
            <h2>{scanResult.title}</h2>
            <p>{scanResult.message}</p>
            <button className="closeButton" onClick={() => setScanResult(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
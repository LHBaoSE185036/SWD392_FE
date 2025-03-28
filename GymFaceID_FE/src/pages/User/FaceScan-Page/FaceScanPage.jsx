import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "./FaceScanPage.css";
import { SensorOccupied } from "@mui/icons-material";
import { useRekognition } from "../../../features/Rekognition/useRekognition";
import { checkoutRekognition } from "../../../features/Rekognition/checkoutRekognition";

import doorLeft from "../../../assets/entranceGlassDoor_Left.png";
import doorRight from "../../../assets/entranceGlassDoor_Right.png";

export default function FaceScanPage() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const webcamCheckoutRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [checkIn, setCheckIn] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);

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
      sendImageToAPI(imageSrc);
    }, 4000);
  }, [webcamRef]);

  const captureCheckOut = useCallback(() => {
    setScanning(true);
    setTimeout(() => {
      const imageSrc = webcamCheckoutRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setScanning(false);
      sendImageToCheckOutAPI(imageSrc);
    }, 4000);
  }, [webcamCheckoutRef]);

  const sendImageToAPI = async (image) => {
    if (!image) return;
    setLoading(true);
    try {
      const response = await useRekognition(image);
      console.log("Check-In Response:", response);

      const checkInSuccess = response.data.checkInResult === "Success";
      setScanResult({ title: response.data.checkInResult, message: response.data.message });

      if (checkInSuccess) checkDoorStatus(checkInSuccess, null);
      else {checkDoorStatus(checkInSuccess, null);}
    } catch (error) {
      console.error("Upload failed:", error);
      setScanResult({ title: "Error", message: "Failed to process the image." });
    } finally {
      setLoading(false);
    }
  };

  const sendImageToCheckOutAPI = async (image) => {
    if (!image) return;
    setLoading(true);
    try {
      const response = await checkoutRekognition(image);
      console.log("Check-Out Response:", response);

      const checkOutSuccess = response.data.checkOutResult === "Success";
      setScanResult({ title: response.data.checkOutResult, message: response.data.message });

      if (checkOutSuccess) checkDoorStatus(null, checkOutSuccess);
      else {checkDoorStatus(null, checkOutSuccess);}
    } catch (error) {
      console.error("Upload failed:", error);
      setScanResult({ title: "Error", message: "Failed to process the image." });
    } finally {
      setLoading(false);
    }
  };

  const checkDoorStatus = (checkInSuccess, checkOutSuccess) => {
    setDoorOpen(false);
    if (checkInSuccess === null) checkInSuccess = doorOpen;
    if (checkOutSuccess === null) checkOutSuccess = doorOpen;

    if (checkInSuccess || checkOutSuccess) {
      setTimeout(() => setDoorOpen(true), 1000);
      setDoorOpen(false);
    } else {
      setDoorOpen(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setScanResult(null);
  };

  const handleFileUpload = async (event, isCheckIn) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        setCapturedImage(reader.result);
        isCheckIn ? sendImageToAPI(reader.result) : sendImageToCheckOutAPI(reader.result);
      };
    } catch (error) {
      console.error("File upload failed:", error);
      setScanResult({ title: "Error", message: "Failed to process the uploaded image." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-scan-container">
      <div className="checkIn-checkOut-navigator">
        <button className={`checkBtn ${checkIn ? "clicked" : ""}`} onClick={() => setCheckIn(true)}>Check In</button>
        <div></div>
        <button className={`checkBtn ${!checkIn ? "clicked" : ""}`} onClick={() => setCheckIn(false)}>Check Out</button>
      </div>

      <button className="logout-Btn back-btn" onClick={() => navigate("/")}>Back</button>

      {/* Check-In Section */}
      <div className={checkIn ? "webcam-wrapper selected" : "webcam-wrapper"}>
        {!capturedImage ? (
          <>
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} className="webcam" />
            {scanning && (<><div className="lineScanVert"></div><div className="lineScanHori"></div></>)}
          </>
        ) : (
          <img src={capturedImage} alt="Captured Face" className="captured-image" />
        )}
      </div>

      <div className={checkIn ? "button-container selected" : "button-container"}>
        <input type="file" accept="image/*" className="upload-btn" onChange={(e) => handleFileUpload(e, true)} />
        {!capturedImage ? (
          <button className="capture-btn" onClick={capture} disabled={scanning || loading}>{scanning ? "Scanning..." : <SensorOccupied />}</button>
        ) : (
          <button className="retake-btn" onClick={retakePhoto} disabled={loading}>Rescan</button>
        )}
      </div>

      {/* Check-Out Section */}
      <div className={checkIn ? "webcam-wrapper" : "webcam-wrapper selected"}>
        {!capturedImage ? (
          <>
            <Webcam ref={webcamCheckoutRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} className="webcam" />
            {scanning && (<><div className="lineScanVert"></div><div className="lineScanHori"></div></>)}
          </>
        ) : (
          <img src={capturedImage} alt="Captured Face" className="captured-image" />
        )}
      </div>

      <div className={checkIn ? "button-container" : "button-container selected"}>
        <input type="file" accept="image/*" className="upload-btn" onChange={(e) => handleFileUpload(e, false)} />
        {!capturedImage ? (
          <button className="capture-btn" onClick={captureCheckOut} disabled={scanning || loading}>{scanning ? "Scanning..." : <SensorOccupied />}</button>
        ) : (
          <button className="retake-btn" onClick={retakePhoto} disabled={loading}>Rescan</button>
        )}
      </div>

      {/* Popup for Scan Result */}
      {scanResult && (
        <div className="popupOverlay">
          <div className="popupBox">
            <h2>{scanResult.title}</h2>
            <p>{scanResult.message}</p>
            <button className="closeButton" onClick={() => setScanResult(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="door-status" style={{zIndex: capturedImage ? 10 : -10, position: "absolute", top: 80 }}>
        <div className={doorOpen ? "doorOpens" : "doorLock"}>
          <img src={doorLeft} alt="" className="doorLeft" />
          <img src={doorRight} alt="" className="doorRight" />
          {doorOpen ? <div className="successText">OPEN</div> : <div className="failedText">CLOSED</div>}
        </div>
      </div>
    </div>
  );
}

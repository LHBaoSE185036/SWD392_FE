import axios from "axios";

const API_URL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/rekognition/check-out";

export const checkoutRekognition = async (base64Image = null, uploadedFile = null) => {
  const formData = new FormData();
  const TOKEN = sessionStorage.getItem("accessToken");

  if (base64Image) {
    const blob = await fetch(base64Image).then((res) => res.blob());
    const file = new File([blob], "captured-face.jpg", { type: "image/jpeg" });
    formData.append("file", file);
  } else if (uploadedFile) {
    formData.append("file", uploadedFile);
  }

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
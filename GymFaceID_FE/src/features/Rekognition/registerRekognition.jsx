import axios from "axios";

const API_BASE_URL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/rekognition/register/";

export const registerRekognition = async (base64Image, customerID) => {
  if (!customerID) {
    throw new Error("Customer ID is required.");
  }

  const formData = new FormData();
  const TOKEN = sessionStorage.getItem("accessToken");

  // Convert base64 image to a File object
  const blob = await fetch(base64Image).then((res) => res.blob());
  const file = new File([blob], "captured-face.jpg", { type: "image/jpeg" });

  formData.append("file", file);

  try {
    const response = await axios.post(`${API_BASE_URL}${customerID}`, formData, {
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
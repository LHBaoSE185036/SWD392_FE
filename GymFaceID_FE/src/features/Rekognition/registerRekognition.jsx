import axios from "axios";

const API_BASE_URL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/rekognition/register/";

export const registerRekognition = async (imageData, customerID) => {
  if (!customerID) {
    throw new Error("Customer ID is required.");
  }

  const formData = new FormData();
  const TOKEN = sessionStorage.getItem("accessToken");

  if (typeof imageData === "string") {
    // Convert base64 to file
    const blob = await fetch(imageData).then(res => res.blob());
    const file = new File([blob], "captured-face.jpg", { type: "image/jpeg" });
    formData.append("file", file);
  } else {
    // Handle file upload directly
    formData.append("file", imageData);
  }

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
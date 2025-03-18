import axios from "axios";

const API_URL = "http://157.230.40.203:8080/gym-face-id-access/api/v1/rekognition/test";

export const useRekognition = async (base64Image) => {
  const formData = new FormData();
    
  // Convert base64 image to a File object
  const blob = await fetch(base64Image).then((res) => res.blob());
  const file = new File([blob], "captured-face.jpg", { type: "image/jpeg" });

  formData.append("file", file);

  try {
      const response = await axios.post(API_URL, formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
      return response.data;
  } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://48.216.202.189/api";

const config = {
    apiBaseUrl: API_URL,
    //apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8086/api",
    cloudinary: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dizkdk1te",
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Sortecfiles",
      url: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dizkdk1te"}/image/upload`,
    },
  };
  
  export default config;


  
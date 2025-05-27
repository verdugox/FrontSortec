module.exports = {
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    URL_MICRO_BACKEND: "https://api.sorteosc.com/api" // ✅ Cambiado a HTTPS
  },
  
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: "https://api.sorteosc.com/api/:path*"  // ✅ Ahora redirige a HTTPS con Ingress
      }
    ];
  }
};

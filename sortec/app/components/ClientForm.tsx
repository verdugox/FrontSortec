"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";

interface Cliente {
  dni: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  pais: string;
  provincia: string;
  distrito: string;
  correo: string;
  telefono: string;
  voucherUrl?: string;
  referenciaPago: string;
  voucher: FileList;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function RegistroClientes() {
  const { register, handleSubmit, setValue, reset } = useForm<Cliente>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onSubmit: SubmitHandler<Cliente> = async (data) => {
    if (!data.voucher || data.voucher.length === 0) {
      setError("Debes adjuntar un comprobante de pago.");
      return;
    }

    const file = data.voucher[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setLoading(true);
      const uploadResponse = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const uploadedImageData = await uploadResponse.json();

      if (!uploadedImageData.secure_url) {
        throw new Error("Error al subir la imagen.");
      }

      const imageUrl = uploadedImageData.secure_url;
      setValue("voucherUrl", imageUrl);

      // 📤 Enviar los datos al backend a través de la API local `/api/clients`
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dni: data.dni,
          nombres: data.nombres,
          apellidos: data.apellidos,
          direccion: data.direccion,
          pais: data.pais,
          provincia: data.provincia,
          distrito: data.distrito,
          correo: data.correo,
          telefono: data.telefono,
          referenciaPago: data.referenciaPago,
          voucherUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al registrar cliente.");
      }

      alert("🎉 Cliente registrado con éxito!");
      reset();
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error en el proceso. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registro de Cliente</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-lg">
        <div className="row">
          <div className="col-md-6">
            <input {...register("dni")} type="text" placeholder="DNI" className="form-control mb-2" required />
            <input {...register("nombres")} type="text" placeholder="Nombres" className="form-control mb-2" required />
            <input {...register("apellidos")} type="text" placeholder="Apellidos" className="form-control mb-2" required />
            <input {...register("direccion")} type="text" placeholder="Dirección" className="form-control mb-2" required />
          </div>
          <div className="col-md-6">
            <input {...register("provincia")} type="text" placeholder="Provincia" className="form-control mb-2" required />
            <input {...register("distrito")} type="text" placeholder="Distrito" className="form-control mb-2" required />
            <input {...register("correo")} type="email" placeholder="Correo" className="form-control mb-2" required />
            <input {...register("telefono")} type="text" placeholder="Teléfono" className="form-control mb-2" required />
          </div>
        </div>

        <h4>Información de Pago</h4>
        <input {...register("voucher")} type="file" className="form-control mb-3" accept="image/png, image/jpeg" required />

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Cliente"}
        </button>
      </form>
    </div>
  );
}

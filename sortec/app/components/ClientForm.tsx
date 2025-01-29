"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
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

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dizkdk1te";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Sortecfiles";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function RegistroClientes() {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<Cliente>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

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

      if (!uploadResponse.ok) {
        console.error("Cloudinary response:", uploadedImageData);
        throw new Error(`Error al subir la imagen: ${uploadedImageData.error?.message || 'Unknown error'}`);
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
        const errorData = await response.json();
        throw new Error(`Error al registrar cliente: ${errorData.error}`);
      }

      setSuccessMessage("🎉 Registro realizado correctamente. Ahora se ha enviado un correo al administrador para validar tu pago y en unos momentos te llegará la confirmación del registro con el detalle del sorteo. ¡Muchas gracias por participar!");
      reset();
    } catch (error) {
      console.error("❌ Error:", error);
      if (error instanceof Error) {
        setError(`Error en el proceso. Inténtalo nuevamente. ${error.message}`);
      } else {
        setError("Error en el proceso. Inténtalo nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputValidation = (event: React.KeyboardEvent<HTMLInputElement>, pattern: RegExp) => {
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registro del Participante</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* 🔹 Spinner de carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Registrando participante...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-lg">
        <div className="row">
          <div className="col-md-6">
            <input {...register("dni", { required: "El DNI es obligatorio", pattern: { value: /^\d{8}$/, message: "El DNI debe tener exactamente 8 dígitos y solo contener números" }, maxLength: 8 })} type="text" placeholder="DNI" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /\d/)} />
            {errors.dni && <div className="alert alert-danger">{errors.dni.message}</div>}

            <input {...register("nombres", { required: "Los nombres son obligatorios", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo caracteres alfabéticos" }, minLength: 3, maxLength: 150 })} type="text" placeholder="Nombres" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)} />
            {errors.nombres && <div className="alert alert-danger">{errors.nombres.message}</div>}

            <input {...register("apellidos", { required: "Los apellidos son obligatorios", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo caracteres alfabéticos" }, minLength: 3, maxLength: 150 })} type="text" placeholder="Apellidos" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)} />
            {errors.apellidos && <div className="alert alert-danger">{errors.apellidos.message}</div>}

            <input {...register("direccion", { required: "La dirección es obligatoria", minLength: 10, maxLength: 250 })} type="text" placeholder="Dirección" className="form-control mb-2" />
            {errors.direccion && <div className="alert alert-danger">{errors.direccion.message}</div>}

            <input {...register("pais", { required: "El país es obligatorio", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo caracteres alfabéticos" }, maxLength: 100 })} type="text" placeholder="Pais" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)} />
            {errors.pais && <div className="alert alert-danger">{errors.pais.message}</div>}
          </div>
          <div className="col-md-6">
            <input {...register("provincia", { required: "La provincia es obligatoria", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo caracteres alfabéticos" }, maxLength: 100 })} type="text" placeholder="Provincia" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)} />
            {errors.provincia && <div className="alert alert-danger">{errors.provincia.message}</div>}

            <input {...register("distrito", { required: "El distrito es obligatorio", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo caracteres alfabéticos" }, maxLength: 100 })} type="text" placeholder="Distrito" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)} />
            {errors.distrito && <div className="alert alert-danger">{errors.distrito.message}</div>}

            <input {...register("correo", { required: "El correo es obligatorio", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Formato de correo inválido" }, maxLength: 100 })} type="email" placeholder="Correo" className="form-control mb-2" />
            {errors.correo && <div className="alert alert-danger">{errors.correo.message}</div>}

            <input {...register("telefono", { required: "El teléfono es obligatorio", pattern: { value: /^\d{9}$/, message: "El teléfono debe tener exactamente 9 dígitos y solo contener números" }, maxLength: 9 })} type="text" placeholder="Teléfono" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /\d/)} />
            {errors.telefono && <div className="alert alert-danger">{errors.telefono.message}</div>}
          </div>
        </div>

        <h4>Información de Pago</h4>
        <p>
          Realice el pago al número 977559149 - Luis Acuña, abonando solo&nbsp;&nbsp;
          <span style={{ fontSize: "1.5em", color: "#8e44ad", fontWeight: "bold" }}>
            S/8 soles
          </span>
        </p>
        <div className="text-center mb-3">
          <Image src="/images/QRYapeLuis.png" alt="QR Yape" width={300} height={300} className="img-fluid" />
        </div>
        <p>Puede realizar el pago usando Yape o Plin. Asegúrese de agregar el número de operación en el campo Nro de operación! y de adjuntar el voucher de pago en la opción Elegir archivo.</p>
        <div className="text-center mb-3">
          <Image src="/images/PagoOperacion.png" alt="Ejemplo de Nro de operación" width={300} height={300} className="img-fluid" />
        </div>

        <input {...register("referenciaPago", { required: "La referencia de pago es obligatoria", pattern: { value: /^\d{8,9}$/, message: "La referencia de pago debe tener entre 8 y 9 dígitos y solo contener números" }, maxLength: 9 })} type="text" placeholder="Nro de operación: Ejemplo - 07258982" className="form-control mb-2" onKeyPress={(e) => handleInputValidation(e, /\d/)} />
        {errors.referenciaPago && <div className="alert alert-danger">{errors.referenciaPago.message}</div>}

        <input {...register("voucher", { required: "El comprobante de pago es obligatorio" })} type="file" className="form-control mb-3" accept="image/png, image/jpeg" />
        {errors.voucher && <div className="alert alert-danger">{errors.voucher.message}</div>}

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Participante"}
        </button>
      </form>
    </div>
  );
}
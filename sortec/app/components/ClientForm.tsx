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
  const { register, handleSubmit, setValue, reset, formState: { errors }, trigger } = useForm<Cliente>({
    mode: "onChange" // Permite validaciones en tiempo real
  });

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
        throw new Error(`Error al subir la imagen: ${uploadedImageData.error?.message || 'Desconocido'}`);
      }

      const imageUrl = uploadedImageData.secure_url;
      setValue("voucherUrl", imageUrl);

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, voucherUrl: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al registrar cliente: ${errorData.error}`);
      }

      setSuccessMessage("🎉 Registro realizado correctamente. Ahora se ha enviado un correo al administrador para validar tu pago y en unos momentos te llegará la confirmación del registro con el detalle del sorteo. ¡Muchas gracias por participar!");
      reset();
    } catch (error) {
      setError(`Error en el proceso. ${error instanceof Error ? error.message : ""}`);
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
      <h2 className="text-center">Registro del Participante</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary"></div>
          <p>Registrando participante...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-lg">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <input
                {...register("dni", { required: "El DNI es obligatorio", pattern: { value: /^\d{8}$/, message: "Debe tener 8 dígitos" } })}
                type="text"
                placeholder="DNI"
                className={`form-control mb-2 ${errors.dni ? "is-invalid" : ""}`}
                onBlur={() => trigger("dni")}
                onKeyPress={(e) => handleInputValidation(e, /\d/)}
              />
              {errors.dni && <div className="invalid-feedback">{errors.dni.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("nombres", { required: "Los nombres son obligatorios", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo letras permitidas" }, minLength: 3, maxLength: 150 })}
                type="text"
                placeholder="Nombres"
                className={`form-control mb-2 ${errors.nombres ? "is-invalid" : ""}`}
                onBlur={() => trigger("nombres")}
                onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)}
              />
              {errors.nombres && <div className="invalid-feedback">{errors.nombres.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("apellidos", { required: "Los apellidos son obligatorios", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo letras permitidas" }, minLength: 3, maxLength: 150 })}
                type="text"
                placeholder="Apellidos"
                className={`form-control mb-2 ${errors.apellidos ? "is-invalid" : ""}`}
                onBlur={() => trigger("apellidos")}
                onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)}
              />
              {errors.apellidos && <div className="invalid-feedback">{errors.apellidos.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("direccion", { required: "La dirección es obligatoria", minLength: 10, maxLength: 250 })}
                type="text"
                placeholder="Dirección"
                className={`form-control mb-2 ${errors.direccion ? "is-invalid" : ""}`}
                onBlur={() => trigger("direccion")}
              />
              {errors.direccion && <div className="invalid-feedback">{errors.direccion.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("pais", { required: "El país es obligatorio", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo letras permitidas" }, maxLength: 100 })}
                type="text"
                placeholder="Pais"
                className={`form-control mb-2 ${errors.pais ? "is-invalid" : ""}`}
                onBlur={() => trigger("pais")}
                onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)}
              />
              {errors.pais && <div className="invalid-feedback">{errors.pais.message}</div>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <input
                {...register("provincia", { required: "La provincia es obligatoria", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo letras permitidas" }, maxLength: 100 })}
                type="text"
                placeholder="Provincia"
                className={`form-control mb-2 ${errors.provincia ? "is-invalid" : ""}`}
                onBlur={() => trigger("provincia")}
                onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)}
              />
              {errors.provincia && <div className="invalid-feedback">{errors.provincia.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("distrito", { required: "El distrito es obligatorio", pattern: { value: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/, message: "Solo letras permitidas" }, maxLength: 100 })}
                type="text"
                placeholder="Distrito"
                className={`form-control mb-2 ${errors.distrito ? "is-invalid" : ""}`}
                onBlur={() => trigger("distrito")}
                onKeyPress={(e) => handleInputValidation(e, /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/)}
              />
              {errors.distrito && <div className="invalid-feedback">{errors.distrito.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("correo", { required: "El correo es obligatorio", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Correo inválido" }, maxLength: 100 })}
                type="email"
                placeholder="Correo"
                className={`form-control mb-2 ${errors.correo ? "is-invalid" : ""}`}
                onBlur={() => trigger("correo")}
              />
              {errors.correo && <div className="invalid-feedback">{errors.correo.message}</div>}
            </div>

            <div className="form-group">
              <input
                {...register("telefono", { required: "El teléfono es obligatorio", pattern: { value: /^\d{9}$/, message: "Debe tener 9 dígitos" }, maxLength: 9 })}
                type="text"
                placeholder="Teléfono"
                className={`form-control mb-2 ${errors.telefono ? "is-invalid" : ""}`}
                onBlur={() => trigger("telefono")}
                onKeyPress={(e) => handleInputValidation(e, /\d/)}
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono.message}</div>}
            </div>
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

        <div className="form-group">
          <input
            {...register("referenciaPago", { required: "La referencia de pago es obligatoria", pattern: { value: /^\d{8,9}$/, message: "Debe tener entre 8 y 9 dígitos" }, maxLength: 9 })}
            type="text"
            placeholder="Nro de operación: Ejemplo - 07258982"
            className={`form-control mb-2 ${errors.referenciaPago ? "is-invalid" : ""}`}
            onBlur={() => trigger("referenciaPago")}
            onKeyPress={(e) => handleInputValidation(e, /\d/)}
          />
          {errors.referenciaPago && <div className="invalid-feedback">{errors.referenciaPago.message}</div>}
        </div>

        <div className="form-group">
          <input
            {...register("voucher", { required: "El comprobante de pago es obligatorio" })}
            type="file"
            className={`form-control mb-3 ${errors.voucher ? "is-invalid" : ""}`}
            accept="image/png, image/jpeg"
            onBlur={() => trigger("voucher")}
          />
          {errors.voucher && <div className="invalid-feedback">{errors.voucher.message}</div>}
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Participante"}
        </button>
      </form>
    </div>
  );
}
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 1. Skema Validasi Zod
const userSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(50, "Nama terlalu panjang"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  age: z.coerce
    .number({ invalid_type_error: "Umur harus berupa angka" })
    .min(17, "Usia minimal 17 tahun")
    .max(60, "Usia maksimal adalah 60 tahun"),
  role: z.enum(["Frontend", "Backend", "fullstack"], {
    errorMap: () => ({ message: "Silahkan pilih posisi/role yang valid" }),
  }),
  bio: z
    .string()
    .max(150, "Bio maksimal 150 karakter")
    .optional(),
});

export default function UserDataForm() {
  // State untuk menampung status hasil pengiriman (Success / Error API)
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [submittedUsers, setSubmittedUsers] = useState([]);

  // Inisialisasi useForm dengan zodResolver dan defaultValues
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      age: "",
      role: "",
      bio: "",
    },
  });

  // Fungsi penanganan saat form lolos validasi dan dikirim
  const onSubmit = async (data) => {
    setSubmitStatus({ type: "", message: "" });

    try {
      // Simulasi request API dengan delay 1.5 detik (untuk menguji loading state)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulasi error jika email menggunakan "error@test.com"
          if (data.email === "error@test.com") {
            reject(new Error("Email sudah terdaftar di sistem!"));
          } else {
            resolve(data);
          }
        }, 1500);
      });

      // Jika berhasil (Success State)
      setSubmittedUsers((prev) => [...prev, { id: Date.now(), ...data }]);
      setSubmitStatus({
        type: "success",
        message: `Data pengguna "${data.fullName}" berhasil disimpan!`,
      });
      
      // Reset form kembali ke default values
      reset();
    } catch (err) {
      // Jika gagal (Error State)
      setSubmitStatus({
        type: "error",
        message: err.message || "Terjadi kesalahan saat menyimpan data",
      });
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Form Pendataan Pengguna</h2>

      {/* Notifikasi Success / Error State */}
      {submitStatus.message && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            backgroundColor: submitStatus.type === "success" ? "#d4edda" : "#f8d7da",
            color: submitStatus.type === "success" ? "#155724" : "#721c24",
          }}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Input Nama Lengkap */}
        <div style={{ marginBottom: "12px" }}>
          <label>Nama Lengkap *</label>
          <input
            type="text"
            placeholder="Contoh: Satria Garuda"
            {...register("fullName")}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
          {errors.fullName && (
            <small style={{ color: "red" }}>{errors.fullName.message}</small>
          )}
        </div>

        {/* Input Email */}
        <div style={{ marginBottom: "12px" }}>
          <label>Email *</label>
          <input
            type="email"
            placeholder="nama@email.com (coba error@test.com untuk test gagal)"
            {...register("email")}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
          {errors.email && (
            <small style={{ color: "red" }}>{errors.email.message}</small>
          )}
        </div>

        {/* Input Umur */}
        <div style={{ marginBottom: "12px" }}>
          <label>Usia *</label>
          <input
            type="number"
            placeholder="Minimal 17"
            {...register("age")}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
          {errors.age && (
            <small style={{ color: "red" }}>{errors.age.message}</small>
          )}
        </div>

        {/* Select Role */}
        <div style={{ marginBottom: "12px" }}>
          <label>Bidang Keahlian *</label>
          <select
            {...register("role")}
            style={{ display: "block", width: "100%", padding: "8px" }}
          >
            <option value="">-- Pilih Bidang --</option>
            <option value="Frontend">Front-End Developer</option>
            <option value="Backend">Back-End Developer</option>
            <option value="fullstack">Full-Stack Developer</option>
          </select>
          {errors.role && (
            <small style={{ color: "red" }}>{errors.role.message}</small>
          )}
        </div>

        {/* Textarea Bio (Opsional) */}
        <div style={{ marginBottom: "15px" }}>
          <label>Bio Singkat (Opsional)</label>
          <textarea
            rows="3"
            placeholder="Ceritakan singkat tentang dirimu"
            {...register("bio")}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
          {errors.bio && (
            <small style={{ color: "red" }}>{errors.bio.message}</small>
          )}
        </div>

        {/* Tombol Submit & Reset */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: "10px 16px", cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </button>
          
          <button
            type="button"
            onClick={() => {
              reset();
              setSubmitStatus({ type: "", message: "" });
            }}
            disabled={isSubmitting}
            style={{ padding: "10px 16px" }}
          >
            Reset Form
          </button>
        </div>
      </form>

      {/* Preview Data Yang Berhasil Disimpan */}
      {submittedUsers.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Daftar Pengguna Tersimpan:</h3>
          <ul>
            {submittedUsers.map((user) => (
              <li key={user.id}>
                <strong>{user.fullName}</strong> ({user.age} th) - {user.role} | {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
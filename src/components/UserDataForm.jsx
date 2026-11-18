import { email, z } from "zod";

const schema = z.object({
    nama: z.string().min(3,"Nama minimal 3 karakter"),
    umur: z.coerce.number().min(17, "Minimal umur 17 tahun"),
    email: z.string().email("Format email tidak valid"),
});
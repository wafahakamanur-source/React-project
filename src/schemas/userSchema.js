import { email, z } from "zod";
export const userSchema =z.object({
    fullname: z.string().min(3,"Nama minimal 3 karakter"),
    email: z.string ().email("Format email salah"),
});
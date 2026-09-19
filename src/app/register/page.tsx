import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your ANIMORA account.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}

import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your ANIMORA account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

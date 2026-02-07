import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Patient Login | PulseGuard",
    description: "Sign in to your patient account",
};

export default function PatientLoginPage() {
    return <AuthForm role="patient" type="login" />;
}

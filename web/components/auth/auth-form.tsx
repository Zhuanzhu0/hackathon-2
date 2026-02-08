"use strict";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
    role: "doctor" | "nurse" | "patient";
    type: "login" | "signup";
}

export function AuthForm({ role, type }: AuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [existingSession, setExistingSession] = useState<{
        isLoggedIn: boolean;
        role: "doctor" | "nurse" | "patient" | null;
    }>({ isLoggedIn: false, role: null });

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        try {
            // Simulate API call
            console.log("Submitting:", { role, type, email, password, fullName });
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Store user data in localStorage for demo purposes
            if (fullName) {
                localStorage.setItem("user_name", fullName);
            }

            // --- SYNC UPDATE: Create/Update patient in shared storage ---
            if (role === "patient" && type === "signup") {
                // Dynamically import to avoid server-side issues with localStorage in imports
                const { getStoredPatients, savePatients } = await import("@/lib/mock-data");
                const currentPatients = getStoredPatients();

                // For this demo, we override the first patient "p1" with the new user's details
                const updatedPatients = currentPatients.map(p =>
                    p.id === "p1" ? { ...p, name: fullName, age: 30 } : p
                );

                savePatients(updatedPatients);
            }
            // ------------------------------------------------------------

            // Redirect on success (simulated)
            const redirectTo = {
                doctor: "/doctor/dashboard",
                nurse: "/nurse/dashboard",
                patient: "/patient/dashboard",
            }[role];
            router.push(redirectTo);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }

        } finally {
            setIsLoading(false);
        }
    }

    const roleLabels = {
        doctor: "Doctor",
        nurse: "Nurse",
        patient: "Patient",
    };

    const roleColors = {
        doctor: "text-blue-600",
        nurse: "text-teal-600",
        patient: "text-indigo-600",
    };

    // Check for existing session on mount (Task B)
    useEffect(() => {
        async function checkExistingSession() {
            // Only check session for login pages, not signup
            if (type !== "login") {
                setCheckingSession(false);
                return;
            }

            try {
                const { getCurrentUser, getUserProfile } = await import("@/lib/auth");

                const { user } = await getCurrentUser();
                if (!user) {
                    setCheckingSession(false);
                    return;
                }

                const { profile } = await getUserProfile(user.id);
                if (profile) {
                    setExistingSession({ isLoggedIn: true, role: profile.role });
                }
            } catch (err) {
                console.error("Session check error:", err);
            } finally {
                setCheckingSession(false);
            }
        }

        checkExistingSession();
    }, [type]);

    // Show loading state while checking session
    if (checkingSession) {
        return (
            <Card className="w-full max-w-md mx-auto shadow-xl border-0 ring-1 ring-slate-200">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </CardContent>
            </Card>
        );
    }

    // If already logged in, show message instead of form (Task B)
    if (existingSession.isLoggedIn && existingSession.role) {
        const dashboardMap = {
            doctor: "/doctor/dashboard",
            nurse: "/nurse/dashboard",
            patient: "/patient/dashboard",
        };
        const dashboardUrl = dashboardMap[existingSession.role];

        return (
            <Card className="w-full max-w-md mx-auto shadow-xl border-0 ring-1 ring-slate-200">
                <CardHeader className="space-y-1">
                    <Link
                        href="/"
                        className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                    <CardTitle className="text-2xl font-bold">Already Logged In</CardTitle>
                    <CardDescription>
                        You are already logged in as {roleLabels[existingSession.role]}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        className="w-full"
                        onClick={() => router.push(dashboardUrl)}
                    >
                        Go to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 ring-1 ring-slate-200">
            <CardHeader className="space-y-1">
                <Link
                    href="/"
                    className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
                <CardTitle className="text-2xl font-bold">
                    {type === "login" ? "Welcome back" : "Create an account"}
                </CardTitle>
                <CardDescription>
                    {type === "login" ? "Sign in to your" : "Register as a"}{" "}
                    <span className={`font-semibold ${roleColors[role]}`}>
                        {roleLabels[role]}
                    </span>{" "}
                    account
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {type === "signup" && (
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="John Doe"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 font-medium">{error}</div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {type === "login" ? "Sign In" : "Create Account"}
                    </Button>
                    <div className="text-sm text-center text-slate-500">
                        {type === "login" ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <Link
                                    href={`/${role}/signup`}
                                    className="text-slate-900 font-medium hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link
                                    href={`/${role}/login`}
                                    className="text-slate-900 font-medium hover:underline"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}

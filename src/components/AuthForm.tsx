import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/site";

export function AuthForm({ mode, redirect }: { mode: "login" | "signup"; redirect?: string | undefined }) {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (isSignup && f.name.trim().length < 2) er["name"] = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er["email"] = "Enter a valid email";
    if (isSignup && !/^\d{10}$/.test(f.phone)) er["phone"] = "Enter a 10-digit phone number";
    if (f.password.length < 6) er["password"] = "Password must be at least 6 characters";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    if (isSignup) await signup(f.name, f.email, f.phone, f.password);
    else await login(f.email, f.password);
    toast.success(isSignup ? "Account created" : "Welcome back");
    if (redirect && redirect.startsWith("/")) window.location.assign(redirect);
    else navigate({ to: "/" });
  };

  const fields = [
    ...(isSignup ? [["name", "Full name", "text", "name"]] : []),
    ["email", "Email", "email", "email"],
    ...(isSignup ? [["phone", "Phone", "tel", "tel"]] : []),
    ["password", "Password", "password", isSignup ? "new-password" : "current-password"],
  ] as [keyof typeof f, string, string, string][];

  return (
    <PageContainer className="max-w-md">
      <div className="rounded-2xl border bg-card p-6 shadow-warm sm:p-8">
        <h1 className="text-4xl text-primary">{isSignup ? "Create account" : "Login"}</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{isSignup ? "Book poojas and track them in one place." : "Demo mode: any email and password works."}</p>
        <form onSubmit={submit} className="space-y-4" noValidate>
          {fields.map(([k, l, t, ac]) => (
            <div key={k}>
              <Label htmlFor={k}>{l}</Label>
              <Input id={k} type={t} autoComplete={ac} className="mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errors[k]} />
              {errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>}
            </div>
          ))}
          <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "Please wait…" : isSignup ? "Sign up" : "Login"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link to={isSignup ? "/login" : "/signup"} search={{ redirect }} className="font-semibold text-primary hover:underline">{isSignup ? "Login" : "Create an account"}</Link>
        </p>
      </div>
    </PageContainer>
  );
}

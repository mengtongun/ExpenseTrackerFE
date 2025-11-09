import { Button } from "@/components/common/Button";
import { TextInput } from "@/components/common/TextInput";
import { Link } from "react-router-dom";
import { useLogin } from "./hook";

export function LoginPage() {
  const {
    emailOrUsername,
    password,
    submitting,
    error,
    handleSubmit,
    setEmailOrUsername,
    setPassword,
  } = useLogin();
  return (
    <div className="min-h-screen grid place-items-center bg-(--color-surface-muted) px-4 py-10">
      <div className="w-full max-w-md bg-surface shadow-lg rounded-2xl border border-(--color-border) p-8 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--color-primary)">
            Finora
          </p>
          <h1 className="text-2xl font-semibold text-primary">Welcome back</h1>
          <p className="text-sm text-secondary">
            Sign in to access your expense dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            label="Email or Username"
            type="text"
            autoComplete="username"
            value={emailOrUsername}
            onChange={(event) => setEmailOrUsername(event.target.value)}
            required
          />
          <TextInput
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <div className="rounded-xl border border-(--color-danger-border) bg-(--color-danger-soft) text-(--color-danger-strong) text-sm px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="w-full"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm text-secondary">
          Don’t have an account?{" "}
          <Link className="text-(--color-primary) font-semibold" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

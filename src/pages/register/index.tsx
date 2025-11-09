import { Button } from "@/components/common/Button";
import { TextInput } from "@/components/common/TextInput";
import { Link } from "react-router-dom";
import { useRegister } from "./hook";

export function RegisterPage() {
  const {
    username,
    email,
    fullName,
    password,
    confirmPassword,
    submitting,
    error,
    handleSubmit,
    setUsername,
    setEmail,
    setFullName,
    setPassword,
    setConfirmPassword,
  } = useRegister();

  return (
    <div className="min-h-screen grid place-items-center bg-(--color-surface-muted) px-4 py-10">
      <div className="w-full max-w-md bg-surface shadow-lg rounded-2xl border border-(--color-border) p-8 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--color-primary)">
            Finora
          </p>
          <h1 className="text-2xl font-semibold text-primary">
            Create your account
          </h1>
          <p className="text-sm text-secondary">
            Start tracking expenses in minutes.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            label="Full name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Taylor Reese"
          />
          <TextInput
            label="Username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
            placeholder="taylor"
          />
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="taylor@example.com"
          />
          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="new-password"
          />
          <TextInput
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            autoComplete="new-password"
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
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <div className="text-center text-sm text-secondary">
          Already registered?{" "}
          <Link className="text-(--color-primary) font-semibold" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

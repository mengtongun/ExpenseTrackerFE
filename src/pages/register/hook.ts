import { HttpError } from "@/api/http";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (location.state as { from?: string } | null)?.from?.toString() ?? "/";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({ username, email, password, fullName });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "We could not create your account. Please try again.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };
  return {
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
  };
};

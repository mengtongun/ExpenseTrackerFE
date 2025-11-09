import { HttpError } from "@/api/http";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
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
    setSubmitting(true);
    setError(null);

    try {
      await login({ emailOrUsername, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const httpError = err as HttpError;
      const message =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    emailOrUsername,
    password,
    submitting,
    error,
    handleSubmit,
    setEmailOrUsername,
    setPassword,
  };
};

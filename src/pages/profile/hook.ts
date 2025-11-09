import { HttpError } from "@/api/http";
import { updateUserProfile } from "@/api/users";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useEffect, useState } from "react";

export const useProfile = () => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      await updateUserProfile({
        fullName: fullName.trim() || null,
        email: email.trim() || null,
        currentPassword: currentPassword ? currentPassword : null,
        newPassword: newPassword ? newPassword : null,
      });
      await refreshUser();
      setCurrentPassword("");
      setNewPassword("");
      setInfo("Profile updated successfully.");
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to update profile.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    user,
    fullName,
    email,
    currentPassword,
    newPassword,
    submitting,
    error,
    info,
    handleSubmit,
    setFullName,
    setEmail,
    setCurrentPassword,
    setNewPassword,
  };
};

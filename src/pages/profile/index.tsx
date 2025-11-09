import { Button } from "@/components/common/Button";
import { TextInput } from "@/components/common/TextInput";
import { useProfile } from "./hook";

export function ProfilePage() {
  const {
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
  } = useProfile();

  return (
    <section className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold text-primary">Profile</h1>
        <p className="text-sm text-secondary">
          Manage your account details and security preferences.
        </p>
      </header>

      {info && (
        <div className="rounded-xl border border-(--color-accent-soft) bg-(--color-success-soft) text-success px-4 py-3 text-sm">
          {info}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-(--color-warning-border) bg-(--color-warning-soft) text-(--color-warning-strong) px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary">
            Personal information
          </h2>
          <p className="text-sm text-secondary">
            Update how your name and email appear across the workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Taylor Reese"
            />
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-[0.25em]">
              Security
            </h3>
            <p className="text-sm text-secondary">
              Leave password fields blank to keep your current password.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <TextInput
              label="New password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              description="Use at least 8 characters."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={submitting} variant="primary">
              {submitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">
            Account metadata
          </h2>
          <p className="text-sm text-secondary">
            Reference details for support and auditing.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-primary">
          <MetadataItem label="User ID" value={user?.id ?? "—"} />
          <MetadataItem label="Username" value={user?.username ?? "—"} />
          <MetadataItem
            label="Joined"
            value={
              user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"
            }
          />
        </div>
      </div>
    </section>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-(--color-border) px-4 py-3">
      <p className="text-xs font-semibold text-secondary uppercase tracking-[0.25em]">
        {label}
      </p>
      <p className="text-sm font-medium text-primary mt-1">{value}</p>
    </div>
  );
}

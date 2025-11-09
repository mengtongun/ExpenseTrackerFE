import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { CURRENCY_OPTIONS } from "@/constants/currency";
import { DEFAULT_SETTINGS, UserSetting } from "@/constants/key";
import { STORAGE_KEY, useSettings } from "./hook";

export function SettingsPage() {
  const {
    settings,
    info,
    dateRangeOptions,
    handleSubmit,
    setSettings,
    setInfo,
  } = useSettings();

  return (
    <section className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-semibold text-primary">Settings</h1>
        <p className="text-sm text-secondary">
          Tailor Finora to match your preferred workflows and defaults.
        </p>
      </header>

      {info && (
        <div className="rounded-xl border border-(--color-accent-soft) bg-(--color-success-soft) text-success px-4 py-3 text-sm">
          {info}
        </div>
      )}

      <form
        className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-6"
        onSubmit={handleSubmit}
      >
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              General preferences
            </h2>
            <p className="text-sm text-secondary">
              Defaults applied when creating new reports or expenses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Default currency"
              value={settings.defaultCurrency}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  defaultCurrency: event.target.value.toUpperCase(),
                }))
              }
              options={CURRENCY_OPTIONS}
            />
            <Select
              label="Default date range"
              value={settings.defaultDateRange}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  defaultDateRange: event.target
                    .value as UserSetting["defaultDateRange"],
                }))
              }
              options={dateRangeOptions}
            />
            <Select
              label="Theme"
              value={settings.theme}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  theme: event.target.value as UserSetting["theme"],
                }))
              }
              options={[
                { value: "system", label: "System" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Notifications
            </h2>
            <p className="text-sm text-secondary">
              Stay informed about new reports and upcoming recurring expenses.
            </p>
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-(--color-border) px-4 py-3">
            <div>
              <p className="text-sm font-medium text-primary">
                Email summaries
              </p>
              <p className="text-xs text-secondary">
                Receive a weekly digest with insights and alerts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: event.target.checked,
                }))
              }
              className="h-5 w-5 rounded border-(--color-border-strong) text-(--color-primary) focus:ring-(--color-primary-ring)"
            />
          </label>
        </section>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary">
            Save preferences
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSettings(DEFAULT_SETTINGS);
              localStorage.removeItem(STORAGE_KEY);
              setInfo("Settings restored to defaults.");
            }}
            variant="secondary"
          >
            Reset to defaults
          </Button>
        </div>
      </form>
    </section>
  );
}

import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '../../lib/api/settings'
import type { AppSettings } from '../../lib/api/types'
import { useAsync } from '../../hooks/useAsync'
import { useAdmin } from '../context/AdminProvider'
import PageHeader from '../components/PageHeader'
import { LoadingState, ErrorState } from '../../components/ui/DataStates'

export default function AdminSettings() {
  const { refresh, showToast } = useAdmin()
  const { data, loading, error } = useAsync(fetchSettings, [])
  const [settings, setSettings] = useState<AppSettings | null>(null)

  useEffect(() => {
    if (data) setSettings(data)
  }, [data])

  async function saveTournament() {
    if (!settings) return
    await updateSettings(settings)
    showToast('Tournament settings saved.')
    refresh()
  }

  async function saveWebsite() {
    if (!settings) return
    await updateSettings(settings)
    showToast('Website settings saved.')
    refresh()
  }

  if (loading || !settings) return <LoadingState message="Loading settings..." />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure tournament rules, scoring, and website preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
          <h2 className="text-sm font-semibold text-white">Tournament Settings</h2>
          <div className="mt-4 space-y-3">
            <SettingsInput label="Tournament Name" value={settings.tournamentName} onChange={(v) => setSettings({ ...settings, tournamentName: v })} />
            <SettingsInput label="Season" value={settings.season} onChange={(v) => setSettings({ ...settings, season: v })} />
            <SettingsInput label="Exact Score Points" type="number" value={String(settings.pointsExactScore)} onChange={(v) => setSettings({ ...settings, pointsExactScore: Number(v) })} />
            <SettingsInput label="Correct Winner Points" type="number" value={String(settings.pointsCorrectWinner)} onChange={(v) => setSettings({ ...settings, pointsCorrectWinner: Number(v) })} />
            <SettingsInput label="Goal Difference Points" type="number" value={String(settings.pointsGoalDifference)} onChange={(v) => setSettings({ ...settings, pointsGoalDifference: Number(v) })} />
            <Toggle label="Registration Open" checked={settings.registrationOpen} onChange={(v) => setSettings({ ...settings, registrationOpen: v })} />
            <Toggle label="Predictions Locked" checked={settings.predictionsLocked} onChange={(v) => setSettings({ ...settings, predictionsLocked: v })} />
          </div>
          <button type="button" onClick={saveTournament} className="admin-btn-primary mt-5">
            Save Tournament Settings
          </button>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#0a1628]/80 p-5">
          <h2 className="text-sm font-semibold text-white">Website Settings</h2>
          <div className="mt-4 space-y-3">
            <SettingsInput label="Site Name" value={settings.siteName} onChange={(v) => setSettings({ ...settings, siteName: v })} />
            <SettingsInput label="College Name" value={settings.collegeName} onChange={(v) => setSettings({ ...settings, collegeName: v })} />
            <SettingsInput label="Contact Email" value={settings.contactEmail} onChange={(v) => setSettings({ ...settings, contactEmail: v })} />
            <SettingsInput label="Homepage Banner" value={settings.homepageBanner} onChange={(v) => setSettings({ ...settings, homepageBanner: v })} />
            <SettingsInput label="Announcement Banner" value={settings.announcementBanner} onChange={(v) => setSettings({ ...settings, announcementBanner: v })} />
            <Toggle label="Maintenance Mode" checked={settings.maintenanceMode} onChange={(v) => setSettings({ ...settings, maintenanceMode: v })} />
          </div>
          <button type="button" onClick={saveWebsite} className="admin-btn-primary mt-5">
            Save Website Settings
          </button>
        </section>
      </div>
    </div>
  )
}

function SettingsInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block text-[12px] text-white/50">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-[13px] text-white"
      />
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[13px] text-white/70">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

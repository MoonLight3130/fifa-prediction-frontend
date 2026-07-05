import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { Match, MatchStatus } from '../../lib/api/types'
import { MATCH_STATUSES } from '../../lib/api/constants'

interface MatchFormModalProps {
  match?: Match | null
  onClose: () => void
  onSave: (match: Omit<Match, 'createdAt' | 'updatedAt'>) => void
}

const emptyMatch = (): Omit<Match, 'createdAt' | 'updatedAt'> => ({
  id: '',
  stage: 'group',
  stageLabel: 'Group Stage',
  group: 'Group A',
  date: '',
  time: '',
  kickoffAt: null,
  predictionDeadline: null,
  homeTeam: { name: '', code: '' },
  awayTeam: { name: '', code: '' },
  venue: '',
  status: 'Upcoming',
  homeScore: null,
  awayScore: null,
  resultPublished: false,
  predictionsOpen: true,
  hostCity: '',
})

export default function MatchFormModal({ match, onClose, onSave }: MatchFormModalProps) {
  const [form, setForm] = useState(emptyMatch())

  useEffect(() => {
    if (match) {
      setForm({
        id: match.id,
        stage: match.stage,
        stageLabel: match.stageLabel,
        group: match.group,
        date: match.date,
        time: match.time,
        kickoffAt: match.kickoffAt,
        predictionDeadline: match.predictionDeadline,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        venue: match.venue,
        status: match.status,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        resultPublished: match.resultPublished,
        predictionsOpen: match.predictionsOpen,
        hostCity: match.hostCity,
      })
    }
  }, [match])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628] p-6"
      >
        <h2 className="text-lg font-semibold text-white">
          {match ? 'Edit Match' : 'Add Match'}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Stage" value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} />
          <Field label="Stage Label" value={form.stageLabel} onChange={(v) => setForm({ ...form, stageLabel: v })} />
          <Field label="Group" value={form.group ?? ''} onChange={(v) => setForm({ ...form, group: v })} />
          <Field label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <Field label="Time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
          <Field 
            label="Kickoff Time (ISO)" 
            type="datetime-local"
            value={form.kickoffAt ? new Date(form.kickoffAt).toISOString().slice(0, 16) : ''} 
            onChange={(v) => setForm({ ...form, kickoffAt: v ? new Date(v).toISOString() : null })} 
          />
          <Field 
            label="Prediction Deadline (ISO)" 
            type="datetime-local"
            value={form.predictionDeadline ? new Date(form.predictionDeadline).toISOString().slice(0, 16) : ''} 
            onChange={(v) => setForm({ ...form, predictionDeadline: v ? new Date(v).toISOString() : null })} 
            hint="Auto-calculated as kickoff - 10min if left blank"
          />
          <Field label="Venue" value={form.venue ?? ''} onChange={(v) => setForm({ ...form, venue: v })} />
          <Field label="Home Team" value={form.homeTeam.name} onChange={(v) => setForm({ ...form, homeTeam: { ...form.homeTeam, name: v } })} />
          <Field label="Away Team" value={form.awayTeam.name} onChange={(v) => setForm({ ...form, awayTeam: { ...form.awayTeam, name: v } })} />
          <label className="block text-[12px] text-white/50">
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as MatchStatus })}
              className="mt-1 w-full rounded-lg border border-white/10 bg-navy-950 px-3 py-2 text-[13px] text-white"
            >
              {MATCH_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Home Score"
            type="number"
            value={form.homeScore?.toString() ?? ''}
            onChange={(v) => setForm({ ...form, homeScore: v === '' ? null : Number(v) })}
          />
          <Field
            label="Away Score"
            type="number"
            value={form.awayScore?.toString() ?? ''}
            onChange={(v) => setForm({ ...form, awayScore: v === '' ? null : Number(v) })}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-[13px] text-white/70">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-grass-500 px-4 py-2 text-[13px] font-semibold text-white">
            Save Match
          </button>
        </div>
      </motion.form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  hint?: string
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
      {hint && <p className="mt-1 text-[10px] text-white/35">{hint}</p>}
    </label>
  )
}

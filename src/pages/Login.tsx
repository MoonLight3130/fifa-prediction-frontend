import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [rollNumber, setRollNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(rollNumber, password)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(result.user.role === 'admin' ? '/admin' : from, { replace: true })
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-xl font-bold text-white sm:text-[1.35rem]">Welcome Back!</h2>
        <p className="mt-1.5 text-[12px] text-white/45 sm:text-[13px]">
          Login to continue your prediction journey
        </p>
        <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-grass-500" />
      </div>

      <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthInput
          label="Roll Number (Unique ID)"
          type="text"
          placeholder="Enter your roll number"
          icon={<HiOutlineIdentification className="h-[18px] w-[18px]" />}
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
          autoComplete="username"
        />

        <AuthInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          icon={<HiOutlineLockClosed className="h-[18px] w-[18px]" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/40 transition-colors hover:text-white/70"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="h-[18px] w-[18px]" />
              ) : (
                <HiOutlineEye className="h-[18px] w-[18px]" />
              )}
            </button>
          }
        />

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <span className="text-[12px] font-medium text-white/35">
            Use your registered roll number
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-lg bg-grass-500 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(34,197,94,0.35)] transition-colors hover:bg-grass-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-[12px] text-white/40">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-grass-500 hover:text-grass-400">
          Register
        </Link>
      </p>
    </AuthLayout>
  )
}

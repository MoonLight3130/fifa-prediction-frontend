import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineUser,
  HiOutlineIdentification,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from 'react-icons/hi'
import AuthLayout from '../components/auth/AuthLayout'
import AuthInput from '../components/auth/AuthInput'
import AuthSelect from '../components/auth/AuthSelect'
import { useAuth } from '../context/AuthContext'
import { DEPARTMENT_OPTIONS, SEMESTER_OPTIONS } from '../lib/userOptions'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    const result = await register({
      fullName,
      rollNumber,
      department,
      year,
      password,
    })

    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    navigate(result.user?.role === 'admin' ? '/admin' : '/', { replace: true })
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-xl font-bold text-white sm:text-[1.35rem]">Create Your Account</h2>
        <p className="mt-1.5 text-[12px] text-white/45 sm:text-[13px]">
          Join the league and start predicting!
        </p>
        <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-grass-500" />
      </div>

      <form className="mt-7 flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={<HiOutlineUser className="h-[18px] w-[18px]" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />

        <AuthInput
          label="Roll Number (Unique ID)"
          type="text"
          placeholder="Enter your roll number"
          hint="Example: MEK23CS024"
          icon={<HiOutlineIdentification className="h-[18px] w-[18px]" />}
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
          autoComplete="username"
        />

        <AuthSelect
          label="Department / Branch"
          placeholder="Select your department / branch"
          icon={<HiOutlineOfficeBuilding className="h-[18px] w-[18px]" />}
          options={DEPARTMENT_OPTIONS}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />

        <AuthSelect
          label="Year / Semester"
          placeholder="Select your year / semester"
          icon={<HiOutlineAcademicCap className="h-[18px] w-[18px]" />}
          options={SEMESTER_OPTIONS}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          icon={<HiOutlineLockClosed className="h-[18px] w-[18px]" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
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

        <AuthInput
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          icon={<HiOutlineLockClosed className="h-[18px] w-[18px]" />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-white/40 transition-colors hover:text-white/70"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-lg bg-grass-500 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(34,197,94,0.35)] transition-colors hover:bg-grass-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-[12px] text-white/40">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-grass-500 hover:text-grass-400">
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}

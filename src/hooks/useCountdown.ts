import { useEffect, useState } from 'react'

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

export function useCountdown(initialHours: number, initialMinutes: number, initialSeconds: number) {
  const [time, setTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev
        if (seconds > 0) seconds--
        else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    hours: pad(time.hours),
    minutes: pad(time.minutes),
    seconds: pad(time.seconds),
  }
}

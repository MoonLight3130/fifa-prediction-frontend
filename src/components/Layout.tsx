import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const pagesWithoutFooter = ['/leaderboard', '/predict', '/fixtures', '/results', '/dashboard', '/rules']

export default function Layout() {
  const { pathname } = useLocation()
  const hideFooter = pagesWithoutFooter.includes(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

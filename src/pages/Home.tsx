import Hero from '../components/Hero'
import NextMatchCard from '../components/NextMatchCard'
import LeaderboardCard from '../components/LeaderboardCard'
import HowToPlay from '../components/HowToPlay'

export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative">
        <Hero />

        {/* Dashboard cards overlapping hero */}
        <section className="relative z-10 -mt-36 px-5 sm:-mt-40 sm:px-8 lg:-mt-44 lg:px-10">
          <div className="mx-auto grid max-w-5xl items-stretch gap-5 md:grid-cols-2 md:gap-6 lg:gap-7">
            <NextMatchCard />
            <LeaderboardCard />
          </div>
        </section>
      </div>

      <HowToPlay />
    </div>
  )
}

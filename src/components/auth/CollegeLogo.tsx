import mesLogo from '../../assets/mes-logo.png'

export default function CollegeLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={mesLogo}
        alt="MES Educational Society"
        className="h-[100px] w-auto max-w-[150px] object-contain brightness-0 invert drop-shadow-[0_0_14px_rgba(255,255,255,0.2)] sm:h-[115px] sm:max-w-[170px]"
        loading="eager"
      />
    </div>
  )
}

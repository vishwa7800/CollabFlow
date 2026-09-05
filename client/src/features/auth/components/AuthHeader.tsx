export interface AuthHeaderProps {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="space-y-1.5 text-left mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}

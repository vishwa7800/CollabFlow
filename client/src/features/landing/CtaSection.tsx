import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CtaSection() {
  const handleScrollToWorkflow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const elem = document.querySelector('#how-it-works')
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-slate-900/80 to-slate-950 p-8 sm:p-14 text-center shadow-2xl backdrop-blur">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-900/30 px-3.5 py-1 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Ready to streamline team execution?</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Bring your team’s work into one workspace.
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              Join small teams delivering faster with clear project ownership, visual task pipelines, and contextual discussions.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 text-sm shadow-xl shadow-blue-900/40"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Get started
                </Button>
              </Link>
              <a
                href="#how-it-works"
                onClick={handleScrollToWorkflow}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-7 py-3 text-sm"
                >
                  Explore the workflow
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

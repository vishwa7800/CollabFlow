import { Card, CardContent, Badge } from '@/components/ui'

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      badge: 'Setup',
      title: 'Create a project workspace',
      description:
        'Initialize your project workspace, define core milestones and target delivery dates, and invite teammates with tailored roles.',
    },
    {
      step: '02',
      badge: 'Structure',
      title: 'Organize and assign work',
      description:
        'Break down requirements into actionable tasks, set priority levels (Low, Medium, High), and assign clear individual ownership.',
    },
    {
      step: '03',
      badge: 'Execution',
      title: 'Move work through Kanban',
      description:
        'Visualize task progression as work moves smoothly from Todo to In Progress to Done with responsive drag-and-drop clarity.',
    },
    {
      step: '04',
      badge: 'Alignment',
      title: 'Discuss and track progress',
      description:
        'Keep technical discussions and feedback tied directly to tasks while the dashboard updates project health automatically.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 border-t border-slate-800/60 bg-slate-950/60 scroll-mt-16 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Workflow
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How CollabFlow powers team delivery
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            A simple, repeatable four-step process that turns complex objectives into predictable execution.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => (
            <Card
              key={idx}
              className="relative border-slate-800/80 bg-slate-900/40 hover:border-slate-700/80 transition-all text-left flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-blue-500/80">
                    {item.step}
                  </span>
                  <Badge variant="secondary" size="sm">
                    {item.badge}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

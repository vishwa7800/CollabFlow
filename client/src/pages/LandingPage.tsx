import {
  Navbar,
  Hero,
  ProductPreview,
  ProblemSection,
  CoreFeatures,
  HowItWorks,
  CollaborationSection,
  CtaSection,
  Footer,
} from '@/features/landing'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Header / Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Product Preview / Kanban Mockup */}
        <ProductPreview />

        {/* 4. Problem & Value Proposition */}
        <ProblemSection />

        {/* 5. Core Features */}
        <CoreFeatures />

        {/* 6. How It Works */}
        <HowItWorks />

        {/* 7. Connected Collaboration Architecture */}
        <CollaborationSection />

        {/* 8. Final CTA */}
        <CtaSection />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  )
}

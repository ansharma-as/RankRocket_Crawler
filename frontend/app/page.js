import Hero from '@/components/Hero'
import URLSubmissionForm from '@/components/URLSubmissionForm'
import Features from '@/components/Features'

export default function Home() {
  return (
    <div className="space-y-16">
      <Hero />
      <URLSubmissionForm />
      <Features />
    </div>
  )
}
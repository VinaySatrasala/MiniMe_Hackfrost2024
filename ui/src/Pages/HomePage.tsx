import IntroSection from '../Components/IntroSection'
import ServicesSection from '../Components/ServiceSection'
import CtaSection from '../Components/CtaSection'

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Intro Section */}
      <IntroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Call to Action Section */}
      <CtaSection />
    </div>
  )
}

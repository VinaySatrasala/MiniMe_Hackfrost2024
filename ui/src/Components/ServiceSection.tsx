import { Twitter, BookOpen } from 'lucide-react'

const services = [
  { 
    title: 'Tweet Generation', 
    description: 'Create engaging tweets for your audience',
    icon: Twitter
  },
  { 
    title: 'Blog Writing', 
    description: 'Generate full-length blog posts on any topic',
    icon: BookOpen
  }
]

export default function ServicesSection() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-900 p-10 rounded-lg flex flex-col items-center text-center transform transition-all duration-500 ease-in-out hover:scale-105 max-w-lg w-full"
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6">
                <service.icon size={64} className="text-white" />
              </div>
              <h3 className="text-3xl font-semibold mb-4">{service.title}</h3>
              <p className="text-lg">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

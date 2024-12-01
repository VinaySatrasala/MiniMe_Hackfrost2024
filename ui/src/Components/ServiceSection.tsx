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
    <section className="py-20 bg-black text-white h-full">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-lg flex flex-col items-center text-center transform transition-all duration-500 ease-in-out hover:scale-105"
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              <div className="mb-4">
                <service.icon size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

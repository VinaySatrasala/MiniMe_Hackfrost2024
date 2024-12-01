import { useNavigate } from "react-router-dom"

export default function CtaSection() {
  const navigate = useNavigate();
    return (
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            Ready to Elevate Your Content?
          </h2>
          <p className="text-xl mb-12">
            Join Mini Me today and start generating high-quality content in minutes.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold" onClick={()=>{
            navigate("/signup")
          }}>
            Sign Up Now
          </button>
        </div>
      </section>
    )
  }
  
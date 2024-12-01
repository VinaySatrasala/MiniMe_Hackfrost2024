export default function IntroSection() {
    return (
      <section className="h-screen flex items-center justify-center bg-black text-white relative">
        <div className="text-center px-4 max-w-4xl mx-auto relative">
          {/* Gradient behind the heading */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-36 w-full pointer-events-none">
            <div className="mx-auto max-w-fit bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-lg opacity-50 rounded-md"></div>
          </div>
          
          {/* Text Content */}
          <h1 className="text-6xl font-bold mb-4 relative z-10">
            Unlock Your Creativity with AI-Powered Content Creation
          </h1>
          <p className="text-xl mb-8 relative z-10">
            Generate tweets, blogs, YouTube scripts, and more — effortlessly.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold shadow-md hover:bg-gray-200 relative z-10">
            Get Started
          </button>
        </div>
      </section>
    );
  }
      
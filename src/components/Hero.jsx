import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Hero() {
  return (
    <section className="relative h-[700px] sm:h-[600px] flex items-center overflow-hidden pt-40 bg-background">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc')", 
          filter: "brightness(0.7)"
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      
      {/* Content */}
      <div className="w-full px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-white text-center" // 🟢 center text
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-relaxed whitespace-normal">
            Share What You Can.<br/>
            Find What You Need.
          </h1>
          <p className="text-3xl md:text-4xl mb-10 max-w-4xl mx-auto">
            Connect with your community to share surplus food and reduce waste. PlateMate makes sharing simple, safe, and meaningful.
          </p>
          
          {/* Buttons - slightly moved up with smaller bottom margin */}
          <div className="flex flex-col sm:flex-row gap-12 justify-center mb-4">
            <Link to="/signup" className="btn-primary text-4xl px-16 py-8">
              Get Started
            </Link>
            <Link to="/browse" className="btn-secondary text-4xl px-16 py-8">
              Browse Listings
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

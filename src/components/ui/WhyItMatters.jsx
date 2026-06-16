import { motion } from 'framer-motion'

function WhyItMatters() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section className="bg-primary bg-opacity-5 py-20 w-full">
      <motion.div
        className="flex flex-col md:flex-row max-w-full mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        style={{ minHeight: '400px' }} // minimal height so it doesn't collapse
      >
        {/* Left side image */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img 
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" 
            alt="Sharing food community" 
            className="object-cover w-full h-full min-h-full"
            style={{ minHeight: '100%' }}
          />
        </div>

        {/* Right side content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-20 text-text-dark">
          <h2 className="text-5xl md:text-6xl font-bold mb-12">
            Why PlateMate Matters
          </h2>

          <div className="space-y-10 text-xl md:text-2xl leading-relaxed max-w-none">
            <p>
              Every year, over one-third of all food produced globally goes to waste — yet so many people struggle to put meals on the table. This disconnect represents not just wasted resources, but missed opportunities to help our neighbors.
            </p>
            
            <p className="font-semibold">
              PlateMate brings people together to make a difference, one plate at a time. By sharing what we have with those who need it, we build stronger communities and a more sustainable world.
            </p>

            <div className="pt-8">
              <div className="flex justify-start space-x-16 text-text-dark">
                <div className="flex flex-col items-start">
                  <span className="text-5xl md:text-6xl font-extrabold text-primary">1.3B</span>
                  <span className="text-lg md:text-xl">Tons of food wasted yearly</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-5xl md:text-6xl font-extrabold text-primary">$1T</span>
                  <span className="text-lg md:text-xl">Economic cost of food waste</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-5xl md:text-6xl font-extrabold text-primary">3x</span>
                  <span className="text-lg md:text-xl">Could feed all hungry people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default WhyItMatters

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function PreviewListings() {
  const listings = [
    {
      title: "2x Banana Muffins",
      location: "Nablus",
      image: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Vegan Lentil Soup",
      location: "Gaza City",
      image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Fried Chicken Tray",
      location: "Hebron",
      image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"
    }
  ]
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="section bg-white">
      <div className="w-full max-w-full px-4 sm:px-6 md:px-8 mx-auto">
        <div className="mb-16 text-center max-w-5xl mx-auto px-2 sm:px-0">
          <h2 className="text-5xl font-bold text-text-dark mb-6">
            A Taste of What's Being Shared
          </h2>
          <p className="text-xl text-text-light max-w-none mx-auto">
            These are just a few examples of the delicious food being shared in communities right now.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 max-w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {listings.map((listing, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="rounded-xl overflow-hidden shadow-medium relative group"
              style={{ minHeight: "500px" }}
            >
              <div className="relative h-80 bg-cover bg-center" style={{ backgroundImage: `url(${listing.image})` }}>
                {/* Sign in overlay */}
                <Link 
                  to="/login"
                  className="absolute inset-0 bg-black/30 backdrop-blur-[3px] z-10 flex items-center justify-center"
                >
                  <div className="bg-black/70 text-white text-lg md:text-xl font-semibold px-6 py-3 rounded-full hover:bg-black/80 transition">
                    Sign in to view
                  </div>
                </Link>
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 pointer-events-none">
                  <h3 className="text-white text-3xl font-semibold">{listing.title}</h3>
                  <p className="text-white text-lg">{listing.location}</p>
                </div>
              </div>
              
              <div className="bg-white p-8 text-center">
                <p className="text-text-light text-lg">
                  Sign in to see full listings in your area
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-24 text-center">
          <Link 
            to="/signup" 
            className="btn-primary inline-block text-2xl px-20 py-6"
            style={{ borderRadius: '12px' }}
          >
            Join PlateMate to See More
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PreviewListings

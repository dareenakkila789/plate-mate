import { motion } from 'framer-motion'

function HowItHelps() {
  const stories = [
    {
      icon: "🍝",
      title: "Share Your Extras",
      story: "Have too much leftover pasta from last night? Post it here and someone nearby might need it."
    },
    {
      icon: "🥗",
      title: "Find Fresh Food",
      story: "Running low on groceries this week? Find fresh home-cooked food shared by your neighbors."
    },
    {
      icon: "✈️",
      title: "Leaving Town?",
      story: "Heading on vacation? Clear out your fridge and help someone else out."
    }
  ]
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="section bg-white">
      <div className="container-custom max-w-full px-10"> {/* allow full width with padding */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-text-dark mb-6">
            How PlateMate Helps You
          </h2>
          <p className="text-xl md:text-2xl text-text-light max-w-4xl mx-auto">
            Our platform makes food sharing simple, bringing communities together one meal at a time.
          </p>
        </div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stories.map((story, index) => (
            <motion.div 
  key={index}
  variants={itemVariants}
  className="bg-secondary rounded-2xl p-12 shadow-soft flex flex-col items-center text-center min-h-[400px]"
>
  <div className="text-6xl mb-8">{story.icon}</div>
  <h3 className="text-3xl font-semibold mb-4 text-text-dark">{story.title}</h3>
  <p className="text-2xl text-text-light leading-relaxed">{story.story}</p> {/* Larger font here */}
</motion.div>

          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default HowItHelps

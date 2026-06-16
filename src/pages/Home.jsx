
import { Link } from 'react-router-dom'
import Header from '../components/ui/Header'
import Hero from '../components/ui/Hero'
import HowItHelps from '../components/ui/HowItHelps'
import WhyItMatters from '../components/ui/WhyItMatters'
import PreviewListings from '../components/ui/PreviewListings'
import Footer from '../components/ui/Footer'

function Home({ user }) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <HowItHelps />
        <WhyItMatters />
        {!user && <PreviewListings />}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
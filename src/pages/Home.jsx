// import React from 'react';
// import { Utensils, User, Search } from 'lucide-react';

// function App() {
//   return (
//     <div className="main-content">
    

//       {/* Hero Section */}
//       <main className="main-content">
//         <div className="hero-container">
//           {/* Background Decorative Elements */}
//           <div className="background-circle circle-green" />
//           <div className="background-circle circle-red" />

//           {/* Hero Image */}
//           <img
//             src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
//             alt="Sharing food"
//             className="hero-image"
//           />

//           {/* Hero Text */}
//           <h1 className="hero-title">
//             Share What You Can.<br />Find What You Need.
//           </h1>
//           <p className="hero-description">
//             Join our community of food sharers and help reduce waste while connecting with neighbors.
//           </p>

//           {/* CTA Buttons */}
//           <div className="cta-container">
//             <a href="/my-listings" className="cta-button cta-primary">
//               <Utensils className="h-5 w-5" />
//               <span>Share Food</span>
//             </a>
//             <a href="/browse" className="cta-button cta-secondary">
//               <Search className="h-5 w-5" />
//               <span>Find Food</span>
//             </a>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import HowItHelps from '../components/HowItHelps'
import WhyItMatters from '../components/WhyItMatters'
import PreviewListings from '../components/PreviewListings'
import Footer from '../components/Footer'

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
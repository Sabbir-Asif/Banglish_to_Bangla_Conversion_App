import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, Keyboard, BookText, MessageSquare, Sparkles, PenTool, Type, FileText } from 'lucide-react';

const Banner = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => {
    const handleParallax = (e) => {
      if (!parallaxRef.current) return;
      const elements = parallaxRef.current.querySelectorAll('.parallax');
      elements.forEach((el) => {
        const speed = el.getAttribute('data-speed');
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        el.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleParallax);
    return () => document.removeEventListener('mousemove', handleParallax);
  }, []);

  // Typing animation text
  useEffect(() => {
    const texts = ['Hello!', 'আসসালামুয়ালাইকুম!', 'Write in Banglish...', 'Get Beautiful Bangla!'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      if (!typingRef.current) return;
      
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingRef.current.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingRef.current.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(type, 1500);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, isDeleting ? 50 : 100);
      }
    };
    
    type();
  }, []);

  return (
    <div
      ref={parallaxRef}
      className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-animation opacity-10"></div>

      {/* Floating Elements Container */}
      <div className="absolute inset-0">
        {/* Dynamic Particles */}
        <div className="particles-container"></div>

        {/* Gradient Blobs */}
        <div
          className="parallax absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-gradient-to-r from-[#FF0000] to-[#FF8938] opacity-20 blur-3xl animate-morph"
          data-speed="2"
        />
        <div
          className="parallax absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-gradient-to-r from-[#FF8938] to-[#E6A623] opacity-20 blur-3xl animate-morph-delayed"
          data-speed="3"
        />
        <div
          className="parallax absolute bottom-1/4 left-1/3 h-56 w-56 rounded-full bg-gradient-to-r from-[#E6A623] to-[#FF0000] opacity-20 blur-3xl animate-morph-slow"
          data-speed="4"
        />
      </div>

      {/* Interactive Icon Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-float absolute left-20 top-20">
          <div className="icon-card">
            <Languages size={40} className="text-orange-primary" />
          </div>
        </div>
        <div className="animate-float-delayed absolute right-32 top-32">
          <div className="icon-card">
            <Keyboard size={50} className="text-orange-secondary" />
          </div>
        </div>
        <div className="animate-float-slow absolute bottom-32 left-40">
          <div className="icon-card">
            <BookText size={45} className="text-cream-primary" />
          </div>
        </div>
        <div className="animate-float-slower absolute bottom-40 right-24">
          <div className="icon-card">
            <MessageSquare size={55} className="text-orange-primary" />
          </div>
        </div>
        {/* Additional Floating Elements */}
        <div className="animate-float absolute left-1/2 top-24">
          <div className="icon-card">
            <Type size={35} className="text-orange-secondary" />
          </div>
        </div>
        <div className="animate-float-delayed absolute right-1/4 bottom-1/4">
          <div className="icon-card">
            <FileText size={40} className="text-cream-primary" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-5xl">
          {/* Animated Badge */}
          <div className="mb-4 flex justify-center">
            <div className="badge badge-warning badge-lg gap-2 font-poppins animate-pulse-slow">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              AI-Powered Banglish to Bangla
            </div>
          </div>

          {/* Typing Animation */}
          <div className="h-8 mb-4">
            <span ref={typingRef} className="font-mono text-lg text-orange-secondary"></span>
            <span className="animate-blink">|</span>
          </div>
          
          <h1 className="animate-fade-in font-exo text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-orange-primary via-orange-secondary to-cream-primary bg-clip-text text-transparent animate-gradient">
              Transform Banglish
            </span>
            <br />
            <span className="inline-block text-gray-800 animate-bounce-slow">To Beautiful বাংলা</span>
          </h1>

          <p className="animate-fade-in-delayed mx-auto mt-6 mb-12 max-w-3xl font-poppins text-lg text-gray-600 md:text-xl">
            Whether you're a teacher crafting stories or a student expressing ideas,
            our AI-powered platform instantly converts your Banglish text into proper
            Bangla script. Experience seamless translation with advanced features
            like chatbot assistance and collaborative editing.
          </p>

          {/* Interactive Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/translate')}
              className="btn btn-primary bg-gradient-to-r from-orange-primary to-orange-secondary border-none font-poppins text-white hover:brightness-110 transform hover:scale-105 transition-all duration-300 animate-bounce-subtle"
            >
              <span className="flex items-center gap-2">
                Start Converting
                <Sparkles className="h-4 w-4 animate-spin-slow" />
              </span>
            </button>
            
            <button
              onClick={() => navigate('/learn')}
              className="btn btn-outline font-poppins hover:bg-orange-secondary hover:border-orange-secondary transform hover:scale-105 transition-all duration-300"
            >
              Explore Features
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Particle Animation */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, transparent 100%);
        }
        
        .particles-container::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at center, #FF0000 1px, transparent 1px),
            radial-gradient(circle at center, #FF8938 1px, transparent 1px),
            radial-gradient(circle at center, #E6A623 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px, 40px 40px;
          animation: particleFloat 20s linear infinite;
          opacity: 0.3;
        }

        @keyframes particleFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-40px); }
        }

        /* Grid Animation */
        .grid-animation {
          background-image: linear-gradient(#FF8938 1px, transparent 1px),
                          linear-gradient(90deg, #FF8938 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }

        /* Icon Card Styles */
        .icon-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .icon-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
        }

        /* Morphing Animation */
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
        }

        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }

        .animate-morph-delayed {
          animation: morph 8s ease-in-out 2s infinite;
        }

        .animate-morph-slow {
          animation: morph 12s ease-in-out infinite;
        }

        /* Gradient Animation */
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradientFlow 5s ease infinite;
        }

        /* Other Animations */
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .animate-bounce-subtle {
          animation: bounceSoft 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Typing Animation */
        .animate-blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Float Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 5s ease-in-out 1s infinite;
        }

        .animate-float-slow {
          animation: float 7s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float 9s ease-in-out 2s infinite;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1.5s ease-out forwards;
        }

        .animate-fade-in-delayed {
          opacity: 0;
          animation: fadeIn 1.5s ease-out 0.8s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Banner;
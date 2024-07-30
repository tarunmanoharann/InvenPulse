import React, { useRef, ReactNode, useEffect, useState } from 'react';
import { motion, useInView, useAnimationControls } from 'framer-motion';
import * as THREE from 'three';
import Footer from '@/components/Footer';

const HeroAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0x444444);
    scene.add(gridHelper);

    const packages: THREE.Group[] = [];
    const packageGeometry = new THREE.BoxGeometry(1, 0.6, 0.8);
    const packageMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xD3D3D3 }),
      new THREE.MeshPhongMaterial({ color: 0xA9A9A9 }),
      new THREE.MeshPhongMaterial({ color: 0x6945C9 }),
    ];

    for (let i = 0; i < 100; i++) {
      const packageGroup = new THREE.Group();
      const packageMesh = new THREE.Mesh(packageGeometry, packageMaterials[Math.floor(Math.random() * packageMaterials.length)]);
      packageGroup.add(packageMesh);

      const edgesGeometry = new THREE.EdgesGeometry(packageGeometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      packageGroup.add(edges);

      packageGroup.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 10,
        (Math.random() - 0.5) * 50
      );
      scene.add(packageGroup);
      packages.push(packageGroup);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);

      packages.forEach((pkg) => {
        pkg.rotation.y += 0.002;
        pkg.position.y = Math.abs(Math.sin(Date.now() * 0.0005 + pkg.position.x + pkg.position.z) * 1.5) + 0.5;
      });

      const time = Date.now() * 0.0002;
      camera.position.x = Math.cos(time) * 40;
      camera.position.z = Math.sin(time) * 40;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimationControls();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  company: string;
  text: string;
  avatar: string;
}

const LandingPage: React.FC = () => {
  const features: Feature[] = [
    { title: 'Real-time Tracking', description: 'Monitor your inventory levels in real-time, ensuring you never run out of stock.', icon: '📊' },
    { title: 'Advanced Analytics', description: 'Gain valuable insights into your inventory trends and make data-driven decisions.', icon: '📈' },
    { title: 'Seamless Integration', description: 'Easily integrate with your existing systems for a smooth workflow.', icon: '🔗' },
    { title: 'Automated Reordering', description: 'Set up automated reordering to maintain optimal stock levels.', icon: '🔄' },
    { title: 'Multi-location Support', description: 'Manage inventory across multiple locations from a single dashboard.', icon: '🌐' },
    { title: 'Mobile Access', description: 'Access your inventory data on-the-go with our mobile app.', icon: '📱' },
  ];

  const testimonials: Testimonial[] = [
    { name: 'John Doe', company: 'Tech Co.', text: 'InvenPulse revolutionized our inventory management process.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Jane Smith', company: 'Retail Inc.', text: "We've seen a 30% increase in efficiency since implementing InvenPulse.", avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Mike Johnson', company: 'Logistics Ltd.', text: 'The real-time tracking feature has been a game-changer for our business.', avatar: 'https://i.pravatar.cc/150?img=3' },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <AnimatedSection className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <HeroAnimation />
        <div className="z-10 bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-6xl font-bold text-white mb-6">Welcome to InvenPulse</h1>
          <p className="text-2xl text-gray-300 mb-8">Your Inventory Solution, Perfected for the Future</p>
          <button className="px-8 py-3 bg-6945C9 text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300">
            Get Started
          </button>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose InvenPulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-gray-200 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">What Our Clients Say</h2>
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <img src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].name} className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].company}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg italic">"{testimonials[currentTestimonial].text}"</p>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Basic', 'Pro', 'Enterprise'].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3, duration: 0.8 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center"
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{plan}</h3>
                <p className="text-4xl font-bold text-6945C9 mb-6">${(index + 1) * 49}<span className="text-sm text-gray-600 dark:text-gray-400">/mo</span></p>
                <ul className="text-left mb-8">
                  <li className="mb-2">✅ Feature 1</li>
                  <li className="mb-2">✅ Feature 2</li>
                  <li className="mb-2">✅ Feature 3</li>
                  {index > 0 && <li className="mb-2">✅ Feature 4</li>}
                  {index > 1 && <li className="mb-2">✅ Feature 5</li>}
                </ul>
                <button className="w-full px-6 py-3 bg-6945C9 text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300">
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-6945C9">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Optimize Your Inventory?</h2>
          <p className="text-xl text-white mb-8">Join thousands of businesses already using InvenPulse to streamline their operations.</p>
          <button className="px-8 py-3 bg-white text-6945C9 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Start Your Free Trial
          </button>
        </div>
      </AnimatedSection>

      <Footer/>
    </div>
  );
};

export default LandingPage;
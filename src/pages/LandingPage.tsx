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
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(100, 15, 0x888888, 0x444444);
    scene.add(gridHelper);

    const packages: THREE.Group[] = [];
    const packageGeometry = new THREE.BoxGeometry(2.25, 1.8, 2.25, 2, 2, 2);
    const packageMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xD3D3D3 }),
      new THREE.MeshPhongMaterial({ color: 0xA9A9A9 }),
      new THREE.MeshPhongMaterial({ color: 0x6945C9 }),
    ];

    const lidGeometry = new THREE.BoxGeometry(2.25, 0.3, 2.25, 2, 2, 2);

    for (let i = 0; i < 80; i++) {
      const packageGroup = new THREE.Group();
      const packageMesh = new THREE.Mesh(packageGeometry, packageMaterials[Math.floor(Math.random() * packageMaterials.length)]);
      packageGroup.add(packageMesh);

      const lidMesh = new THREE.Mesh(lidGeometry, packageMaterials[Math.floor(Math.random() * packageMaterials.length)]);
      lidMesh.position.y = 0.7;
      lidMesh.rotation.x = Math.random() * Math.PI / 4;
      packageGroup.add(lidMesh);

      const edgesGeometry = new THREE.EdgesGeometry(packageGeometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      packageGroup.add(edges);

      packageGroup.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 50 + 20,
        (Math.random() - 0.5) * 50
      );
      packageGroup.userData = { lifespan: Math.random() * 5 + 5 };
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

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      packages.forEach((pkg) => {
        if (pkg.position.y > 0) {
          pkg.position.y -= 0.1 * delta * 60;
          pkg.rotation.x += 0.005 * delta * 60;
          pkg.rotation.y += 0.005 * delta * 60;
        } else {
          pkg.userData.lifespan -= delta;
          if (pkg.userData.lifespan <= 0) {
            pkg.position.y = Math.random() * 50 + 20;
            pkg.position.x = (Math.random() - 0.5) * 50;
            pkg.position.z = (Math.random() - 0.5) * 50;
            pkg.userData.lifespan = Math.random() * 5 + 5;
          }
        }

        pkg.children[1].rotation.x = Math.sin(Date.now() * 0.0005 + pkg.position.x + pkg.position.z) * Math.PI / 16;
      });

      const time = Date.now() * 0.0002;
      camera.position.x = Math.cos(time) * 40;
      camera.position.z = Math.sin(time) * 40;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
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
    { title: 'Real-time Tracking', description: 'Monitor inventory levels across multiple locations in real-time, with customizable alerts for low stock.', icon: '📊' },
    { title: 'Predictive Analytics', description: 'Leverage AI-powered forecasting to optimize stock levels and reduce carrying costs.', icon: '🧠' },
    { title: 'Seamless Integration', description: 'Connect with your existing ERP, e-commerce, and POS systems for a unified workflow.', icon: '🔗' },
    { title: 'Automated Procurement', description: 'Set up intelligent reordering rules based on demand forecasts and lead times.', icon: '🔄' },
    { title: 'Multi-channel Management', description: 'Synchronize inventory across all sales channels, from brick-and-mortar to online marketplaces.', icon: '🌐' },
    { title: 'Mobile Accessibility', description: 'Manage your inventory on-the-go with our powerful mobile app, available for iOS and Android.', icon: '📱' },
  ];

  const testimonials: Testimonial[] = [
    { name: 'Sarah Johnson', company: 'TechNova Solutions', text: 'InvenPulse has transformed our supply chain management. The predictive analytics feature alone has saved us thousands in carrying costs.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Michael Chang', company: 'Global Retail Corp', text: "Since implementing InvenPulse, our stockouts have decreased by 35% and our inventory turnover has improved significantly. It's been a game-changer for our operations.", avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Emily Rodriguez', company: 'Eco Logistics', text: 'The multi-channel management feature of InvenPulse has streamlined our entire fulfillment process. We now have a single source of truth for our inventory across all platforms.', avatar: 'https://i.pravatar.cc/150?img=3' },
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
      <div className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <HeroAnimation />
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="z-10 bg-black bg-opacity-70 p-14 rounded-lg"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-6xl font-bold text-white mb-6"
          >
            Welcome to InvenPulse
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-2xl text-gray-300 mb-8"
          >
            Revolutionize Your Inventory Management
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="px-8 py-3 bg-customPurple text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300"
          >
           Get Started
          </motion.button>
        </motion.div>
      </div>

      <AnimatedSection className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Optimize Your Supply Chain</h2>
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
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Success Stories</h2>
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
    <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Flexible Pricing Plans</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {['Startup', 'Business', 'Enterprise'].map((plan, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3, duration: 0.8 }}
          className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md text-center flex flex-col h-full"
        >
          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{plan}</h3>
            <p className="text-4xl font-bold text-6945C9 mb-6">${(index + 1) * 99}<span className="text-sm text-gray-600 dark:text-gray-400">/mo</span></p>
            <ul className="text-left mb-8">
              <li className="mb-2">✅ Real-time Tracking</li>
              <li className="mb-2">✅ Multi-channel Management</li>
              <li className="mb-2">✅ Mobile App Access</li>
              {index > 0 && <li className="mb-2">✅ Advanced Analytics</li>}
              {index > 1 && <li className="mb-2">✅ Dedicated Account Manager</li>}
            </ul>
          </div>
          <button className="w-full px-6 py-3 bg-customPurple text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition duration-300 mt-auto">
            Choose Plan
          </button>
        </motion.div>
      ))}
    </div>
  </div>
</AnimatedSection>

      <AnimatedSection className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Transform Your Inventory Management?</h2>
          <p className="text-xl text-black mb-8">Join thousands of businesses already optimizing their operations with InvenPulse.</p>
          <button className="px-8 py-3 bg-customPurple text-white font-semibold rounded-lg shadow-md  transition duration-300">
            Start Your 30-Day Free Trial
          </button>
        </div>
      </AnimatedSection>

      <Footer/>
    </div>
  );
};

export default LandingPage;
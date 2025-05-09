'use client'

import React, { useRef, ReactNode, useEffect, useState } from 'react';
import { motion, useInView, useAnimationControls } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Image from 'next/image';

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
      if (mountRef.current) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.error("Error removing renderer:", e);
        }
      }
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

export default function HomePage() {
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
          className="z-10 bg-black bg-opacity-70 p-14 rounded-xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Smart Inventory Management <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your inventory operations with real-time tracking, automated replenishment, and powerful analytics.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
              Get Started Free
            </Link>
            <Link href="#features" className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>

      <AnimatedSection id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Powerful Features to <span className="text-primary">Transform</span> Your Inventory Management
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Trusted by <span className="text-primary">Industry Leaders</span>
          </h2>
          <div className="relative h-96 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-lg"
                initial={index === 0 ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                animate={{ 
                  opacity: currentTestimonial === index ? 1 : 0,
                  x: currentTestimonial === index ? 0 : 100,
                  zIndex: currentTestimonial === index ? 10 : 0
                }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex flex-col h-full justify-between">
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 italic mb-8">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 overflow-hidden rounded-full mr-4">
                      <Image
                        src={testimonial.avatar}
                        fill
                        alt={testimonial.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-primary">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-4 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Optimize Your Inventory Management?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Join thousands of businesses that have streamlined their operations with InvenPulse.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
              Start Your Free Trial
            </Link>
            <Link href="/login" className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
              Log in
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
} 
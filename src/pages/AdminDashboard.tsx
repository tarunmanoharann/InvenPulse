import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconChevronRight, IconChevronLeft, IconHome, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isActive, isExpanded, onClick }) => (
  <motion.div
    className={`flex items-center p-2 rounded-lg cursor-pointer ${
      isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
    {isExpanded && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="ml-3"
      >
        {label}
      </motion.span>
    )}
  </motion.div>
);

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeLink, setActiveLink] = useState('Home');

  const links = [
    { icon: <IconHome size={24} />, label: 'Home' },
    { icon: <IconUser size={24} />, label: 'Profile' },
    { icon: <IconSettings size={24} />, label: 'Settings' },
    { icon: <IconLogout size={24} />, label: 'Logout' },
  ];

  return (
    <motion.div
      className="bg-white h-screen shadow-lg"
      initial={{ width: isExpanded ? 240 : 80 }}
      animate={{ width: isExpanded ? 240 : 80 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          {isExpanded && <h1 className="text-xl font-bold">My App</h1>}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <IconChevronLeft size={24} /> : <IconChevronRight size={24} />}
          </motion.button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {links.map((link) => (
            <SidebarLink
              key={link.label}
              icon={link.icon}
              label={link.label}
              isActive={activeLink === link.label}
              isExpanded={isExpanded}
              onClick={() => setActiveLink(link.label)}
            />
          ))}
        </nav>
        <div className="p-4">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-500"
            >
              © 2024 My App
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
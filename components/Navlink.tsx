'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface NavLinkProps {
  label: string;
  href: string;
  pathname: string | null;
  setHoveredLink: (link: string | null) => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  href,
  pathname,
  setHoveredLink
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, color: '#359572' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setHoveredLink(href)}
      onMouseLeave={() => setHoveredLink(null)}
      className="relative"
    >
      <Link
        href={href}
        className={`flex items-center p-2 rounded-xl transition-colors w-full text-gray-800 hover:text-customGreen`}
      >
        <span className="ml-4 relative">
          {label}
          <motion.div
            className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#359572]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: pathname === `/${href}` ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </Link>
    </motion.div>
  );
};

export default NavLink;

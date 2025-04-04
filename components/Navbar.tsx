'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavLink from '@/components/Navlink';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNavbar';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const navLinks = [
  { label: 'Plan Your Trip', href: 'trip-planner', icon: '🗺️' },
  { label: 'Saved Trips', href: 'saved', icon: '❤️' },
  { label: 'Explore', href: 'explore', icon: '🔍' }
];

const Navbar = () => {
  const [, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex justify-between items-center mt-4 h-16 bg-transparent text-black relative p-2 px-6 shadow-md rounded-2xl z-50">
      <Link href="/" className="flex items-center">
        <Image
          src="/tripgenius.png"
          alt="TripGenius Logo"
          width={64}
          height={64}
        />
        <p className="font-light tracking-wider text-xl">
          trip
          <span className="font-bold tracking-normal text-[#359572] drop-shadow-2xl">
            Genius
          </span>
        </p>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4 text-[#2c3e2e] font-medium text-lg">
        <SignedIn>
          {navLinks.map(({ label, href }) => (
            <NavLink
              key={href}
              label={label}
              href={href}
              pathname={pathname}
              setHoveredLink={setHoveredLink}
            />
          ))}

          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in" passHref>
            <motion.div
              whileHover={{
                scale: 1.03,
                boxShadow: '0px 5px 15px rgba(29, 53, 87, 0.2)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full py-2 px-4 rounded-xl flex items-center font-light justify-center bg-[#1d3557] text-white cursor-pointer"
            >
              Sign In
            </motion.div>
          </Link>
        </SignedOut>
      </div>

      {/* Mobile Navigation */}
      <button
        className="md:hidden cursor-pointer text-[#1d3557] z-50"
        onClick={handleMenuToggle}
      >
        {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;

'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const isLoggedIn = false;

  return (
    <div className="flex justify-between items-center mt-4 h-16 bg-transparent text-black relative p-2 px-6 shadow-md rounded-2xl">
      <Link href="/" className="flex justify-center items-center">
        <Image
          src="/tripgenius.png"
          alt="TripGenius Logo"
          width={64}
          height={64}
        />
        <p className="font-light tracking-wider text-xl">
          trip
          <span className="font-bold tracking-normal text-customGreen drop-shadow-2xl">
            Genius
          </span>
        </p>
      </Link>
      <div className="flex items-center space-x-8 text-mainColor font-medium text-lg">
        {isLoggedIn &&
          [
            { label: 'Plan Your Trip', href: 'trip' },
            { label: 'Saved Trips', href: 'saved' },
            { label: 'Explore', href: 'explore' },
            { label: 'Profile', href: 'user' }
          ].map(({ label, href }) => (
            <div
              key={href}
              className="relative"
              onMouseEnter={() => setHoveredLink(href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link href={`/${href}`} className="relative">
                <span
                  className={`transition duration-300 ${
                    hoveredLink === href ? 'text-mainColor' : 'text-accentColor'
                  }`}
                >
                  {label}
                </span>
              </Link>
              <motion.div
                className="absolute -bottom-1 left-1/2 h-0.5 bg-accentOrange translate-x-[-50%] rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: hoveredLink === href ? '50%' : 0
                }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              />
            </div>
          ))}
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: '0px 5px 15px rgba(29, 53, 87, 0.2)',
            borderRadius: '0.5rem'
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {!isLoggedIn && (
            <Link
              className="bg-accentOrange rounded-lg text-white px-5 py-2 inline-block text-base"
              href="/login"
            >
              Login
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Navbar;

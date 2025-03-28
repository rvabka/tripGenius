import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

const sidebarVariants = {
  closed: {
    x: '100%',
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    x: '0%',
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  closed: { x: 20, opacity: 0 },
  open: { x: 0, opacity: 1 }
};

interface MobileNavProps {
  isOpen: boolean;
  navLinks: Array<{
    label: string;
    href: string;
    icon: string;
  }>;
  onClose: () => void;
}

const MobileNav = ({ isOpen, navLinks, onClose }: MobileNavProps) => {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl z-40 md:hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/tripgenius.png"
                  alt="TripGenius Logo"
                  width={40}
                  height={40}
                />
                <p className="font-light tracking-wider text-lg ml-2">
                  trip
                  <span className="font-bold tracking-normal text-[#359572]">
                    Genius
                  </span>
                </p>
              </div>
            </div>

            <SignedIn>
              <motion.div
                variants={itemVariants}
                className="p-6 border-b border-gray-100 flex items-center"
              >
                <UserButton afterSignOutUrl="/" />
                <div className="ml-4">
                  <p className="font-medium text-[#2c3e2e]">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </motion.div>

              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map(({ label, href, icon }, index) => (
                  <motion.div
                    key={href}
                    variants={itemVariants}
                    custom={index}
                    className="px-6 py-3"
                    onClick={onClose}
                  >
                    <Link
                      href={`/${href}`}
                      className={`flex items-center space-x-4 p-2 rounded-xl transition-colors ${
                        pathname === `/${href}`
                          ? 'bg-[#4a6b4a]/10 text-[#359572] font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{icon}</span>
                      <span>{label}</span>
                      {pathname === `/${href}` && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-6 rounded-full bg-[#359572]"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">
                  Please sign in to access features
                </p>
              </div>
            </SignedOut>

            <motion.div
              variants={itemVariants}
              className="p-6 border-t border-gray-100 mt-auto"
            >
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
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;

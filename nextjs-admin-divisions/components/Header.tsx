'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const Header = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here, e.g., router.push(`/search?q=${searchTerm}`);
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="bg-gray-800 shadow-lg">
      <nav className="container mx-auto py-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Logo and Mobile Hamburger */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link href="/" className="text-xl font-semibold text-white" onClick={closeMenu}>
              Toko Monggo
            </Link>

            {/* Mobile Hamburger Icon */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Search Bar - Integrated for Desktop, below logo for Mobile */}
          <div className="w-full mt-3 md:mt-0 md:order-2 md:flex-grow md:max-w-xl md:mx-4">
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Cari produk..." // Search products...
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="absolute left-3 text-gray-400 hover:text-white focus:outline-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 md:order-3">
            {status === 'loading' && (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-md"></div>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link href="/auth/signin" className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600">
                  Sign Up
                </Link>
              </>
            )}
            {status === 'authenticated' && (
              <>
                <span className="text-gray-200">Hi, {session.user?.name || 'User'}</span>
                <Link href="/profile" className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600">
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-95 z-50 flex flex-col items-center justify-center space-y-6">
          <button onClick={closeMenu} className="absolute top-4 right-4 text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {status === 'loading' && (
            <div className="animate-pulse h-10 w-32 bg-gray-200 rounded-md"></div>
          )}
          {status === 'unauthenticated' && (
            <>
              <Link href="/auth/signin" className="text-white text-lg font-medium hover:text-indigo-300" onClick={closeMenu}>
                Sign In
              </Link>
              <Link href="/auth/signup" className="text-white text-lg font-medium hover:text-indigo-300" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
          {status === 'authenticated' && (
            <>
              <span className="text-gray-200 text-lg">Hi, {session.user?.name || 'User'}</span>
              <Link href="/profile" className="text-white text-lg font-medium hover:text-indigo-300" onClick={closeMenu}>
                Profile
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); closeMenu(); }}
                className="text-white text-lg font-medium hover:text-red-300"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
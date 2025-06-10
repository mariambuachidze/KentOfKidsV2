"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaBars, FaTimes, FaUser, FaShoppingBag } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log(session?.user?.name);
  };

  const isActive = (path) => {
    return pathname === path
      ? "text-primary font-bold"
      : "text-gray-700 hover:text-primary";
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">
              Kent Of Kids
            </span>
          </Link>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`${isActive("/")} transition duration-200`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/products"
              className={`${isActive("/products")} transition duration-200`}
            >
              Ürünler
            </Link>
            <Link
              href="/appointments"
              className={`${isActive("/appointments")} transition duration-200`}
            >
              Randevular
            </Link>
            <Link
              href="/about"
              className={`${isActive("/about")} transition duration-200`}
            >
              Hakkımızda
            </Link>
              {session?.user && (
              <Link
                href="/profile"
                className={`${isActive("/admin")} transition duration-200`}
              >
                Profile
              </Link>
            )}

            {session?.user?.isAdmin && (
              <Link
                href="/admin"
                className={`${isActive("/admin")} transition duration-200`}
              >
                Admin Paneli
              </Link>
            )}
          </nav>

          {/* Giriş/Çıkış Butonları */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-primary" />
                  <Link 
                    href="/profile" 
                    className="text-sm font-medium hover:text-primary transition duration-200"
                  >
                    {session.user.name}
                  </Link>
                </div>
                <button onClick={() => signOut()} className="btn btn-outline">
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary transition duration-200"
                >
                  Giriş
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`${isActive("/")} transition duration-200`}
                onClick={toggleMenu}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/products"
                className={`${isActive("/products")} transition duration-200`}
                onClick={toggleMenu}
              >
                Ürünler
              </Link>
              <Link
                href="/appointments"
                className={`${isActive(
                  "/appointments"
                )} transition duration-200`}
                onClick={toggleMenu}
              >
                Randevular
              </Link>
              <Link
                href="/about"
                className={`${isActive("/about")} transition duration-200`}
                onClick={toggleMenu}
              >
                Hakkımızda
              </Link>

              {status === "authenticated" ? (
                <>
                  <div className="flex items-center space-x-2 py-2">
                    <FaUser className="text-primary" />
                    <Link 
                      href="/profile" 
                      className="text-sm font-medium hover:text-primary transition duration-200"
                      onClick={toggleMenu}
                    >
                      {session.user.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="btn btn-outline w-full"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-3">
                  <Link
                    href="/login"
                    className="btn btn-outline w-full text-center"
                    onClick={toggleMenu}
                  >
                    Giriş
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary w-full text-center"
                    onClick={toggleMenu}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
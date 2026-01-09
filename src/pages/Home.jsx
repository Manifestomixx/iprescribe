import React, { useState, useEffect, useRef } from "react";
import { Icon } from "../components/Icon";
import Notification from "../components/Notification";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuRef = useRef(null);
  const footerRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        type: 'success',
        title: 'Successful!',
        message: 'Your email has been submitted on our waitlist',
        bgColor: 'bg-[#283C85]',
        borderColor: 'border-blue-900',
        iconBg: 'bg-green-100',
                  logo: Icon.logoWhite,
        textColor: 'text-white',
        duration: 2000
      });
      setEmail('');
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white bg-gradient-to-b from-[#ffffff] to-[#e4eafe] min-h-screen" style={{ fontFamily: "'Onest', sans-serif" }}>
        <div
          className="flex flex-row justify-between items-center gap-2 sm:gap-4 py-3 sm:py-4 md:py-6 relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"
          ref={menuRef}
        >
          <img
            src={Icon.logo}
            alt="logo"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex-shrink-0"
          />

          <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 items-center">
            <button
              className="sm:hidden bg-[#283C85] text-[10px] xs:text-xs text-white px-3 xs:px-4 py-2 xs:py-2.5 rounded-full hover:bg-[#1e2d6b] transition-colors whitespace-nowrap"
              onClick={scrollToFooter}
            >
              Join Waitlist
            </button>

            <button
              onClick={toggleMenu}
              className="sm:hidden flex flex-col gap-1.5 p-2 z-50 bg-[#EEF2FF] rounded-md"
              aria-label="Toggle menu"
            >
              <span
                className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-gray-800 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>

            <div className="hidden sm:flex sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 items-center">
              <div className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm md:text-base">
                <p className="cursor-not-allowed hover:text-[#1e2d6b] transition-colors whitespace-nowrap">
                  Home
                </p>
                <p className="cursor-not-allowed hover:text-[#1e2d6b] transition-colors whitespace-nowrap">
                  Features
                </p>
                <p className="cursor-not-allowed hover:text-[#1e2d6b] transition-colors whitespace-nowrap">
                  Contact us
                </p>
              </div>
              <button 
                onClick={scrollToFooter}
                className="bg-[#283C85] cursor-pointer text-xs sm:text-sm md:text-base text-white px-4 sm:px-5 md:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-full hover:bg-[#1e2d6b] transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </div>

            <div
              className={`sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out z-40 ${
                isMenuOpen
                  ? "opacity-100 max-h-96"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-4 text-base">
                  <p
                    className="cursor-pointer hover:text-[#283C85] transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Home
                  </p>
                  <p
                    className="cursor-pointer hover:text-[#283C85] transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Features
                  </p>
                  <p
                    className="cursor-pointer hover:text-[#283C85] transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Contact us
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12 pb-8 sm:pb-12 md:pb-16 lg:pb-20 pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="flex text-center md:text-left flex-col space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 w-full md:w-1/2 md:justify-start">
            <div className="bg-[#689AFF1A] inline-flex w-fit flex-row items-center gap-2 xs:gap-3 p-2.5 sm:p-3 md:p-4 rounded-lg text-[10px] md:text-xs">
                <img src={Icon.profiles} alt="" />
              <p className="whitespace-nowrap">Ready to explore iPrescribe?</p>
              <button 
                onClick={scrollToFooter}
                className="text-[#405ABA] font-semibold whitespace-nowrap hover:underline"
              >
                Join Waitlist
              </button>
            </div>
            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] px-2 md:px-0 font-bold leading-tight sm:leading-tight md:leading-tight">
              Your Bridge Between Care & Convenience
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              Schedule consultations, send or receive e-prescriptions, and
              manage medications from one secure platform.
            </p>
            <div className="flex sm:flex-row gap-3 sm:gap-4 md:gap-5 mt-4 sm:mt-5 md:mt-6 justify-center md:justify-start">
              <button 
                onClick={() => setNotification({
                  type: 'info',
                  title: 'Coming Soon!',
                  message: 'We are launching this soon',
                  bgColor: 'bg-white',
                  borderColor: 'border-blue-200',
                  iconBg: '',
                  logo: Icon.logo,
                  textColor: 'text-gray-900',
                  duration: 4000
                })}
                className="flex items-center justify-center sm:justify-start gap-2 bg-black px-4 sm:px-5 lg:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-xl text-white hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                <img
                  src={Icon.playstore}
                  alt="googlePlay"
                  className="w-5 h-5 sm:w-6 md:w-7 lg:w-8 flex-shrink-0"
                />
                <div className="text-left">
                  <p className="text-[8px] sm:text-[11px] md:text-[8px]">
                    Coming Soon
                  </p>
                  <p className="text-xs sm:text-sm md:text-[12px]">Google Play</p>
                </div>
              </button>
              <button 
                onClick={() => setNotification({
                  type: 'info',
                  title: 'Coming Soon!',
                  message: 'We are launching this soon',
                  bgColor: 'bg-white',
                  borderColor: 'border-blue-200',
                  iconBg: '',
                  logo: Icon.logo,
                  textColor: 'text-gray-900',
                  duration: 4000
                })}
                className="flex items-center justify-center sm:justify-start gap-2 bg-black px-4 sm:px-5 md:px-6 lg:px-7 py-2.5 sm:py-3 md:py-3.5 rounded-xl text-white hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                <img
                  src={Icon.apple}
                  alt="apple"
                  className="w-5 h-5 sm:w-6 md:w-7 lg:w-8 flex-shrink-0"
                />
                <div className="text-left">
                  <p className="text-[8px] md:text-[8px]   ">
                    Coming Soon
                  </p>
                  <p className="text-xs sm:text-sm md:text-[12px]">Apple Store</p>
                </div>
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center md:items-start md:justify-end">
            <img
              src={Icon.phone}
              alt="phone"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
            />
          </div>
        </div>

        <div ref={footerRef} className="flex flex-col justify-between items-center gap-6 sm:gap-8 md:gap-10 pb-8 pt-6  px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 bg-[#283C85]">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 justify-center items-center text-center text-white space-y-3 sm:space-y-4 md:space-y-5 pb-10 w-full max-w-xl">
            <h1 className="text-[24px] md:text-[32px] pt-5 font-bold leading-tight">
              Join Our Waitlist
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-4 leading-relaxed">
              Be the first one to know about discounts, offers and events weekly
              in your mailbox. Unsubscribe whenever you like with one click.
            </p>

            <form onSubmit={handleEmailSubmit} className="w-full bg-[#405192] outline-none flex sm:flex-row p-1.5 sm:p-2 items-center justify-between border-1 border-gray-500 rounded-full gap-2 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="ml-2 sm:ml-4 sm:mr-2 text-white bg-transparent ring-0 focus:outline-none focus:ring-0 placeholder:text-gray-300 text-xs sm:text-sm md:text-base flex-1 min-w-0 w-full sm:w-auto"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-[#283C85] px-4 sm:px-5 md:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-medium hover:bg-gray-100 transition-colors whitespace-nowrap sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#283C85]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
          <span className="w-full h-[1px] bg-white opacity-20"></span>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-8 w-full pt-6 sm:pt-8">
            <img
              src={Icon.logoWhite}
              alt="logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 order-1"
            />
            <p className="text-white text-xs sm:text-sm md:text-base text-center sm:text-center order-3 sm:order-2">
              © 2025, All Rights Reserved
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-1 order-2 sm:order-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full p-2"
              >
                <img src={Icon.facebook} alt="facebook" className="" />{" "}
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full p-2"
              >
                <img src={Icon.youtube} alt="youtube" className="" />{" "}
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full p-2"
              >
                <img src={Icon.whatsapp} alt="whatsapp" className="" />{" "}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Notification notification={notification} onClose={() => setNotification(null)} />
    </>
  );
};
export default Home;

import React, { useState, useEffect, useCallback, useRef } from "react";

const Notification = ({ notification, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const notificationIdRef = useRef(null);

  useEffect(() => {
    if (notification) {
      setShouldRender(true);
    }
  }, [notification]);

  const closeNotification = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (notification) {
      const currentId = `${notification.title}-${notification.message}`;
      if (notificationIdRef.current !== currentId) {
        setIsClosing(false);
        notificationIdRef.current = currentId;
      }
    } else {
      notificationIdRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification?.title, notification?.message]);

  useEffect(() => {
    if (notification && !isClosing) {
      const timer = setTimeout(() => {
        closeNotification();
      }, notification.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, isClosing, closeNotification]);

  if (!shouldRender) return null;

  return (
    <>
      <div className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>
        <div className={`${notification.bgColor} rounded-lg shadow-2xl border ${notification.borderColor} p-4 sm:p-5 max-w-sm w-full flex items-start gap-3 sm:gap-4`}>
          <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full`}>
            <img src={notification.logo} alt="notification-logo" className="" />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-base font-semibold ${notification.textColor} mb-1`}>
              {notification.title}
            </p>
            <p className={`text-[8px] sm:text-sm ${notification.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>
              {notification.message}
            </p>
          </div>

          <button
            onClick={closeNotification}
            className={`flex-shrink-0 ${notification.textColor === 'text-white' ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
            aria-label="Close notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-in-out forwards;
        }
        .animate-slide-out {
          animation: slide-out 0.3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default Notification;


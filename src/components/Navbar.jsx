import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import useAuthStore from '../store/authStore';

export default function Navbar({ onMenuClick }) {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getUserDisplayName = () => {
        if (!user) return 'User';
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName || 'User';
    };

    const getUserInitials = () => {
        if (!user) return 'U';
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return (firstInitial + lastInitial) || 'U';
    };

    const getUserRole = () => {
        if (!user || !user.roles || user.roles.length === 0) return 'User';
        const defaultRole = user.roles.find(role => role.default === 1);
        return defaultRole ? defaultRole.name : user.roles[0].name;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="h-[64px] bg-white flex items-center justify-between md:justify-end gap-5 px-4 md:px-0">
            <button
                onClick={onMenuClick}
                className="md:hidden flex flex-col gap-1.5 p-2 relative z-10"
                aria-label="Toggle menu"
            >
                <span className="w-6 h-0.5 bg-gray-800 transition-all duration-300"></span>
                <span className="w-6 h-0.5 bg-gray-800 transition-all duration-300"></span>
                <span className="w-6 h-0.5 bg-gray-800 transition-all duration-300"></span>
            </button>
            
            <div className="flex items-center gap-5 lg:pr-10">
               <img src={Icon.notification} alt="notification" className="hidden sm:block" />
               <span className='border-l-1 h-10 border-zinc-200 hidden sm:block'></span>
               <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 pr-2">
                    {user?.image ? (
                        <img 
                            src={user.image} 
                            alt={getUserDisplayName()} 
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">{getUserInitials()}</span>
                        </div>
                    )}
                    <div className='hidden sm:block'>
                        <p className='text-sm font-medium'>{getUserDisplayName()}</p>
                        <p className='text-xs text-blue-700'>{getUserRole()}</p>
                    </div>
                    <button 
                        onClick={toggleDropdown}
                        className="hidden sm:block cursor-pointer hover:opacity-70 transition-opacity"
                        aria-label="Toggle dropdown"
                    >
                        <img 
                            src={Icon.arrowDown} 
                            alt="down" 
                            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
                
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-500 cursor-pointer transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                )}
               </div>
            </div>
        </div>
    )
}
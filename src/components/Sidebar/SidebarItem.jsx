import { Link, useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import DynamicIcon from '../DynamicIcon'

export default function SidebarItem({ title, path, iconName, iconRaw, onClose }) {
    const location = useLocation()
    const isActive = location.pathname === path || 
                     (title === 'Dashboard' && (location.pathname === '/' || location.pathname === '/dashboard'))

    const handleClick = () => {
        if (onClose && window.innerWidth < 768) {
            onClose()
        }
    }

    return (
        <Link 
            to={path} 
            onClick={handleClick}
            className={`relative flex items-center gap-3 p-3 transition-colors rounded-l-full ${
                isActive 
                    ? 'bg-white' 
                    : 'hover:bg-white/10'
            }`}
        >
            {isActive && <span className='absolute left-[-16px] top-0 bottom-0 border-l-6 rounded-r-full border-white'></span>}
            <DynamicIcon 
                src={iconName} 
                svgContent={iconRaw}
                isActive={isActive}
                style={{ width: '24px', height: '24px', flexShrink: 0 }}
            />
            <Typography variant="body1" color={isActive ? "#283C85" : "white"} sx={{ fontWeight: isActive ? 600 : 400, fontSize: '0.875rem' }}>
                {title}
            </Typography>
        </Link>
    )
}
import { useState } from "react"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar"

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    return (
        <div className="flex h-screen relative">
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 bg-opacity-20 backdrop-blur-xs z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}
            
            <div className={`
                fixed md:static inset-y-0 left-0 z-[60]
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <Sidebar onClose={closeSidebar} />
            </div>
            
            <div className="flex-1 flex flex-col min-h-0 w-full md:w-auto">
                <Navbar onMenuClick={toggleSidebar} />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
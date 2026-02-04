import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            {/* Overlay for mobile */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                ></div>
            )}

            <Sidebar role={role} isCollapsed={!isSidebarOpen} />

            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <Topbar role={role} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="p-8 flex-1 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

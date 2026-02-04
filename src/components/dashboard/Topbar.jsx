import { FiSearch, FiBell, FiUser, FiMenu } from 'react-icons/fi';

const Topbar = ({ role, toggleSidebar }) => {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FiMenu className="w-6 h-6 text-gray-600" />
                </button>
                <div className="hidden md:flex relative group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="pl-12 pr-6 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none w-64 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                    <FiBell className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">Dr. Rajesh Kumar</p>
                        <p className="text-xs font-semibold text-gray-500 capitalize">{role}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-secondary rounded-xl flex items-center justify-center text-white shadow-md">
                        <FiUser className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiSearch } from 'react-icons/fi';

const FindDoctor = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');

    const departments = ['All', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Gynecology', 'Neurology'];

    const doctors = [
        {
            id: 1,
            name: 'Dr. Pravesh Kumar',
            specialty: 'Cardiologist',
            experience: '15 years',
            image: '/public/21004063.jpg',
            department: 'Cardiology',
        },
        {
            id: 2,
            name: 'Dr. Subham Shekhar Das',
            specialty: 'Pediatrician',
            experience: '12 years',
            image: '/public/21004063.jpg',
            department: 'Pediatrics',
        },
        {
            id: 3,
            name: 'Dr. Chandan Shashank',
            specialty: 'Orthopedic Surgeon',
            experience: '18 years',
            image: '/public/21004063.jpg',
            department: 'Orthopedics',
        },
        {
            id: 4,
            name: 'Dr. Nikitha Reddy',
            specialty: 'Gynecologist',
            experience: '10 years',
            image: '/public/21004063.jpg',
            department: 'Gynecology',
        },
        {
            id: 5,
            name: 'Dr. Achyut Shivarao',
            specialty: 'Neurologist',
            experience: '20 years',
            image: '/public/21004063.jpg',
            department: 'Neurology',
        },
        {
            id: 6,
            name: 'Dr. Aishwarya',
            specialty: 'Cardiologist',
            experience: '14 years',
            image: '/public/21004063.jpg',
            department: 'Cardiology',
        },
    ];

    const filteredDoctors = doctors.filter(doc => {
        const matchesDepartment = activeFilter === 'All' || doc.department === activeFilter;
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDepartment && matchesSearch;
    });

    return (
        <section id="doctors" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="section-title">Find a Doctor</h2>
                    <p className="section-subtitle">
                        Expertise you can trust. Meet our esteemed doctors who bring exceptional
                        knowledge, compassion, and innovation to provide top-notch care.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8 px-4 sm:px-0">
                    <div className="relative group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by doctor name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 text-gray-700 bg-white shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>

                {/* Department Filters */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
                    {departments.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setActiveFilter(dept)}
                            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${activeFilter === dept
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                                }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor, index) => (
                        <div
                            key={doctor.id}
                            className="card p-6 animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-primary-100"
                                />
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {doctor.name}
                                </h3>
                                <p className="text-primary-600 font-medium mb-1">
                                    {doctor.specialty}
                                </p>
                                <p className="text-gray-500 text-sm mb-4">
                                    Experience: {doctor.experience}
                                </p>

                                <div className="flex gap-3 w-full mt-4">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex-1 flex items-center justify-center space-x-2 bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        <span className="text-sm font-medium">Online Consult</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        <FiMapPin className="w-4 h-4" />
                                        <span className="text-sm font-medium">Hospital Visit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No doctors found in this department.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FindDoctor;

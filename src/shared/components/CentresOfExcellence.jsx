import { useState } from 'react';
import { FiArrowRight, FiHeart, FiActivity, FiBriefcase, FiZap } from 'react-icons/fi';
import { MdChildCare, MdPregnantWoman } from 'react-icons/md';

const CentresOfExcellence = () => {
    const [activeTab, setActiveTab] = useState('cardiology');

    const centres = {
        cardiology: {
            title: 'Cardiology',
            icon: <FiHeart className="w-6 h-6" />,
            description: 'Our Cardiology department offers comprehensive heart care with state-of-the-art diagnostic and treatment facilities. From preventive cardiology to complex cardiac surgeries, we ensure your heart is in the best hands.',
            services: [
                'Cardiac Catheterization',
                'Echocardiography',
                'Heart Failure Management',
                'Interventional Cardiology',
                'Pacemaker Implantation',
                'Preventive Cardiology',
            ],
            color: 'from-red-500 to-pink-600',
        },
        pediatrics: {
            title: 'Pediatrics',
            icon: <MdChildCare className="w-6 h-6" />,
            description: 'Every child possesses unique qualities. Our pediatric specialists provide comprehensive and customized care for your little ones, ensuring their holistic development and well-being with compassion and expertise.',
            services: [
                'General Pediatrics',
                'Neonatal Care',
                'Pediatric Surgery',
                'Developmental Pediatrics',
                'Pediatric Nutrition',
                'Vaccinations',
            ],
            color: 'from-blue-500 to-cyan-600',
        },
        orthopedics: {
            title: 'Orthopedics',
            icon: <FiActivity className="w-6 h-6" />,
            description: 'Our orthopedic department specializes in treating bone, joint, and muscle conditions using advanced techniques and personalized rehabilitation programs to restore your mobility and quality of life.',
            services: [
                'Joint Replacement',
                'Sports Medicine',
                'Spine Surgery',
                'Trauma Care',
                'Arthroscopy',
                'Physiotherapy',
            ],
            color: 'from-orange-500 to-amber-600',
        },
        gynecology: {
            title: 'Gynecology',
            icon: <MdPregnantWoman className="w-6 h-6" />,
            description: 'We provide comprehensive women\'s healthcare services with a team of experienced gynecologists and obstetricians, ensuring personalized care throughout all life stages.',
            services: [
                'Prenatal Care',
                'High-Risk Pregnancy',
                'Minimally Invasive Surgery',
                'Fertility Treatment',
                'Menopause Management',
                'Well-Woman Check-ups',
            ],
            color: 'from-purple-500 to-pink-600',
        },
        neurology: {
            title: 'Neurology',
            icon: <FiZap className="w-6 h-6" />,
            description: 'Our neurology department offers advanced diagnosis and treatment for neurological disorders with cutting-edge technology and a multidisciplinary approach to brain and nervous system care.',
            services: [
                'Stroke Management',
                'Epilepsy Treatment',
                'Movement Disorders',
                'Neurosurgery',
                'Pain Management',
                'Neuro Rehabilitation',
            ],
            color: 'from-indigo-500 to-purple-600',
        },
    };

    const tabs = Object.keys(centres);

    return (
        <section id="centres" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="section-title">Our Centres of Excellence</h2>
                    <p className="section-subtitle">
                        Discover our premier centers of medical expertise, meticulously crafted
                        to meet global standards and dedicated to ensuring patient well-being.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab
                                ? `bg-gradient-to-r ${centres[tab].color} text-white shadow-lg transform scale-105`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span className={activeTab === tab ? 'text-white' : 'text-gray-600'}>
                                {centres[tab].icon}
                            </span>
                            <span>{centres[tab].title}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    <div className="glass rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Left: Description */}
                            <div>
                                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${centres[activeTab].color} rounded-xl text-white mb-6`}>
                                    {centres[activeTab].icon}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                    {centres[activeTab].title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    {centres[activeTab].description}
                                </p>
                                <button className={`flex items-center space-x-2 bg-gradient-to-r ${centres[activeTab].color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}>
                                    <span>Learn More</span>
                                    <FiArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Right: Services List */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-6">Key Services</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {centres[activeTab].services.map((service, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${centres[activeTab].color} mt-2 flex-shrink-0`}></div>
                                            <span className="text-gray-700 font-medium">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CentresOfExcellence;

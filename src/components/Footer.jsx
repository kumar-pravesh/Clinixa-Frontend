import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Centres of Excellence', href: '#centres' },
        { name: 'Our Doctors', href: '#doctors' },
        { name: 'Services', href: '#services' },
        { name: 'Contact Us', href: '#contact' },
    ];

    const services = [
        { name: 'Emergency Care', href: '#services' },
        { name: 'Online Consultation', href: '#doctors' },
        { name: 'Health Checkups', href: '#services' },
        { name: 'Lab Tests', href: '#services' },
        { name: 'Pharmacy', href: '#services' },
        { name: 'Home Healthcare', href: '#services' },
    ];

    const socialLinks = [
        { icon: <FiFacebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
        { icon: <FiTwitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
        { icon: <FiInstagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
        { icon: <FiLinkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer id="contact" className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* About Clinixa */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-2xl font-bold text-white font-display">
                                Clinixa
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Providing world-class healthcare services with compassion and excellence.
                            Your health is our priority.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Our Services</h3>
                        <ul className="space-y-2">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href={service.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                                    >
                                        {service.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <FiMapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                                <span className="text-gray-400">
                                    123 Healthcare Avenue,<br />
                                    Medical District,<br />
                                    Mumbai - 400001, India
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href="tel:+911234567890" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    +91 123 456 7890
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                <a href="mailto:info@clinixa.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    info@clinixa.com
                                </a>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <a href="tel:+911234567890" className="btn-accent w-full text-center block">
                                Emergency: Call Now
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} Clinixa Healthcare. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="#privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#disclaimer" className="text-gray-400 hover:text-primary-400 transition-colors">
                                Medical Disclaimer
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

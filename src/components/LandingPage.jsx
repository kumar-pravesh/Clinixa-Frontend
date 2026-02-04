import { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import QuickActions from './QuickActions';
import FindDoctor from './FindDoctor';
import CentresOfExcellence from './CentresOfExcellence';
import Services from './Services';
import Stats from './Stats';
import FAQ from './FAQ';
import Footer from './Footer';
import BookingModal from './dashboard/features/BookingModal';

const LandingPage = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen">
            <Navbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onOpenBooking={() => setIsBookingModalOpen(true)}
            />
            <Hero onOpenBooking={() => setIsBookingModalOpen(true)} />
            <QuickActions onOpenBooking={() => setIsBookingModalOpen(true)} />
            <FindDoctor searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <CentresOfExcellence />
            <Services />
            <Stats />
            <FAQ />
            <Footer />

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />
        </div>
    );
};

export default LandingPage;

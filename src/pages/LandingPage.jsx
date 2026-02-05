import { useState } from 'react';
import Navbar from '../shared/components/Navbar';
import Hero from '../shared/components/Hero';
import QuickActions from '../shared/components/QuickActions';
import FindDoctor from '../shared/components/FindDoctor';
import CentresOfExcellence from '../shared/components/CentresOfExcellence';
import Services from '../shared/components/Services';
import Stats from '../shared/components/Stats';
import FAQ from '../shared/components/FAQ';
import Footer from '../shared/components/Footer';
import BookingModal from '../modules/patient/components/BookingModal';

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

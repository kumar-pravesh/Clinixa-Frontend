import Navbar from './Navbar';
import Hero from './Hero';
import QuickActions from './QuickActions';
import FindDoctor from './FindDoctor';
import CentresOfExcellence from './CentresOfExcellence';
import Services from './Services';
import Stats from './Stats';
import FAQ from './FAQ';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <QuickActions />
            <FindDoctor />
            <CentresOfExcellence />
            <Services />
            <Stats />
            <FAQ />
            <Footer />
        </div>
    );
};

export default LandingPage;

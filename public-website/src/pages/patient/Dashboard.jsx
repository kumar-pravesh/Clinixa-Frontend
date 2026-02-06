import { Link } from 'react-router-dom';

const PatientDashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Book Appointment Card */}
                <div className="bg-gradient-to-br from-primary to-teal-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
                    <h2 className="text-xl font-bold mb-2">Book Appointment</h2>
                    <p className="mb-4 opacity-90">Find a doctor and book a slot instantly.</p>
                    <Link to="/patient/book-appointment" className="inline-block bg-white text-primary px-4 py-2 rounded font-semibold hover:bg-gray-100">
                        Book Now
                    </Link>
                </div>

                {/* My Appointments Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-secondary transform transition hover:translate-y-[-2px]">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Upcoming Appointments</h2>
                    <p className="text-gray-600 mb-4">Check your schedule bookings.</p>
                    <Link to="/patient/appointments" className="text-secondary font-semibold hover:underline">
                        View Schedule &rarr;
                    </Link>
                </div>

                {/* Medical Records Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-accent transform transition hover:translate-y-[-2px]">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Prescriptions & Reports</h2>
                    <p className="text-gray-600 mb-4">View your medical history.</p>
                    <Link to="/patient/prescriptions" className="text-accent font-semibold hover:underline">
                        View Records &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;

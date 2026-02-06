const Prescriptions = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Medical Records</h1>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-blue-700">Digital records of your prescriptions and lab reports will appear here after your doctor uploads them.</p>
            </div>

            <div className="bg-white p-8 text-center text-gray-500 rounded-lg border border-dashed border-gray-300">
                <p>No records found.</p>
            </div>
        </div>
    );
};

export default Prescriptions;

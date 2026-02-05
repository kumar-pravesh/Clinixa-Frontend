import { useState } from "react";

const Ragesterwalkin = () => {

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        mobile: "",
        visitType: "",
        department: "",
        doctor: "",
        symptoms: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // UI phase – just log
        console.log("Registered Patient:", formData);

        // Later → API call + token generation
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Register Walk-in Patient
                </h1>
                <p className="text-gray-500 font-medium">
                    Add patient details for consultation
                </p>
            </div>

            {/* Form Card */}
            <div className="card p-8">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    {/* Patient Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Patient Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                            required
                        >
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Blood Group
                        </label>
                        <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                        >
                            <option value="">Select blood group</option>
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>O+</option>
                            <option>O-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                        </select>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter mobile number"
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                            required
                        />
                    </div>

                    {/* Visit Type */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Visit Type
                        </label>
                        <select
                            name="visitType"
                            value={formData.visitType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                        >
                            <option value="">Select visit type</option>
                            <option>General Consultation</option>
                            <option>Emergency</option>
                            <option>Follow-up</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Department
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                        >
                            <option value="">Select department</option>
                            <option>General Medicine</option>
                            <option>Cardiology</option>
                            <option>Orthopedics</option>
                            <option>Pediatrics</option>
                        </select>
                    </div>

                    {/* Doctor */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Doctor (Optional)
                        </label>
                        <select
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                        >
                            <option value="">Select doctor</option>
                            <option>Dr. Sharma</option>
                            <option>Dr. Patel</option>
                            <option>Dr. Mehta</option>
                        </select>
                    </div>

                    {/* Symptoms */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-600 mb-1">
                            Symptoms / Notes
                        </label>
                        <textarea
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter symptoms or reason for visit"
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 resize-none"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                        <button
                            type="reset"
                            onClick={() => setFormData({
                                name: "",
                                dob: "",
                                gender: "",
                                bloodGroup: "",
                                mobile: "",
                                visitType: "",
                                department: "",
                                doctor: "",
                                symptoms: ""
                            })}
                            className="px-6 py-3 rounded-xl border font-bold text-gray-600 hover:bg-gray-50"
                        >
                            Reset
                        </button>

                        <button
                            type="submit"
                            className="btn-primary px-8 py-3"
                        >
                            Register Patient
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Ragesterwalkin;

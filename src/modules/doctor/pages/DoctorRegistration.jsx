import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUserPlus, FiMail, FiPhone, FiLock, FiActivity, FiMapPin, FiArrowLeft, 
  FiCheckCircle 
} from 'react-icons/fi';

const DoctorRegistration = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    experience: '',
    qualification: '',
    hospital: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    licenseNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const specializations = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
    'Pediatrician', 'Orthopedist', 'Gynecologist', 'Dentist', 'Ophthalmologist'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Valid email required';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = '10-digit phone required';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    if (!formData.specialization) newErrors.specialization = 'Specialization required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // TODO: Call your api/doctor/register API
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Doctor Registration:', formData);
        alert('Doctor registered successfully!');
        navigate('/doctor/dashboard');
      } catch (error) {
        alert('Registration failed. Try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold p-3 rounded-xl hover:bg-white transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <FiUserPlus className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Doctor Registration</h1>
                <p className="text-gray-600">Complete your profile to access Clinixa dashboard</p>
              </div>

              {/* Personal Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-3">👤 Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="John" />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="Doe" />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiMail className="w-4 h-4" /> Email *
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="doctor@clinixa.com" />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiPhone className="w-4 h-4" /> Phone *
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="9876543210" />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiLock className="w-4 h-4" /> Password *
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                    placeholder="Minimum 8 characters" />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-3">🏥 Professional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization *</label>
                    <select name="specialization" value={formData.specialization} onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.specialization ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                      <option value="">Select specialization</option>
                      {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                    {errors.specialization && <p className="text-red-600 text-sm mt-1">{errors.specialization}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" max="50"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
                    <input name="qualification" value={formData.qualification} onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="MBBS, MD Dermatology" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">License Number *</label>
                    <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${errors.licenseNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} 
                      placeholder="MH-123456" />
                    {errors.licenseNumber && <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital/Clinic</label>
                  <input name="hospital" value={formData.hospital} onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="Apollo Hospital" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 border-b pb-3">📍 Clinic Address</h3>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="City" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" />
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="State" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="PIN Code" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl text-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>

          {/* Benefits Panel */}
          <div className="lg:sticky lg:top-12 space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 shadow-xl border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiCheckCircle className="w-8 h-8 text-emerald-600" />
                Clinixa Benefits
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl hover:bg-blue-50 transition-all">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm mt-0.5">1</div>
                  <div>Smart token system & patient queue</div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl hover:bg-blue-50 transition-all">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm mt-0.5">2</div>
                  <div>Real-time dashboard & revenue tracking</div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl hover:bg-blue-50 transition-all">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm mt-0.5">3</div>
                  <div>Complete patient history management</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;

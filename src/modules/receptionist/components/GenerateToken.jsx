import { useState } from "react";
import { FiUserPlus, FiCreditCard, FiActivity, FiUsers } from "react-icons/fi";
import { useTokens } from "./TokenContext";

const GenerateToken = () => {
  const { tokens, setTokens } = useTokens();

  const [tokenCount, setTokenCount] = useState(() =>
    tokens && tokens.length ? tokens.length + 1 : 1
  );

  const [formData, setFormData] = useState({
    patientName: "",
    department: "",
    doctor: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  // ---------------- HANDLERS ----------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateToken = (e) => {
    e.preventDefault();

    const newToken = {
      tokenNo: `T-${tokenCount.toString().padStart(2, "0")}`,
      patientName: formData.patientName,
      department: formData.department,
      doctor: formData.doctor,
      status: "Pending",
    };

    setTokens((prev) => [...prev, newToken]);
    setTokenCount((prev) => prev + 1);

    setFormData({
      patientName: "",
      department: "",
      doctor: "",
    });
  };

  const deleteToken = (index) => {
    setTokens((prev) => prev.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditData(tokens[index]);
  };

  const saveEdit = () => {
    const updated = [...tokens];
    updated[editingIndex] = editData;
    setTokens(updated);
    setEditingIndex(null);
  };

  const updateStatus = (index, status) => {
    const updated = [...tokens];
    updated[index].status = status;
    setTokens(updated);
  };

  // ---------------- STATS WITH ICONS ----------------

  const stats = [
    { label: "Total Tokens", value: tokens.length, icon: <FiUserPlus />, color: "bg-blue-500" },
    { label: "Pending Tokens", value: tokens.filter((t) => t.status === "Pending").length, icon: <FiCreditCard />, color: "bg-orange-500" },
    { label: "Completed Tokens", value: tokens.filter((t) => t.status === "Done").length, icon: <FiActivity />, color: "bg-green-500" },
    { label: "Emergency Queue", value: tokens.filter((t) => t.department === "Emergency").length, icon: <FiUsers />, color: "bg-red-500" },
  ];

  // ---------------- UI ----------------

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Token Management</h1>
        <p className="text-gray-500">Generate, assign and manage patient tokens</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center p-6 bg-white rounded-2xl shadow-sm border space-x-4">
            <div className={`p-4 rounded-2xl text-white shadow-lg ${stat.color}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* GENERATE TOKEN */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          <h3 className="text-xl font-bold">Generate Token</h3>

          <form onSubmit={generateToken} className="space-y-5">
            <input
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Patient Name"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20"
              required
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            >
              <option value="">Select Department</option>
              <option>General Medicine</option>
              <option>Cardiology</option>
              <option>Orthopedics</option>
              <option>Emergency</option>
            </select>

            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
              required
            >
              <option value="">Assign Doctor</option>
              <option>Dr. Sharma</option>
              <option>Dr. Patel</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
            >
              Generate Token
            </button>
          </form>
        </div>

        {/* LIVE TOKEN TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-8 py-5 border-b">
            <h3 className="text-xl font-bold">Live Token Status</h3>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Token</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Update</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {tokens.map((t, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-blue-600">{t.tokenNo}</td>
                  <td className="px-6 py-4">{t.patientName}</td>
                  <td className="px-6 py-4">{t.doctor}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        t.status === "Done"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(index, e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    >
                      <option>Pending</option>
                      <option>Done</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 space-x-4">
                    <button
                      onClick={() => startEdit(index)}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteToken(index)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {tokens.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    No tokens generated yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GenerateToken;

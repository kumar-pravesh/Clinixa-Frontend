import { useState } from 'react';

const MyPatients = () => {
  const [search, setSearch] = useState('');
  const patients = [
    { id: 1, name: 'Sameer Khan', age: 40, lastVisit: '2026-02-01', condition: 'Follow up' },
    { id: 2, name: 'Anita Sharma', age: 32, lastVisit: '2026-01-20', condition: 'Consultation' },
  ];

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
      <p className="text-gray-500">Manage patient history and records.</p>

      <input
        type="text"
        placeholder="Search patients..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
      />

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Age</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Last Visit</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Condition</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                <td className="px-6 py-4">{p.age}</td>
                <td className="px-6 py-4 text-gray-600">{p.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">{p.condition}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPatients;

import { useState, useEffect } from 'react';
import { 
  FiCalendar, FiClock, FiUser, FiCheckCircle, FiUsers 
} from 'react-icons/fi';

const DoctorAppointments = () => {
  const [slots, setSlots] = useState([
    { 
      id: 1, token: 'A001', date: '2026-02-05', time: '10:30 AM', type: 'Follow up', 
      status: 'waiting', patient: 'Sameer Khan', avatar: 'S', phone: '9876543210', notes: '',
      duration: 20, revenue: 500, walkin: false 
    },
    { 
      id: 2, token: 'A002', date: '2026-02-05', time: '11:00 AM', type: 'Consultation', 
      status: 'in-progress', patient: 'Anita Sharma', avatar: 'A', phone: '9876543211', notes: 'BP controlled',
      duration: 30, revenue: 800, walkin: false 
    },
    { 
      id: 3, token: 'A003', date: '2026-02-05', time: '02:00 PM', type: 'Routine', 
      status: 'available', patient: '', avatar: '', phone: '', notes: '',
      duration: 15, revenue: 400, walkin: false 
    },
  ]);
  
  const [currentToken, setCurrentToken] = useState('A001');
  const [stats, setStats] = useState({
    todayPatients: 8,
    todayRevenue: 4500,
    completed: 3,
    waiting: 2,
    noShows: 1
  });

  // Auto advance token every 30 seconds (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      const nextToken = slots.find(s => s.status === 'waiting');
      if (nextToken) {
        setCurrentToken(nextToken.token);
        // Auto complete current consultation after 5 mins (simulation)
        setTimeout(() => {
          setSlots(prev => prev.map(slot => 
            slot.status === 'in-progress' ? { ...slot, status: 'completed' } : slot
          ));
        }, 300000); // 5 minutes
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [slots]);

  const callNextPatient = () => {
    const nextWaiting = slots.find(s => s.status === 'waiting');
    if (nextWaiting) {
      setSlots(prev => prev.map(slot => 
        slot.token === nextWaiting.token 
          ? { ...slot, status: 'in-progress' } 
          : slot
      ));
      setCurrentToken(nextWaiting.token);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      waiting: 'bg-orange-100 text-orange-800 border-orange-200 ring-orange-200',
      'in-progress': 'bg-emerald-100 text-emerald-800 border-emerald-200 ring-emerald-200',
      available: 'bg-blue-100 text-blue-800 border-blue-200 ring-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200 ring-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 🔥 HERO STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-2xl border border-blue-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.todayPatients}</div>
          <div className="text-sm text-gray-600">Today's Patients</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600">₹{stats.todayRevenue}</div>
          <div className="text-sm text-gray-600">Today's Revenue</div>
        </div>
        <div className="text-center border-l border-blue-200 pl-6">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="text-center border-l border-blue-200 pl-6">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-orange-600">
            <FiUsers className="w-6 h-6" />
            {stats.waiting}
          </div>
          <div className="text-sm text-gray-600">Waiting</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🎫 CURRENT TOKEN DISPLAY */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-2xl text-center">
            <div className="text-6xl font-black tracking-wider mb-4 animate-pulse">{currentToken}</div>
            <div className="text-2xl font-bold mb-6">Current Patient</div>
            <button 
              onClick={callNextPatient}
              className="w-full bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/30 transition-all shadow-xl flex items-center justify-center gap-3 text-lg"
            >
              <FiCheckCircle className="w-6 h-6" />
              Call Next Patient
            </button>
            <div className="mt-6 space-y-2 text-blue-100">
              <div className="flex justify-between text-sm">
                <span>Next Token:</span>
                <span className="font-bold">A003</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Est. Wait:</span>
                <span className="font-bold">12 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* 📋 TODAY'S SCHEDULE */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl border border-blue-50 overflow-hidden h-[70vh]">
            <div className="p-8 border-b border-blue-50 bg-gradient-to-r from-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-500 rounded-2xl text-white shadow-lg">
                    <FiCalendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Today's Queue</h2>
                    <p className="text-blue-600 font-semibold">February 5, 2026 • 15 Patients</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-1 overflow-y-auto h-[calc(70vh-140px)]">
              <div className="divide-y divide-blue-50">
                {slots.map(slot => (
                  <div key={slot.id} className={`p-6 hover:bg-blue-50/50 transition-all cursor-pointer ${slot.status === 'in-progress' ? 'bg-emerald-50 border-l-4 border-emerald-400' : ''}`}>
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center font-bold text-lg shadow-lg ring-4 ring-blue-100 flex-shrink-0 ${getStatusColor(slot.status).includes('orange') ? 'bg-orange-500 ring-orange-200' : slot.status === 'in-progress' ? 'bg-emerald-500 ring-emerald-200' : 'bg-blue-500'}`}>
                          {slot.token.slice(-3)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-xl text-gray-900 truncate">{slot.patient || 'Walk-in Patient'}</h3>
                            {slot.walkin && <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">WALK-IN</span>}
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                            <FiClock className="w-4 h-4" />
                            {slot.time} • {slot.type} • {slot.duration}min
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-xl font-bold text-sm border shadow-sm ${getStatusColor(slot.status)} whitespace-nowrap`}>
                        {slot.status === 'waiting' && 'Waiting'}
                        {slot.status === 'in-progress' && 'Consulting'}
                        {slot.status === 'available' && 'Ready'}
                        {slot.status === 'completed' && 'Done'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;

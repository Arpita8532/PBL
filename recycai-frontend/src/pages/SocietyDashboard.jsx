import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Truck, BarChart3, TrendingUp, Info, Package, Calendar, Radio, RefreshCw } from 'lucide-react';
import StatCard from '../components/StatCard';

const POLL_INTERVAL = 10000; // 10 seconds

const SocietyDashboard = ({ user, onNavigate }) => {
  const [pickups, setPickups] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPickups = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/pickup/list');
      const userPickups = response.data.filter(p => p.societyId === user.identifier || p.societyName === user.name);
      setPickups(userPickups);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch pickups", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPickups();
    const interval = setInterval(() => fetchPickups(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPickups]);

  const totalCredits = pickups.reduce((acc, curr) => acc + (curr.creditsAwarded || 0), 0);
  const totalWeight = pickups.reduce((acc, curr) => acc + (curr.weight || 0), 0);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 p-8 rounded-3xl text-white mb-8 shadow-xl shadow-green-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black mb-1 text-white">Welcome, {user.name}!</h1>
            <p className="text-green-100 opacity-90 text-lg">Doing great for the environment today.</p>
          </div>
          <div className="flex items-center space-x-3">
            {lastRefresh && (
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Radio className="w-4 h-4 text-green-200 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-green-100">Live</span>
              </div>
            )}
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Credits"
          value={totalCredits}
          subtitle="Earned from recycling"
          icon={<BarChart3 className="w-6 h-6" />}
          highlight={true}
        />
        <StatCard 
          title="Pickups Requested"
          value={pickups.length}
          subtitle="Lifetime requests"
          icon={<Truck className="w-6 h-6" />}
        />
        <StatCard 
          title="Est. Waste Recycled"
          value={`${totalWeight} kg`}
          subtitle="Diverted from landfills"
          icon={<Package className="w-6 h-6" />}
          highlight={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions side */}
        <div className="space-y-6">
          <button
            onClick={() => onNavigate('request')}
            className="w-full bg-white p-6 rounded-2xl border border-green-200 shadow-sm hover:shadow-lg transition-all duration-300 text-left group flex items-center space-x-4"
          >
            <div className="w-14 h-14 shrink-0 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-700 group-hover:text-white transition-colors">
              <Truck className="w-6 h-6 text-green-700 transition-colors" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-gray-800 mb-1">Request Pickup</h2>
               <p className="text-gray-500 text-sm">Schedule a collector to pick up your sorted recyclables.</p>
            </div>
          </button>

          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
             <div className="flex items-start space-x-3 mb-2">
                <Info className="w-5 h-5 text-green-700 mt-1" />
                <h3 className="font-bold text-gray-800">Your Society ID</h3>
             </div>
             <p className="text-gray-500 flex flex-col justify-start text-sm">
                Save your identifier for manual login: 
                <span className="font-mono bg-gray-50 px-3 py-2 rounded-lg text-green-800 font-bold border border-green-100 mt-2 block break-all text-center">
                    {user.identifier}
                </span>
             </p>
          </div>
        </div>

        {/* Recent Pickups Table side */}
        <div className="lg:col-span-2 relative">
           <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden h-full">
              <div className="px-6 py-5 border-b border-green-50 bg-gray-50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-gray-800">Recent Pickup Requests</h2>
                 <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => fetchPickups(false)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors text-gray-400 hover:text-green-700"
                      title="Refresh"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <Package className="w-5 h-5 text-gray-400" />
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-100">
                       <tr>
                          <th className="py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Waste Type</th>
                          <th className="py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="py-3 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {pickups.length > 0 ? pickups.slice(0, 5).map((p) => (
                          <tr key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors">
                             <td className="py-4 px-6">
                                <span className="font-bold text-gray-800 capitalize flex items-center">
                                   {p.wasteType || p.type}
                                </span>
                             </td>
                             <td className="py-4 px-6 text-gray-500 text-sm font-medium flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(p.date || (p.createdAt?._seconds ? p.createdAt._seconds * 1000 : p.createdAt) || Date.now()).toLocaleDateString()}
                             </td>
                             <td className="py-4 px-6 text-right">
                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                                   ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' 
                                   : p.status === 'accepted' ? 'bg-blue-100 text-blue-800' 
                                   : 'bg-amber-100 text-amber-800'}`
                                }>
                                   {p.status || 'Pending'}
                                </span>
                             </td>
                          </tr>
                       )) : (
                          <tr>
                             <td colSpan="3" className="py-12 text-center text-gray-500 font-medium">
                                No pickup requests found. Click "Request Pickup" to start recycling.
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SocietyDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Truck, BarChart3, TrendingUp, Info, Package, Calendar, Radio, RefreshCw, CloudLightning } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import BadgesSection from '../components/BadgesSection';
import logo from '../assets/logo.png';

const POLL_INTERVAL = 10000; // 10 seconds

// Standard EPA CO2 savings values (kg CO2 saved per kg of waste recycled)
const CO2_FACTORS = {
  plastic: 1.5,
  paper: 0.9,
  metal: 4.0,
  ewaste: 20.0,
  glass: 0.3,
  fabric: 1.2,
  wood: 0.5,
  food: 0.2,
  rubber: 1.1,
  batteries: 2.5,
  chemicals: 3.0,
  medical: 2.0,
  construction: 0.1
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

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

  // Calculations
  const completedPickups = pickups.filter(p => p.status === 'completed');
  const totalCredits = completedPickups.reduce((acc, curr) => acc + (curr.creditsAwarded || 0), 0);
  const totalWeight = completedPickups.reduce((acc, curr) => acc + (curr.weight || 0), 0);
  
  // CO2 calculation
  const totalCO2Saved = completedPickups.reduce((acc, curr) => {
    const factor = CO2_FACTORS[curr.wasteType?.toLowerCase()] || 0.5;
    return acc + ((curr.weight || 0) * factor);
  }, 0);

  // Line Chart Data: Monthly kg recycled
  const monthlyDataMap = {};
  completedPickups.forEach(p => {
    const d = new Date(p.date || (p.createdAt?._seconds ? p.createdAt._seconds * 1000 : p.createdAt) || Date.now());
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const displayMonth = d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();
    
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = { sortKey: monthKey, name: displayMonth, weight: 0 };
    }
    monthlyDataMap[monthKey].weight += (p.weight || 0);
  });
  
  const lineChartData = Object.values(monthlyDataMap)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(data => ({ name: data.name, kg: Math.round(data.weight * 10) / 10 }));

  // Pie Chart Data: Waste type distribution
  const wasteTypeMap = {};
  completedPickups.forEach(p => {
    const type = p.wasteType || 'other';
    wasteTypeMap[type] = (wasteTypeMap[type] || 0) + (p.weight || 0);
  });
  
  const pieChartData = Object.keys(wasteTypeMap)
    .map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: Math.round(wasteTypeMap[key] * 10) / 10
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-green-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-xl">
              <img src={logo} alt="EcoLoop Logo" className="h-12 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black mb-1 text-white">EcoLoop Dashboard</h1>
              <p className="text-green-100 opacity-90 text-lg">Welcome back, {user.name}!</p>
            </div>
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

      {/* Stats row (4 columns now to include CO2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          subtitle={`${completedPickups.length} completed`}
          icon={<Truck className="w-6 h-6" />}
        />
        <StatCard 
          title="Est. Waste Recycled"
          value={`${Math.round(totalWeight * 10)/10} kg`}
          subtitle="Diverted from landfills"
          icon={<Package className="w-6 h-6" />}
          highlight={true}
        />
        <StatCard 
          title="CO₂ Emissions Saved"
          value={`${Math.round(totalCO2Saved * 10)/10} kg`}
          subtitle="Real environmental impact"
          icon={<CloudLightning className="w-6 h-6" />}
          highlight={true}
        />
      </div>

      {/* Badges System */}
      <BadgesSection pickups={pickups} />

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics Charts */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" /> Monthly Recycling Volume
            </h2>
            <div className="h-72 w-full">
              {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#d1fae5', strokeWidth: 2 }}
                    />
                    <Line type="monotone" dataKey="kg" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No data available yet</div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Waste Composition</h2>
              <p className="text-sm text-gray-500 mb-6">Breakdown of recycled materials by weight.</p>
              
              <div className="space-y-3">
                {pieChartData.slice(0, 4).map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                      <span className="font-medium text-gray-700">{entry.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{entry.value} kg</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64 w-64 shrink-0 relative">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 border-4 border-dashed border-gray-100 rounded-full">No Data</div>
              )}
              {pieChartData.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-gray-800">{pieChartData.length}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Types</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Actions & Recent Pickups */}
        <div className="space-y-8">
          
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

          <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-green-50 bg-gray-50 flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-800">Recent Requests</h2>
               <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => fetchPickups(false)}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors text-gray-400 hover:text-green-700"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-white border-b border-gray-100">
                     <tr>
                        <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type & Date</th>
                        <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {pickups.length > 0 ? pickups.slice(0, 4).map((p) => {
                        const d = new Date(p.date || (p.createdAt?._seconds ? p.createdAt._seconds * 1000 : p.createdAt) || Date.now());
                        return (
                          <tr key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors">
                             <td className="py-4 px-6">
                                <div className="font-bold text-gray-800 capitalize flex items-center text-sm">
                                   {p.wasteType || p.type}
                                </div>
                                <div className="text-gray-400 text-xs mt-1 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {d.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                </div>
                             </td>
                             <td className="py-4 px-6 text-right">
                                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                                   ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' 
                                   : p.status === 'accepted' ? 'bg-blue-100 text-blue-800' 
                                   : 'bg-amber-100 text-amber-800'}`
                                }>
                                   {p.status || 'Pending'}
                                </span>
                                {p.status === 'completed' && p.weight > 0 && (
                                  <div className="text-gray-500 border border-gray-100 bg-gray-50 rounded px-1 py-0.5 inline-block text-[10px] font-bold ml-2">
                                    {p.weight} kg
                                  </div>
                                )}
                             </td>
                          </tr>
                        )
                     }) : (
                        <tr>
                           <td colSpan="2" className="py-8 text-center text-gray-500 font-medium text-sm">
                              No requests yet.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            
            {pickups.length > 4 && (
              <div className="p-4 bg-gray-50/50 text-center border-t border-gray-50">
                <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Viewing latest 4 of {pickups.length}</span>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SocietyDashboard;

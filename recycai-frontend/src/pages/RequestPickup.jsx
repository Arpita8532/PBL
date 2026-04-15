import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

const RequestPickup = ({ user, onBack }) => {
  const [wasteType, setWasteType] = useState('plastic');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    
    try {
      await axios.post('http://localhost:5000/pickup/request', {
        societyId: user.identifier,
        societyName: user.name,
        location: user.location || "Default Location", // Fallback if not in user object
        wasteType
      });
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-700">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">Request Sent!</h2>
        <p className="text-gray-500 mb-8">A collector will be notified of your <span className="font-bold text-green-700 capitalize">{wasteType}</span> recycling request.</p>
        <button 
          onClick={onBack}
          className="w-full bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-800 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center text-green-700 hover:text-green-900 mb-8 font-bold transition-all group"
      >
        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="bg-white p-8 rounded-3xl border border-green-200 shadow-xl">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-black text-green-800 mb-2">Request Pickup</h1>
           <p className="text-gray-500 font-medium text-sm">Schedule a municipal authorized collector to pick up your sorted waste.</p>
        </div>
        
        {status === 'error' && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Select Waste Type</label>
             <div className="relative">
                <select 
                   value={wasteType}
                   onChange={(e) => setWasteType(e.target.value)}
                   className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 font-bold text-lg appearance-none focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-600 outline-none transition-all cursor-pointer shadow-sm capitalize"
                >
                   <option value="plastic">♻️  Plastic  (8 credits/kg)</option>
                   <option value="paper">📄  Paper / Cardboard  (5 credits/kg)</option>
                   <option value="metal">🔩  Metal  (15 credits/kg)</option>
                   <option value="glass">🫙  Glass  (6 credits/kg)</option>
                   <option value="ewaste">💻  E-Waste  (20 credits/kg)</option>
                   <option value="fabric">👕  Textiles / Fabric  (7 credits/kg)</option>
                   <option value="wood">🪵  Wood / Furniture  (4 credits/kg)</option>
                   <option value="food">🥬  Organic / Wet Waste  (3 credits/kg)</option>
                   <option value="rubber">🔘  Rubber / Tyres  (5 credits/kg)</option>
                   <option value="batteries">🔋  Batteries  (25 credits/kg)</option>
                   <option value="chemicals">🧪  Oil / Chemicals  (35 credits/kg)</option>
                   <option value="medical">🏥  Medical / Bio-Hazard  (30 credits/kg)</option>
                   <option value="construction">🧱  Construction Debris  (3 credits/kg)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-200/50 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-4"
          >
            <Send className="w-5 h-5" />
            <span>{status === 'loading' ? 'Notifying Collectors...' : 'Submit Request'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPickup;

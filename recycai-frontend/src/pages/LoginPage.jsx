import React, { useState } from 'react';
import { Truck, User, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const LoginPage = ({ onNavigate, onLogin }) => {
  const [role, setRole] = useState('society');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState(''); // Added password field
  const [name, setName] = useState(''); // Added to mock session name

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier) return;
    
    // In a real app, we'd fetch user details from backend using identifier
    const userData = { 
        name: name || (role === 'society' ? "Society User" : "Collector"), 
        role, 
        identifier 
    };
    localStorage.setItem('recycai_user', JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-green-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="EcoLoop Logo" className="h-24 w-auto drop-shadow-md object-contain" />
          </div>
          <h1 className="text-3xl font-black text-green-800 tracking-tight">EcoLoop Login</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">Welcome back to the green platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Identify as</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('society')}
                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                  role === 'society' 
                  ? 'border-green-600 bg-green-50/50 text-green-700 shadow-sm' 
                  : 'border-gray-50 bg-gray-50/50 text-gray-400'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Society</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('collector')}
                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                  role === 'collector' 
                  ? 'border-green-600 bg-green-50/50 text-green-700 shadow-sm' 
                  : 'border-gray-50 bg-gray-50/50 text-gray-400'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Recycling Collector</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
             {role === 'society' && (
               <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all font-medium text-gray-900"
                    placeholder="Enter display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
               </div>
             )}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {role === 'society' ? 'Society ID' : 'Collector Code'}
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all font-mono text-center font-bold text-gray-900"
                placeholder={role === 'society' ? "XXXXXXXXXXXX" : "COLLECTOR-XX"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition-all font-medium text-gray-900"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center bg-gray-50 p-4 rounded-2xl">
          <p className="text-gray-500 text-sm font-medium"> New Society? </p>
          <button 
            onClick={() => onNavigate('signup')}
            className="text-green-600 font-black text-sm uppercase tracking-widest hover:text-green-700 transition-colors mt-1"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

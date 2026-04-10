import React, { useState } from 'react';
import { ArrowLeft, Award, Package } from 'lucide-react';
import logo from '../assets/logo.png';

const CollectorPanel = ({ onBack }) => {
  const [formData, setFormData] = useState({ pickupId: '', weight: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post('http://localhost:5000/pickup/confirm', {
        pickupId: formData.pickupId,
        weight: parseFloat(formData.weight)
      });
      setResult(response.data);
      setFormData({ pickupId: '', weight: '' });
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center text-green-700 hover:text-green-900 mb-8 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Home
      </button>

      <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <img src={logo} alt="EcoLoop Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-green-800">EcoLoop Collector Panel</h1>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl mb-6 text-center animate-pulse">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-bold text-lg">{result.message}</p>
            <p className="text-green-600 text-2xl font-black mt-2">+{result.creditsGenerated} Credits</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">Pickup ID</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter pickup ID"
              value={formData.pickupId}
              onChange={(e) => setFormData({ ...formData, pickupId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-900 mb-1">Actual Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g. 10.5"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Confirming...' : 'Confirm & Generate Credits'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollectorPanel;

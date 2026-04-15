import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SocietyDashboard from './pages/SocietyDashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import RequestPickup from './pages/RequestPickup';
import Leaderboard from './pages/Leaderboard';
// import KnowYourWaste from './pages/KnowYourWaste';
import { Leaf, LogOut, LayoutDashboard, BarChart3, Menu, X, Home, UserPlus, LogIn, Search } from 'lucide-react';
import logo from './assets/logo.png';
import EcoBot from './components/EcoBot';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('recycai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('recycai_user');
    setUser(null);
    setCurrentPage('home');
    setMenuOpen(false);
  };

  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case 'home': return <HomePage onNavigate={navigate} />;
        case 'login': return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
        case 'signup': return <SignupPage onNavigate={navigate} onLogin={handleLogin} />;
        case 'leaderboard': return <Leaderboard onBack={() => navigate('home')} />;
// case 'know-waste': return <KnowYourWaste onNavigate={navigate} onBack={() => navigate('home')} />;
        default: return <HomePage onNavigate={navigate} />;
      }
    } else {
      if (user.role === 'society') {
        switch (currentPage) {
          case 'dashboard': return <SocietyDashboard user={user} onNavigate={navigate} />;
          case 'request': return <RequestPickup user={user} onBack={() => navigate('dashboard')} />;
          case 'leaderboard': return <Leaderboard onBack={() => navigate('dashboard')} />;
// case 'know-waste': return <KnowYourWaste onNavigate={navigate} onBack={() => navigate('dashboard')} />;
          default: return <SocietyDashboard user={user} onNavigate={navigate} />;
        }
      } else {
        switch (currentPage) {
          case 'dashboard': return <CollectorDashboard user={user} />;
          case 'leaderboard': return <Leaderboard onBack={() => navigate('dashboard')} />;
// case 'know-waste': return <KnowYourWaste onNavigate={navigate} onBack={() => navigate('dashboard')} />;
          default: return <CollectorDashboard user={user} />;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col font-sans text-gray-700">
      {/* Navbar */}
      <nav className="bg-white border-b border-green-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(user ? 'dashboard' : 'home')}
            className="flex items-center space-x-1 text-green-800"
          >
            <img src={logo} alt="EcoLoop Logo" className="h-14 md:h-16 w-auto" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tightest leading-none">EcoLoop</span>
              <span className="text-xs font-bold text-gray-400">Recycle. Earn. Lead.</span>
            </div>
          </button>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {!user ? (
              <>
                <button 
                  onClick={() => navigate('home')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'home' ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-800'}`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button 
                  onClick={() => navigate('leaderboard')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'leaderboard' ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-800'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
                {/* 
                <button 
                  onClick={() => navigate('know-waste')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'know-waste' ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-800'}`}
                >
                  <Search className="w-4 h-4" />
                  <span>Know Your Waste</span>
                </button>
                */}
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <button 
                  onClick={() => navigate('login')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'login' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700 hover:bg-emerald-50'}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => navigate('signup')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'signup' ? 'bg-green-700 text-white shadow-md' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('dashboard')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'dashboard' ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-800'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => navigate('leaderboard')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'leaderboard' ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-800'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Leaderboard</span>
                </button>
                {/* 
                <button 
                  onClick={() => navigate('know-waste')}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 'know-waste' ? 'bg-green-700 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-800'}`}
                >
                  <Search className="w-4 h-4" />
                  <span>Know Your Waste</span>
                </button>
                */}
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-green-50 rounded-lg">
             {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-green-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {!user ? (
              <>
                <button onClick={() => navigate('home')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 font-bold text-gray-700">
                  <Home className="w-5 h-5" /><span>Home</span>
                </button>
                <button onClick={() => navigate('leaderboard')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 font-bold text-gray-700">
                  <BarChart3 className="w-5 h-5" /><span>Leaderboard</span>
                </button>
                {/* 
222:                 <button onClick={() => navigate('know-waste')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 font-bold text-gray-700">
223:                   <Search className="w-5 h-5" /><span>Know Your Waste</span>
224:                 </button>
225:                 */}
                <button onClick={() => navigate('login')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 font-bold text-emerald-800">
                  <LogIn className="w-5 h-5" /><span>Login</span>
                </button>
                <button onClick={() => navigate('signup')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-green-100 font-bold text-green-800">
                  <UserPlus className="w-5 h-5" /><span>Register</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('dashboard')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 font-bold text-gray-700">
                  <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
                </button>
                <button onClick={() => navigate('leaderboard')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 font-bold text-gray-700">
                  <BarChart3 className="w-5 h-5" /><span>Leaderboard</span>
                </button>
                {/* 
240:                 <button onClick={() => navigate('know-waste')} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-50 font-bold text-gray-700">
241:                   <Search className="w-5 h-5" /><span>Know Your Waste</span>
242:                 </button>
243:                 */}
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-50 font-bold text-red-600">
                  <LogOut className="w-5 h-5" /><span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {renderPage()}
      </main>

      {/* EcoBot floating chat widget — visible on all pages */}
      <EcoBot />

      {/* Footer */}
      <footer className="bg-white border-t border-green-200 pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <div className="flex flex-col items-center justify-center md:items-start space-y-1 mb-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <img src={logo} alt="EcoLoop Logo" className="h-8 w-auto" />
                  <span className="text-xl font-black tracking-tightest">EcoLoop</span>
                </div>
                <span className="text-sm font-bold text-gray-500">Recycle. Earn. Lead.</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Digitally enabling recycling through smart collection and community competition.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate('home')} className="hover:text-green-700 transition-colors">Home</button></li>
                <li><button onClick={() => navigate('leaderboard')} className="hover:text-green-700 transition-colors">Leaderboard</button></li>
                {/* <li><button onClick={() => navigate('know-waste')} className="hover:text-green-700 transition-colors">Know Your Waste</button></li> */}
                <li><button onClick={() => navigate('login')} className="hover:text-green-700 transition-colors">Login to Portal</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Helpdesk: support@ecoloop.gov</li>
                <li>Toll-Free: 1800-RECYCLE</li>
                <li>HQ: Municipal Sustainability Dept.</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} EcoLoop Platform &bull; Sustainable Future Guaranteed
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

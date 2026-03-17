import React from 'react';
import { ArrowRight, Leaf, Recycle, RefreshCw, Trash2, Users, Globe, Zap, ArrowDown, CheckCircle2, IndianRupee, Search, ScanLine, Clock, Lightbulb, Trophy, Gift, Medal } from 'lucide-react';
import InfoCard from '../components/InfoCard';
import StatCard from '../components/StatCard';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-full mb-8 backdrop-blur-sm border border-white/30">
            <Leaf className="w-16 h-16 text-green-100" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            RecycAI – Smart Recycling for <br className="hidden md:block"/> Sustainable Cities
          </h1>
          <p className="text-xl md:text-3xl font-medium text-green-50 mb-12 max-w-3xl leading-relaxed">
            Digitally connecting citizens, collectors, and recyclers. Be part of the municipal green initiative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
             <button 
                onClick={() => onNavigate('leaderboard')}
                className="bg-white text-green-800 hover:bg-green-50 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 w-full sm:w-auto"
             >
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span>View Leaderboard</span>
             </button>
          </div>
        </div>
      </section>

      {/* Estimated Recycling Value Section */}
      <section className="py-20 px-6 bg-green-50 border-y border-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-5xl font-black text-green-900 mb-4">Estimated Recycling Value</h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto">Approximate value of commonly recyclable materials.</p>
          </div>
          <p className="text-center text-sm text-gray-400 mb-12 italic">* Prices are approximate and may vary by region and market conditions.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { material: 'Plastic Bottles', price: '₹10 – ₹25 / kg', desc: 'Common PET plastic bottles used for beverages.', color: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
              { material: 'Paper / Cardboard', price: '₹8 – ₹15 / kg', desc: 'Includes newspapers, cartons, and packaging paper.', color: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-600' },
              { material: 'Aluminium Cans', price: '₹80 – ₹120 / kg', desc: 'Highly recyclable metal used in beverage cans.', color: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-600' },
              { material: 'Iron / Scrap Metal', price: '₹25 – ₹40 / kg', desc: 'Includes basic metal waste and small appliances.', color: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
              { material: 'E-Waste (small electronics)', price: 'Varies widely', desc: 'Includes chargers, cables, and small devices.', color: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} border ${item.border} rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${item.icon}`}>
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-800">{item.material}</h3>
                </div>
                <p className="text-2xl font-black text-green-700 mb-2">{item.price}</p>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Know Your Waste Feature Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Search className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-6">Know Your Waste</h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Use AI to identify waste items and learn how to recycle them properly.
              </p>
              <p className="text-gray-600 font-medium mb-6">Upload an image of a waste item to detect:</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Recycle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-gray-700">Waste type classification</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-bold text-gray-700">Decomposition time estimate</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-gray-700">Recycling guidance & tips</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('know-waste')}
                className="bg-green-700 hover:bg-green-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-green-200/50 flex items-center space-x-2 transition-all"
              >
                <ScanLine className="w-5 h-5" />
                <span>Try Waste Detector</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right — Visual */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Main card */}
                <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-3xl p-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mb-6">
                    <ScanLine className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-green-800 mb-2">AI Waste Scanner</h3>
                  <p className="text-sm text-gray-500 mb-6">Snap a photo and let AI identify the waste type for you.</p>
                  <div className="w-full space-y-3">
                    <div className="bg-white rounded-xl p-3 flex items-center space-x-3 shadow-sm border border-green-100">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Recycle className="w-4 h-4 text-emerald-600" /></div>
                      <div className="text-left"><p className="text-xs text-gray-400 font-bold">TYPE</p><p className="text-sm font-bold text-gray-700">Plastic Bottle</p></div>
                    </div>
                    <div className="bg-white rounded-xl p-3 flex items-center space-x-3 shadow-sm border border-green-100">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
                      <div className="text-left"><p className="text-xs text-gray-400 font-bold">DECOMPOSITION</p><p className="text-sm font-bold text-gray-700">~450 years</p></div>
                    </div>
                    <div className="bg-white rounded-xl p-3 flex items-center space-x-3 shadow-sm border border-green-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Lightbulb className="w-4 h-4 text-blue-600" /></div>
                      <div className="text-left"><p className="text-xs text-gray-400 font-bold">SUGGESTION</p><p className="text-sm font-bold text-gray-700">Recycle in plastic stream</p></div>
                    </div>
                  </div>
                </div>
                {/* Decorative dot */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-400 rounded-full opacity-50"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-emerald-400 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards & Prizes Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-900 to-green-950 text-white relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-yellow-400/20 text-yellow-400 rounded-2xl mb-4 border border-yellow-400/30">
              <Gift className="w-10 h-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Earn Credits <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">& Win Exciting Prizes</span></h2>
            <p className="text-xl text-green-200 max-w-2xl mx-auto font-medium">Recycling is rewarding! Accumulate Green Credits to climb the leaderboard and unlock municipal rewards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/15 transition-all">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0">
                <Medal className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Monthly Top 3</h3>
              <p className="text-green-200 leading-relaxed font-medium mb-6">Societies ranking in the top 3 spots of the leaderboard each month receive exclusive municipal recognition and grand prizes.</p>
              <ul className="text-sm font-bold text-yellow-300 space-y-2">
                <li className="flex items-center justify-center sm:justify-start"> <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span> Trophies & Certificates </li>
                <li className="flex items-center justify-center sm:justify-start"> <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span> Community Fund Bonuses </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/15 transition-all md:scale-105 shadow-2xl relative z-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-widest py-1 px-4 rounded-full">Most Popular</div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0 shadow-lg shadow-yellow-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Credit Milestones</h3>
              <p className="text-green-200 leading-relaxed font-medium mb-6">Unlock instant rewards when your society reaches universal credit tiers across the year.</p>
              <ul className="text-sm font-medium text-white/80 space-y-3 bg-black/20 p-4 rounded-xl">
                 <li className="flex justify-between items-center"><span className="text-white">♻️ 5,000 Credits:</span> <span className="text-green-300 font-bold">Reusable Tote Bags</span></li>
                 <li className="flex justify-between items-center"><span className="text-white">🌱 15,000 Credits:</span> <span className="text-green-300 font-bold">Composter Kits</span></li>
                 <li className="flex justify-between items-center"><span className="text-white">🌍 50,000 Credits:</span> <span className="text-green-300 font-bold">Property Tax Rebates</span></li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/15 transition-all">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Community Events</h3>
              <p className="text-green-200 leading-relaxed font-medium mb-6">Host sponsored clean-up drives. Earn bonus Green Credits for verified community-driven recycling events in your area.</p>
              <button onClick={() => onNavigate('leaderboard')} className="w-full mt-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 px-4 rounded-xl transition-all">
                Check Rankings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Recycling Section (RRR) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">The 3 R's of Sustainability</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Our government portal encourages every citizen to follow these core principles.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard 
              icon={<Trash2 className="w-8 h-8" />}
              title="Reduce"
              description="Minimize waste generation by making smart purchasing decisions and avoiding single-use plastics."
              colorClass="bg-red-50"
            />
            <InfoCard 
              icon={<RefreshCw className="w-8 h-8" />}
              title="Reuse"
              description="Find new purposes for old items. Donate, repair, or upcycle instead of throwing away."
              colorClass="bg-blue-50"
            />
            <InfoCard 
              icon={<Recycle className="w-8 h-8" />}
              title="Recycle"
              description="Separate your waste so valuable materials can be processed and turned into new products."
              colorClass="bg-green-50"
            />
          </div>
        </div>
      </section>

      {/* Environmental Impact Stats */}
      <section className="py-20 px-6 bg-green-50 border-y border-green-100 relative">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-green-900 mb-4">Citywide Impact</h2>
                <p className="text-xl text-green-700 max-w-2xl mx-auto">Real-time statistics from our municipal recycling network.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard 
                  title="Waste Diverted"
                  value="12,450 kg"
                  subtitle="from the local landfill"
                  icon={<Globe className="w-8 h-8" />}
                  highlight={true}
                />
                <StatCard 
                  title="Active Societies"
                  value="342"
                  subtitle="registered communities"
                  icon={<Users className="w-8 h-8" />}
                  highlight={false}
                />
                <StatCard 
                  title="Green Credits Generated"
                  value="85,200"
                  subtitle="awarded to citizens"
                  icon={<Zap className="w-8 h-8" />}
                  highlight={true}
                />
            </div>
        </div>
      </section>

      {/* How it Works / Flows */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-4">How RecycAI Works</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">A seamless digital flow connecting households to authorized kabadiwalas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {[
              { step: 1, title: 'Identify', text: 'Separate your recyclable waste' },
              { step: 2, title: 'Request', text: 'Schedule a pickup on the portal' },
              { step: 3, title: 'Collect', text: 'Authorized kabadiwala arrives' },
              { step: 4, title: 'Earn', text: 'Receive verified Green Credits' },
              { step: 5, title: 'Compete', text: 'Climb the municipal leaderboard' }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group hover:bg-green-50 transition-colors">
                  <div className="w-12 h-12 bg-green-600 text-white font-black text-xl rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:-translate-y-1 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{item.text}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:flex justify-center text-green-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
                {index < 4 && (
                  <div className="md:hidden flex justify-center text-green-300 py-2">
                    <ArrowDown className="w-6 h-6" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>



      {/* Optional Panels: Tips & Timelines */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-black mb-8 flex items-center"><Leaf className="mr-3 text-green-400"/> Recycling Tips</h3>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                   <div className="bg-gray-800 p-2 rounded-lg text-emerald-400 mt-1"><CheckCircle2 className="w-5 h-5"/></div>
                   <div>
                     <h4 className="font-bold text-lg text-gray-100">Separate Dry and Wet Waste</h4>
                     <p className="text-gray-400 mt-1">Keep food waste strictly away from paper and plastics to avoid contamination.</p>
                   </div>
                </li>
                 <li className="flex items-start space-x-4">
                   <div className="bg-gray-800 p-2 rounded-lg text-emerald-400 mt-1"><CheckCircle2 className="w-5 h-5"/></div>
                   <div>
                     <h4 className="font-bold text-lg text-gray-100">Clean Your Plastics</h4>
                     <p className="text-gray-400 mt-1">Rinse takeaway containers and bottles before throwing them into the recycle bin.</p>
                   </div>
                </li>
                 <li className="flex items-start space-x-4">
                   <div className="bg-gray-800 p-2 rounded-lg text-emerald-400 mt-1"><CheckCircle2 className="w-5 h-5"/></div>
                   <div>
                     <h4 className="font-bold text-lg text-gray-100">Dispose E-Waste Responsibly</h4>
                     <p className="text-gray-400 mt-1">Batteries and electronics contain toxic materials and require specialized recycling.</p>
                   </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700 shadow-2xl">
              <h3 className="text-2xl font-black mb-8 text-white">Decomposition Timeline</h3>
              <p className="text-gray-400 mb-8 text-sm">How long it takes for common items to break down in a landfill if not recycled:</p>
              
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gray-300">Newspaper / Paper</span>
                        <span className="text-red-400">2 to 6 weeks</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{width: '10%'}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gray-300">Aluminium Cans</span>
                        <span className="text-orange-400">200 years</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{width: '50%'}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gray-300">Plastic Bottles</span>
                        <span className="text-yellow-400">up to 450 years</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{width: '80%'}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-gray-300">Glass Bottles</span>
                        <span className="text-red-600">1 Million+ years</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-red-600 h-2 rounded-full" style={{width: '100%'}}></div></div>
                 </div>
              </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

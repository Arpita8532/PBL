import React from 'react';

const BADGE_DEFS = [
  {
    id: 'first_step',
    emoji: '🌱',
    name: 'First Step',
    desc: 'Complete your first pickup',
    color: 'from-emerald-400 to-green-500',
    check: (pickups) => pickups.some(p => p.status === 'completed')
  },
  {
    id: 'consistent',
    emoji: '🔄',
    name: 'Consistent',
    desc: '3+ pickups in any single month',
    color: 'from-blue-400 to-cyan-500',
    check: (pickups) => {
      const monthMap = {};
      pickups.filter(p => p.status === 'completed').forEach(p => {
        const d = new Date(p.date || (p.createdAt?._seconds ? p.createdAt._seconds * 1000 : Date.now()));
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthMap[key] = (monthMap[key] || 0) + 1;
      });
      return Object.values(monthMap).some(count => count >= 3);
    }
  },
  {
    id: 'green_champion',
    emoji: '🏆',
    name: 'Green Champion',
    desc: '100 kg total waste recycled',
    color: 'from-yellow-400 to-amber-500',
    check: (pickups) => pickups.reduce((s, p) => s + (p.weight || 0), 0) >= 100
  },
  {
    id: 'e_warrior',
    emoji: '⚡',
    name: 'E-Warrior',
    desc: 'Recycled any e-waste',
    color: 'from-purple-400 to-violet-500',
    check: (pickups) => pickups.some(p => p.wasteType === 'ewaste' && p.status === 'completed')
  },
  {
    id: 'half_tonne',
    emoji: '🌍',
    name: 'Half Tonne Hero',
    desc: '500 kg total waste recycled',
    color: 'from-orange-400 to-red-500',
    check: (pickups) => pickups.reduce((s, p) => s + (p.weight || 0), 0) >= 500
  },
  {
    id: 'diverse_recycler',
    emoji: '🎨',
    name: 'Diverse Recycler',
    desc: 'Recycled 5+ different waste types',
    color: 'from-pink-400 to-rose-500',
    check: (pickups) => {
      const types = new Set(pickups.filter(p => p.status === 'completed').map(p => p.wasteType));
      return types.size >= 5;
    }
  },
  {
    id: 'credit_king',
    emoji: '💎',
    name: 'Credit King',
    desc: 'Earned 1,000+ green credits',
    color: 'from-teal-400 to-emerald-500',
    check: (pickups) => pickups.reduce((s, p) => s + (p.creditsAwarded || 0), 0) >= 1000
  },
  {
    id: 'century_pickups',
    emoji: '🚛',
    name: 'Century Pickups',
    desc: '10+ completed pickups',
    color: 'from-indigo-400 to-blue-500',
    check: (pickups) => pickups.filter(p => p.status === 'completed').length >= 10
  }
];

const BadgesSection = ({ pickups }) => {
  const badges = BADGE_DEFS.map(b => ({ ...b, unlocked: b.check(pickups) }));
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-green-50 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">🏅 Achievements</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{unlockedCount} of {badges.length} unlocked</p>
        </div>
        <div className="bg-green-100 px-3 py-1 rounded-full">
          <span className="text-green-800 font-black text-sm">{unlockedCount}/{badges.length}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`relative rounded-2xl p-4 text-center transition-all duration-300 ${
              badge.unlocked
                ? 'shadow-md hover:shadow-lg hover:-translate-y-0.5'
                : 'opacity-40 grayscale'
            }`}
          >
            {badge.unlocked && (
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-10`} />
            )}
            <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center text-2xl
              ${badge.unlocked ? `bg-gradient-to-br ${badge.color} shadow-md` : 'bg-gray-200'}`}>
              {badge.emoji}
            </div>
            <p className="font-black text-gray-800 text-xs leading-tight">{badge.name}</p>
            <p className="text-gray-400 text-[10px] mt-1 leading-snug">{badge.desc}</p>
            {badge.unlocked && (
              <span className="mt-2 inline-block bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                Unlocked ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;

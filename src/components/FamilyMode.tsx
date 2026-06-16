import React, { useState } from 'react';
import { FamilyMember } from '../types';
import { Users, Plus, Trash2, ArrowUpRight, Scale, Info } from 'lucide-react';

interface FamilyModeProps {
  familyMembers: FamilyMember[];
  onAddFamilyMember: (name: string, transport: number, energy: number, food: number, lifestyle: number) => void;
  onRemoveFamilyMember: (id: string) => void;
}

export const FamilyMode: React.FC<FamilyModeProps> = ({
  familyMembers,
  onAddFamilyMember,
  onRemoveFamilyMember
}) => {
  const [name, setName] = useState('');
  const [transport, setTransport] = useState('120');
  const [energy, setEnergy] = useState('90');
  const [food, setFood] = useState('80');
  const [lifestyle, setLifestyle] = useState('40');

  const totalSum = familyMembers.reduce((acc, m) => acc + m.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const t = Number(transport) || 0;
    const eg = Number(energy) || 0;
    const f = Number(food) || 0;
    const l = Number(lifestyle) || 0;

    onAddFamilyMember(name.trim(), t, eg, f, l);
    setName('');
  };

  return (
    <div className="bg-white border border-stone-200/85 rounded-2xl p-6 shadow-sm mr-auto" id="family_mode_container">
      <div className="pb-4 border-b border-stone-100 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Family & Household Group Mode</h2>
          <p className="text-xs text-stone-500 font-medium">Record and aggregate footprint metrics across multiple household members without cloud accounts</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form to enter a family member */}
        <div className="lg:col-span-5 bg-stone-50/70 p-5 rounded-xl border border-stone-200/60">
          <h3 className="text-sm font-bold text-stone-800 pb-3 border-b border-stone-200/50 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Add Family Member Footprint</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">Member Name / Tag</label>
              <input
                type="text"
                placeholder="e.g. Person A, Roommate, Sister"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-stone-200 rounded-lg p-2.5 bg-white font-medium focus:outline-emerald-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-600">Transport CO₂ (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-600">Utilities / Energy (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-600">Food Diet CO₂ (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-600">Lifestyle Offset (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-semibold py-2 px-1 text-stone-500">
                <span>Calculated Member Total:</span>
                <span className="font-extrabold text-stone-900 number-font">
                  {(Number(transport) + Number(energy) + Number(food) + Number(lifestyle) || 0).toFixed(0)} kg CO₂
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-stone-950 rounded-lg hover:bg-stone-850 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enroll Member Record</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* List representation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary counters */}
          <div className="bg-emerald-800 text-white p-5 rounded-xl shadow flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Household Aggregated footprint</p>
              <h3 className="text-2xl font-extrabold tracking-tight mt-1 number-font">{totalSum.toFixed(0)} <span className="text-sm font-medium text-emerald-100">kg CO₂ / month</span></h3>
              <p className="text-[10px] text-emerald-300 mt-1">Average per person: <span className="font-bold number-font">{familyMembers.length > 0 ? (totalSum / familyMembers.length).toFixed(0) : '0'}</span> kg</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-emerald-700 font-bold px-3 py-1.5 rounded-full border border-emerald-600/50">
                {familyMembers.length} Members Logged
              </span>
            </div>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-stone-100 p-3 border-b border-stone-200 flex justify-between font-bold text-xs text-stone-600">
              <span className="w-1/3">Family Name</span>
              <span className="w-1/2 text-center text-[10px] uppercase font-mono">T / E / F / L</span>
              <span className="w-1/6 text-right">Total</span>
            </div>

            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
              {familyMembers.map(member => (
                <div key={member.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-stone-50/50 transition-colors">
                  <div className="w-1/3 font-semibold text-stone-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="truncate">{member.name}</span>
                  </div>

                  <div className="w-1/2 text-center text-stone-500 font-medium font-mono text-[10px]">
                    {member.transport} / {member.energy} / {member.food} / {member.lifestyle}
                  </div>

                  <div className="w-1/6 text-right flex items-center justify-end gap-2">
                    <span className="font-bold text-stone-800 number-font">{member.total.toFixed(0)} kg</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFamilyMember(member.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                      title="Decline logging entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {familyMembers.length === 0 && (
                <div className="py-12 text-center space-y-1.5">
                  <p className="text-xs font-semibold text-stone-500">No family logs enrolled yet</p>
                  <p className="text-[10px] text-stone-400 max-w-sm mx-auto p-0.5">
                    Input records under the "Add Family Member" form to calculate household aggregates and map offsets with roommates or family members.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3.5 text-[10px] text-stone-500 flex gap-2 leading-relaxed">
            <Info className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Your local family lists are entirely insulated and stored directly in your browser. Unlocking active lists triggers the <strong>Family Captain</strong> achievement Badge automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

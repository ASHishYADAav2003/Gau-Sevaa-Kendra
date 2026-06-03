import { Heart, IndianRupee, Banknote, Users, TrendingUp, TrendingDown, Wheat, Stethoscope, Wrench } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      
      {/* 4 Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Animals */}
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-orange-400 border-x border-b border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Animals</p>
              <p className="text-3xl font-bold text-gray-900">48</p>
            </div>
            <div className="bg-orange-50 p-2 rounded-full">
              <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3 this month
          </p>
        </div>

        {/* Today's Donations */}
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-green-500 border-x border-b border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Today's Donations</p>
              <p className="text-3xl font-bold text-gray-900">₹42,500</p>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% vs yesterday
          </p>
        </div>

        {/* Month Expenses */}
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-yellow-400 border-x border-b border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Month Expenses</p>
              <p className="text-3xl font-bold text-gray-900">₹1.2L</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded-full">
              <Banknote className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs font-medium text-red-500 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> -5% vs last month
          </p>
        </div>

        {/* Subscribers */}
        <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-t-purple-400 border-x border-b border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">1,240</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-full">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +32 this week
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Animals Needing Attention */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Animals Needing Attention</h3>
          </div>
          <div className="p-5 flex-1 space-y-6">
            
            {/* Kapila */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <img src="/logo.jpeg" alt="Cow" className="w-8 h-8 object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Kapila <span className="text-xs font-normal text-gray-500">(कपिला) GSK-10023</span></h4>
                    <p className="text-xs text-gray-500">Rescued: 12 May 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded-full mb-1">Critical</span>
                    <p className="text-[10px] text-gray-500">Cost: ₹5,500/mo</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div className="bg-green-700 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* Gopal */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <img src="/logo.jpeg" alt="Cow" className="w-8 h-8 object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Gopal <span className="text-xs font-normal text-gray-500">(गोपाल) GSK-10024</span></h4>
                    <p className="text-xs text-gray-500">Rescued: 18 May 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded-full mb-1">Treatment</span>
                    <p className="text-[10px] text-gray-500">Cost: ₹3,000/mo</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>

            {/* Nandi */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <img src="/logo.jpeg" alt="Cow" className="w-8 h-8 object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Nandi <span className="text-xs font-normal text-gray-500">(नंदी) GSK-10022</span></h4>
                    <p className="text-xs text-gray-500">Rescued: 05 Apr 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-semibold rounded-full mb-1">Recovering</span>
                    <p className="text-[10px] text-gray-500">Cost: ₹2,500/mo</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>

            {/* Gauri */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <img src="/logo.jpeg" alt="Cow" className="w-8 h-8 object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Gauri <span className="text-xs font-normal text-gray-500">(गौरी) GSK-10021</span></h4>
                    <p className="text-xs text-gray-500">Rescued: 01 Jan 2026</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-semibold rounded-full mb-1">Healthy</span>
                    <p className="text-[10px] text-gray-500">Cost: ₹1,500/mo</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                  <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-800">Recent Expenses</h3>
            <button className="text-xs text-brand-orange font-semibold hover:underline">View All</button>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            
            {/* Chart Mockup */}
            <div className="h-32 flex items-end justify-between gap-2 mb-6 px-2">
              {[40, 60, 30, 80, 50, 10, 75, 45].map((height, i) => (
                <div key={i} className="w-full bg-gray-100 rounded-t-sm relative group h-full flex items-end">
                  <div 
                    className="w-full bg-[#f97316] rounded-t-sm transition-all duration-300" 
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">
                    {14 + i}
                  </span>
                </div>
              ))}
            </div>

            {/* List */}
            <div className="space-y-5 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                    <Wheat className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Weekly green fodder</p>
                    <p className="text-xs text-gray-500">20 May 2026</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-sm">₹15,500</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Vaccines and medicines</p>
                    <p className="text-xs text-gray-500">18 May 2026</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-sm">₹4,200</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Shed repair work</p>
                    <p className="text-xs text-gray-500">15 May 2026</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-sm">₹3,500</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

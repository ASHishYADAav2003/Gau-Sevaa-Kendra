import { Link } from 'react-router';
import { 
  Heart, 
  IndianRupee, 
  Receipt, 
  Users, 
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Download,
  FileText,
  Mail,
  Wheat,
  Stethoscope,
  Wrench
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 pb-12 font-['Inter',sans-serif]">
      
      {/* ROW 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-[12px] p-5 border border-[#EBEBEB] border-t-3 border-t-[#FF6600] shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] text-[#757575] font-medium mb-1">Total Animals</p>
              <h3 className="text-2xl font-bold text-gray-900">48</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#FF6600]">
              <Heart size={20} fill="currentColor" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[12px] text-[#2E7D32] font-medium">
            <TrendingUp size={14} className="mr-1" />
            <span>+3 this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[12px] p-5 border border-[#EBEBEB] border-t-3 border-t-[#2E7D32] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] text-[#757575] font-medium mb-1">Today's Donations</p>
              <h3 className="text-2xl font-bold text-gray-900">₹42,500</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[12px] text-[#2E7D32] font-medium">
            <TrendingUp size={14} className="mr-1" />
            <span>+18% vs yesterday</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[12px] p-5 border border-[#EBEBEB] border-t-3 border-t-[#F57C00] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] text-[#757575] font-medium mb-1">Month Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900">₹1.2L</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center text-[#F57C00]">
              <Receipt size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[12px] text-[#C62828] font-medium">
            <TrendingDown size={14} className="mr-1" />
            <span>-5% vs last month</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-[12px] p-5 border border-[#EBEBEB] border-t-3 border-t-[#7B1FA2] shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[13px] text-[#757575] font-medium mb-1">Subscribers</p>
              <h3 className="text-2xl font-bold text-gray-900">1,240</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#7B1FA2]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-[12px] text-[#2E7D32] font-medium">
            <TrendingUp size={14} className="mr-1" />
            <span>+32 this week</span>
          </div>
        </div>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Animals Needing Attention */}
        <div className="bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm">
          <div className="p-5 border-b border-[#EBEBEB]">
            <h3 className="text-[15px] font-medium text-gray-900">Animals Needing Attention</h3>
          </div>
          <div className="p-0">
            {[
              { emoji: '🐄', name: 'Kapila', hi: 'कपिला', tag: 'GSK-10023', date: '12 May 2026', cost: '₹5,500', needed: 80, status: 'Critical', statusColor: 'bg-[#FDECEA] text-[#C62828]' },
              { emoji: '🐃', name: 'Gopal', hi: 'गोपाल', tag: 'GSK-10024', date: '18 May 2026', cost: '₹3,000', needed: 40, status: 'Treatment', statusColor: 'bg-[#FFF3E0] text-[#F57C00]' },
              { emoji: '🐂', name: 'Nandi', hi: 'नंदी', tag: 'GSK-10022', date: '05 Apr 2026', cost: '₹2,500', needed: 90, status: 'Recovering', statusColor: 'bg-[#FFFDE7] text-[#FBC02D]' },
              { emoji: '🐄', name: 'Gauri', hi: 'गौरी', tag: 'GSK-10021', date: '01 Jan 2026', cost: '₹1,500', needed: 20, status: 'Healthy', statusColor: 'bg-[#E8F5E9] text-[#2E7D32]' }
            ].map((animal, i) => (
              <div key={i} className="p-4 border-b border-[#EBEBEB] last:border-0 hover:bg-gray-50 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-[#FFF3E0] flex items-center justify-center text-2xl shrink-0">
                  {animal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="truncate">
                      <span className="text-[14px] font-medium text-gray-900 mr-2">{animal.name} <span className="text-[12px] text-[#757575] font-normal font-['Noto_Sans_Devanagari']">({animal.hi})</span></span>
                      <span className="text-[11px] text-[#757575]">{animal.tag}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-[20px] text-[11px] font-medium shrink-0 ${animal.statusColor}`}>
                      {animal.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#757575] mb-2">
                    <span>Rescued: {animal.date}</span>
                    <span>Cost: {animal.cost}/mo</span>
                  </div>
                  <div className="w-full h-[4px] bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${animal.needed > 50 ? 'bg-[#2E7D32]' : 'bg-[#FF6600]'}`} 
                      style={{ width: `${animal.needed}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#EBEBEB] flex justify-between items-center">
            <h3 className="text-[15px] font-medium text-gray-900">Recent Expenses</h3>
            <span className="text-[12px] text-[#FF6600] cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            {/* Mini Bar Chart */}
            <div className="flex items-end justify-between h-24 mb-6 pt-2">
              {[40, 70, 35, 90, 50, 20, 85, 60].map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-[10%]">
                  <div className="w-full bg-gray-100 rounded-t-[4px] relative h-[80px]">
                    <div 
                      className="absolute bottom-0 w-full bg-[#FF6600] rounded-t-[4px] group-hover:bg-[#E55A00] transition-colors"
                      style={{ height: `${val}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-[#757575]">{i + 14}</span>
                </div>
              ))}
            </div>

            {/* Expense Rows */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Wheat size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 leading-tight">Weekly green fodder</p>
                    <p className="text-[11px] text-[#757575] leading-tight mt-0.5">20 May 2026</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-gray-900">₹15,500</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 leading-tight">Vaccines and medicines</p>
                    <p className="text-[11px] text-[#757575] leading-tight mt-0.5">18 May 2026</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-gray-900">₹4,200</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 leading-tight">Shed repair work</p>
                    <p className="text-[11px] text-[#757575] leading-tight mt-0.5">15 May 2026</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-gray-900">₹3,500</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Donations */}
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm">
          <div className="px-5 pt-5 pb-0 border-b border-[#EBEBEB] flex justify-between items-end">
            <h3 className="text-[15px] font-medium text-gray-900 pb-4">Donations</h3>
            <div className="flex gap-4">
              <button className="text-[13px] font-medium text-[#FF6600] border-b-2 border-[#FF6600] pb-3 px-1">Recent</button>
              <button className="text-[13px] font-medium text-[#757575] hover:text-gray-900 border-b-2 border-transparent pb-3 px-1 transition-colors">Top Donors</button>
            </div>
          </div>
          
          <div className="p-0">
            {[
              { name: 'Rahul Sharma', initial: 'R', color: 'bg-blue-100 text-blue-700', purpose: 'General Fund', mode: 'UPI', amount: '₹2,100' },
              { name: 'Priya Desai', initial: 'P', color: 'bg-purple-100 text-purple-700', purpose: 'Medical Care', mode: 'Credit Card', amount: '₹5,000' },
              { name: 'Amit Kumar', initial: 'A', color: 'bg-green-100 text-green-700', purpose: 'Fodder Donation', mode: 'Bank Transfer', amount: '₹11,000' },
              { name: 'Neha Gupta', initial: 'N', color: 'bg-pink-100 text-pink-700', purpose: 'Shed Building', mode: 'UPI', amount: '₹1,500' },
              { name: 'Vikram Singh', initial: 'V', color: 'bg-orange-100 text-orange-700', purpose: 'General Fund', mode: 'Cash', amount: '₹500' },
            ].map((donor, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-[#EBEBEB] last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${donor.color}`}>
                    {donor.initial}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900 leading-tight">{donor.name}</p>
                    <p className="text-[11px] text-[#757575] leading-tight mt-1">{donor.purpose} • {donor.mode}</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-[#2E7D32]">{donor.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[12px] border border-[#EBEBEB] shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#EBEBEB]">
            <h3 className="text-[15px] font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-3">
            <Link to="/admin/animals/add" className="w-full h-[40px] bg-[#FF6600] hover:bg-[#E55A00] text-white rounded-[8px] flex items-center px-4 transition-colors">
              <PlusCircle size={18} className="mr-3" />
              <span className="text-[13px] font-medium">+ Add New Animal</span>
            </Link>
            
            <Link to="/admin/expenses/add" className="w-full h-[40px] border border-[#EBEBEB] hover:border-[#FF6600] hover:text-[#FF6600] text-gray-700 rounded-[8px] flex items-center px-4 transition-colors">
              <Receipt size={18} className="mr-3 text-[#757575] group-hover:text-[#FF6600]" />
              <span className="text-[13px] font-medium">Add Daily Expense</span>
            </Link>
            
            <button className="w-full h-[40px] border border-[#EBEBEB] hover:border-[#FF6600] hover:text-[#FF6600] text-gray-700 rounded-[8px] flex items-center px-4 transition-colors">
              <Download size={18} className="mr-3 text-[#757575]" />
              <span className="text-[13px] font-medium">Export Donations CSV</span>
            </button>
            
            <Link to="/admin/blogs" className="w-full h-[40px] border border-[#EBEBEB] hover:border-[#FF6600] hover:text-[#FF6600] text-gray-700 rounded-[8px] flex items-center px-4 transition-colors">
              <FileText size={18} className="mr-3 text-[#757575]" />
              <span className="text-[13px] font-medium">Write Blog Post</span>
            </Link>
            
            <Link to="/admin/newsletter" className="w-full h-[40px] border border-[#EBEBEB] hover:border-[#FF6600] hover:text-[#FF6600] text-gray-700 rounded-[8px] flex items-center px-4 transition-colors">
              <Mail size={18} className="mr-3 text-[#757575]" />
              <span className="text-[13px] font-medium">Send Newsletter</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

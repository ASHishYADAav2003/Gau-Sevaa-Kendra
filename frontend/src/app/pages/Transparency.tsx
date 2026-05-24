import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, TrendingUp, DollarSign, PieChart as PieChartIcon, FileText, Calendar } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Transparency() {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState("April 2026");

  const expenseBreakdown = [
    { id: "food", name: "Food & Nutrition", value: 320000, color: "#fb923c" },
    { id: "medical", name: "Medical Treatment", value: 280000, color: "#f97316" },
    { id: "shelter", name: "Shelter Maintenance", value: 150000, color: "#ea580c" },
    { id: "rescue", name: "Rescue Operations", value: 85000, color: "#fdba74" },
    { id: "staff", name: "Staff Salaries", value: 120000, color: "#fed7aa" },
    { id: "utilities", name: "Utilities", value: 45000, color: "#ffedd5" },
  ];

  const monthlyData = [
    { month: "Oct", donations: 820000, expenses: 780000 },
    { month: "Nov", donations: 950000, expenses: 890000 },
    { month: "Dec", donations: 1100000, expenses: 980000 },
    { month: "Jan", donations: 880000, expenses: 920000 },
    { month: "Feb", donations: 970000, expenses: 950000 },
    { month: "Mar", donations: 1050000, expenses: 1000000 },
    { month: "Apr", donations: 1200000, expenses: 1000000 },
  ];

  const recentExpenses = [
    { date: "2026-05-15", category: "Medical", description: "Veterinary treatment for Lakshmi", amount: 12500, receipt: "RCP-2026-0543" },
    { date: "2026-05-14", category: "Food", description: "Bulk fodder purchase - 2 tons", amount: 28000, receipt: "RCP-2026-0542" },
    { date: "2026-05-14", category: "Medical", description: "Vaccination drive - 50 animals", amount: 35000, receipt: "RCP-2026-0541" },
    { date: "2026-05-13", category: "Shelter", description: "Shed repair and maintenance", amount: 18500, receipt: "RCP-2026-0540" },
    { date: "2026-05-12", category: "Rescue", description: "Emergency rescue operation", amount: 8500, receipt: "RCP-2026-0539" },
    { date: "2026-05-11", category: "Food", description: "Fresh vegetables and supplements", amount: 6200, receipt: "RCP-2026-0538" },
    { date: "2026-05-10", category: "Medical", description: "Medicine stock replenishment", amount: 22000, receipt: "RCP-2026-0537" },
  ];

  const animalWiseExpenses = [
    { animal: "Lakshmi", food: 3500, medical: 12500, shelter: 2000, total: 18000 },
    { animal: "Nandi", food: 3200, medical: 8500, shelter: 2000, total: 13700 },
    { animal: "Ganga (Triplets)", food: 7800, medical: 4200, shelter: 3500, total: 15500 },
    { animal: "Radha", food: 3800, medical: 15000, shelter: 2000, total: 20800 },
    { animal: "Krishna", food: 3400, medical: 2500, shelter: 2000, total: 7900 },
  ];

  const totalDonations = monthlyData.reduce((sum, month) => sum + month.donations, 0);
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0);
  const currentBalance = totalDonations - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('transparency.title')}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {t('transparency.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                <span className="text-sm text-gray-500">Total Donations</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">₹{(totalDonations / 100000).toFixed(1)}L</div>
              <p className="text-sm text-green-600 mt-1">Last 7 months</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <span className="text-sm text-gray-500">Total Expenses</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">₹{(totalExpenses / 100000).toFixed(1)}L</div>
              <p className="text-sm text-orange-600 mt-1">Last 7 months</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <PieChartIcon className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">Current Balance</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">₹{(currentBalance / 100000).toFixed(1)}L</div>
              <p className="text-sm text-blue-600 mt-1">Reserve funds</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-purple-600" />
                <span className="text-sm text-gray-500">Transparency Score</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <p className="text-sm text-purple-600 mt-1">All records public</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Monthly Donations vs Expenses */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Monthly Overview</h2>
                <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-semibold">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} id="monthly-chart">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="donations" fill="#fb923c" name="Donations" />
                  <Bar dataKey="expenses" fill="#f97316" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Expense Categories</h2>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option>April 2026</option>
                  <option>March 2026</option>
                  <option>February 2026</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart id="expense-pie-chart">
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry) => (
                      <Cell key={`cell-${entry.id}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-2">
                {expenseBreakdown.map((item) => (
                  <div key={`legend-${item.id}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Expenses Table */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Expenses</h2>
              <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-semibold">
                <FileText className="w-4 h-4" />
                View All Bills
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          expense.category === 'Medical' ? 'bg-red-100 text-red-700' :
                          expense.category === 'Food' ? 'bg-green-100 text-green-700' :
                          expense.category === 'Shelter' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{expense.description}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-orange-600 hover:text-orange-700 text-xs font-semibold flex items-center gap-1 mx-auto">
                          <Download className="w-3 h-3" />
                          {expense.receipt}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Animal-wise Expense Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Animal-wise Expense Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Animal Name</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Food</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Medical</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Shelter</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total (Monthly)</th>
                  </tr>
                </thead>
                <tbody>
                  {animalWiseExpenses.map((animal, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{animal.animal}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">₹{animal.food.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">₹{animal.medical.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">₹{animal.shelter.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm font-bold text-orange-600 text-right">₹{animal.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-orange-50 font-bold">
                    <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      ₹{animalWiseExpenses.reduce((sum, a) => sum + a.food, 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      ₹{animalWiseExpenses.reduce((sum, a) => sum + a.medical, 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      ₹{animalWiseExpenses.reduce((sum, a) => sum + a.shelter, 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-orange-600 text-right">
                      ₹{animalWiseExpenses.reduce((sum, a) => sum + a.total, 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Reports */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl shadow-lg p-8 mt-12 text-white text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Monthly Financial Reports</h3>
            <p className="mb-6 opacity-90">Download detailed PDF reports with all receipts and documentation</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold">
                Download April 2026 Report
              </button>
              <button className="bg-white/20 text-white border border-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-semibold">
                View Archive
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

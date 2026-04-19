import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface Entry { id: string; label: string; amount: number; type: 'expense' | 'income'; category: string; month: string; }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const EXPENSE_CATS = ['Seeds','Fertilizer','Labor','Equipment','Irrigation','Pesticide','Other'];
const INCOME_CATS = ['Crop Sale','Subsidy','Rental','Other'];
const COLORS = ['#4CAF50','#8BC34A','#CDDC39','#FFC107','#03A9F4','#9C27B0','#FF5722'];

const ExpenseChart = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', label: 'Wheat Seeds', amount: 3200, type: 'expense', category: 'Seeds', month: 'Oct' },
    { id: '2', label: 'DAP Fertilizer', amount: 4500, type: 'expense', category: 'Fertilizer', month: 'Oct' },
    { id: '3', label: 'Harvest Labor', amount: 5000, type: 'expense', category: 'Labor', month: 'Mar' },
    { id: '4', label: 'Wheat Sale', amount: 28000, type: 'income', category: 'Crop Sale', month: 'Apr' },
    { id: '5', label: 'PM-KISAN', amount: 2000, type: 'income', category: 'Subsidy', month: 'Feb' },
  ]);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', amount: '', type: 'expense' as 'expense' | 'income', category: 'Seeds', month: 'Jan' });

  const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const totalIncome = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const monthlyData = MONTHS.map(m => ({
    name: m,
    expense: entries.filter(e => e.type === 'expense' && e.month === m).reduce((s, e) => s + e.amount, 0),
    income: entries.filter(e => e.type === 'income' && e.month === m).reduce((s, e) => s + e.amount, 0),
  }));

  const catMap: Record<string, number> = {};
  entries.filter(e => e.type === 'expense').forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const categoryData = Object.entries(catMap).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));

  const addEntry = () => {
    if (!form.label || !form.amount) return;
    setEntries(prev => [...prev, { id: Date.now().toString(), ...form, amount: parseFloat(form.amount) }]);
    setForm({ label: '', amount: '', type: 'expense', category: 'Seeds', month: 'Jan' });
    setShowForm(false);
  };

  const removeEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-semibold">Financial Overview</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant={chartType === 'bar' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('bar')}>Monthly</Button>
          <Button variant={chartType === 'pie' ? 'default' : 'outline'} size="sm" onClick={() => setChartType('pie')}>Categories</Button>
          <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="text-green-600 border-green-400">
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <Input placeholder="Description" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            <Input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as any, category: v === 'expense' ? 'Seeds' : 'Crop Sale' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(form.type === 'expense' ? EXPENSE_CATS : INCOME_CATS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.month} onValueChange={v => setForm(f => ({ ...f, month: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={addEntry} className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
          </div>
        </div>
      )}

      <div className="h-[280px]">
        {chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
              <Legend />
              <Bar dataKey="expense" name="Expenses" fill="#FF5252" radius={[4,4,0,0]} />
              <Bar dataKey="income" name="Income" fill="#4CAF50" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData.length ? categoryData : [{ name: 'No Data', value: 1, color: '#ccc' }]} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {(categoryData.length ? categoryData : [{ name: 'No Data', value: 1, color: '#ccc' }]).map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {entries.length > 0 && (
        <div className="mt-3 max-h-28 overflow-y-auto space-y-1">
          {entries.map(e => (
            <div key={e.id} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-gray-50 dark:bg-gray-800">
              <span className={e.type === 'income' ? 'text-green-600' : 'text-red-500'}>{e.type === 'income' ? '+' : '-'}₹{e.amount.toLocaleString('en-IN')}</span>
              <span className="text-gray-600 dark:text-gray-400 flex-1 mx-2 truncate">{e.label} ({e.category}, {e.month})</span>
              <button onClick={() => removeEntry(e.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-xs text-gray-500">Total Income</p>
          <p className="text-lg font-semibold text-green-600">₹{totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Expenses</p>
          <p className="text-lg font-semibold text-red-500">₹{totalExpense.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Net Profit</p>
          <p className={`text-lg font-semibold ${netProfit >= 0 ? 'text-primary' : 'text-red-600'}`}>₹{netProfit.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  Banknote, 
  CreditCard, 
  Smartphone, 
  Receipt, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  History, 
  User, 
  UserPlus,
  Lock, 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  FileSpreadsheet,
  Cloud,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

// Denomination Definitions - Ascending Order
const COIN_DENOMINATIONS = [
  { value: 0.01, label: '$0.01 (Un Centavo)', short: '$0.01' },
  { value: 0.05, label: '$0.05 (Un Unésimo)', short: '$0.05' },
  { value: 0.10, label: '$0.10 (Un Décimo)', short: '$0.10' },
  { value: 0.25, label: '$0.25 (Un Cuarto)', short: '$0.25' },
  { value: 0.50, label: '$0.50 (Medio Balboa)', short: '$0.50' },
  { value: 1.00, label: '$1.00 (Balboa/Martinelli)', short: '$1.00' },
];

const BILL_DENOMINATIONS = [
  { value: 1, label: '$1.00', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 5, label: '$5.00', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { value: 10, label: '$10.00', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 20, label: '$20.00', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 50, label: '$50.00', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 100, label: '$100.00', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const PAYMENT_METHODS = [
  { id: 'yappy', name: 'Yappy (Banco General)', icon: Smartphone, color: 'text-orange-500 bg-orange-50' },
  { id: 'clave', name: 'Tarjeta Clave', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
  { id: 'visa_mc', name: 'Visa / Mastercard', icon: CreditCard, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'cheque', name: 'Cheque', icon: Receipt, color: 'text-slate-600 bg-slate-100' },
  { id: 'ach', name: 'Transferencia ACH', icon: Building2, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'otros', name: 'Otros / Varios', icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
];

const INITIAL_USERS = [
  { id: 'usr_1', name: 'María Rodríguez', role: 'Cajera Principal', avatar: 'MR' },
  { id: 'usr_2', name: 'Carlos Chen', role: 'Cajero Nocturno', avatar: 'CC' },
  { id: 'usr_3', name: 'Ana Gómez', role: 'Supervisora de Caja', avatar: 'AG' },
  { id: 'usr_4', name: 'Elena Delgado', role: 'Cajera Turno Mañana', avatar: 'ED' },
];

export default function App() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState('nuevo'); // 'nuevo' | 'historial'
  
  // User Management & Selected Cashier
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newCashierName, setNewCashierName] = useState('');
  const [newCashierRole, setNewCashierRole] = useState('Cajera/o');

  // Form State: Cash & Expected Sales
  const [initialCash, setInitialCash] = useState(100.00);
  const [expectedSales, setExpectedSales] = useState('');
  const [notes, setNotes] = useState('');

  // Bills Count State: { 1: qty, 5: qty, ... }
  const [bills, setBills] = useState({ 1: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 });

  // Coins Count State: { 0.01: qty, 0.05: qty, ... }
  const [coins, setCoins] = useState({ 0.01: 0, 0.05: 0, 0.10: 0, 0.25: 0, 0.50: 0, 1.00: 0 });

  // Non-Cash Digital Payments
  const [nonCash, setNonCash] = useState({
    yappy: '',
    clave: '',
    visa_mc: '',
    cheque: '',
    ach: '',
    otros: '',
  });

  // Withdrawals / Payouts list [{ id, amount, reason }]
  const [withdrawals, setWithdrawals] = useState([]);
  const [newWithdrawalAmount, setNewWithdrawalAmount] = useState('');
  const [newWithdrawalReason, setNewWithdrawalReason] = useState('');

  // History & Modal State
  const [history, setHistory] = useState([]);
  const [selectedArqueo, setSelectedArqueo] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Load stored mock data on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('cajeras_panama_list');
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        setUsersList(parsed);
        if (parsed.length > 0) setCurrentUser(parsed[0]);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }

    const saved = localStorage.getItem('arqueos_caja_panama');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved history', e);
      }
    } else {
      // Seed mock records
      const initialHistory = [
        {
          id: 'ARQ-2026-001',
          date: new Date(Date.now() - 86400000).toISOString(),
          user: INITIAL_USERS[0],
          initialCash: 100,
          expectedSales: 1250.50,
          totalCoins: 48.75,
          totalBills: 680.00,
          totalCashPhysical: 728.75,
          totalNonCash: 621.75,
          totalWithdrawals: 0,
          totalCounted: 1350.50,
          netExpected: 1350.50,
          difference: 0,
          notes: 'Arqueo de cierre perfecto sin faltantes.',
        }
      ];
      setHistory(initialHistory);
      localStorage.setItem('arqueos_caja_panama', JSON.stringify(initialHistory));
    }
  }, []);

  // Save users list updates
  const handleAddNewCashier = () => {
    if (!newCashierName.trim()) return;
    const initials = newCashierName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser = {
      id: `usr_${Date.now()}`,
      name: newCashierName.trim(),
      role: newCashierRole.trim() || 'Cajera/o',
      avatar: initials || 'CJ'
    };

    const updated = [...usersList, newUser];
    setUsersList(updated);
    setCurrentUser(newUser);
    localStorage.setItem('cajeras_panama_list', JSON.stringify(updated));

    setNewCashierName('');
    setNewCashierRole('Cajera/o');
    setShowAddUserModal(false);
  };

  // Save history updates
  const saveToHistory = (newRecord) => {
    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem('arqueos_caja_panama', JSON.stringify(updated));
  };

  // Input Handlers
  const handleBillChange = (val, qty) => {
    const num = Math.max(0, parseInt(qty) || 0);
    setBills(prev => ({ ...prev, [val]: num }));
  };

  const handleCoinChange = (val, qty) => {
    const num = Math.max(0, parseInt(qty) || 0);
    setCoins(prev => ({ ...prev, [val]: num }));
  };

  const handleNonCashChange = (field, val) => {
    setNonCash(prev => ({ ...prev, [field]: val }));
  };

  const handleAddWithdrawal = () => {
    const amt = parseFloat(newWithdrawalAmount);
    if (!amt || amt <= 0) return;
    setWithdrawals(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        amount: amt,
        reason: newWithdrawalReason.trim() || 'Retiro de caja / Pago a proveedor',
      }
    ]);
    setNewWithdrawalAmount('');
    setNewWithdrawalReason('');
  };

  const handleRemoveWithdrawal = (id) => {
    setWithdrawals(prev => prev.filter(item => item.id !== id));
  };

  // Computed Totals
  const totalCoins = useMemo(() => {
    return COIN_DENOMINATIONS.reduce((sum, item) => sum + (coins[item.value] || 0) * item.value, 0);
  }, [coins]);

  const totalBills = useMemo(() => {
    return BILL_DENOMINATIONS.reduce((sum, item) => sum + (bills[item.value] || 0) * item.value, 0);
  }, [bills]);

  const totalCashPhysical = useMemo(() => totalCoins + totalBills, [totalCoins, totalBills]);

  const totalNonCash = useMemo(() => {
    return Object.values(nonCash).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  }, [nonCash]);

  const totalWithdrawals = useMemo(() => {
    return withdrawals.reduce((sum, item) => sum + item.amount, 0);
  }, [withdrawals]);

  // Grand total counted across all channels
  const totalCounted = useMemo(() => {
    return totalCashPhysical + totalNonCash;
  }, [totalCashPhysical, totalNonCash]);

  // Net Expected Cash + NonCash = (Initial Cash + Expected Sales) - Withdrawals
  const expectedSalesNum = parseFloat(expectedSales) || 0;
  const initialCashNum = parseFloat(initialCash) || 0;
  
  const totalExpectedInDrawerAndDigital = useMemo(() => {
    return (initialCashNum + expectedSalesNum) - totalWithdrawals;
  }, [initialCashNum, expectedSalesNum, totalWithdrawals]);

  const difference = useMemo(() => {
    return totalCounted - totalExpectedInDrawerAndDigital;
  }, [totalCounted, totalExpectedInDrawerAndDigital]);

  // Submit / Save Arqueo
  const handleSaveArqueo = () => {
    const record = {
      id: `ARQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      user: currentUser,
      initialCash: initialCashNum,
      expectedSales: expectedSalesNum,
      coins,
      bills,
      nonCash,
      withdrawals,
      totalCoins,
      totalBills,
      totalCashPhysical,
      totalNonCash,
      totalWithdrawals,
      totalCounted,
      netExpected: totalExpectedInDrawerAndDigital,
      difference,
      notes,
    };

    saveToHistory(record);
    setSelectedArqueo(record);
    setShowPrintModal(true);
  };

  const handleResetForm = () => {
    setInitialCash(100.00);
    setExpectedSales('');
    setNotes('');
    setBills({ 1: 0, 5: 0, 10: 0, 20: 0, 50: 0, 100: 0 });
    setCoins({ 0.01: 0, 0.05: 0, 0.10: 0, 0.25: 0, 0.50: 0, 1.00: 0 });
    setNonCash({ yappy: '', clave: '', visa_mc: '', cheque: '', ach: '', otros: '' });
    setWithdrawals([]);
  };

  // Filtered History
  const filteredHistory = history.filter(item => {
    const q = searchFilter.toLowerCase();
    return (
      item.id.toLowerCase().includes(q) ||
      item.user?.name.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-12">
      {/* HEADER */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-xl text-slate-950 font-bold">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                ArqueoPro <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">Panamá 🇵🇦</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Control & Registro de Caja Registradora en Nube</p>
            </div>
          </div>

          {/* USER SWITCHER & NAVIGATION */}
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setActiveTab('nuevo')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === 'nuevo'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Nuevo Arqueo
              </button>
              <button
                onClick={() => setActiveTab('historial')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'historial'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Historial ({history.length})
              </button>
            </div>

            {/* Current Active Cashier Indicator */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                {currentUser.avatar}
              </div>
              <span className="text-xs text-slate-200 font-bold">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'nuevo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT FORM PANEL (8 COLS) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. SELECCIÓN DE CAJERA RESPONSABLE & CONFIGURACIÓN DE TURNO */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  1. Selección de Cajera Responsable y Configuración
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* SELECTOR DE CAJERA RESPONSABLE */}
                  <div className="sm:col-span-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-extrabold text-amber-900">
                        Cajera / Cajero Responsable del Arqueo (*)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(true)}
                        className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> + Nueva Cajera
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={currentUser.id}
                        onChange={(e) => {
                          const found = usersList.find(u => u.id === e.target.value);
                          if (found) setCurrentUser(found);
                        }}
                        className="w-full px-3 py-2 bg-white text-slate-800 font-bold border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm cursor-pointer"
                      >
                        {usersList.map(u => (
                          <option key={u.id} value={u.id}>
                            👩‍💼 {u.name} — ({u.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Monto Base / Fondo Inicial ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={initialCash}
                      onChange={(e) => setInitialCash(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Ventas Registradas en Sistema ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 1250.00"
                      value={expectedSales}
                      onChange={(e) => setExpectedSales(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* 2. DESGLOSE DE MONEDAS - ASCENDING ORDER */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    2. Conteo de Monedas (Orden Ascendente $0.01 ➔ $1.00)
                  </h2>
                  <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Subtotal Monedas: ${totalCoins.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {COIN_DENOMINATIONS.map(({ value, label, short }) => {
                    const count = coins[value] || '';
                    const sub = (coins[value] || 0) * value;
                    return (
                      <div key={value} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            {short}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            ${sub.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mb-1 truncate">{label}</div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => handleCoinChange(value, e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-1.5 text-center bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-slate-800"
                          />
                          <span className="text-xs text-slate-400">uds</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. DESGLOSE DE BILLETES - ASCENDING ORDER */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-green-600" />
                    3. Conteo de Billetes (Orden Ascendente $1.00 ➔ $100.00)
                  </h2>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Subtotal Billetes: ${totalBills.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {BILL_DENOMINATIONS.map(({ value, label, color }) => {
                    const count = bills[value] || '';
                    const sub = (bills[value] || 0) * value;
                    return (
                      <div key={value} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${color}`}>
                            {label}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            ${sub.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={count}
                            onChange={(e) => handleBillChange(value, e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-1.5 text-center bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800"
                          />
                          <span className="text-xs text-slate-400">uds</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. MEDIOS DE PAGO DIGITALES Y OTROS */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    4. Pagos Digitales y No-Efectivo
                  </h2>
                  <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                    Subtotal Digital: ${totalNonCash.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map(({ id, name, icon: Icon, color }) => (
                    <div key={id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate">{name}</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={nonCash[id] || ''}
                          onChange={(e) => handleNonCashChange(id, e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 text-right bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. RETIROS / SANGRÍAS DE CAJA */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ArrowDownRight className="w-5 h-5 text-rose-600" />
                  5. Retiros de Caja / Pagos Salientes (Sangrías)
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Monto ($)"
                    value={newWithdrawalAmount}
                    onChange={(e) => setNewWithdrawalAmount(e.target.value)}
                    className="sm:w-36 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Motivo (ej: Pago de proveedor de insumos)"
                    value={newWithdrawalReason}
                    onChange={(e) => setNewWithdrawalReason(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800"
                  />
                  <button
                    onClick={handleAddWithdrawal}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Agregar
                  </button>
                </div>

                {withdrawals.length > 0 ? (
                  <div className="space-y-2">
                    {withdrawals.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-xs">
                        <span className="font-semibold text-rose-950">{item.reason}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-rose-700">-${item.amount.toFixed(2)}</span>
                          <button
                            onClick={() => handleRemoveWithdrawal(item.id)}
                            className="text-rose-400 hover:text-rose-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No se han registrado salidas ni retiros durante el turno.</p>
                )}
              </div>

              {/* NOTAS GENERALES */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Observaciones / Notas Adicionales del Cierre
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Se dejó el sencillo completo en monedas. Falta voucher de Visa por falla del terminal."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs text-slate-800"
                ></textarea>
              </div>

            </div>

            {/* RIGHT SUMMARY SIDEBAR (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 sticky top-20">
                <h3 className="text-lg font-extrabold text-amber-400 mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span>Resumen de Cierre</span>
                  <Cloud className="w-5 h-5 text-slate-500" />
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400">Cajera Responsable:</span>
                    <span className="font-extrabold text-amber-300">{currentUser.name}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Base Inicial (+):</span>
                    <span className="font-semibold text-white">${initialCashNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Ventas Sistema (+):</span>
                    <span className="font-semibold text-white">${expectedSalesNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Retiros Sangrías (-):</span>
                    <span className="font-semibold text-rose-400">-${totalWithdrawals.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400 font-medium">
                    <span>Total Esperado Sistema:</span>
                    <span className="font-bold text-slate-200">${totalExpectedInDrawerAndDigital.toFixed(2)}</span>
                  </div>

                  <div className="my-4 p-3 bg-slate-800 rounded-xl space-y-2 border border-slate-700/60">
                    <div className="flex justify-between text-amber-300">
                      <span>Total Monedas ($0.01-$1):</span>
                      <span className="font-bold">${totalCoins.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Total Billetes ($1-$100):</span>
                      <span className="font-bold">${totalBills.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-indigo-300">
                      <span>Total Digital / Tarjetas:</span>
                      <span className="font-bold">${totalNonCash.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* GRAND TOTAL COUNTED */}
                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 text-center">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Total Físico + Digital Contado
                    </span>
                    <span className="text-3xl font-black text-amber-400">
                      ${totalCounted.toFixed(2)}
                    </span>
                  </div>

                  {/* VARIANCE DISPLAY */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    Math.abs(difference) < 0.01
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : difference > 0
                      ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {Math.abs(difference) < 0.01 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                      <div>
                        <div className="font-bold text-xs">
                          {Math.abs(difference) < 0.01
                            ? 'Caja Balanceada'
                            : difference > 0
                            ? 'Sobrante en Caja'
                            : 'Faltante en Caja'}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {Math.abs(difference) < 0.01 ? 'Sin diferencias' : 'Diferencia detectada'}
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-black">
                      {difference >= 0 ? `+$${difference.toFixed(2)}` : `-$${Math.abs(difference).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={handleSaveArqueo}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Save className="w-5 h-5" />
                    Guardar y Generar Comprobante
                  </button>

                  <button
                    onClick={handleResetForm}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Limpiar Formulario
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HISTORIAL TAB */}
        {activeTab === 'historial' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Historial de Arqueos Registrados</h2>
                <p className="text-xs text-slate-500">Registros guardados por cajeras responsibles</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID, cajero..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {filteredHistory.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  No se encontraron arqueos guardados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-4">Código ID</th>
                        <th className="p-4">Fecha y Hora</th>
                        <th className="p-4">Cajera Responsable</th>
                        <th className="p-4 text-right">Efectivo Físico</th>
                        <th className="p-4 text-right">Digital / Varios</th>
                        <th className="p-4 text-right">Total Contado</th>
                        <th className="p-4 text-right">Diferencia</th>
                        <th className="p-4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{item.id}</td>
                          <td className="p-4 text-slate-500">
                            {new Date(item.date).toLocaleString('es-PA', { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                              👩‍💼 {item.user?.name || 'No especificado'}
                            </span>
                          </td>
                          <td className="p-4 text-right font-semibold text-emerald-700">
                            ${item.totalCashPhysical?.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-semibold text-indigo-700">
                            ${item.totalNonCash?.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-bold text-slate-900">
                            ${item.totalCounted?.toFixed(2)}
                          </td>
                          <td className="p-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                              Math.abs(item.difference) < 0.01
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.difference > 0
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.difference >= 0 ? `+$${item.difference.toFixed(2)}` : `-$${Math.abs(item.difference).toFixed(2)}`}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedArqueo(item);
                                setShowPrintModal(true);
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" /> Ticket
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: REGISTRAR NUEVA CAJERA */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-500" />
              Registrar Nueva Cajera / Cajero
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nombre Completo (*)</label>
                <input
                  type="text"
                  placeholder="Ej: Carmen Gómez"
                  value={newCashierName}
                  onChange={(e) => setNewCashierName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Cargo / Rol</label>
                <input
                  type="text"
                  placeholder="Ej: Cajera Turno Tarde"
                  value={newCashierRole}
                  onChange={(e) => setNewCashierRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddNewCashier}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow transition-colors"
              >
                Guardar Cajera
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT TICKET MODAL */}
      {showPrintModal && selectedArqueo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* TICKET CONTAINER FOR PRINTING */}
            <div id="printable-ticket" className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-3">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h2 className="text-base font-black tracking-tight text-slate-900">COMPROBANTE DE ARQUEO</h2>
                <p className="text-[10px] text-slate-500">República de Panamá 🇵🇦</p>
                <p className="text-[10px] text-slate-400 mt-1">ID: {selectedArqueo.id}</p>
                <p className="text-[10px] text-slate-400">
                  Fecha: {new Date(selectedArqueo.date).toLocaleString('es-PA')}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between bg-amber-100/60 p-1.5 rounded">
                  <span className="text-amber-950 font-bold">Cajera Responsable:</span>
                  <span className="font-black text-amber-950">{selectedArqueo.user?.name}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Monto Base Inicial:</span>
                  <span>${selectedArqueo.initialCash?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ventas Sistema:</span>
                  <span>${selectedArqueo.expectedSales?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Retiros / Sangrías:</span>
                  <span>-${selectedArqueo.totalWithdrawals?.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>DESGLOSE CONTEO:</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>- Monedas ($0.01-$1.00):</span>
                  <span>${selectedArqueo.totalCoins?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>- Billetes ($1.00-$100):</span>
                  <span>${selectedArqueo.totalBills?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>- Digital/Tarjetas/Yappy:</span>
                  <span>${selectedArqueo.totalNonCash?.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t-2 border-slate-900 pt-2 space-y-1 text-sm font-bold">
                <div className="flex justify-between text-slate-900">
                  <span>TOTAL CONTADO:</span>
                  <span>${selectedArqueo.totalCounted?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>TOTAL ESPERADO:</span>
                  <span>${selectedArqueo.netExpected?.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between pt-1 ${
                  Math.abs(selectedArqueo.difference) < 0.01
                    ? 'text-emerald-700'
                    : selectedArqueo.difference > 0
                    ? 'text-blue-700'
                    : 'text-rose-700'
                }`}>
                  <span>DIFERENCIA:</span>
                  <span>
                    {selectedArqueo.difference >= 0
                      ? `+$${selectedArqueo.difference?.toFixed(2)}`
                      : `-$${Math.abs(selectedArqueo.difference)?.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {selectedArqueo.notes && (
                <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-500">
                  <strong>Notas:</strong> {selectedArqueo.notes}
                </div>
              )}

              <div className="pt-6 text-center text-[10px] text-slate-400 space-y-8">
                <div className="border-t border-slate-300 pt-1 w-3/4 mx-auto font-bold text-slate-600">
                  Firma Cajera Responsable
                  <br />
                  <span className="text-[9px] font-normal text-slate-400">({selectedArqueo.user?.name})</span>
                </div>
                <div className="border-t border-slate-300 pt-1 w-3/4 mx-auto font-bold text-slate-600">
                  Firma Supervisor
                </div>
              </div>
            </div>

            {/* MODAL CONTROLS */}
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" /> Imprimir Comprobante
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

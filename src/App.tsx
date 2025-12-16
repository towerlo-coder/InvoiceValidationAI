import React, { useState } from 'react';
import { 
  Check, 
  AlertTriangle, 
  X, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  RefreshCw, 
  Building, 
  Calendar, 
  DollarSign, 
  Hash, 
  CreditCard,
  CheckCircle2,
  Menu,
  Search,
  Bell,
  Briefcase,
  Layers,
  MapPin,
  ArrowRight
} from 'lucide-react';

// --- Types & Interfaces ---

// Use React.ElementType for the icon prop to be flexible
type IconType = React.ElementType;

interface LineItem {
  desc: string;
  qty: number;
  unit: number;
  total: number;
}

interface Invoice {
  id: string;
  status: string;
  vendor: string;
  vendorConfidence: number;
  invoiceDate: string;
  dateConfidence: number;
  invoiceNumber: string;
  numberConfidence: number;
  totalAmount: string;
  amountConfidence: number;
  currency: string;
  glAccount: string;
  glConfidence: number;
  companyCode: string;
  ccConfidence: number;
  costCenter: string;
  costCenterConfidence: number;
  profitCenter: string;
  profitCenterConfidence: number;
  lineItems: LineItem[];
}

// --- Mock Data ---

const MOCK_INVOICES_LIST: Invoice[] = [
  {
    id: "INV-2024-001",
    status: "Review Needed", // Review Needed, Posted, Rejected
    vendor: "Acme Corp Services",
    vendorConfidence: 0.98,
    invoiceDate: "2024-12-12",
    dateConfidence: 0.65,
    invoiceNumber: "AC-99283",
    numberConfidence: 0.95,
    totalAmount: "1,250.00",
    amountConfidence: 0.99,
    currency: "USD",
    glAccount: "600100 - Office Supplies",
    glConfidence: 0.40,
    // New SAP Dimensions
    companyCode: "1000",
    ccConfidence: 0.99,
    costCenter: "CC-IT-001",
    costCenterConfidence: 0.85,
    profitCenter: "PC-US-EAST",
    profitCenterConfidence: 0.70,
    lineItems: [
      { desc: "Consulting Services - Q4", qty: 10, unit: 120, total: 1200 },
      { desc: "Travel Expenses", qty: 1, unit: 50, total: 50 }
    ]
  },
  {
    id: "INV-2024-002",
    status: "Review Needed",
    vendor: "TechStart Logistics",
    vendorConfidence: 0.92,
    invoiceDate: "2024-12-10",
    dateConfidence: 0.95,
    invoiceNumber: "TS-2201",
    numberConfidence: 0.98,
    totalAmount: "4,500.00",
    amountConfidence: 0.92,
    currency: "USD",
    glAccount: "600300 - Travel & Entertainment",
    glConfidence: 0.90,
    companyCode: "1000",
    ccConfidence: 0.99,
    costCenter: "CC-OPS-002",
    costCenterConfidence: 0.91,
    profitCenter: "PC-US-WEST",
    profitCenterConfidence: 0.88,
    lineItems: []
  },
  {
    id: "INV-2024-003",
    status: "Posted",
    vendor: "Globex Internet",
    vendorConfidence: 0.99,
    invoiceDate: "2024-12-01",
    dateConfidence: 0.99,
    invoiceNumber: "GL-883",
    numberConfidence: 0.99,
    totalAmount: "120.00",
    amountConfidence: 0.99,
    currency: "USD",
    glAccount: "600500 - Utilities",
    glConfidence: 0.99,
    companyCode: "2000",
    ccConfidence: 0.99,
    costCenter: "CC-HQ-001",
    costCenterConfidence: 0.99,
    profitCenter: "PC-GLOBAL",
    profitCenterConfidence: 0.99,
    lineItems: []
  }
];

const GL_ACCOUNTS: string[] = [
  "600100 - Office Supplies",
  "600200 - Professional Services",
  "600300 - Travel & Entertainment",
  "600400 - Software Licenses",
  "600500 - Utilities"
];

const COST_CENTERS: string[] = [
  "CC-IT-001 - IT Operations",
  "CC-HR-001 - Human Resources",
  "CC-FIN-001 - Finance Dept",
  "CC-OPS-002 - Logistics",
  "CC-HQ-001 - Headquarters"
];

// --- Components ---

interface ConfidenceBadgeProps {
  score: number;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score }) => {
  let color = "bg-green-100 text-green-800 border-green-200";
  let icon = <Check size={12} />;
  let label = "High";

  if (score < 0.7) {
    color = "bg-red-100 text-red-800 border-red-200";
    icon = <AlertTriangle size={12} />;
    label = "Low";
  } else if (score < 0.9) {
    color = "bg-yellow-100 text-yellow-800 border-yellow-200";
    icon = <AlertTriangle size={12} />;
    label = "Medium";
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      <span>{label} ({Math.round(score * 100)}%)</span>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  confidence: number;
  type?: string;
  icon?: IconType;
  options?: string[] | null;
  width?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, confidence, type = "text", icon: Icon, options = null, width = "w-full" }) => {
  const isLowConfidence = confidence < 0.8;
  
  return (
    <div className={`mb-4 ${width}`}>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          {Icon && <Icon size={14} className="text-slate-400" />}
          {label}
        </label>
        <ConfidenceBadge score={confidence} />
      </div>
      
      <div className="relative">
        {options ? (
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2.5 text-sm border rounded-lg appearance-none bg-white focus:ring-2 outline-none transition-all
              ${isLowConfidence ? 'border-orange-300 ring-orange-100 focus:border-orange-500 focus:ring-orange-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}
            `}
          >
            <option value="" disabled>Select...</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-2.5 text-sm border rounded-lg focus:ring-2 outline-none transition-all
              ${isLowConfidence ? 'border-orange-300 bg-orange-50 focus:border-orange-500 focus:ring-orange-200' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}
            `}
          />
        )}
        
        {isLowConfidence && (
          <div className="absolute right-3 top-2.5 text-orange-500 animate-pulse">
            <AlertTriangle size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Views ---

interface DocumentListProps {
  onSelect: (invoice: Invoice) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ onSelect }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Document Worklist</h2>
           <p className="text-slate-500">Queue: Incoming Invoices (SharePoint)</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2 hover:bg-slate-800">
           <RefreshCw size={16} /> Refresh Queue
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
             <tr>
               <th className="px-6 py-4">Status</th>
               <th className="px-6 py-4">Vendor</th>
               <th className="px-6 py-4">Invoice #</th>
               <th className="px-6 py-4">Date</th>
               <th className="px-6 py-4 text-right">Amount</th>
               <th className="px-6 py-4">Dimensions</th>
               <th className="px-6 py-4"></th>
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {MOCK_INVOICES_LIST.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                   <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                        ${inv.status === 'Posted' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                         {inv.status === 'Posted' ? <CheckCircle2 size={12}/> : <AlertTriangle size={12}/>}
                         {inv.status}
                      </span>
                   </td>
                   <td className="px-6 py-4 font-medium text-slate-900">{inv.vendor}</td>
                   <td className="px-6 py-4 text-slate-500">{inv.invoiceNumber}</td>
                   <td className="px-6 py-4 text-slate-500">{inv.invoiceDate}</td>
                   <td className="px-6 py-4 text-right font-mono font-medium">${inv.totalAmount}</td>
                   <td className="px-6 py-4 text-xs text-slate-500">
                      <div>Co: {inv.companyCode}</div>
                      <div>CC: {inv.costCenter.split(' - ')[0]}</div>
                   </td>
                   <td className="px-6 py-4 text-right">
                      {inv.status !== 'Posted' && (
                        <button 
                          onClick={() => onSelect(inv)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Review <ArrowRight size={16} />
                        </button>
                      )}
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ValidationCockpitProps {
  invoice: Invoice;
  onBack: () => void;
}

const ValidationCockpit: React.FC<ValidationCockpitProps> = ({ invoice, onBack }) => {
  const [formData, setFormData] = useState<Invoice>(invoice);
  const [status, setStatus] = useState<string>(invoice.status === 'Posted' ? 'posted' : 'review');
  const [sapId, setSapId] = useState<string | null>(invoice.status === 'Posted' ? '190002931' : null);

  const handlePostToSAP = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('posted');
      setSapId("510000" + Math.floor(Math.random() * 9000));
    }, 2000);
  };

  return (
    <div className="flex flex-1 overflow-hidden h-full">
        {/* Left Panel: Document Viewer */}
        <div className="flex-1 bg-slate-800 p-8 overflow-y-auto flex flex-col items-center justify-start border-r border-slate-200 relative">
          <div className="w-full flex justify-between items-center mb-6 text-white/80">
             <button onClick={onBack} className="flex items-center gap-2 hover:text-white transition-colors">
                <ChevronLeft size={16} /> Back to List
             </button>
             <div className="bg-black/50 px-3 py-1 rounded-md text-xs backdrop-blur-sm flex items-center gap-2">
                <FileText size={12} /> {invoice.id}.pdf
             </div>
          </div>
          
          {/* Simulated Paper Invoice */}
          <div className="w-full max-w-xl bg-white shadow-2xl min-h-[800px] p-10 text-xs text-slate-800 relative transform transition-transform duration-300">
             {/* Invoice Header */}
             <div className="flex justify-between items-start mb-12 border-b-2 border-slate-800 pb-4">
                <div>
                   <h2 className="text-2xl font-serif font-bold text-slate-900">{invoice.vendor}</h2>
                   <p className="text-slate-500">123 Business Rd, Tech City</p>
                </div>
                <div className="text-right">
                   <h1 className="text-4xl font-light text-slate-300 mb-2">INVOICE</h1>
                   <p><strong>Date:</strong> {invoice.invoiceDate}</p>
                   <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                </div>
             </div>
             {/* Bill To */}
             <div className="mb-12">
                <p className="text-slate-500 mb-1">BILL TO:</p>
                <h3 className="text-lg font-bold">Client Industries Inc.</h3>
                <p>Company Code: {invoice.companyCode}</p>
             </div>
             {/* Line Items */}
             <table className="w-full mb-12">
                <thead>
                   <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="text-left py-2 px-2">Description</th>
                      <th className="text-right py-2 px-2">Qty</th>
                      <th className="text-right py-2 px-2">Unit</th>
                      <th className="text-right py-2 px-2">Total</th>
                   </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="py-3 px-2">{item.desc}</td>
                      <td className="text-right py-3 px-2">{item.qty}</td>
                      <td className="text-right py-3 px-2">{item.unit}</td>
                      <td className="text-right py-3 px-2">{item.total}</td>
                   </tr>
                  ))}
                   {invoice.lineItems.length === 0 && (
                     <tr className="border-b border-slate-100">
                        <td className="py-3 px-2">Service Fee (Generated)</td>
                        <td className="text-right py-3 px-2">1</td>
                        <td className="text-right py-3 px-2">{invoice.totalAmount}</td>
                        <td className="text-right py-3 px-2">{invoice.totalAmount}</td>
                     </tr>
                   )}
                </tbody>
             </table>
             {/* Totals */}
             <div className="flex justify-end">
                <div className="w-48">
                   <div className="flex justify-between py-2 font-bold text-lg mt-2">
                      <span>Total:</span>
                      <span>${invoice.totalAmount}</span>
                   </div>
                </div>
             </div>
             <div className="absolute inset-0 pointer-events-none bg-yellow-50/10 mix-blend-multiply"></div>
          </div>
        </div>

        {/* Right Panel: Extraction Form */}
        <div className="w-[500px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <RefreshCw size={18} className="text-blue-500" />
              Validation & Coding
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Verify extracted data and SAP Dimensions.
            </p>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {status === 'posted' ? (
               <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                     <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Posted to SAP</h3>
                  <div className="bg-slate-100 rounded-lg p-4 w-full mb-8 border border-slate-200 mt-4">
                     <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">SAP Document ID</p>
                     <p className="text-xl font-mono text-slate-900 tracking-wider select-all">{sapId}</p>
                  </div>
                  <button onClick={onBack} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                     Back to Worklist
                  </button>
               </div>
            ) : (
               <div className={`space-y-6 ${status === 'processing' ? 'opacity-50 pointer-events-none' : ''}`}>
                  
                  {/* Basic Data */}
                  <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Header Data</h3>
                     <InputField 
                        label="Vendor Name"
                        value={formData.vendor}
                        onChange={(v) => setFormData({...formData, vendor: v})}
                        confidence={formData.vendorConfidence}
                        icon={Building}
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <InputField 
                           label="Invoice Date"
                           type="date"
                           value={formData.invoiceDate}
                           onChange={(v) => setFormData({...formData, invoiceDate: v})}
                           confidence={formData.dateConfidence}
                           icon={Calendar}
                        />
                        <InputField 
                           label="Invoice Number"
                           value={formData.invoiceNumber}
                           onChange={(v) => setFormData({...formData, invoiceNumber: v})}
                           confidence={formData.numberConfidence}
                           icon={Hash}
                        />
                     </div>
                     <div className="flex gap-4">
                        <InputField 
                           label="Total Amount"
                           value={formData.totalAmount}
                           onChange={(v) => setFormData({...formData, totalAmount: v})}
                           confidence={formData.amountConfidence}
                           icon={DollarSign}
                        />
                         <div className="w-1/3">
                            <label className="text-sm font-medium text-slate-700 block mb-1">Currency</label>
                            <input value={formData.currency} disabled className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-500" />
                         </div>
                     </div>
                  </div>

                  {/* SAP Dimensions (New) */}
                  <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-4">
                     <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Layers size={14} /> SAP Dimensions
                     </h3>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <InputField 
                           label="Company Code"
                           value={formData.companyCode}
                           onChange={(v) => setFormData({...formData, companyCode: v})}
                           confidence={formData.ccConfidence}
                           icon={Briefcase}
                        />
                        <InputField 
                           label="Profit Center"
                           value={formData.profitCenter}
                           onChange={(v) => setFormData({...formData, profitCenter: v})}
                           confidence={formData.profitCenterConfidence}
                           icon={MapPin}
                        />
                     </div>

                     <InputField 
                        label="Cost Center"
                        value={formData.costCenter}
                        onChange={(v) => setFormData({...formData, costCenter: v})}
                        confidence={formData.costCenterConfidence}
                        icon={Building}
                        options={COST_CENTERS}
                     />

                     <div className="pt-2 border-t border-blue-200/50 mt-2">
                         <div className="bg-white p-3 rounded border border-blue-100">
                             <p className="text-xs text-blue-600 mb-2 font-medium">AI Insight:</p>
                             <p className="text-xs text-slate-600">
                                Vendor "TechStart" usually maps to <strong>CC-OPS-002</strong>. <br/>
                                Profit center derived from Company Code 1000.
                             </p>
                         </div>
                     </div>
                  </div>

                  {/* GL Account */}
                  <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">GL Coding</h3>
                     <InputField 
                        label="GL Account"
                        value={formData.glAccount}
                        onChange={(v) => setFormData({...formData, glAccount: v})}
                        confidence={formData.glConfidence}
                        icon={CreditCard}
                        options={GL_ACCOUNTS}
                     />
                  </div>

               </div>
            )}
          </div>

          {/* Footer Actions */}
          {status !== 'posted' && (
             <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
               <button 
                  disabled={status === 'processing'}
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
               >
                  <X size={18} /> Reject
               </button>
               <button 
                  onClick={handlePostToSAP}
                  disabled={status === 'processing'}
                  className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2 disabled:bg-blue-400"
               >
                  {status === 'processing' ? (
                     <>
                        <RefreshCw size={18} className="animate-spin" /> Simulating SAP BAPI...
                     </>
                  ) : (
                     <>
                        <Save size={18} /> Approve & Post
                     </>
                  )}
               </button>
             </div>
          )}
        </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentView, setCurrentView] = useState<'list' | 'cockpit'>('list'); // 'list' or 'cockpit'
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('cockpit');
  };

  const handleBack = () => {
    setSelectedInvoice(null);
    setCurrentView('list');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Top Navigation Bar (Global) */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-30 relative">
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleBack}>
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Invoice Validator AI</h1>
            <p className="text-xs text-slate-500">SAP Integration Cockpit</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-slate-600">System Online</span>
          </div>
          <div className="relative">
            <Bell size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </div>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
            JS
          </div>
        </div>
      </header>

      {/* 2. Main Content Swapper */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'list' ? (
          <DocumentList onSelect={handleSelectInvoice} />
        ) : (
          // selectedInvoice is guaranteed to be non-null here due to logic, but TypeScript might need a check or cast if strict.
          // Since setCurrentView('cockpit') is only called with handleSelectInvoice, we can assume it's set.
          selectedInvoice && <ValidationCockpit invoice={selectedInvoice} onBack={handleBack} />
        )}
      </main>

    </div>
  );
}
import React, { useState } from 'react'
import AssetDirectory from './pages/AssetDirectory'
import Bookings from './pages/Bookings'
import Maintenance from './pages/Maintenance'
import { Boxes, Calendar, Wrench } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col font-sans">
      {/* Interactive Review Header */}
      <header className="bg-[#1E293B] border-b border-[#334155] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#2962FF] p-2 rounded-lg text-white">
            <span className="font-bold text-lg">AF</span>
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-white leading-tight">AssetFlow</h2>
            <span className="text-xs text-slate-400">Enterprise Resource & Service ERP Preview</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-[#0F172A] p-1.5 rounded-xl border border-[#334155] gap-1">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-[#2962FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Asset Directory</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#2962FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              activeTab === 'maintenance'
                ? 'bg-[#2962FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Maintenance</span>
          </button>
        </nav>
      </header>

      {/* Page Content Dashboard */}
      <main className="flex-1 bg-[#0F172A]">
        {activeTab === 'directory' && <AssetDirectory />}
        {activeTab === 'bookings' && <Bookings />}
        {activeTab === 'maintenance' && <Maintenance />}
      </main>
    </div>
  )
}

export default App

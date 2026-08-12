import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Send, AlertTriangle, Sparkles, User, FileText, Wrench, ShieldAlert, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIMaintenanceAssistant: React.FC = () => {
  const { selectedAircraft } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am **AeroFix AI**, specialized in commercial jets (Boeing, Airbus) and helicopters. 

How can I assist your engineering team today? You can ask about:
• **Fault Isolation & Troubleshooting** (e.g. B737 nose gear steering, fuel pressure drop)
• **Parts Cross-Referencing & Interchangeability**
• **AMM / IPC / FIM Inspection Procedures**
• **Specialized Calibration Tools & Torque Specifications**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const presetPrompts = [
    `Troubleshoot ${selectedAircraft.name} nose landing gear steering failure`,
    'Find replacement part options for hydraulic pump P/N 65-46321-12',
    'Explain ATA 29 hydraulic system pressure loss isolation procedure',
    'Check compatibility between part numbers 65-46321-12 and 65-46321-15',
  ];

  const handleSend = async (queryText?: string) => {
    const query = queryText || input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          aircraftModel: selectedAircraft.name,
          ataCode: 'ATA 29/32',
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'Unable to complete AI response. Please verify server connectivity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Error contacting AI backend service. Please ensure server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Powered by Gemini 3.6 Flash Aviation Intelligence
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">AeroFix AI Maintenance Specialist</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Context-aware diagnostic & parts engineering specialist tuned for Boeing, Airbus, and helicopter airframe systems.
          </p>
        </div>

        <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl">
          Active Fleet: {selectedAircraft.name}
        </span>
      </div>

      {/* Mandatory Safety Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-800 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-900 font-bold uppercase tracking-wider block">
            MRO Safety Protocol Notice
          </strong>
          AeroFix AI provides advisory decision support. AI suggestions do NOT constitute approved engineering orders. Always verify torque values, wiring diagrams, and steps against current approved operator AMM / FIM / IPC documentation before performing airframe maintenance.
        </div>
      </div>

      {/* Preset Prompts Bar */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preset MRO Queries:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-left bg-white hover:bg-blue-50/80 text-slate-800 hover:text-blue-700 p-3 rounded-xl border border-slate-200 hover:border-blue-300 text-xs font-medium transition-all flex items-center justify-between group shadow-2xs"
            >
              <span className="line-clamp-1">{prompt}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat History Box (Sleek Dark Terminal) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[520px] overflow-hidden text-white">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-blue-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div
                  className={`text-[10px] ${
                    msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-blue-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700 w-fit animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" /> AeroFix Gemini AI is analyzing engineering manuals and parts databases...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask AI about faults, symptoms, P/N alternatives, or AMM procedures..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

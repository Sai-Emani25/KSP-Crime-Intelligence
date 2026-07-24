import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

interface AICrimeCopilotProps {
  initialPrompt?: string;
}

export const AICrimeCopilot: React.FC<AICrimeCopilotProps> = ({ initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'Analyze cyber fraud incidents in Bengaluru Urban from last month involving fake police calls and telegram trading scams.'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; mode?: string }>>([
    {
      sender: 'ai',
      text: `Welcome to the **Karnataka State Police Strategic AI Copilot**.

I am connected to the live State Crime Records Bureau (SCRB) dataset and predictive modeling engine. You can ask me to:
- **Analyze spatiotemporal crime clusters & MO signatures**
- **Draft tactical patrol deployment plans for high-risk beats**
- **Synthesize suspect criminal dossiers and syndicate connections**
- **Formulate executive briefing summaries for DGP & CM meetings**

Select a quick prompt below or type your strategic query:`,
    },
  ]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    'Analyze WhatsApp Digital Arrest scam wave in Whitefield CEN PS jurisdiction',
    'Formulate weekend night patrol plan for Koramangala and Indiranagar pub clusters',
    'Synthesize darknet narcotics supply chain links between Mangaluru and Udupi',
    'Identify repeat offenders operating across Belagavi and Hubballi-Dharwad borders',
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || prompt;
    if (!q.trim() || loading) return;

    const userMessage = { sender: 'user' as const, text: q };
    setChatHistory((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: data.reply || 'Analysis completed.',
          mode: data.mode,
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai' as const,
          text: 'Unable to reach Gemini AI backend service. Please check network connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-950/50">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>SCRB Strategic Intelligence Assistant</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Gemini 2.5 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generative Crime Pattern Reasoner, Dossier Synthesizer & Strategic Copilot
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setChatHistory([
              {
                sender: 'ai',
                text: 'Chat history reset. Ready for new intelligence query.',
              },
            ])
          }
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          title="Reset Chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat History View */}
      <div className="flex-1 overflow-y-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4 font-sans">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-1 mb-2 gap-4">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  {msg.sender === 'user' ? '👨‍✈️ SCRB Officer' : '🤖 Strategic AI Copilot'}
                </span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    className="text-slate-400 hover:text-slate-200 transition"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 w-fit animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Analyzing 5,000+ SCRB records & running Gemini AI reasoning...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Suggested Intelligence Queries
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <input
          type="text"
          placeholder="Ask AI Copilot to analyze crime trends, formulate patrol plans or draft case summaries..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 px-3 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition disabled:opacity-50"
        >
          <span>Analyze</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

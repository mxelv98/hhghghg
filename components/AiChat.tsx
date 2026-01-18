
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { getAiAnalysis } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface AiChatProps {
  user: User;
  onBack: () => void;
}

const AiChat: React.FC<AiChatProps> = ({ user, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Accessing database... Analysis module ready. How can I assist with your strategy today?`, sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    const aiResponseText = await getAiAnalysis(inputValue, user.isVip);
    setMessages(prev => [...prev, { id: (Date.now()+1).toString(), text: aiResponseText || 'System offline.', sender: 'ai' }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      <header className="px-6 py-5 flex items-center justify-between border-b border-brand-border bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h3 className="font-bold text-sm">AI STRATEGIST</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Online Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed border ${
              m.sender === 'user' 
                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/10' 
                : 'bg-slate-900 text-slate-200 border-slate-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 px-5 py-3.5 rounded-2xl flex items-center gap-3">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-200"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Processing Data</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950 border-t border-brand-border">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1.5 flex gap-2 focus-within:border-brand-primary/50 transition-colors shadow-2xl">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe market movement..."
            className="flex-1 bg-transparent border-none text-sm px-4 py-2 focus:ring-0 placeholder:text-slate-600 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

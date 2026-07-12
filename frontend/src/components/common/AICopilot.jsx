import React, { useState, useRef, useEffect } from 'react';
import { Leaf, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from '../../services/aiService';

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I am your EcoSphere AI Copilot. Ask me anything about your carbon emissions, departments, or sustainability goals!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const SUGGESTIONS = [
    'Analyze our emissions',
    'Recommend improvements',
    'Generate ESG Summary',
    'Which department has the highest emissions?',
  ];

  const handleSend = async (e, forcedInput = null) => {
    if (e) e.preventDefault();
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: textToSend.trim() };
    setMessages((prev) => [...prev, userMessage]);
    if (!forcedInput) setInput('');
    setIsLoading(true);

    try {
      // Get the last 6 messages excluding the welcome message and errors
      const historyToSend = messages
        .filter(m => m.id !== 1 && !m.isError)
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await sendChatMessage(userMessage.content, historyToSend);
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I'm currently unable to generate a response. Please try again in a moment.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(null, suggestion);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-env-600 hover:bg-env-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-bounce group"
        >
          <Leaf className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed right-6 bottom-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-[800px] h-[80vh] max-w-[90vw]' : 'w-[380px] h-[600px] max-h-[80vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-env-600 dark:bg-env-800 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">EcoSphere AI</h3>
                <p className="text-xs text-env-100">Your sustainability assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-env-600 text-white rounded-br-none shadow-sm'
                      : msg.isError 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-bl-none border border-red-100 dark:border-red-900/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800 dark:prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 mt-4 max-w-[85%]">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Suggested Questions</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      disabled={isLoading}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left text-xs bg-white dark:bg-slate-800 border border-env-200 dark:border-env-800 hover:border-env-400 dark:hover:border-env-600 hover:bg-env-50 dark:hover:bg-slate-700 text-env-700 dark:text-env-300 rounded-lg px-3 py-2 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-env-600" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your emissions..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-env-500 focus:border-transparent transition-all dark:text-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-env-600 hover:bg-env-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-env-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AICopilot;

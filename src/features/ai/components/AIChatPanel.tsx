import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  projectId: number;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 I'm Antigravity AI. Ask me anything about your dataset — distributions, correlations, feature importance, or modeling strategy. I'll provide data-driven answers."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await apiClient.post('/ai/chat', {
        project_id: projectId,
        message: userMsg,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an issue connecting to the AI service. Please ensure the backend is running and your OpenAI API key is configured."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border-[#1f2937] flex flex-col h-[600px]">
      <CardHeader className="border-b border-[#1f2937] pb-4 shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#6366F1]" />
          AI Data Assistant
        </CardTitle>
        <p className="text-sm text-[#9CA3AF]">Powered by OpenAI GPT-4o-mini</p>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-[#6366F1]" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#6366F1] text-white rounded-br-none'
                  : 'bg-[#1f2937] text-[#F9FAFB] rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-[#22D3EE]/20 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-[#22D3EE]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-[#6366F1]/20 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-[#6366F1] animate-pulse" />
            </div>
            <div className="bg-[#1f2937] px-4 py-3 rounded-xl rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Input Area */}
      <div className="p-4 border-t border-[#1f2937] shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your data (e.g. 'Which features predict churn?')"
            className="flex-1 bg-[#0b1020] border border-[#374151] rounded-lg px-4 py-2.5 text-sm text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#6366F1] transition-colors"
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

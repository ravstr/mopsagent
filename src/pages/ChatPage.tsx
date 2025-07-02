import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Zap, User, Bot } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../components/UserProfile';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get initial prompt from navigation state
  const initialPrompt = location.state?.initialPrompt;

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!loading && !user) {
      navigate('/');
      return;
    }

    // Add initial prompt as first message if it exists
    if (initialPrompt && messages.length === 0) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: initialPrompt,
        role: 'user',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      
      // Simulate AI response for now
      handleAIResponse(initialPrompt);
    }
  }, [initialPrompt, user, loading, navigate, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual OpenAI API call
      // This is a placeholder response tailored for marketing use cases
      const aiResponse = generateMarketingResponse(userMessage);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMarketingResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('email') || lowerPrompt.includes('campaign')) {
      return `Great question about email campaigns! Here's how I can help you optimize your email marketing:

**Key Areas to Focus On:**
• **Segmentation**: Divide your audience based on behavior, demographics, and engagement levels
• **Personalization**: Use dynamic content and personalized subject lines
• **A/B Testing**: Test subject lines, send times, and content variations
• **Automation**: Set up drip campaigns and triggered emails

**Specific Recommendations:**
1. Analyze your current open rates and click-through rates
2. Implement behavioral triggers for abandoned cart emails
3. Create re-engagement campaigns for inactive subscribers
4. Optimize send times based on your audience's time zones

Would you like me to dive deeper into any of these areas or help you create a specific email campaign strategy?`;
    }
    
    if (lowerPrompt.includes('lead') || lowerPrompt.includes('scoring')) {
      return `Lead scoring is crucial for prioritizing your sales efforts! Here's a comprehensive approach:

**Lead Scoring Framework:**
• **Demographic Data** (20-30 points): Job title, company size, industry
• **Behavioral Data** (40-50 points): Website visits, content downloads, email engagement
• **Engagement Level** (20-30 points): Social media interactions, webinar attendance

**Implementation Strategy:**
1. **Define Your Ideal Customer Profile (ICP)**
2. **Set Point Values** for different actions and attributes
3. **Create Scoring Tiers** (Hot: 80+, Warm: 50-79, Cold: <50)
4. **Automate Follow-up Actions** based on scores

**Tools & Metrics:**
- Track conversion rates by score ranges
- Monitor score decay over time
- Integrate with your CRM for seamless handoffs

What specific aspects of lead scoring would you like to explore further?`;
    }
    
    if (lowerPrompt.includes('segment') || lowerPrompt.includes('customer')) {
      return `Customer segmentation is the foundation of effective marketing! Let me help you create meaningful segments:

**Segmentation Strategies:**
• **Behavioral Segmentation**: Purchase history, website behavior, engagement patterns
• **Demographic Segmentation**: Age, location, job role, company size
• **Psychographic Segmentation**: Values, interests, lifestyle
• **Lifecycle Stage**: New prospects, active customers, at-risk customers

**Advanced Segmentation Techniques:**
1. **RFM Analysis**: Recency, Frequency, Monetary value
2. **Cohort Analysis**: Group customers by acquisition date
3. **Predictive Segmentation**: Use ML to predict future behavior
4. **Dynamic Segmentation**: Segments that update automatically

**Actionable Next Steps:**
- Audit your current data sources
- Identify your top 3-5 most valuable segments
- Create targeted campaigns for each segment
- Set up automated segment updates

Which type of segmentation would be most valuable for your current marketing goals?`;
    }
    
    // Default marketing-focused response
    return `I'm here to help you optimize your marketing operations! Based on your query, here are some strategic recommendations:

**Marketing Operations Best Practices:**
• **Data Integration**: Ensure all your marketing tools are connected and sharing data
• **Attribution Modeling**: Track the customer journey across all touchpoints
• **Performance Analytics**: Set up dashboards for real-time campaign monitoring
• **Process Automation**: Automate repetitive tasks to focus on strategy

**Key Areas to Explore:**
1. **Campaign Optimization**: Improve ROI across all channels
2. **Lead Management**: Streamline lead capture to conversion
3. **Customer Journey Mapping**: Understand and optimize touchpoints
4. **Marketing Technology Stack**: Evaluate and optimize your tools

**Next Steps:**
- Identify your biggest marketing challenge
- Audit your current processes and tools
- Set measurable goals and KPIs
- Create an action plan with timelines

What specific marketing challenge would you like to tackle first? I can provide more targeted advice based on your priorities.`;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage.trim();
    setCurrentMessage('');

    await handleAIResponse(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 flex items-center justify-center">
        <div className="text-gray-700 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-soft">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">MopsAgent</span>
          </div>
        </div>
        
        <UserProfile />
      </nav>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-3xl p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white ml-12'
                    : 'bg-white/95 text-gray-800 shadow-soft border border-gray-200/30'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/95 p-4 rounded-2xl shadow-soft border border-gray-200/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="px-8 py-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/40">
        <div className="max-w-4xl mx-auto">
          <div className="card-soft p-4">
            <div className="flex items-end space-x-4">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Continue the conversation..."
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 border-none outline-none resize-none text-base leading-relaxed min-h-[60px] max-h-32 font-medium"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                className={`btn-primary-compact flex items-center space-x-2 ${
                  !currentMessage.trim() || isLoading
                    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:translate-y-0'
                    : ''
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
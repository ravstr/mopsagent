import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { EmailSignup } from './components/EmailSignup';
import { Footer } from './components/Footer';

function App() {
  const [prompt, setPrompt] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  const suggestions = [
    'Optimize email campaigns',
    'Generate lead scoring',
    'Customer segmentation',
    'Analyze conversion funnels',
    'Attribution reporting',
    'Automate workflows',
    'Content personalization',
    'Journey analytics'
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleSendClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // Handle sending the prompt when user is authenticated
    console.log('Sending prompt:', prompt);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 flex items-center justify-center">
        <div className="text-gray-700 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-beige-50 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-soft">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">MopsAgent</span>
        </div>
        
        {user ? (
          <UserProfile />
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="btn-secondary"
          >
            Sign In
          </button>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20 max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="heading-large mb-8 text-gray-800">
            Marketing Ops
            <br />
            meets AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl leading-relaxed font-medium">
            Supercharge your marketing operations with intelligent automation.
          </p>
        </div>

        {/* Prompt Box */}
        <div className="w-full max-w-3xl mb-12">
          <div className="card-soft p-6 mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="How can MopsAgent help you today?"
              className="w-full bg-transparent text-gray-800 placeholder-gray-500 border-none outline-none resize-none text-base leading-relaxed min-h-[100px] font-medium"
              rows={4}
            />
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleSendClick}
                className={`btn-primary-compact flex items-center space-x-2 ${!prompt.trim() ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:translate-y-0' : ''}`}
                disabled={!prompt.trim()}
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-5xl mb-20">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="chip-compact"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Email Signup Section */}
        <div className="w-full max-w-md">
          <EmailSignup />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-beige-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-beige-400/8 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;
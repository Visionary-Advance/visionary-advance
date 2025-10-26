'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Briefcase, Calendar, Users, Lock, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function JobberConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Check for success or error in URL params
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');

    if (success === 'true') {
      setMessage({
        type: 'success',
        text: 'Successfully connected to Jobber! Your account is now synced.'
      });
      // Clear URL params
      window.history.replaceState({}, '', '/connect-jobber');
    } else if (error) {
      const errorMessages = {
        'oauth_failed': 'Failed to connect to Jobber. Please try again.',
        'access_denied': 'You denied access to Jobber.',
      };
      setMessage({
        type: 'error',
        text: errorMessages[error] || 'An error occurred. Please try again.'
      });
      // Clear URL params
      window.history.replaceState({}, '', '/connect-jobber');
    }
  }, []);

  const handleConnect = () => {
    setIsConnecting(true);
    // Use the server-side authorize endpoint which handles all OAuth configuration
    window.location.href = '/api/jobber/authorize';
  };

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Auto-Create Clients",
      description: "Form submissions automatically create new clients in your Jobber account"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Auto-Create Requests",
      description: "Service requests are instantly generated in Jobber from website forms"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Sync",
      description: "No manual data entry - form data syncs to Jobber in real-time"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Streamlined Workflow",
      description: "Turn website inquiries into Jobber jobs in seconds, not minutes"
    }
  ];

  const steps = [
    "Click 'Connect Jobber Account' below",
    "Log in to your Jobber account",
    "Authorize the connection",
    "Start creating requests automatically with every form submission!"
  ];

  return (
    <div className="min-h-screen bg-[#191E1E] pt-28.5 text-white">
      {/* Message Banner */}
      {message.text && (
        <div className={`px-4 md:px-16 py-4 ${message.type === 'success' ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'} border-t-4`}>
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            {message.type === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            )}
            <p className="font-manrope text-white">{message.text}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-[#008070]"></div>
              <span className="font-manrope text-[#008070] font-semibold">Integration</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                Connect Your
                <Image
                  src="/Img/Jobber-WhiteFull.png"
                  alt="Jobber"
                  width={600}
                  height={120}
                  className="h-20 md:h-14 lg:h-20 w-auto"
                />
                Account
              </h1>
              <p className="font-manrope text-lg text-white max-w-3xl mx-auto">
                Integrate Jobber with your website to automatically create clients and requests right from your form when users submit a form
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center space-y-6 p-8 bg-black/30 rounded-2xl border border-white/10 hover:border-[#008070]/50 transition-all duration-300"
              >
                <div className="text-[#008070] flex justify-center">
                  {feature.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="font-anton text-xl text-white">
                    {feature.title}
                  </h3>
                  <p className="font-manrope text-white">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 md:px-16 py-16 md:py-20 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <p className="font-manrope font-semibold text-[#008070]">Simple Process</p>
            <h2 className="font-anton text-3xl md:text-4xl text-white leading-tight">
              How It Works
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-start gap-6 p-6 bg-[#191E1E] rounded-2xl border border-white/10"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#008070] rounded-full flex items-center justify-center">
                  <span className="font-anton text-white text-lg">{index + 1}</span>
                </div>
                <p className="font-manrope text-white text-lg pt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 bg-black/30 rounded-2xl border border-[#008070]/30">
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#008070]/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#008070]" />
                </div>
                <h3 className="font-anton text-2xl text-[#008070]">
                  Secure & Private
                </h3>
              </div>
              <p className="font-manrope text-white">
                Your Jobber credentials are never stored on our servers. We use OAuth 2.0,
                the industry standard for secure authorization. You can revoke access at any time
                from your Jobber account settings.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <CheckCircle className="w-5 h-5 text-[#008070]" />
                <span className="font-manrope text-white">Bank-level encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#008070]" />
                <span className="font-manrope text-white">Revoke access anytime</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#008070]" />
                <span className="font-manrope text-white">Industry standard OAuth 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-16 py-16 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h2 className="font-anton text-3xl md:text-5xl text-white leading-tight">
              Ready to Get Started?
            </h2>
            <p className="font-manrope text-lg text-white max-w-2xl mx-auto">
              Connect your Jobber account now and start syncing client data automatically
            </p>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-[#008070] hover:bg-[#006b5d] text-white px-8 py-4 rounded-lg font-manrope font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting to Jobber...
              </>
            ) : (
              <>
                <Briefcase className="w-6 h-6" />
                Connect Jobber Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="font-manrope text-white text-sm mt-6">
            By connecting, you agree to share your Jobber client and job data with this application
          </p>
        </div>
      </section>

      {/* Footer Info */}
      <section className="px-4 md:px-16 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-manrope text-white mb-4">
            Need help? Contact our support team at{' '}
            <a href="mailto:info@visionaryadvance.com" className="text-[#008070] hover:underline">
              info@visionaryadvance.com
            </a>
          </p>
         
        </div>
      </section>
    </div>
  );
}
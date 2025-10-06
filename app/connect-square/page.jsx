'use client';

import { useState } from 'react';
import { CheckCircle, CreditCard, ShoppingBag, Store, Lock, Zap, ArrowRight } from 'lucide-react';

export default function SquareConnectPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    // Check if Application ID is configured
    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
    
    if (!appId) {
      alert('Square Application ID is not configured. Please add NEXT_PUBLIC_SQUARE_APPLICATION_ID to your .env.local file and restart the server.');
      return;
    }
    
    setIsConnecting(true);
    
    // FORCE the correct redirect URI based on environment
    let redirectUri = process.env.NEXT_PUBLIC_SQUARE_REDIRECT_URI;
    
    if (!redirectUri) {
      const isLocalhost = typeof window !== 'undefined' && 
                         (window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1');
      
      if (isLocalhost) {
        redirectUri = 'http://localhost:3000/api/square/callback';
      } else {
        // ALWAYS use non-www version to match Square Dashboard
        redirectUri = 'https://visionaryadvance.com/api/square/callback';
      }
    }
    
    // Determine OAuth base URL
    const isProduction = !appId.includes('sandbox');
    const oauthBaseUrl = isProduction 
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';
    
    const params = new URLSearchParams({
      client_id: appId,
      scope: 'MERCHANT_PROFILE_READ PAYMENTS_READ PAYMENTS_WRITE ORDERS_READ ORDERS_WRITE',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: `state_${Date.now()}_${Math.random().toString(36).substring(7)}`
    });

    const oauthUrl = `${oauthBaseUrl}/oauth2/authorize?${params.toString()}`;
    
    console.log('=== Square OAuth Debug Info ===');
    console.log('Current hostname:', window.location.hostname);
    console.log('Environment:', isProduction ? 'PRODUCTION' : 'SANDBOX');
    console.log('OAuth Base URL:', oauthBaseUrl);
    console.log('Client ID:', appId);
    console.log('Redirect URI (forced):', redirectUri);
    console.log('Full OAuth URL:', oauthUrl);
    console.log('===============================');
    
    // Verify the URL has https://
    if (!redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
      console.error('❌ ERROR: Redirect URI missing protocol!');
      console.error('Current value:', redirectUri);
      alert('Configuration error: Redirect URI is malformed. Check console for details.');
      setIsConnecting(false);
      return;
    }
    
    // Redirect to Square OAuth
    window.location.href = oauthUrl;
  };

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Accept Payments",
      description: "Process credit cards, mobile payments, and more"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Manage Orders",
      description: "Track and fulfill customer orders seamlessly"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Sync Inventory",
      description: "Keep your product catalog in sync automatically"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Get instant notifications for new transactions"
    }
  ];

  const steps = [
    "Click 'Connect Square Account' below",
    "Log in to your Square account",
    "Authorize the connection",
    "Start accepting payments!"
  ];

  return (
    <div className="min-h-screen bg-[#191E1E] text-white">
      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-[#008070]"></div>
              <span className="font-manrope text-[#008070] font-semibold">Integration</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
                Connect Your Square Account
              </h1>
              <p className="font-manrope text-lg text-white max-w-3xl mx-auto">
                Integrate Square with your website to accept payments, manage orders, and grow your business
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
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[#008070]/20 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#008070]" />
              </div>
              <div className="space-y-4">
                <h3 className="font-anton text-2xl text-[#008070]">
                  Secure & Private
                </h3>
                <p className="font-manrope text-white">
                  Your Square credentials are never stored on our servers. We use OAuth 2.0, 
                  the industry standard for secure authorization. You can revoke access at any time 
                  from your Square dashboard.
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
              Connect your Square account now and start accepting payments in minutes
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
                Connecting to Square...
              </>
            ) : (
              <>
                <Store className="w-6 h-6" />
                Connect Square Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="font-manrope text-white text-sm mt-6">
            By connecting, you agree to share your Square merchant profile, 
            payment, and order data with this application
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
          <p className="font-manrope text-white">
            Already connected?{' '}
            <a href="/dashboard" className="text-[#008070] hover:underline font-semibold">
              Go to Dashboard
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
import { AnimatePresence, motion } from 'framer-motion';
import log from 'loglevel';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from './AuthForm.tsx';
import { MarketingPanel } from './MarketingPanel.tsx';

interface AuthSwitchProps {
  onClose?: () => void;
}

export const Component = ({ onClose }: AuthSwitchProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleSuccess = (userData: { email: string; name?: string }) => {
    log.log('Authentication successful:', userData);
    setIsClosing(true);
    void navigate('/teams');
  };

  return (
    <AnimatePresence mode="wait">
      {!isClosing && (
        <motion.div
          key="auth-modal"
          className="min-h-screen relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 animated-gradient-bg" />

          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-radial-green opacity-40 animate-pulse" />
          <div
            className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-radial-blue opacity-40 animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={goBack}
            className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </motion.button>

          <div className="relative z-10 h-screen w-screen flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh] md:w-[700px] md:h-[600px] max-w-6xl"
            >
              <div className="bg-white/10 backdrop-blur-2xl rounded-[1.5rem] border border-white/20 shadow-2xl overflow-hidden h-full">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="hidden md:flex md:w-2/5">
                    <MarketingPanel />
                  </div>

                  <div className="w-full md:w-3/5 bg-white/95 backdrop-blur-xl p-4 sm:p-8 md:p-16 h-full overflow-y-auto">
                    <AuthForm
                      onSuccess={handleSuccess}
                      onClose={() => {
                        log.log('Auth form closed');
                        goBack();
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Component;

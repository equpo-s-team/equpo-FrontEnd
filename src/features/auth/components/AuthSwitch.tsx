import { AnimatePresence, motion } from 'framer-motion';
import log from 'loglevel';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthForm } from './AuthForm.tsx';
import { MarketingPanel } from './MarketingPanel.tsx';

interface AuthSwitchProps {
  onClose?: () => void;
}

export const AuthSwitch = ({ onClose }: AuthSwitchProps) => {
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
          className="min-h-screen relative w-full overflow-hidden"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={goBack}
            className="absolute top-6 md:top-8 right-6 md:right-8 z-30 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all backdrop-blur-sm bg-white/10 rounded-lg border border-white/20"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="relative z-10 w-screen h-screen md:h-screen md:flex md:items-center md:justify-center lg:w-[55vw] md:m-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full h-full md:w-[90vw] lg:w-[80vw] md:h-[80vh] rounded-none md:rounded-[1.5rem] md:overflow-hidden"
            >
              <div className="flex h-full items-center bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border-0 md:border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden">
                <div className="hidden md:flex md:w-2/5">
                  <MarketingPanel />
                </div>

                <div className="w-full h-full md:w-3/5 bg-white/95 dark:bg-gray-900/60 backdrop-blur-xl p-6 md:p-12 overflow-y-auto">
                  <AuthForm
                    onSuccess={handleSuccess}
                    onClose={() => {
                      log.log('Auth form closed');
                      goBack();
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthSwitch;

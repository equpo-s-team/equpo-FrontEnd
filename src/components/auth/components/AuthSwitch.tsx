'use client';

import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {ArrowLeft} from 'lucide-react';
import {AuthForm} from './AuthForm';
import {MarketingPanel} from './MarketingPanel';

export const Component = () => {
    const [isClosing, setIsClosing] = useState(false);

    const goBack = () => {
        setIsClosing(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 500);
    };

    return (
        <AnimatePresence mode="wait">
            {!isClosing && (
                <motion.div
                    key="auth-modal"
                    className="min-h-screen relative overflow-hidden"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.3}}
                >
                    <div className="absolute inset-0 animated-gradient-bg"/>

                    <div
                        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-radial-green opacity-40 animate-pulse"/>
                    <div
                        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-radial-blue opacity-40 animate-pulse"
                        style={{animationDelay: '2s'}}/>
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 blur-3xl animate-pulse"
                        style={{animationDelay: '1s'}}/>

                    <motion.button
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: 0.3}}
                        onClick={goBack}
                        className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                        <span className="font-medium">Volver</span>
                    </motion.button>

                    <div className="relative z-10 h-screen w-screen flex items-center justify-center">
                        <motion.div
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            transition={{duration: 0.5, ease: "easeInOut"}}
                            className="w-[85vw] max-w-6xl h-[85vh]"
                        >
                            <div
                                className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full">
                                <div className="flex h-full">
                                    <MarketingPanel/>

                                    <div className="w-3/5 bg-white/95 backdrop-blur-xl p-16 h-full overflow-y-auto">
                                        <AuthForm
                                            onSuccess={(userData) => {
                                                console.log('Authentication successful:', userData);
                                                window.location.href = '/dashboard';
                                            }}
                                            onClose={() => {
                                                console.log('Auth form closed');
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

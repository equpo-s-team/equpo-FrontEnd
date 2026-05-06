import { ArrowRight, Link2, UserPlus, X } from 'lucide-react';

interface InvitationChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLink: () => void;
  onSelectUid: () => void;
}

export function InvitationChoiceModal({
  isOpen,
  onClose,
  onSelectLink,
  onSelectUid,
}: InvitationChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-grey-100 dark:border-gray-700 transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Header */}
        <div className="flex flex-col items-center p-8 pb-6 border-b border-grey-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-grey-800 dark:text-gray-100 font-body mb-2">
            ¿Cómo quieres invitar?
          </h2>
          <p className="text-sm text-grey-500 dark:text-grey-400 font-body text-center max-w-xs">
            Elige el método que mejor se adapte a tus necesidades
          </p>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-600 dark:hover:text-grey-300 hover:bg-grey-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="p-8 pt-6 space-y-4">
          {/* Link Invitation */}
          <button
            onClick={() => {
              onSelectLink();
              onClose();
            }}
            className="w-full p-5 rounded-xl border-2 border-grey-200 dark:border-gray-600 hover:border-blue hover:bg-blue/5 dark:hover:bg-blue/10 transition-all duration-200 text-left group transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue/20 transition-colors">
                <Link2 size={20} className="text-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-grey-800 dark:text-gray-100 mb-1 font-body text-base">
                  Invitar con enlace
                </h3>
                <p className="text-sm text-grey-500 dark:text-grey-400 font-body">
                  Cualquiera con el link puede unirse
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue text-white flex items-center justify-center group-hover:bg-blue/600 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </button>

          {/* UID Invitation */}
          <button
            onClick={() => {
              onSelectUid();
              onClose();
            }}
            className="w-full p-5 rounded-xl border-2 border-grey-200 dark:border-gray-600 hover:border-purple hover:bg-purple/5 dark:hover:bg-purple/10 transition-all duration-200 text-left group transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple/20 transition-colors">
                <UserPlus size={20} className="text-purple" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-grey-800 dark:text-gray-100 mb-1 font-body text-base">
                  Agregar por UID o Email
                </h3>
                <p className="text-sm text-grey-500 dark:text-grey-400 font-body">Para usuarios específicos</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple text-white flex items-center justify-center group-hover:bg-purple/600 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

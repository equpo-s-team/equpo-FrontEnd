import { useEffect, useRef, useState } from 'react';
import { X, Users, Phone } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase';
import { useChatContext } from './ChatContext';
import { useActiveCalls } from '../hooks/useActiveCalls';

interface ChatInfoModalProps {
  onClose: () => void;
}

export default function ChatInfoModal({ onClose }: ChatInfoModalProps) {
  const { activeRoom, teamId } = useChatContext();
  const activeCalls = useActiveCalls(teamId || '');
  const [members, setMembers] = useState<{ uid: string; role: string; name?: string }[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const isCallActive = activeCalls.some(c => c.roomId === activeRoom?.id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!activeRoom || !teamId) return;
    const fetchMembers = async () => {
      const snapshot = await getDocs(collection(db, 'teams', teamId, 'chatRooms', activeRoom.id, 'members'));
      const membersData: any[] = [];
      snapshot.forEach(doc => {
        membersData.push({ uid: doc.id, ...doc.data() });
      });
      setMembers(membersData);
    };
    fetchMembers();
  }, [activeRoom, teamId]);

  if (!activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-2xl w-[400px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-grey-150">
          <h3 className="font-semibold text-grey-900">Información del chat</h3>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
           <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9] flex items-center justify-center text-white font-semibold text-2xl mb-4">
             {activeRoom.name.slice(0, 2).toUpperCase()}
           </div>
           <h2 className="text-lg font-semibold text-grey-900 mb-1">{activeRoom.name}</h2>
           
           {isCallActive ? (
             <div className="mt-2 flex items-center gap-2 text-green font-medium text-sm">
                <Phone size={14} /> Videollamada en curso
             </div>
           ) : (
             <p className="text-xs text-grey-500">Sin videollamada activa</p>
           )}
        </div>

        <div className="p-4 border-t border-grey-150">
           <div className="flex items-center gap-2 mb-3">
             <Users size={16} className="text-grey-400" />
             <span className="text-sm font-semibold text-grey-800">Miembros ({members.length})</span>
           </div>
           <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2">
             {members.map(m => (
               <div key={m.uid} className="flex items-center gap-3 text-sm text-grey-700">
                 <div className="w-8 h-8 rounded-full bg-grey-200 flex items-center justify-center text-xs">
                   M
                 </div>
                 <span>{m.name || 'Miembro'}</span>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

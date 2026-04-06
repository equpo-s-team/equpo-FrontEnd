import { useEffect, useRef } from 'react';

import type { ReportMemberRow } from '../types/types.ts';

interface MemberPanelProps {
  members: ReportMemberRow[];
}

const MemberPanel = ({ members }: MemberPanelProps) => {
  const memberListRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const checkFade = () => {
    const list = memberListRef.current;
    const fade = fadeRef.current;
    if (list && fade) {
      const isBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 4;
      fade.classList.toggle('hidden', isBottom);
    }
  };

  useEffect(() => {
    checkFade();
    const list = memberListRef.current;
    if (!list) {
      return;
    }

    list.addEventListener('scroll', checkFade);
    return () => list.removeEventListener('scroll', checkFade);
  }, []);

  const totalCompleted = members.reduce((acc, member) => acc + member.completed, 0);
  const safeTotalCompleted = totalCompleted === 0 ? 1 : totalCompleted;
  const widths = members.map((member) => (member.completed / safeTotalCompleted) * 100);

  return (
    <div className="panel neon-blue">
      <div className="panel-header">
        <span className="panel-title">Contribucion por miembro</span>
        <span style={{ fontSize: '.71rem', color: 'var(--grey-400)' }}>
          {members.length} miembros · scroll para ver mas
        </span>
      </div>

      <div className="dist-bar">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="dist-seg"
            style={{
              width: `${widths[idx]}%`,
              background: member.barGradient,
              boxShadow: `0 0 8px ${member.pctColor}`,
            }}
          ></div>
        ))}
      </div>

      <div className="dist-legend">
        {members.map((member) => (
          <div key={member.id} className="leg-item">
            <div
              className="leg-dot"
              style={{ background: member.pctColor, boxShadow: `0 0 7px ${member.pctColor}` }}
            ></div>
            {member.name.split(' ')[0]}
          </div>
        ))}
      </div>

      <div className="member-scroll-wrap">
        <div className="member-list" ref={memberListRef}>
          {members.map((member) => {
            const percentage =
              member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0;
            return (
              <div key={member.id} className="member-row">
                <div className={`avatar ${member.avatarClass}`}>{member.initials}</div>
                <div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
                <div>
                  <div className="member-bar-label">
                    <span>Completadas</span>
                    <span>
                      {member.completed}/{member.total}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: member.barGradient,
                        boxShadow: `0 0 8px ${member.pctColor}`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pct" style={{ color: member.pctColor }}>
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="member-fade" ref={fadeRef}></div>
      </div>
    </div>
  );
};

export default MemberPanel;

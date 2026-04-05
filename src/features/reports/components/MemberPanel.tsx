import React, { useEffect, useRef } from 'react';

import { members } from '@/features/reports/components/data.ts';

const MemberPanel: React.FC = () => {
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
    if (list) {
      list.addEventListener('scroll', checkFade);
      return () => list.removeEventListener('scroll', checkFade);
    }
  }, []);

  const totalCompleted = members.reduce((acc, m) => acc + m.completed, 0);
  const widths = members.map((m) => (m.completed / totalCompleted) * 100);

  return (
    <div className="panel neon-blue">
      <div className="panel-header">
        <span className="panel-title">Contribución por miembro</span>
        <span style={{ fontSize: '.71rem', color: 'var(--grey-400)' }}>
          9 miembros · scroll para ver más
        </span>
      </div>

      <div className="dist-bar">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="dist-seg"
            style={{
              width: `${widths[idx]}%`,
              background: member.gradient,
              boxShadow: `0 0 8px ${member.color}`,
            }}
          ></div>
        ))}
      </div>

      <div className="dist-legend">
        {members.map((member) => (
          <div key={member.id} className="leg-item">
            <div
              className="leg-dot"
              style={{ background: member.color, boxShadow: `0 0 7px ${member.color}` }}
            ></div>
            {member.name.split(' ')[0]}
          </div>
        ))}
      </div>

      <div className="member-scroll-wrap">
        <div className="member-list" ref={memberListRef}>
          {members.map((member) => {
            const percentage = Math.round((member.completed / member.total) * 100);
            return (
              <div key={member.id} className="member-row">
                <div className={`avatar av-${member.initials.toLowerCase()}`}>
                  {member.initials}
                </div>
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
                        background: member.gradient,
                        boxShadow: `0 0 8px ${member.color}`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pct" style={{ color: member.color }}>
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

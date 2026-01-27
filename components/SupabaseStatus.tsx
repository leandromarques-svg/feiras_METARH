import React, { useEffect, useState } from 'react';
import { pingSupabase } from '../services/feiraParticipanteService';

const SupabaseStatus: React.FC = () => {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const result = await pingSupabase();
      setOnline(result);
    };
    check();
    const interval = setInterval(check, 10000); // checa a cada 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '12px 0',
      background: online === null ? '#f3f4f6' : online ? '#e0f7ef' : '#fee2e2',
      border: `2px solid ${online === null ? '#999' : online ? '#10b981' : '#ef4444'}`,
      borderRadius: 12,
      fontSize: 18,
      fontWeight: 700,
      color: online === null ? '#999' : online ? '#047857' : '#b91c1c',
      margin: '0 auto',
      maxWidth: 320,
      boxShadow: '0 2px 8px 0 #0001',
    }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: online === null ? '#999' : online ? '#10b981' : '#ef4444', display: 'inline-block', boxShadow: `0 0 8px 2px ${online === null ? '#999' : online ? '#10b981' : '#ef4444'}55` }} />
      Supabase {online === null ? '...' : online ? 'Online' : 'Offline'}
    </div>
  );
};

export default SupabaseStatus;

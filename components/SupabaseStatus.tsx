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
    <div style={{ fontSize: 12, fontWeight: 600, color: online === null ? '#999' : online ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: online === null ? '#999' : online ? '#10b981' : '#ef4444', display: 'inline-block' }} />
      Supabase {online === null ? '...' : online ? 'Online' : 'Offline'}
    </div>
  );
};

export default SupabaseStatus;

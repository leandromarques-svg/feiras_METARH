import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    // Busca usuário por email
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, senha_hash, perfil')
      .eq('email', email)
      .single();
    if (error || !data) {
      setErro('Usuário não encontrado');
      setLoading(false);
      return;
    }
    // Verifica senha (simples, para exemplo; ideal usar hash)
    if (senha !== data.senha_hash) {
      setErro('Senha incorreta');
      setLoading(false);
      return;
    }
    // Salva dados do usuário logado (exemplo: localStorage)
    localStorage.setItem('usuario', JSON.stringify({ id: data.id, perfil: data.perfil }));
    window.location.reload(); // Redireciona ou atualiza app
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
      <h2>Acesso ao Sistema</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
        </div>
        {erro && <div style={{ color: 'red', marginTop: 8 }}>{erro}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default LoginView;

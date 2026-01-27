import React, { useEffect, useState } from 'react';
import { listarParticipantes, adicionarParticipante, atualizarParticipante, deletarParticipante } from '../services/feiraParticipanteService';

const ParticipanteAdmin: React.FC = () => {
  const [participantes, setParticipantes] = useState<{ id: string; nome: string }[]>([]);
  const [novoNome, setNovoNome] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchParticipantes = async () => {
    setLoading(true);
    try {
      const data = await listarParticipantes();
      setParticipantes(data || []);
    } catch (e) {
      alert('Erro ao carregar participantes');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const handleAdd = async () => {
    if (!novoNome.trim()) return;
    setLoading(true);
    try {
      await adicionarParticipante(novoNome.trim());
      setNovoNome('');
      fetchParticipantes();
    } catch (e) {
      alert('Erro ao adicionar participante');
    }
    setLoading(false);
  };

  const handleEdit = (id: string, nome: string) => {
    setEditId(id);
    setEditNome(nome);
  };

  const handleUpdate = async () => {
    if (!editId || !editNome.trim()) return;
    setLoading(true);
    try {
      await atualizarParticipante(editId, editNome.trim());
      setEditId(null);
      setEditNome('');
      fetchParticipantes();
    } catch (e) {
      alert('Erro ao atualizar participante');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover?')) return;
    setLoading(true);
    try {
      await deletarParticipante(id);
      fetchParticipantes();
    } catch (e) {
      alert('Erro ao deletar participante');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Participantes</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Novo participante"
          value={novoNome}
          onChange={e => setNovoNome(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleAdd} disabled={loading}>Adicionar</button>
      </div>
      <ul>
        {participantes.map(p => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            {editId === p.id ? (
              <>
                <input
                  type="text"
                  value={editNome}
                  onChange={e => setEditNome(e.target.value)}
                  disabled={loading}
                />
                <button onClick={handleUpdate} disabled={loading}>Salvar</button>
                <button onClick={() => setEditId(null)} disabled={loading}>Cancelar</button>
              </>
            ) : (
              <>
                {p.nome}
                <button style={{ marginLeft: 8 }} onClick={() => handleEdit(p.id, p.nome)} disabled={loading}>Editar</button>
                <button style={{ marginLeft: 4 }} onClick={() => handleDelete(p.id)} disabled={loading}>Remover</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {loading && <div>Carregando...</div>}
    </div>
  );
};

export default ParticipanteAdmin;

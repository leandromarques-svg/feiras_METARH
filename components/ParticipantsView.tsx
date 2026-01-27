import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Participante, listarParticipantes, adicionarParticipante, deletarParticipante } from '../services/feiraParticipanteService';

const ParticipantsView: React.FC = () => {
    const [participants, setParticipants] = useState<Participante[]>([]);
    const [newName, setNewName] = useState('');
    const [newArea, setNewArea] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const data = await listarParticipantes();
            if (data) {
                setParticipants(data);
            }
        } catch (error) {
            console.error("Erro ao buscar participantes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        try {
            const newPart = await adicionarParticipante(newName, newArea);
            if (newPart) {
                setParticipants([...participants, newPart]);
                setNewName('');
                setNewArea('');
            }
        } catch (error) {
            console.error("Erro ao adicionar:", error);
            alert("Erro ao adicionar participante.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este participante?')) return;
        try {
            await deletarParticipante(id);
            setParticipants(participants.filter(p => p.id !== id));
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao deletar participante.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 font-['Barlow']">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Gerenciar Time Comercial
            </h3>

            <div className="flex gap-4 mb-8">
                <form onSubmit={handleAdd} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Nome..."
                        className="flex-[2] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Área (Ex: Comercial)"
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!newName.trim()}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-100"
                    >
                        Adicionar
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participants.map(p => (
                        <div key={p.id} className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                    {p.nome.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700">{p.nome}</div>
                                    <div className="text-xs text-slate-400 font-medium">{p.area || 'Sem área'}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(p.id!)}
                                className="text-slate-300 hover:text-red-500 transition-colors bg-white p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    {participants.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-400 italic">
                            Nenhum integrante cadastrado no time ainda.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParticipantsView;

import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const DataManagementView: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleImport = async () => {
        if (!jsonInput.trim()) return;

        setStatus('loading');
        setMessage('');

        try {
            const parsedData = JSON.parse(jsonInput);

            // Ensure it's an array
            const dataToInsert = Array.isArray(parsedData) ? parsedData : [parsedData];

            if (!supabase) {
                throw new Error("Supabase não está configurado.");
            }

            // Basic validation (optional, can be improved)
            const validItems = dataToInsert.map(item => ({
                nome: item.nome,
                sobre: item.sobre || '',
                segmento: item.segmento || 'Geral',
                local: item.local || 'A definir',
                site: item.site || '',
                mes: item.mes || '1 - janeiro',
                dia: item.dia || '01',
                ano: item.ano || '2026',
                interessados: Array.isArray(item.interessados) ? item.interessados : []
            })).filter(item => item.nome); // Must have a name

            if (validItems.length === 0) {
                throw new Error("Nenhum evento válido encontrado no JSON.");
            }

            const { error } = await supabase.from('eventos').insert(validItems);

            if (error) throw error;

            setStatus('success');
            setMessage(`${validItems.length} eventos importados com sucesso!`);
            setJsonInput('');
        } catch (error: any) {
            console.error("Erro na importação:", error);
            setStatus('error');
            setMessage(error.message || "Erro ao processar JSON. Verifique o formato.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 font-['Barlow']">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Importação em Massa
            </h3>

            <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                    Cole abaixo um JSON com uma lista de eventos para importar para o banco de dados.
                    <br />
                    <span className="text-xs text-slate-400">Formato esperado: Array de objetos com campos nome, sobre, segmento, local, etc.</span>
                </p>

                <textarea
                    className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder='[{"nome": "Evento Exemplo", "segmento": "Teste", ...}]'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />

                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {status === 'loading' && <span className="text-purple-600 font-bold text-sm animate-pulse">Processando...</span>}
                        {status === 'success' && <span className="text-emerald-500 font-bold text-sm">{message}</span>}
                        {status === 'error' && <span className="text-red-500 font-bold text-sm">{message}</span>}
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={status === 'loading' || !jsonInput.trim()}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Importar Eventos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataManagementView;

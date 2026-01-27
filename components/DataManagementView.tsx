import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const DataManagementView: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const parseCSV = (text: string) => {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) return [];

        // Detect separator
        const headerLine = lines[0];
        const separator = headerLine.includes(';') ? ';' : ',';

        const headers = headerLine.split(separator).map(h => h.trim().replace(/^"|"$/g, ''));

        return lines.slice(1).map(line => {
            // Basic regex to handle specific cases, but a simple split is usually enough for simple CSVs
            // This simple split does NOT handle delimiters inside quotes perfectly, but sufficient for this context
            const values = line.split(separator).map(v => v.trim().replace(/^"|"$/g, ''));

            const obj: any = {};
            headers.forEach((h, i) => {
                obj[h] = values[i];
            });
            return obj;
        });
    };

    const processData = async (rawData: any[]) => {
        // Mapeamento inteligente
        const validItems = rawData.map(item => ({
            nome: item.nome || item.Evento || item.evento,
            sobre: item.sobre || item.Sobre || '',
            segmento: item.segmento || item.Segmento || 'Geral',
            local: item.local || item.Local || 'A definir',
            site: item.site || item['Site do Evento'] || item.site_do_evento || '',
            mes: item.mes || item['Mês'] || item.mes || '1 - janeiro',
            dia: item.dia || item.Dia || item.dia ? String(item.dia || item.Dia) : '01',
            ano: item.ano || item.Ano || item.ano ? String(item.ano || item.Ano) : '2026',
            interessados: Array.isArray(item.interessados) ? item.interessados : []
        })).filter(item => item.nome);

        if (validItems.length === 0) {
            throw new Error("Nenhum evento válido encontrado.");
        }

        if (!supabase) throw new Error("Supabase off.");

        // Insert in batches if needed, but here simple insert
        const { error } = await supabase.from('eventos').insert(validItems);
        if (error) throw error;

        return validItems.length;
    };

    const handleImport = async () => {
        if (!jsonInput.trim() && !csvFile) return;

        setStatus('loading');
        setMessage('');

        try {
            let data: any[] = [];

            if (csvFile) {
                const text = await csvFile.text();
                // Simple check if it confuses JSON
                if (text.trim().startsWith('[')) {
                    data = JSON.parse(text);
                } else {
                    data = parseCSV(text);
                }
            } else {
                // Try JSON first
                try {
                    data = JSON.parse(jsonInput);
                } catch {
                    // Try CSV if JSON fails
                    data = parseCSV(jsonInput);
                }
            }

            // Normalize
            if (!Array.isArray(data)) data = [data];

            const count = await processData(data);

            setStatus('success');
            setMessage(`${count} eventos importados com sucesso!`);
            setJsonInput('');
            setCsvFile(null);
            // Reset file input value manually if needed, but handled by state mainly
            const fileInput = document.getElementById('csvInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error: any) {
            console.error("Erro na importação:", error);
            setStatus('error');
            setMessage(error.message || "Erro ao processar dados.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 font-['Barlow']">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Importação em Massa
            </h3>

            <div className="space-y-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Opção 1: Upload de Arquivo (CSV ou JSON)</label>
                    <input
                        id="csvInput"
                        type="file"
                        accept=".csv,.json"
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-xs file:font-semibold
                          file:bg-purple-50 file:text-purple-700
                          hover:file:bg-purple-100
                        "
                        onChange={e => setCsvFile(e.target.files?.[0] || null)}
                    />
                    <p className="mt-2 text-xs text-slate-400">
                        Suporta arquivos .csv (separado por vírgula ou ponto-e-vírgula) e .json.
                    </p>
                </div>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-300 text-xs font-bold uppercase">OU</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Opção 2: Colar Texto (JSON)</label>
                    <textarea
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder='[{"Evento": "Nome...", "Sobre": "..."}]'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-800">
                        <strong>Colunas aceitas (CSV/JSON):</strong> Evento (ou nome), Sobre, Segmento, Local, Site do Evento (ou site), Mês, Dia, Ano.
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex-1">
                        {status === 'loading' && <span className="text-purple-600 font-bold text-sm animate-pulse">Processando...</span>}
                        {status === 'success' && <span className="text-emerald-500 font-bold text-sm">{message}</span>}
                        {status === 'error' && <span className="text-red-500 font-bold text-sm">{message}</span>}
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={status === 'loading' || (!jsonInput.trim() && !csvFile)}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Importar Dados
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataManagementView;

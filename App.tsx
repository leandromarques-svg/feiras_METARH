
import React, { useState, useMemo, useEffect } from 'react';
import { EVENTOS_DATA } from './constants';
import { Evento, FilterState, ViewMode } from './types';
import Sidebar from './components/Sidebar';
import EventCard from './components/EventCard';
import { generateGoogleCalendarUrl, generateOutlookCalendarUrl } from './services/calendarService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SegmentoChart from './components/SegmentoChart';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { pingSupabase, Participante, listarParticipantes } from './services/feiraParticipanteService';
import ParticipantsView from './components/ParticipantsView';
import DataManagementView from './components/DataManagementView';

const App: React.FC = () => {
  // ...existing code...
  const initialEvents = EVENTOS_DATA.map(event => ({
    ...event,
    interessados: Array.isArray(event.interessados)
      ? event.interessados.map((i: any) => {
        if (typeof i === 'object' && i.nome) return i;
        if (typeof i === 'string') return { nome: i, intencao: 'Outros' };
        return { nome: String(i), intencao: 'Outros' };
      })
      : []
  }));

  const [events, setEvents] = useState<Evento[]>(initialEvents);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [view, setView] = useState<ViewMode>(ViewMode.GRID);
  const [filters, setFilters] = useState<FilterState>({
    search: '', segmento: '', mes: '', interessado: ''
  });
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [allParticipants, setAllParticipants] = useState<Participante[]>([]);


  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Form State
  const [formEvent, setFormEvent] = useState<Partial<Evento>>({
    nome: '', sobre: '', segmento: '', local: '', site: '', mes: '1 - janeiro', dia: '', ano: '2026', interessados: []
  });

  useEffect(() => {
    const checkStatus = async () => {
      if (!isSupabaseConfigured) {
        setConnectionStatus('error');
        return;
      }
      const isConnected = await pingSupabase();
      setConnectionStatus(isConnected ? 'connected' : 'error');
    };
    checkStatus();
  }, []);
  // ...autenticação removida, acesso livre...

  // Fetch from Supabase ou mantém constantes
  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [eventsResult, participantsResult] = await Promise.all([
          supabase.from('eventos').select('*'),
          listarParticipantes()
        ]);

        if (!eventsResult.error && eventsResult.data && eventsResult.data.length > 0) {
          // Sanitize data to ensure interessados is always in correct format
          const sanitizedEvents = eventsResult.data.map((event: any) => ({
            ...event,
            interessados: Array.isArray(event.interessados)
              ? event.interessados.map((i: any) => {
                if (typeof i === 'object' && i.nome) return i;
                if (typeof i === 'string') return { nome: i, intencao: 'Outros' };
                return { nome: String(i), intencao: 'Outros' };
              })
              : []
          }));
          setEvents(sanitizedEvents);
        }

        if (participantsResult) {
          setAllParticipants(participantsResult);
        }

      } catch (err) {
        console.error("Erro na conexão com Supabase:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const segmentos = useMemo(() => Array.from(new Set(events.map(e => e.segmento))), [events]);
  const meses = useMemo(() => {
    const uniqueMeses = Array.from(new Set(events.map(e => e.mes)));
    // Ordenação correta dos meses (Janeiro a Dezembro)
    const mesesOrdem = [
      '1 - janeiro',
      '2 - fevereiro',
      '3 - março',
      '4 - abril',
      '5 - maio',
      '6 - junho',
      '7 - julho',
      '8 - agosto',
      '9 - setembro',
      '10 - outubro',
      '11 - novembro',
      '12 - dezembro',
    ];
    return mesesOrdem.filter(m => uniqueMeses.includes(m));
  }, [events]);
  const interessados = useMemo(() => {
    const all = events.flatMap(e => e.interessados?.map(i => i.nome) || []);
    return Array.from(new Set(all));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const mesesOrdem = [
      '1 - janeiro',
      '2 - fevereiro',
      '3 - março',
      '4 - abril',
      '5 - maio',
      '6 - junho',
      '7 - julho',
      '8 - agosto',
      '9 - setembro',
      '10 - outubro',
      '11 - novembro',
      '12 - dezembro',
    ];
    return events
      .filter(e => {
        const matchSearch = e.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.sobre.toLowerCase().includes(filters.search.toLowerCase());
        const matchSegmento = !filters.segmento || e.segmento === filters.segmento;
        const matchMes = !filters.mes || e.mes === filters.mes;
        const matchInteressado = !filters.interessado || (e.interessados && e.interessados.some(i => i.nome === filters.interessado));
        return matchSearch && matchSegmento && matchMes && matchInteressado;
      })
      .sort((a, b) => {
        // Ano
        const anoA = parseInt(a.ano);
        const anoB = parseInt(b.ano);
        if (anoA !== anoB) return anoA - anoB;
        // Mês
        const mesA = mesesOrdem.indexOf(a.mes);
        const mesB = mesesOrdem.indexOf(b.mes);
        if (mesA !== mesB) return mesA - mesB;
        // Dia (pega o primeiro número do campo dia)
        const diaA = parseInt((a.dia.match(/\d+/) || ['0'])[0]);
        const diaB = parseInt((b.dia.match(/\d+/) || ['0'])[0]);
        return diaA - diaB;
      });
  }, [filters, events]);

  const statsData = useMemo(() => {
    const mesesOrdem = [
      '1 - janeiro',
      '2 - fevereiro',
      '3 - março',
      '4 - abril',
      '5 - maio',
      '6 - junho',
      '7 - julho',
      '8 - agosto',
      '9 - setembro',
      '10 - outubro',
      '11 - novembro',
      '12 - dezembro',
    ];
    const counts: Record<string, number> = {};
    events.forEach(e => {
      const mes = e.mes;
      if (!counts[mes]) counts[mes] = 0;
      counts[mes]++;
    });
    return mesesOrdem
      .filter(m => counts[m])
      .map(m => ({ name: m.split(' - ')[1], value: counts[m] }));
  }, [events]);

  const segmentoData = useMemo(() => { // Keep this for future if used
    const counts: Record<string, number> = {};
    events.forEach(e => {
      counts[e.segmento] = (counts[e.segmento] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [events]);

  // Ranking data update
  // We need to fix the Ranking do Time section in render if it relies on string inclusion which logic changed.
  // I will check the usage below in render. It uses `events.filter(e => e.interessados && e.interessados.includes(nome))`.
  // I need to update that too. I'll do it in this chunk if I can reach. I can't reach render here.
  // I'll update these memos first.

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedEvent) {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('eventos').update(formEvent).eq('id', selectedEvent.id);
        if (error) {
          console.error("Error updating event in Supabase:", error);
          alert("Erro ao atualizar evento no banco de dados. Verifique o console.");
        }
      }
      setEvents(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...ev, ...formEvent } as Evento : ev));
      setSelectedEvent({ ...selectedEvent, ...formEvent } as Evento);
      setIsEditMode(false);
    } else {
      let eventToAdd: Evento;

      if (isSupabaseConfigured && supabase) {
        // Para Supabase, não enviamos ID se for autoincrement/uuid, ou geramos um UUID válido se necessário.
        // Assumindo que o banco gera o UUID:
        const payload = { ...formEvent, interessados: [] };
        const { data, error } = await supabase.from('eventos').insert([payload]).select();

        if (error) {
          console.error("Error inserting event in Supabase:", error);
          alert("Erro ao salvar evento no banco de dados: " + error.message);
          return;
        }

        // Usa o objeto retornado pelo banco (com o ID correto)
        if (data && data[0]) {
          eventToAdd = data[0] as Evento;
        } else {
          // Fallback muito improvável
          eventToAdd = { ...formEvent, id: Date.now().toString(), interessados: [] } as Evento;
        }
      } else {
        // Modo Offline
        eventToAdd = { ...formEvent, id: Date.now().toString(), interessados: [] } as Evento;
      }

      setEvents(prev => [...prev, eventToAdd]);
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('eventos').delete().eq('id', eventId);
      if (error) {
        console.error("Error deleting event:", error);
        alert("Erro ao excluir evento.");
        return;
      }
    }

    setEvents(prev => prev.filter(e => e.id !== eventId));
    setSelectedEvent(null);
    setIsEditMode(false);
  };

  const addParticipant = async (eventId: string, name: string, intencao: string) => {
    if (!name.trim() || !intencao) return;
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const newInteressado = { nome: name, intencao };
    // Check if already exists by name
    if (event.interessados?.some(i => i.nome === name)) return;

    const newInteressados = [...(event.interessados || []), newInteressado];

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('eventos').update({ interessados: newInteressados }).eq('id', eventId);
      if (error) {
        console.error("Erro ao atualizar participantes:", error);
        alert("Erro ao salvar responsável: " + error.message);
        return;
      }
    }

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, interessados: newInteressados } : e));
    if (selectedEvent?.id === eventId) setSelectedEvent({ ...selectedEvent, interessados: newInteressados });
    setNewParticipantName('');
  };

  const removeParticipant = async (eventId: string, name: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const newInteressados = (event.interessados || []).filter(i => i.nome !== name);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('eventos').update({ interessados: newInteressados }).eq('id', eventId);
    }

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, interessados: newInteressados } : e));
    if (selectedEvent?.id === eventId) setSelectedEvent({ ...selectedEvent, interessados: newInteressados });
  };

  const openEdit = () => {
    if (selectedEvent) {
      setFormEvent(selectedEvent);
      setIsEditMode(true);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
  };

  const toggleSelectEvent = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.size} eventos selecionados?`)) return;

    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const idsToDelete = Array.from(selectedIds);
      const { error } = await supabase.from('eventos').delete().in('id', idsToDelete);

      if (error) {
        console.error("Erro ao excluir eventos:", error);
        alert("Erro ao excluir eventos selecionados.");
      } else {
        setEvents(prev => prev.filter(e => !selectedIds.has(e.id)));
      }
    }

    setSelectedIds(new Set());
    setIsSelectionMode(false);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#f7f6fa', fontFamily: 'Barlow, sans-serif' }}>
      <Sidebar activeView={view} onViewChange={setView} connectionStatus={connectionStatus} />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: '#3F2666', letterSpacing: '-0.01em' }}>
              {view === ViewMode.GRID && 'Eventos Disponíveis'}
              {view === ViewMode.CALENDAR && 'Cronograma 2026'}
              {view === ViewMode.STATS && 'Insights de Prospecção'}
            </h2>
            <p className="mt-1 font-medium italic" style={{ color: '#3F2666', opacity: 0.7 }}>Gestão colaborativa do time comercial.</p>
          </div>

          <div className="flex space-x-3 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar evento..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 shadow-sm"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5" style={{ color: '#3F2666', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {view === ViewMode.GRID && (
              <button
                onClick={toggleSelectionMode}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${isSelectionMode
                  ? 'bg-[#ede9f7] text-[#3F2666] border-[#cfc1e6]'
                  : 'bg-white text-[#3F2666] border-[#e5e0f0] hover:bg-[#f7f6fa]'
                  }`}
              >
                {isSelectionMode ? 'Cancelar Seleção' : 'Selecionar'}
              </button>
            )}

            <button
              onClick={() => { setIsEditMode(false); setFormEvent({ nome: '', sobre: '', segmento: '', local: '', site: '', mes: '1 - janeiro', dia: '', ano: '2026', interessados: [] }); setIsAddModalOpen(true); }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Cadastrar Evento
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold uppercase tracking-widest text-xs" style={{ color: '#3F2666', opacity: 0.7 }}>Sincronizando banco de dados...</p>
          </div>
        ) : (
          <>
            {view === ViewMode.GRID && (
              <>
                <div className="flex flex-wrap gap-4 mb-8">
                  <select
                    className="bg-white border border-[#e5e0f0] rounded-lg px-3 py-2 text-sm text-[#3F2666] focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm font-medium"
                    value={filters.segmento}
                    onChange={(e) => setFilters(prev => ({ ...prev, segmento: e.target.value }))}
                  >
                    <option value="">Todos os Segmentos</option>
                    {segmentos.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <select
                    className="bg-white border border-[#e5e0f0] rounded-lg px-3 py-2 text-sm text-[#3F2666] focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm font-medium"
                    value={filters.mes}
                    onChange={(e) => setFilters(prev => ({ ...prev, mes: e.target.value }))}
                  >
                    <option value="">Todos os Meses</option>
                    {meses.map(m => <option key={m} value={m}>{m.split(' - ')[1]}</option>)}
                  </select>

                  <select
                    className="bg-white border border-[#e5e0f0] rounded-lg px-3 py-2 text-sm text-[#3F2666] focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm font-medium"
                    value={filters.interessado}
                    onChange={(e) => setFilters(prev => ({ ...prev, interessado: e.target.value }))}
                  >
                    <option value="">Todos os Interessados</option>
                    {interessados.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEvents.map(evento => (
                    <EventCard
                      key={evento.id}
                      evento={evento}
                      onClick={setSelectedEvent}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedIds.has(evento.id)}
                      onToggleSelect={toggleSelectEvent}
                    />
                  ))}
                </div>
              </>
            )}

            {view === ViewMode.CALENDAR && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="space-y-10">
                  {meses.map(m => {
                    const eventsInMonth = filteredEvents.filter(e => e.mes === m);
                    if (eventsInMonth.length === 0) return null;
                    return (
                      <div key={m}>
                        <h4 className="text-xl font-extrabold text-purple-700 border-l-4 border-purple-500 pl-4 mb-5 uppercase tracking-wider">
                          {m.split(' - ')[1]}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {eventsInMonth.map(e => (
                            <div key={e.id} className="p-5 bg-[#f7f6fa] rounded-xl border border-[#e5e0f0] flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                              <div>
                                <p className="font-bold" style={{ color: '#3F2666', fontSize: '1.125rem' }}>{e.nome}</p>
                                <p className="text-xs font-bold uppercase tracking-tight" style={{ color: '#3F2666', opacity: 0.7 }}>{e.dia} de {e.mes.split(' - ')[1]}</p>
                              </div>
                              <button onClick={() => setSelectedEvent(e)} className="bg-purple-50 text-purple-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === ViewMode.STATS && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6" style={{ color: '#3F2666' }}>Eventos por Mês</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{ fill: '#f5f3ff' }} />
                        <Bar dataKey="value" fill="#9333ea" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6" style={{ color: '#3F2666' }}>Participantes por Evento</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(() => {
                        const participantCounts: Record<string, number> = {};
                        events.forEach(e => {
                          e.interessados?.forEach(i => {
                            participantCounts[i.nome] = (participantCounts[i.nome] || 0) + 1;
                          });
                        });
                        return Object.entries(participantCounts)
                          .map(([name, value]) => ({ name, value }))
                          .sort((a, b) => b.value - a.value);
                      })()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{ fill: '#f5f3ff' }} />
                        <Bar dataKey="value" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
                  <h3 className="text-lg font-bold mb-6" style={{ color: '#3F2666' }}>Ranking do Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {interessados.map(nome => {
                      const count = events.filter(e => e.interessados && e.interessados.some(i => i.nome === nome)).length;
                      const percentage = (count / (events.length || 1)) * 100;
                      return (
                        <div key={nome}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold" style={{ color: '#3F2666' }}>{nome}</span>
                            <span className="text-purple-600 font-bold">{count} feiras</span>
                          </div>
                          <div className="w-full" style={{ background: '#e5e0f0', borderRadius: '9999px', height: '0.75rem' }}>
                            <div className="bg-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {view === ViewMode.PARTICIPANTS && (
              <ParticipantsView />
            )}

            {view === ViewMode.DATA_MANAGEMENT && (
              <DataManagementView />
            )}
          </>
        )}
      </main >

      {/* Floating Action Bar for Bulk Delete */}
      {selectedIds.size > 0 && isSelectionMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl border border-slate-200 z-50 flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <span className="font-bold" style={{ color: '#3F2666' }}>{selectedIds.size} selecionado(s)</span>
          <div className="h-6 w-px" style={{ background: '#e5e0f0' }}></div>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Excluir
          </button>
        </div>
      )}

      {/* Modal Cadastro/Edição */}
      {
        (isAddModalOpen || isEditMode) && (
          <div className="fixed inset-0" style={{ background: 'rgba(63,38,102,0.6)' }}>
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-8 animate-in slide-in-from-bottom-4 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold" style={{ color: '#3F2666' }}>{isEditMode ? 'Editar Evento' : 'Cadastrar Novo Evento'}</h3>
                <button onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); }} style={{ color: '#b3a0d1' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSaveEvent} className="space-y-4 font-['Barlow']">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3F2666', opacity: 0.7 }}>Nome do Evento</label>
                    <input required type="text" className="w-full px-4 py-3" style={{ background: '#f7f6fa', border: '1px solid #e5e0f0', borderRadius: '0.75rem', fontWeight: 500 }}
                      value={formEvent.nome} onChange={e => setFormEvent({ ...formEvent, nome: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3F2666', opacity: 0.7 }}>Segmento</label>
                    <input required type="text" className="w-full px-4 py-3" style={{ background: '#f7f6fa', border: '1px solid #e5e0f0', borderRadius: '0.75rem', fontWeight: 500 }}
                      value={formEvent.segmento} onChange={e => setFormEvent({ ...formEvent, segmento: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3F2666', opacity: 0.7 }}>Mês</label>
                    <select className="w-full px-4 py-3" style={{ background: '#f7f6fa', border: '1px solid #e5e0f0', borderRadius: '0.75rem', fontWeight: 500 }}
                      value={formEvent.mes} onChange={e => setFormEvent({ ...formEvent, mes: e.target.value })}>
                      <option value="1 - janeiro">Janeiro</option>
                      <option value="2 - fevereiro">Fevereiro</option>
                      <option value="3 - março">Março</option>
                      <option value="4 - abril">Abril</option>
                      <option value="5 - maio">Maio</option>
                      <option value="6 - junho">Junho</option>
                      <option value="7 - julho">Julho</option>
                      <option value="8 - agosto">Agosto</option>
                      <option value="9 - setembro">Setembro</option>
                      <option value="10 - outubro">Outubro</option>
                      <option value="11 - novembro">Novembro</option>
                      <option value="12 - dezembro">Dezembro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3F2666', opacity: 0.7 }}>Dias</label>
                    <input placeholder="Ex: 10 a 12" required type="text" className="w-full px-4 py-3" style={{ background: '#f7f6fa', border: '1px solid #e5e0f0', borderRadius: '0.75rem', fontWeight: 500 }}
                      value={formEvent.dia} onChange={e => setFormEvent({ ...formEvent, dia: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3F2666', opacity: 0.7 }}>Local</label>
                    <input required type="text" className="w-full px-4 py-3" style={{ background: '#f7f6fa', border: '1px solid #e5e0f0', borderRadius: '0.75rem', fontWeight: 500 }}
                      value={formEvent.local} onChange={e => setFormEvent({ ...formEvent, local: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#3F2666', opacity: 0.7 }}>Sobre o Evento</label>
                    <textarea required rows={3} className="w-full px-4 py-3" style={{ background: '#f7f6fa', border: '1px solid #e5e0f0', borderRadius: '0.75rem', fontWeight: 500 }}
                      value={formEvent.sobre} onChange={e => setFormEvent({ ...formEvent, sobre: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Site</label>
                    <input required type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                      value={formEvent.site} onChange={e => setFormEvent({ ...formEvent, site: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex justify-center">
                  {isEditMode ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </form>
            </div>
          </div>
        )
      }

      {/* Detalhes do Evento */}
      {
        selectedEvent && !isEditMode && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto font-['Barlow']">
              <div className="bg-purple-700 p-10 text-white relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <button onClick={() => setSelectedEvent(null)} className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors bg-black/20 p-2 rounded-full hover:bg-black/40 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex justify-between items-start mb-6">
                  <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">{selectedEvent.segmento}</span>
                  <button onClick={openEdit} className="mr-12 bg-white/10 hover:bg-white/30 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Editar
                  </button>
                </div>
                <h3 className="text-4xl font-extrabold leading-none mb-2 tracking-tight">{selectedEvent.nome}</h3>
                <p className="text-purple-100 flex items-center gap-2 font-bold uppercase tracking-widest text-xs opacity-80">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {selectedEvent.dia} de {selectedEvent.mes.split(' - ')[1]} de {selectedEvent.ano}
                </p>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resumo Estratégico</h4>
                    <p className="text-slate-700 leading-relaxed text-sm font-medium">{selectedEvent.sobre}</p>

                    <div className="mt-8 flex flex-col gap-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adicionar ao meu Calendário</h4>
                      <div className="flex gap-3">
                        <a href={generateGoogleCalendarUrl(selectedEvent)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm">
                          <svg className="w-5 h-5" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                          Google
                        </a>
                        <a href={generateOutlookCalendarUrl(selectedEvent)} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm">
                          <svg className="w-5 h-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>file_type_outlook</title><path d="M19.484,7.937v5.477L21.4,14.619a.489.489,0,0,0,.21,0l8.238-5.554a1.174,1.174,0,0,0-.959-1.128Z" style={{fill:'#0072c6'}}/><path d="M19.484,15.457l1.747,1.2a.522.522,0,0,0,.543,0c-.3.181,8.073-5.378,8.073-5.378V21.345a1.408,1.408,0,0,1-1.49,1.555H19.483V15.457Z" style={{fill:'#0072c6'}}/><path d="M10.44,12.932a1.609,1.609,0,0,0-1.42.838,4.131,4.131,0,0,0-.526,2.218A4.05,4.05,0,0,0,9.02,18.2a1.6,1.6,0,0,0,2.771.022,4.014,4.014,0,0,0,.515-2.2,4.369,4.369,0,0,0-.5-2.281A1.536,1.536,0,0,0,10.44,12.932Z" style={{fill:'#0072c6'}}/><path d="M2.153,5.155V26.582L18.453,30V2ZM13.061,19.491a3.231,3.231,0,0,1-2.7,1.361,3.19,3.19,0,0,1-2.64-1.318A5.459,5.459,0,0,1,6.706,16.1a5.868,5.868,0,0,1,1.036-3.616A3.267,3.267,0,0,1,10.486,11.1a3.116,3.116,0,0,1,2.61,1.321,5.639,5.639,0,0,1,1,3.484A5.763,5.763,0,0,1,13.061,19.491Z" style={{fill:'#0072c6'}}/></svg>
                          Outlook
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Localização</h4>
                      <p className="text-slate-900 font-bold flex items-center gap-3 text-base">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {selectedEvent.local}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Participantes</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedEvent.interessados && selectedEvent.interessados.length > 0 ? (
                          selectedEvent.interessados.map(interessado => (
                            <span key={interessado.nome} className="group flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-800 rounded-xl text-xs font-bold border border-purple-100 shadow-sm">
                              <span>{interessado.nome}</span>
                              <button onClick={() => removeParticipant(selectedEvent.id, interessado.nome)} className="text-purple-300 hover:text-red-500 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 text-xs italic">Nenhum responsável definido ainda.</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <select
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 font-medium appearance-none"
                          value={newParticipantName}
                          onChange={e => setNewParticipantName(e.target.value)}
                        >
                          <option value="">Selecione um participante...</option>
                          {allParticipants
                            .filter(p => !selectedEvent.interessados?.some(i => i.nome === p.nome))
                            .map(p => (
                              <option key={p.id} value={p.nome}>{p.nome}</option>
                            ))
                          }
                        </select>
                        <button
                          onClick={() => {
                            if (newParticipantName) {
                              addParticipant(selectedEvent.id, newParticipantName, 'Participante');
                              setNewParticipantName('');
                            }
                          }}
                          disabled={!newParticipantName}
                          className="px-6 py-3 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Incluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                  <a
                    href={selectedEvent.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[2] bg-slate-900 text-white text-center py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Visitar Site Oficial
                  </a>
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="flex-none px-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-all"
                    title="Excluir Evento"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default App;

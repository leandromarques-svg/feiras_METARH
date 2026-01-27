import { supabase } from './supabaseClient';

// Testa conexão com Supabase
export const pingSupabase = async () => {
  try {
    const { error } = await supabase.from('feiras').select('*').limit(1);
    if (error) throw error;
    return true;
  } catch (e) {
    return false;
  }
};

export interface Feira {
  id?: string;
  nome: string;
  data?: string; // formato YYYY-MM-DD
  local?: string;
}

export interface Participante {
  id?: string;
  nome: string;
}

// FEIRAS CRUD
export const listarFeiras = async () => {
  const { data, error } = await supabase.from('feiras').select('*');
  if (error) throw error;
  return data;
};

export const adicionarFeira = async (feira: Omit<Feira, 'id'>) => {
  const { data, error } = await supabase.from('feiras').insert([feira]).select();
  if (error) throw error;
  return data?.[0];
};

export const atualizarFeira = async (id: string, feira: Partial<Feira>) => {
  const { data, error } = await supabase.from('feiras').update(feira).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
};

export const deletarFeira = async (id: string) => {
  const { error } = await supabase.from('feiras').delete().eq('id', id);
  if (error) throw error;
};

// PARTICIPANTES CRUD
export const listarParticipantes = async () => {
  const { data, error } = await supabase.from('participantes').select('*');
  if (error) throw error;
  return data;
};

export const adicionarParticipante = async (nome: string) => {
  const { data, error } = await supabase.from('participantes').insert([{ nome }]).select();
  if (error) throw error;
  return data?.[0];
};

export const atualizarParticipante = async (id: string, nome: string) => {
  const { data, error } = await supabase.from('participantes').update({ nome }).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
};

export const deletarParticipante = async (id: string) => {
  const { error } = await supabase.from('participantes').delete().eq('id', id);
  if (error) throw error;
};

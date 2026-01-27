
export interface Evento {
  id: string;
  nome: string;
  sobre: string;
  segmento: string;
  interessados: string[];
  local: string;
  site: string;
  mes: string;
  dia: string;
  ano: string;
}

export interface FilterState {
  search: string;
  segmento: string;
  mes: string;
  interessado: string;
}

export enum ViewMode {
  GRID = 'GRID',
  CALENDAR = 'CALENDAR',
  STATS = 'STATS',
  PARTICIPANTS = 'PARTICIPANTS',
  DATA_MANAGEMENT = 'DATA_MANAGEMENT'
}


import React from 'react';
import { Evento } from '../types';

interface EventCardProps {
  evento: Evento;
  onClick: (evento: Evento) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ evento, onClick, isSelectionMode, isSelected, onToggleSelect }) => {
    // Função para determinar se o evento já passou
    const isPast = (() => {
      const today = new Date();
      const year = parseInt(evento.ano);
      const month = parseInt(evento.mes.split(' - ')[0]) - 1;
      // Pega o último número do campo dia (ex: "10 a 12" => 12)
      const dias = evento.dia.match(/\d+/g);
      const day = dias && dias.length > 0 ? parseInt(dias[dias.length - 1]) : 1;
      const eventDate = new Date(year, month, day, 23, 59, 59);
      return eventDate < today;
    })();
  const handleClick = () => {
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect(evento.id);
    } else {
      onClick(evento);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-xl shadow-sm transition-all p-5 border cursor-pointer group flex flex-col justify-between relative
        ${isSelected ? 'border-purple-500 ring-2 ring-purple-100 bg-purple-50/10' : 'border-slate-200'}
        ${isPast ? 'bg-slate-100 text-slate-400 opacity-70 hover:shadow-none hover:bg-slate-100 cursor-default' : 'bg-white hover:shadow-md'}
      `}
    >
      {isSelectionMode && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected
              ? 'bg-purple-600 border-purple-600'
              : 'border-slate-300 bg-white'
            }`}>
            {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
            {evento.segmento}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-purple-600 transition-colors mb-2 leading-tight pr-8">
          {evento.nome}
        </h3>
        <p className="text-slate-600 text-xs font-medium line-clamp-3 mb-4 leading-relaxed">
          {evento.sobre}
        </p>
      </div>

      <div className="flex items-end justify-between pt-4 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Data</span>
          <span className="text-xs font-bold text-slate-700">{evento.dia} de {evento.mes.split(' - ')[1]}</span>
        </div>

        <div className="flex -space-x-2 overflow-hidden">
          {evento.interessados && evento.interessados.length > 0 ? (
            evento.interessados.map((interessado, i) => (
              <div
                key={i}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm cursor-help"
                title={`${interessado.nome} - ${interessado.intencao}`}
              >
                {interessado.nome[0]}
              </div>
            ))
          ) : (
            <span className="text-slate-300 text-[10px] italic">Sem time</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

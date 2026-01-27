
import React from 'react';
import { Evento } from '../types';

interface EventCardProps {
  evento: Evento;
  onClick: (evento: Evento) => void;
}

const EventCard: React.FC<EventCardProps> = ({ evento, onClick }) => {
  return (
    <div 
      onClick={() => onClick(evento)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-slate-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded uppercase tracking-wider">
            {evento.segmento.split(' / ')[0]}
          </span>
          <span className="text-slate-500 text-xs font-medium">
            {evento.mes.split(' - ')[1]}
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors mb-2 line-clamp-1">
          {evento.nome}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {evento.sobre}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex -space-x-2 overflow-hidden">
          {evento.interessados && evento.interessados.length > 0 ? (
            evento.interessados.map((nome, i) => (
              <div 
                key={i} 
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold"
                title={nome}
              >
                {nome[0]}
              </div>
            ))
          ) : (
            <span className="text-slate-400 text-xs italic">Sem responsáveis</span>
          )}
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          {evento.local}
        </span>
      </div>
    </div>
  );
};

export default EventCard;

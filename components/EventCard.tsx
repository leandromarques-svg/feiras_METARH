
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
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
            {evento.segmento}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-purple-600 transition-colors mb-2 leading-tight">
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
            evento.interessados.map((nome, i) => (
              <div
                key={i}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm"
                title={nome}
              >
                {nome[0]}
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

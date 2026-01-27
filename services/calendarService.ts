
import { Evento } from '../types';

export const generateGoogleCalendarUrl = (evento: Evento) => {
  const title = encodeURIComponent(evento.nome);
  const details = encodeURIComponent(`${evento.sobre}\n\nSite: ${evento.site}`);
  const location = encodeURIComponent(evento.local);
  
  // Best effort date parsing for a 2026 event
  // Format: YYYYMMDD/YYYYMMDD
  // Since "dia" can be "09 a 13", we take the first part as start and last as end if possible.
  const dayMatch = evento.dia.match(/\d+/g);
  const startDay = dayMatch ? dayMatch[0].padStart(2, '0') : '01';
  const endDay = dayMatch && dayMatch.length > 1 ? dayMatch[dayMatch.length - 1].padStart(2, '0') : startDay;
  
  const monthIndex = parseInt(evento.mes.split(' - ')[0]);
  const monthStr = monthIndex.toString().padStart(2, '0');
  
  const startDate = `2026${monthStr}${startDay}`;
  const endDate = `2026${monthStr}${parseInt(endDay) + 1 < 10 ? '0' + (parseInt(endDay) + 1) : parseInt(endDay) + 1}`;

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
};

export const generateOutlookCalendarUrl = (evento: Evento) => {
  const title = encodeURIComponent(evento.nome);
  const location = encodeURIComponent(evento.local);
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&location=${location}`;
};

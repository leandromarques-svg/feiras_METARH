
import { Evento } from './types';

export const EVENTOS_DATA: Evento[] = [
  {
    id: "1",
    nome: "ABIMAD / Feira de Móveis",
    sobre: "O evento é focado em negócios, sendo uma vitrine do melhor do design brasileiro e das tendências internacionais para o mercado de móveis e acessórios.",
    segmento: "Móveis / Decoração",
    interessados: [],
    local: "São Paulo Expo",
    site: "https://www.abimad.com.br/",
    mes: "1 - janeiro",
    dia: "27 a 30",
    ano: "2026"
  },
  {
    id: "2",
    nome: "EXPO REVESTIR",
    sobre: "É a principal feira de revestimentos e acabamentos da América Latina, um evento de negócios para profissionais como arquitetos, designers, lojistas e construtoras.",
    segmento: "Construção Civil / Arquitetura",
    interessados: [],
    local: "São Paulo Expo",
    site: "https://www.exporevestir.com.br/",
    mes: "3 - março",
    dia: "09 a 13",
    ano: "2026"
  },
  {
    id: "3",
    nome: "FRUIT ATTRACTION SÃO PAULO",
    sobre: "É uma importante feira internacional de frutas e vegetais que conecta produtores, exportadores e compradores do hemisfério sul.",
    segmento: "Hortifrúti / Agronegócio",
    interessados: [],
    local: "São Paulo Expo",
    site: "https://www.ifema.es/fruit-attraction-sao-paulo/",
    mes: "3 - março",
    dia: "24 a 26",
    ano: "2026"
  },
  {
    id: "4",
    nome: "ERP Summit",
    sobre: "Evento focado em gestão e software ERP.",
    segmento: "TI / Tecnologia",
    interessados: [],
    local: "Expo Center Norte",
    site: "https://erpsummit.com.br/",
    mes: "3 - março",
    dia: "17 e 18",
    ano: "2026"
  },
  {
    id: "5",
    nome: "Abradilan Conexão Farma",
    sobre: "Evento da Associação Brasileira de Distribuição e Logística de Produtos Farmacêuticos (Abradilan) que reúne distribuidores, varejistas, indústrias e fornecedores.",
    segmento: "Setor Farmaceutico",
    interessados: ["Lisa", "Carol", "Alice"],
    local: "Expo Center Norte",
    site: "https://www.abradilan.com.br/expositor-conexao-fa/",
    mes: "3 - março",
    dia: "10 a 12",
    ano: "2026"
  },
  {
    id: "6",
    nome: "AUTOCON",
    sobre: "É a maior feira de automação comercial da América Latina, funcionando como o principal evento anual para o setor de varejo.",
    segmento: "Tecnologia para Varejo / Automação Comercial",
    interessados: ["Fernanda", "Lisa"],
    local: "São Paulo",
    site: "https://www.feiraautocom.com.br/",
    mes: "4 - abril",
    dia: "01 a 03",
    ano: "2026"
  },
  {
    id: "7",
    nome: "INTERMODAL SOUTH AMERICA",
    sobre: "É a principal e mais abrangente feira da América Latina para os setores de logística, intralogística, tecnologia, transporte de cargas e comércio exterior.",
    segmento: "Logística / Transporte / Portos",
    interessados: ["Fernanda", "Lisa"],
    local: "Anhembi, São Paulo",
    site: "https://www.intermodal.com.br/",
    mes: "4 - abril",
    dia: "14 a 16",
    ano: "2026"
  },
  {
    id: "8",
    nome: "APAS SHOW",
    sobre: "O APAS SHOW é a maior feira e congresso supermercadista do mundo, um evento anual que reúne toda a cadeia de valor do setor de alimentos e bebidas.",
    segmento: "Supermercados / Food & Retail",
    interessados: ["Fernanda", "Lisa"],
    local: "Expo Center Norte, São Paulo",
    site: "https://apasshow.com/",
    mes: "5 - maio",
    dia: "18 a 21",
    ano: "2026"
  },
  {
    id: "9",
    nome: "HOSPITALAR",
    sobre: "É a maior e mais influente feira de saúde da América Latina, um evento que reúne players do setor para gerar negócios.",
    segmento: "Saúde / Hospitalar",
    interessados: ["Alice", "Carol"],
    local: "São Paulo Expo",
    site: "https://www.hospitalar.com/",
    mes: "5 - maio",
    dia: "19 a 22",
    ano: "2026"
  },
  {
    id: "10",
    nome: "NATURALTECH",
    sobre: "É a maior feira de produtos orgânicos, naturais e sustentáveis da América Latina.",
    segmento: "Produtos Naturais / Saúde",
    interessados: ["Lisa", "Alice", "Carol"],
    local: "São Paulo Expo",
    site: "https://naturaltech.com.br/",
    mes: "6 - junho",
    dia: "10 a 13",
    ano: "2026"
  },
  {
    id: "11",
    nome: "FCE Pharma",
    sobre: "Considerada a maior feira da indústria farmacêutica na América Latina, reúne a cadeia de produção completa do setor.",
    segmento: "Setor Farmaceutico",
    interessados: ["Roberta", "Alice", "Carol"],
    local: "São Paulo Expo",
    site: "https://fcepharma.com.br/",
    mes: "6 - junho",
    dia: "01 a 03",
    ano: "2026"
  },
  {
    id: "12",
    nome: "ABF FRANCHISING EXPO",
    sobre: "É a maior feira de franquias do mundo e o principal evento para quem busca oportunidades de negócio no setor de franchising.",
    segmento: "Franchising / Franquias",
    interessados: ["Roberta"],
    local: "Expo Center Norte",
    site: "https://www.abfexpo.com.br/pt/a-feira.html",
    mes: "7 - julho",
    dia: "24 a 27",
    ano: "2026"
  },
  {
    id: "13",
    nome: "PET SOUTH AMERICA",
    sobre: "É um grande evento de negócios e o principal ponto de encontro da América Latina para o mercado pet e veterinário.",
    segmento: "Pet / Veterinária",
    interessados: ["Lisa", "Carol", "Alice"],
    local: "Anhembi / Expo",
    site: "https://home.petsa.com.br/",
    mes: "8 - agosto",
    dia: "12 a 14",
    ano: "2026"
  },
  {
    id: "14",
    nome: "RD SUMMIT",
    sobre: "É o maior evento anual de marketing, vendas e e-commerce da América Latina, organizado pela RD Station.",
    segmento: "Marketing / Digital",
    interessados: ["Lisa"],
    local: "Expo Center Norte",
    site: "https://rdsummit.rdstation.com/",
    mes: "11 - novembro",
    dia: "Consultar 2026",
    ano: "2026"
  }
];

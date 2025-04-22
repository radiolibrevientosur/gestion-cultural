export type Category =
  | 'CINE Y MEDIOS AUDIOVISUALES'
  | 'ARTES VISUALES'
  | 'ARTES ESCÉNICAS Y MUSICALES'
  | 'PROMOCIÓN DEL LIBRO Y LA LECTURA'
  | 'PATRIMONIO CULTURAL'
  | 'ECONOMÍA CULTURAL'
  | 'OTROS';

export type EventType = {
  'CINE Y MEDIOS AUDIOVISUALES': ['cine foro', 'proyección de cine', 'radio', 'realización audiovisual'];
  'ARTES VISUALES': ['dibujo y pintura', 'escultura', 'fotografía', 'constructivismo', 'arte conceptual', 'muralismo'];
  'ARTES ESCÉNICAS Y MUSICALES': ['teatro', 'danza', 'música', 'circo'];
  'PROMOCIÓN DEL LIBRO Y LA LECTURA': ['creación y expresividad iteraria', 'promoción de lectura', 'club de libros'];
  'PATRIMONIO CULTURAL': ['historia local', 'historia general', 'costumbres y tradiciones', 'cultura popular', 'identidad cultural'];
  'ECONOMÍA CULTURAL': ['industrias culturales', 'proyectos culturales', 'portafolios culturales (emprendimientos)', 'finanzas culturales'];
  'OTROS': [];
}[Category];

export type ArtisticDiscipline = 'Teatro' | 'Danza' | 'Artes Visuales' | 'Música' | 'Literatura';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  discipline?: string;
  role?: string;
  isFavorite?: boolean;
  image?: {
    data: string;
    type: string;
  };
  notes?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
}

// Resto de interfaces y tipos se mantienen igual...
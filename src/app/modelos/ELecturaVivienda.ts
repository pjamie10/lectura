export interface ELecturaVivienda{
  id: number;
  lectura: number | null;
  fechaLectura: string;
  idVivienda: number;
}

export interface ELecturaViviendaListado extends ELecturaVivienda{
  propietario: string;
  direccion: string;
  zona: string;
}

export interface EHistorialLectura{
  id: number;
  idUsuario: number;
  idLectura: number;
  lectura: number | null;
  montoComision: number;
  fecha: string;
}

export interface EHistorialLecturaListado {
  propietario: string;
  direccion: string;
  lectura: number;
  montoComision: string;
  fecha: string;
}

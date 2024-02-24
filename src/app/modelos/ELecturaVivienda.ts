export interface ELecturaVivienda{
  id: number;
  lecturaAnterior: number;
  lecturaActual: number;
  fechaLectura: Date;
  idVivienda: number;
}

export interface ELecturaViviendaListado extends ELecturaVivienda{
  propietario: string;
  direccion: string;
  zona: string;
}

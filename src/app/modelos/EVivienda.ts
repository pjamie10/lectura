export interface EVivienda{
  id: number;
  idManzana: string;
  nombrePropietario: string;
  direccion: string;
  lote: string;
  idGrupoVivienda: number;
  estado: boolean;
}

export interface EViviendaListado{
  id: number;
  nombrePropietario: string;
  idManzana: number;
  direccion: string;
  lectura: string;
  lote: string;
  idGrupoVivienda: number;
  estado: boolean;
}

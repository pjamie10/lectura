export interface EVivienda{
  id: number;
  nombrePropietario: string;
  direccion: string;
  manzana: string;
  lote: string;
  idGrupoVivienda: number;
  estado: boolean;
}

export interface EViviendaListado{
  id: number;
  nombrePropietario: string;
  direccion: string;
  manzana: string;
  lote: string;
  idGrupoVivienda: number;
}

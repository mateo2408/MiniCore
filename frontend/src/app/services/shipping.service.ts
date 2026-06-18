import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface EnvioDetalle {
  id_envio: number;
  peso_kg: number;
  fecha_envio: string;
  zona: {
    nombre_zona: string;
    tarifa_por_kg: number;
  } | null;
  costo: number;
}

export interface ReporteRepartidor {
  id_repartidor: number;
  nombre: string;
  email: string;
  cantidadEnvios: number;
  totalKg: number;
  zona: string;
  tarifa: string;
  costoTotal: number;
  envios: EnvioDetalle[];
}

export interface ReporteResponse {
  success: boolean;
  data: ReporteRepartidor[];
  rango: {
    inicio: string;
    fin: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  // En desarrollo local redirige al puerto 3001, en producción (Render) usa rutas relativas
  private isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port === '4200';
  private apiUrl = this.isLocalDev
    ? 'http://localhost:3001/api/envios' 
    : '/api/envios';

  constructor(private http: HttpClient) {}

  getReporte(fechaInicio: string, fechaFin: string): Observable<ReporteResponse> {
    return this.http.get<ReporteResponse>(`${this.apiUrl}/reporte`, {
      params: { fechaInicio, fechaFin }
    }).pipe(timeout(10000));
  }
}

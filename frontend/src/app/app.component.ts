import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ShippingService, ReporteRepartidor } from './services/shipping.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  title = 'Mini Core Logística';
  
  // Modelos de formulario pre-llenados con el rango de datos semilla
  fechaInicio: string = '2025-01-01';
  fechaFin: string = '2025-08-31';
  
  // Estado del reporte
  reporte: ReporteRepartidor[] = [];
  rangoConsultado = { inicio: '', fin: '' };
  
  // Estados de control
  loading: boolean = false;
  submitted: boolean = false;
  error: string | null = null;
  
  // Id del repartidor seleccionado para ver el desglose de envíos
  expandedRepartidorId: number | null = null;

  // Totales acumulados para las tarjetas KPI
  kpiTotalEnvios: number = 0;
  kpiTotalKg: number = 0;
  kpiTotalCosto: number = 0;

  constructor(private shippingService: ShippingService) {}

  ngOnInit(): void {
    // Cargar reporte automáticamente al inicio para mostrar datos de inmediato
    this.consultarReporte();
  }

  consultarReporte(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      this.error = 'Ambos campos de fecha son obligatorios';
      return;
    }

    if (new Date(this.fechaInicio) > new Date(this.fechaFin)) {
      this.error = 'La fecha de inicio no puede ser posterior a la fecha de fin';
      return;
    }

    this.loading = true;
    this.error = null;
    this.submitted = true;

    this.shippingService.getReporte(this.fechaInicio, this.fechaFin)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
      next: (response) => {
        if (response.success) {
          this.reporte = response.data;
          this.rangoConsultado = { ...response.rango };
          this.calcularKPIs();
        } else {
          this.error = 'No se pudo cargar el reporte';
        }
      },
      error: (err) => {
        console.error('Error fetching report:', err);
        this.error = err.name === 'TimeoutError'
          ? 'La consulta tardó demasiado. Revise que el backend esté respondiendo en el puerto 3001.'
          : err.error?.message || 'Error de conexión con el servidor. Asegúrese de que el backend esté ejecutándose.';
        this.reporte = [];
      }
    });
  }

  calcularKPIs(): void {
    this.kpiTotalEnvios = this.reporte.reduce((sum, rep) => sum + rep.cantidadEnvios, 0);
    this.kpiTotalKg = this.reporte.reduce((sum, rep) => sum + rep.totalKg, 0);
    this.kpiTotalCosto = this.reporte.reduce((sum, rep) => sum + rep.costoTotal, 0);
  }

  toggleDetalles(id: number): void {
    if (this.expandedRepartidorId === id) {
      this.expandedRepartidorId = null;
    } else {
      this.expandedRepartidorId = id;
    }
  }

  limpiarForm(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.reporte = [];
    this.submitted = false;
    this.expandedRepartidorId = null;
    this.kpiTotalEnvios = 0;
    this.kpiTotalKg = 0;
    this.kpiTotalCosto = 0;
    this.error = null;
  }
}

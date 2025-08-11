import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColorService } from '../../services/color/color';
import { SnackbarService } from '../../services/snackbar/snackbar';
import { SnackbarComponent } from "../snackbar/snackbar";

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [CommonModule, FormsModule, SnackbarComponent],
  templateUrl: './inputs.html',
  styleUrl: './inputs.css',
})
export class InputsComponent {
  @ViewChildren('inputRef') inputElements!: QueryList<ElementRef>;

  constructor(private colorSvc: ColorService, private readonly snackbarService: SnackbarService) {}

  filaActiva = 0;
  letrasEscritasFilaActiva = 0;
  inputs: string[][] = Array(6).fill(null).map(() => Array(6).fill(''));

  objetivo!: string[];
  randomColorHex: string = '';
  coloresFila: string[][] = Array(6).fill(null).map(() => []);
  estado: 'jugando' | 'fin' = 'jugando';

  score = 0;
  nivel = 1;
  maxIntentos = 6;
  longitudCodigo = 6;
  nextLevelButtonEnable = false;
  puntosPorIntento = [10000, 7500, 5000, 1000, 700, 500];
  puntosTotales = 0;

  ngOnInit() {
    const savedScore = sessionStorage.getItem('score');
    const savedNivel = sessionStorage.getItem('nivel');
    this.score = savedScore ? parseInt(savedScore, 10) : 0;
    this.nivel = savedNivel ? parseInt(savedNivel, 10) : 1;
    this.iniciarNivel();

    
  }

  iniciarNivel() {
    // Reiniciar inputs y colores
    this.inputs = Array(6).fill(null).map(() => Array(6).fill(''));
    this.coloresFila = Array(this.maxIntentos).fill(null).map(() => []);

    this.filaActiva = 0;
    this.letrasEscritasFilaActiva = 0;
    this.estado = 'jugando';


    const savedColor = sessionStorage.getItem('randomColorHex');
    if (savedColor) {
      this.randomColorHex = savedColor;
      document.body.style.backgroundColor = this.randomColorHex;
    } else {
      const randomColor = this.colorSvc.randomColor();
      this.randomColorHex = this.colorSvc.rgbToHex(randomColor).toUpperCase();
      sessionStorage.setItem('randomColorHex', this.randomColorHex);
      document.body.style.backgroundColor = this.randomColorHex;

    }

    // Objetivo: extraemos longitudCodigo letras del color hex (sin #)
    this.objetivo = this.randomColorHex.slice(1, 1 + this.longitudCodigo).split('');
    sessionStorage.setItem('score', this.score.toString());
    sessionStorage.setItem('nivel', this.nivel.toString());
  }

  onLetraInput(value: string, row: number, col: number) {
    this.inputs[row][col] = value.toUpperCase().slice(0, 1);
    if (row === this.filaActiva) {
      this.letrasEscritasFilaActiva = this.inputs[row].filter(l => l.trim().length === 1).length;
    }
  }

  isFilaCompleta(row: number): boolean {
    return this.inputs[row].every(letra => letra.trim().length === 1);
  }

  onKeyUp(event: KeyboardEvent, row: number, index: number) {
    const input = event.target as HTMLInputElement;
    let val = input.value.toUpperCase();

    if (val.length > 1) val = val.charAt(0);
    if (!/^[A-Z0-9]$/.test(val)) {
      input.value = '';
      this.inputs[row][index] = '';
    }
  }

  intentar(fila: number) {
    if (!this.isFilaCompleta(fila)) {
      this.snackbarService.showMessage('Complete the word before trying.', true);
      return;
    }

    const intento = this.inputs[fila].map(l => (l ?? '').toUpperCase());
    const objetivoMay = this.objetivo.map(l => l.toUpperCase());
    const resultado: string[] = Array(intento.length).fill('wrong');

    const letraContador: { [letra: string]: number } = {};
    for (const letra of objetivoMay) {
      letraContador[letra] = (letraContador[letra] || 0) + 1;
    }

    // Marcar correctas
    for (let i = 0; i < intento.length; i++) {
      if (intento[i] === objetivoMay[i]) {
        resultado[i] = 'correct';
        letraContador[intento[i]]--;
      }
    }

    // Marcar desplazadas
    for (let i = 0; i < intento.length; i++) {
      if (resultado[i] === 'correct') continue;

      const letra = intento[i];
      if (letraContador[letra] > 0) {
        resultado[i] = 'misplaced';
        letraContador[letra]--;
      }
    }

    this.coloresFila[fila] = resultado;

    if (resultado.every(r => r === 'correct')) {
      const puntosGanados = this.puntosPorIntento[fila] || 0;
      this.score += puntosGanados;
      sessionStorage.setItem('score', this.score.toString());
      this.nextLevelButtonEnable = true;

      this.snackbarService.showMessage(
        `Congratulations! Level ${this.nivel} completed.`,
        false
      );

      return;
    }

    // Si no ganó, avanza fila o termina juego
    if (this.filaActiva < this.maxIntentos - 1) {
      this.filaActiva++;
    } else {
      this.estado = 'fin';
      this.snackbarService.showMessage(`Finish the game. Level achieved: ${this.nivel}`, true);
    }
  }

nextLevel() {
  this.nivel++;
  sessionStorage.setItem('Level', this.nivel.toString());
  this.inputs = Array(6).fill(null).map(() => Array(6).fill(''));
  this.coloresFila = Array(this.maxIntentos).fill(null).map(() => []);
  this.filaActiva = 0;
  this.letrasEscritasFilaActiva = 0;
  this.estado = 'jugando';
  this.nextLevelButtonEnable = false;
  
  this.cambiarColorNuevoNivel();
  
}


  cambiarColorNuevoNivel() {
    sessionStorage.removeItem('randomColorHex');
    const nuevoColor = this.colorSvc.randomColor();
    this.randomColorHex = this.colorSvc.rgbToHex(nuevoColor).toUpperCase();
    sessionStorage.setItem('randomColorHex', this.randomColorHex);
    document.body.style.backgroundColor = this.randomColorHex;

  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  isInputDisabled(row: number): boolean {
  return row !== this.filaActiva;
}


  onModelChange(value: string, row: number, index: number) {
    const val = (value ?? '').toUpperCase();

    if (!/^[A-Z0-9]$/.test(val)) {
      this.inputs[row][index] = '';
      return;
    }

    this.inputs[row][index] = val;

    const perRow = this.longitudCodigo;
    const inputsArray = this.inputElements.toArray();
    if (val && index < perRow - 1 && !this.inputs[row][index + 1]) {
      const globalIndex = row * perRow + index;
      setTimeout(() => {
        const next = inputsArray[globalIndex + 1];
        next?.nativeElement.focus();
      }, 0);
    }
  }
}

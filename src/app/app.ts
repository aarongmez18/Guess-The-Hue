import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Guess } from './shared/interfaces/guess';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

import {InputsComponent} from '../app/shared/components/inputs/inputs'

import { ColorService, RGB } from '../app/shared/services/color/color';
import { Navbar } from './components/navbar/navbar/navbar';

type Estado = 'jugando' | 'ganado' | 'perdido';
type LetterState = 'absent' | 'present' | 'correct';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [CommonModule, FormsModule, InputsComponent,Navbar],
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {


  input = '';
  mensaje = '';
  objetivo!: RGB;
  intentosRestantes = 5;
  historial: Guess[] = [];
  estado: Estado = 'jugando';
  inputs: string[] = ['', '', '', '', ''];

  constructor(private colorSvc: ColorService) {}

  ngOnInit() {
  this.reset();
  const savedColor = sessionStorage.getItem('randomColorHex');

}


  applyBackgroundColorFromSession(colorHex: string) {
  document.body.style.backgroundColor = colorHex;
}




  reset() {
    this.objetivo = this.colorSvc.randomColor();
    this.intentosRestantes = 5;
    this.mensaje = 'Adivina el color en 5 intentos. Ingresa un hex como #1A2B3C o 1A2B3C.';
    this.historial = [];
    this.estado = 'jugando';
    this.input = '';
  }

  get objetivoHex() {
    return this.colorSvc.rgbToHex(this.objetivo);
  }

  



  
}

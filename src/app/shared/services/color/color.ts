import { Injectable } from '@angular/core';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  // Genera un color aleatorio en formato RGB
  randomColor(): RGB {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    };
  }

  // Convierte RGB a hex string como "#A1B2C3"
  rgbToHex({ r, g, b }: RGB): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  // Convierte hex a RGB; lanza error si inválido
  hexToRgb(hex: string): RGB {
    hex = hex.trim();
    if (hex.startsWith('#')) hex = hex.slice(1);
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error('Hex inválido');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
  }

  // Distancia normalizada entre dos colores RGB (0 = idéntico, 1 = máximo)
  normalizedDistance(c1: RGB, c2: RGB): number {
    const dr = c1.r - c2.r;
    const dg = c1.g - c2.g;
    const db = c1.b - c2.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    // distancia máxima entre (0,0,0) y (255,255,255) = sqrt(3*255^2)
    const max = Math.sqrt(3 * 255 * 255);
    return dist / max;
  }
}

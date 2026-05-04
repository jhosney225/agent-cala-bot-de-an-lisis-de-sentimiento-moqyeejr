```javascript
// Bot de Análisis de Sentimiento de Texto
// Ejecutar con: node index.js

const readline = require('readline');

// Palabras positivas
const palabrasPositivas = {
  'excelente': 2, 'magnífico': 2, 'fantástico': 2, 'increíble': 2, 'maravilloso': 2,
  'bueno': 1.5, 'genial': 1.5, 'perfecto': 1.5, 'hermoso': 1.5, 'amor': 1.5,
  'feliz': 1.5, 'alegre': 1.5, 'lindo': 1.5, 'bonito': 1.5, 'brillante': 1.5,
  'éxito': 1, 'bien': 1, 'ok': 0.5, 'agradable': 1, 'divertido': 1,
  'interesante': 0.5, 'cool': 0.5, 'awesome': 1.5, 'great': 1.5, 'amazing': 2,
  'wonderful': 2, 'fantastic': 2, 'excellent': 2, 'beautiful': 1.5, 'love': 1.5
};

// Palabras negativas
const palabrasNegativas = {
  'horrible': -2, 'terrible': -2, 'abominable': -2, 'detesto': -2, 'odio': -2,
  'malo': -1.5, 'triste': -1.5, 'feo': -1.5, 'fallo': -1.5, 'problema': -1.5,
  'error': -1, 'difícil': -0.5, 'complicado': -0.5, 'no': -0.5, 'nunca': -0.5,
  'peor': -1.5, 'desastre': -2, 'patético': -2, 'disgusto': -1.5, 'asco': -1.5,
  'awful': -2, 'terrible': -2, 'hate': -2, 'bad': -1.5, 'sad': -1.5,
  'ugly': -1.5, 'worst': -2, 'disgusting': -2, 'horrible': -2, 'terrible': -2
};

// Intensificadores
const intensificadores = {
  'muy': 1.5, 'bastante': 1.2, 'extremadamente': 2, 'increíblemente': 2,
  'realmente': 1.3, 'genuinamente': 1.2, 'absolutamente': 1.5, 'totalmente': 1.5,
  'super': 1.3, 'ultra': 1.5, 'mega': 1.5, 'hiper': 1.5,
  'really': 1.3, 'very': 1.5, 'extremely': 2, 'incredibly': 2, 'so': 1.2
};

// Negadores
const negadores = ['no', 'nunca', 'jamás', 'nada', 'not', 'never', 'nothing'];

// Emojis sentimiento
const emojiPositivo = '😊';
const emojiNegativo = '😢';
const emojiNeutral = '😐';

class AnalizadorSentimiento {
  constructor() {
    this.historial = [];
  }

  limpiarTexto(texto) {
    return texto.toLowerCase()
      .replace(/[.,!?;:()'"]/g, '')
      .split(/\s+/)
      .filter(palabra => palabra.length > 0);
  }

  detectarNegacion(palabras, indice) {
    if (indice === 0) return false;
    const palabraAnterior = palabras[indice - 1];
    return negadores.includes(palabraAnterior);
  }

  obtenerIntensificador(palabras, indice) {
    if (indice === 0) return 1;
    const palabraAnterior = palabras[indice - 1];
    return intensificadores[palabraAnterior] || 1;
  }

  analizarTexto(texto) {
    const palabras = this.limpiarTexto(texto);
    let puntuacion = 0;
    let palabrasEncontradas = [];
    let detalles = [];

    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
      let valor = 0;
      let tipo = '';

      if (palabrasPositivas[palabra]) {
        valor = palabrasPositivas[palabra];
        tipo = 'positiva';
      } else if (palabrasNegativas[palabra]) {
        valor = palabrasNegativas[palabra];
        tipo = 'negativa';
      }

      if (valor !== 0) {
        const esNegacion = this.detectarNegacion(palabras, i);
        const intensificador = this.obtenerIntensificador(palabras, i);

        if (esNegacion) {
          valor = -valor;
          detalles.push(`"${palabra}" (${tipo}, negada)`);
        } else {
          valor = valor * intensificador;
          const intensificadorNombre = intensificadores[palabras[i - 1]] ? `(${palabras[i - 1]}) ` : '';
          detalles.push(`"${palabra}" ${intensificadorNombre}(${tipo})`);
        }

        puntuacion += valor;
        palabrasEncontradas.push({ palabra, valor, tipo });
      }
    }

    // Normalizar puntuación
    let sentimiento = '';
    let emoji = '';
    let porcentaje = 0;

    if (puntuacion > 0
// ===== Elementos =====
const frase = document.getElementById('frase');
const contador = document.getElementById('contador');
const chuva = document.getElementById('chuva');
const stickers = document.querySelectorAll('.sticker');

const frases = [
  'hoje não',
  'nem vem',
  'me erra',
  'tô bolado',
  'só ódio',
  'não fala comigo',
  'sai daqui',
  'tô de mal',
  'que ódio',
  'nem tenta',
  'pior dia',
  'tô no limite'
];

const emojis = ['😡', '🤬', '💢', '🔥', '😤', '💔'];

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Contador salvo no navegador =====
let raiva = 0;
try {
  raiva = Number(localStorage.getItem('raiva')) || 0;
} catch (e) {}
contador.textContent = raiva;

function salvar() {
  try { localStorage.setItem('raiva', raiva); } catch (e) {}
}

function aumentarRaiva() {
  raiva++;
  contador.textContent = raiva;
  salvar();
  reiniciarAnimacao(contador, 'subiu');
}

// ===== Som (gerado pelo navegador, sem arquivo) =====
let audio;
function tocarSom() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const volume = audio.createGain();
    const agora = audio.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180 + Math.random() * 80, agora);
    osc.frequency.exponentialRampToValueAtTime(60, agora + 0.3);

    volume.gain.setValueAtTime(0.25, agora);
    volume.gain.exponentialRampToValueAtTime(0.001, agora + 0.3);

    osc.connect(volume).connect(audio.destination);
    osc.start(agora);
    osc.stop(agora + 0.3);
  } catch (e) {}
}

// ===== Tremida =====
function tremer() {
  if (semMovimento) return;
  reiniciarAnimacao(document.body, 'tremendo');
}

// Remove e recoloca a classe para a animação rodar de novo
function reiniciarAnimacao(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

// ===== Frase aleatória =====
function sortearFrase() {
  let nova;
  do {
    nova = frases[Math.floor(Math.random() * frases.length)];
  } while (nova === frase.textContent && frases.length > 1);
  frase.textContent = nova;
  reiniciarAnimacao(frase, 'nova');
}

// ===== Chuva de emojis =====
function chuvaDeRaiva(quantidade = 40) {
  if (semMovimento) quantidade = 8;
  for (let i = 0; i < quantidade; i++) {
    const gota = document.createElement('span');
    gota.className = 'gota';
    gota.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    gota.style.left = Math.random() * 100 + 'vw';
    gota.style.fontSize = 1.5 + Math.random() * 2 + 'rem';
    gota.style.animationDuration = 1.8 + Math.random() * 2 + 's';
    gota.style.animationDelay = Math.random() * 1.2 + 's';
    gota.addEventListener('animationend', () => gota.remove());
    chuva.appendChild(gota);
  }
}

// ===== Eventos =====
stickers.forEach(sticker => {
  sticker.addEventListener('click', () => {
    tocarSom();
    tremer();
    aumentarRaiva();
    sortearFrase();
    // a cada 10 cliques, chove raiva
    if (raiva % 10 === 0) chuvaDeRaiva();
  });
});

document.getElementById('btn-frase').addEventListener('click', sortearFrase);

document.getElementById('btn-chuva').addEventListener('click', () => {
  tocarSom();
  chuvaDeRaiva();
});

document.getElementById('btn-zerar').addEventListener('click', () => {
  raiva = 0;
  contador.textContent = raiva;
  salvar();
  frase.textContent = 'raiva zerada';
});

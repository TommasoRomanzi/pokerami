const code = localStorage.getItem('gameCode');
const isDealer = localStorage.getItem('isDealer') === 'true';
document.getElementById('roomCode').textContent = code;

const playerSection = document.getElementById('playerSection');
const dealerActions = document.getElementById('dealerActions');

if (isDealer) {
  dealerActions.style.display = 'block';
}

// Recupera lista giocatori o inizializza
let players = JSON.parse(localStorage.getItem('players')) || [];

function renderPlayers() {
  playerSection.innerHTML = '';
  players.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'player';
    div.innerHTML = `
      <strong>${p.name}</strong>: €${p.stack.toFixed(2)}
      ${isDealer ? `
        <button onclick="adjustStack(${index}, 1)">+1</button>
        <button onclick="adjustStack(${index}, -1)">-1</button>
      ` : ''}
    `;
    playerSection.appendChild(div);
  });
}

function addPlayer() {
  const name = document.getElementById('playerName').value.trim();
  const stack = parseFloat(document.getElementById('initialStack').value);
  if (name && !isNaN(stack)) {
    players.push({ name, stack });
    savePlayersToFirebase();
    document.getElementById('playerName').value = '';
  }
}

function adjustStack(index, amount) {
  players[index].stack += amount;
  savePlayersToFirebase();
}

function endGame() {
  localStorage.clear();
  window.location.href = 'index.html';
}

// All'avvio
renderPlayers();

function savePlayersToFirebase() {
  db.ref(`games/${code}/players`).set(players);
}

db.ref(`games/${code}/players`).on('value', snapshot => {
  const data = snapshot.val();
  if (data) {
    players = data;
    renderPlayers();
  }
});


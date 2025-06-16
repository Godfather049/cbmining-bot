// Kullanıcı verileri
let user = JSON.parse(localStorage.getItem('cb_user')) || {
  id: generateId(),
  balance: 0,
  mining: false,
  miningEnd: null,
  tonBalance: 0,
  clickedTasks: [],
  referrals: [],
  lastSpin: null,
  walletConnected: false
};

// DOM Elementleri
const miningBtn = document.getElementById('miningBtn');
const premiumBtn = document.getElementById('premiumBtn');
const timerEl = document.getElementById('timer');
const balanceEl = document.getElementById('balance');

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  updateUI();
  if(user.mining && user.miningEnd > Date.now()) {
    startMiningTimer();
  }
  
  // Buton eventleri
  miningBtn?.addEventListener('click', startMining);
  premiumBtn?.addEventListener('click', startPremiumMining);
}

// Madencilik başlatma
function startMining() {
  if(user.mining) return;
  
  user.mining = true;
  user.miningEnd = Date.now() + 8 * 60 * 60 * 1000;
  saveUserData();
  
  miningBtn.classList.add('active');
  startMiningTimer();
  
  setTimeout(completeMining, 8 * 60 * 60 * 1000);
}

// Premium madencilik
function startPremiumMining() {
  if(user.tonBalance < 1.5) {
    showModal('Yetersiz Bakiye', 'Premium madencilik için 1.5 TON gereklidir.');
    return;
  }
  
  user.tonBalance -= 1.5;
  saveUserData();
  startMining();
}

// Madencilik tamamlama
function completeMining() {
  user.balance += 90;
  user.mining = false;
  saveUserData();
  updateUI();
  showModal('Madencilik Tamamlandı', '+90 CB kazandınız!');
}

// Spin fonksiyonu
function openSpin() {
  window.location.href = 'spin.html';
}

// Görevler
const TASKS = [
  { id: 'blum', name: 'Blum', url: 'https://t.me/blum/app?startapp=ref_M96qo1sLIr' },
  { id: 'boinker', name: 'Boinker', url: 'https://t.me/boinker_bot/boinkapp?startapp=boink1463264622' },
  { id: 'cbank', name: 'CBank', url: 'https://t.me/cbankmining' },
  { id: 'yescoin', name: 'Yescoin', url: 'https://t.me/theYescoin_bot/Yescoin?startapp=GtNgBb' }
];

function openTasks() {
  let tasksHTML = TASKS.map(task => `
    <div class="task-item ${user.clickedTasks.includes(task.id) ? 'completed' : ''}">
      <button onclick="completeTask('${task.id}')">
        <img src="assets/${task.id}-icon.png" alt="${task.name}">
        <span>${task.name}</span>
      </button>
    </div>
  `).join('');
  
  showModal('Görevler', `<div class="tasks-grid">${tasksHTML}</div>`);
}

function completeTask(taskId) {
  if(user.clickedTasks.includes(taskId)) return;
  
  const task = TASKS.find(t => t.id === taskId);
  if(task) {
    user.clickedTasks.push(taskId);
    user.balance += 10;
    saveUserData();
    updateUI();
    window.open(task.url, '_blank');
  }
}

// Cüzdan bağlantısı
function connectWallet() {
  if(window.ton) {
    window.ton.request({ method: "ton_requestAccounts" })
      .then(accounts => {
        user.walletAddress = accounts[0];
        user.walletConnected = true;
        saveUserData();
        updateUI();
        showModal('Başarılı', 'TON Cüzdan bağlantısı başarılı!');
      });
  } else {
    showModal('Hata', 'TON Wallet uygulaması yüklü değil');
  }
}

// Referans sistemi
function openReferral() {
  const refLink = `https://t.me/cbmining_bot?start=ref_${user.id}`;
  
  showModal('Referans Programı', `
    <p>Davet başına <strong>10 CB</strong> kazanın!</p>
    <div class="referral-link">
      <input type="text" value="${refLink}" readonly>
      <button onclick="copyToClipboard('${refLink}')">Kopyala</button>
    </div>
    <p>Toplam davet: <strong>${user.referrals.length}</strong></p>
  `);
}

// Yardımcı fonksiyonlar
function updateUI() {
  if(balanceEl) balanceEl.textContent = user.balance;
}

function saveUserData() {
  localStorage.setItem('cb_user', JSON.stringify(user));
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function showModal(title, content) {
  // Modal gösterim kodu
    }

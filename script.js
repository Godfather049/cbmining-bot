// Kullanıcı verileri (localStorage ile kalıcı)
let user = JSON.parse(localStorage.getItem('cbmining_user')) || {
  id: Date.now().toString(),
  balance: 0,
  mining: false,
  miningEnd: null,
  tonBalance: 0,
  clickedRefs: [],
  lastSpin: null,
  referrals: []
};

// DOM Elementleri
const balanceEl = document.getElementById('balance');
const miningBtn = document.getElementById('miningBtn');
const timerEl = document.getElementById('timer');
const premiumBtn = document.getElementById('premiumBtn');

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  if(user.mining && user.miningEnd > Date.now()) {
    startTimerVisual();
  }
});

// Madencilik başlat
function startMining() {
  if(user.mining) return;
  
  user.mining = true;
  user.miningEnd = Date.now() + 8 * 60 * 60 * 1000; // 8 saat
  saveUserData();
  
  miningBtn.classList.add('active');
  startTimerVisual();
  
  setTimeout(() => {
    user.balance += 90;
    user.mining = false;
    saveUserData();
    updateUI();
    showNotification("Madencilik tamamlandı! +90 CB kazandınız.");
  }, 8 * 60 * 60 * 1000);
}

// Premium madencilik
function startPremiumMining() {
  if(user.tonBalance < 1.5) {
    showNotification("Yeterli TON bakiyeniz yok!");
    return;
  }
  
  user.tonBalance -= 1.5;
  sendPaymentToAdmin(1.5);
  startMining();
}

// Geri sayım görseli
function startTimerVisual() {
  const timerInterval = setInterval(() => {
    const now = Date.now();
    const distance = user.miningEnd - now;
    
    if(distance <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "Madenciliği Başlat";
      miningBtn.classList.remove('active');
      return;
    }
    
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Görevler
function openTasks() {
  const tasks = [
    { name: "blum", url: "https://t.me/blum/app?startapp=ref_M96qo1sLIr" },
    { name: "boinker", url: "https://t.me/boinker_bot/boinkapp?startapp=boink1463264622" },
    { name: "cbank", url: "https://t.me/cbankmining" },
    { name: "blumcrypto", url: "https://t.me/blumcrypto_memepad" },
    { name: "yescoin", url: "https://t.me/theYescoin_bot/Yescoin?startapp=GtNgBb" }
  ];

  let message = "Görevler (Her biri 10 CB kazandırır):\n\n";
  tasks.forEach((task, index) => {
    const isCompleted = user.clickedRefs.includes(task.url);
    message += `${index+1}. ${isCompleted ? '✅ ' : '🔴 '}${task.name}\n`;
  });

  const taskName = prompt(message + "\nTamamlamak istediğiniz görevin adını yazın (ör: blum):");
  if(taskName) {
    const selectedTask = tasks.find(t => t.name.toLowerCase() === taskName.toLowerCase());
    if(selectedTask && !user.clickedRefs.includes(selectedTask.url)) {
      user.clickedRefs.push(selectedTask.url);
      user.balance += 10;
      saveUserData();
      updateUI();
      window.open(selectedTask.url, '_blank');
      showNotification("10 CB kazandınız! Görev tamamlandı.");
    }
  }
}

// Cüzdan bağlantısı
function connectWallet() {
  if(window.ton) {
    window.ton.request({ method: "ton_requestAccounts" })
      .then(accounts => {
        user.walletAddress = accounts[0];
        saveUserData();
        showNotification("TON Cüzdan bağlantısı başarılı!");
      });
  } else {
    showNotification("TON Wallet uygulaması yüklü değil");
  }
}

// Referans sistemi
function openRef() {
  const refLink = `https://t.me/cbmining_bot?start=${user.id}`;
  const message = `Referans linkiniz:\n${refLink}\n\nHer davet için 10 CB kazanın!\n\nDavet edilen kişi madenciliğe başladığında otomatik ödül alacaksınız.`;
  showNotification(message);
}

// TON Satın Alma
function buyTON() {
  const paymentLink = `ton://transfer/${user.walletAddress || 'ADMIN_WALLET'}?amount=1500000000&text=CB_Mining`;
  window.open(paymentLink, '_blank');
}

// CBANK Satın Alma
function buyCBANK() {
  window.open("https://t.me/blumcrypto_memepad", '_blank');
}

// Yardımcı fonksiyonlar
function saveUserData() {
  localStorage.setItem('cbmining_user', JSON.stringify(user));
}

function updateUI() {
  balanceEl.textContent = user.balance;
  if(document.getElementById('tonBalance')) {
    document.getElementById('tonBalance').textContent = user.tonBalance;
  }
}

function showNotification(msg) {
  alert(msg);
}

// Telegram WebApp entegrasyonu
if(window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.expand();
  if(Telegram.WebApp.initDataUnsafe.start_param) {
    const referrerId = Telegram.WebApp.initDataUnsafe.start_param.replace('ref_', '');
    if(referrerId && referrerId !== user.id) {
      user.referrals.push(referrerId);
      user.balance += 10;
      saveUserData();
    }
  }
}

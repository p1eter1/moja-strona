
const mainHeading = document.querySelector('.main-heading');
const headingText = "Cześć! Jestem p1eter";
let idx = 0;
function typeWriter() {
  if (idx <= headingText.length) {
    mainHeading.innerHTML = headingText.slice(0, idx) + '<span class="caret" aria-hidden="true"></span>';
    idx++;
    setTimeout(typeWriter, idx < 4 ? 350 : 90 + Math.random() * 60);
  } else {
    mainHeading.innerHTML = headingText;
  }
}
typeWriter();


const navLinks = document.querySelectorAll('.nav-link');
function setActiveNavLink() {
  let scrollPos = window.scrollY || window.pageYOffset;
  let found = false;
  document.querySelectorAll('section.section').forEach((section, i) => {
    const top = section.offsetTop - 80;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom && !found) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[i].classList.add('active');
      found = true;
    }
  });
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[navLinks.length - 1].classList.add('active');
  }
}
window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('DOMContentLoaded', setActiveNavLink);

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const hash = this.getAttribute('href');
    if (hash.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 55, behavior: 'smooth' });
        setTimeout(() => target.setAttribute('tabindex', '-1'), 400);
      }
      document.getElementById('nav-links').classList.remove('open');
      document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
    }
  });
});


const navToggle = document.querySelector('.nav-toggle');
navToggle.addEventListener('click', function() {
  const nav = document.getElementById('nav-links');
  nav.classList.toggle('open');
  const expanded = nav.classList.contains('open');
  navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
});
navToggle.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navToggle.click();
  }
});


function handleFadeInOnScroll() {
  const fadeElems = document.querySelectorAll('.fade-in-on-scroll');
  fadeElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
  document.querySelectorAll('.skill-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      card.classList.add('visible');
      const progress = card.querySelector('.progress');
      if(progress && progress.style.width.match(/^\d+%$/)) {
     
      } else if(progress) {
        progress.style.width = progress.parentElement.dataset.width || "50%";
      }
    }
  });
}
window.addEventListener('scroll', handleFadeInOnScroll);
window.addEventListener('DOMContentLoaded', handleFadeInOnScroll);


const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) {
    formStatus.textContent = "Uzupełnij wszystkie pola.";
    formStatus.style.color = "#ff364e";
    return;
  }
  if (!/^[\w\-\.\+]+@([\w-]+\.)+[\w-]{2,20}$/.test(email)) {
    formStatus.textContent = "Wpisz poprawny adres e-mail.";
    formStatus.style.color = "#ff364e";
    return;
  }
  formStatus.textContent = "Wysyłanie...";
  formStatus.style.color = "#ea0029";
  setTimeout(() => {
    formStatus.textContent = "Dziękuję za wiadomość!";
    formStatus.style.color = "#4be49a";
    contactForm.reset();
  }, 1200);
});


const styleCaret = document.createElement('style');
styleCaret.innerHTML = `.caret { border-right: 2.5px solid #ff364e; animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }`;
document.head.appendChild(styleCaret);


function closeModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
  document.querySelector('.modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function openModal(id) {
  closeModals();
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.querySelector('.modal-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      const focusable = modal.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 100);
  }
}
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', function() { openModal(this.dataset.modal); });
});
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', closeModals);
});
document.querySelector('.modal-backdrop').addEventListener('click', closeModals);
window.addEventListener('keydown', function(e) {
  if (e.key === "Escape") closeModals();
});


const calcDisplay = document.getElementById('calc-display');
if (calcDisplay) {
  const calcBtns = Array.from(document.querySelectorAll('.calc-buttons button'));
  let calcValue = '';
  function updateCalcDisplay() { calcDisplay.value = calcValue; }
  function safeEval(expr) {
    try {
      // Only numbers, . and operators
      if (!/^[\d+\-*/.() ]+$/.test(expr)) return "";
      // eslint-disable-next-line no-eval
      let result = eval(expr);
      if (typeof result === "number" && isFinite(result)) return result;
      return "";
    } catch { return ""; }
  }
  calcBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const val = this.textContent;
      if (val === 'C') {
        calcValue = '';
      } else if (val === '=') {
        const res = safeEval(calcValue);
        if (res === "") calcValue = "";
        else calcValue = String(res);
      } else {
        if (calcValue.length < 22) calcValue += val;
      }
      updateCalcDisplay();
    });
  });
  document.getElementById('calc-clear').addEventListener("click", function() {
    calcValue = '';
    updateCalcDisplay();
  });
}


const snakeCanvas = document.getElementById('snake-canvas');
if (snakeCanvas) {
  const ctx = snakeCanvas.getContext('2d');
  const box = 15;
  let snake, direction, food, interval, score, gameOver, pendingDir;

  function initSnake() {
    snake = [{x: 7, y: 10}];
    direction = 'RIGHT';
    pendingDir = null;
    score = 0;
    gameOver = false;
    spawnFood();
    updateScore();
  }
  function spawnFood() {
    food = {
      x: Math.floor(Math.random()*20),
      y: Math.floor(Math.random()*20)
    };
   
    if (snake.some(s => s.x === food.x && s.y === food.y)) spawnFood();
  }
  function updateScore() {
    document.getElementById('snake-score').textContent = score;
  }
  function drawSnake() {
    ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  
    ctx.fillStyle = "#ea0029";
    ctx.fillRect(food.x*box, food.y*box, box, box);
  
    for(let i=0;i<snake.length;i++){
      ctx.fillStyle = i === 0 ? "#fff" : "#b6b6b6";
      ctx.fillRect(snake[i].x*box, snake[i].y*box, box, box);
      ctx.strokeStyle = "#23232b";
      ctx.strokeRect(snake[i].x*box, snake[i].y*box, box, box);
    }
  }
  function moveSnake() {
    if (gameOver) return;

    if (pendingDir) {
      direction = pendingDir;
      pendingDir = null;
    }
    let head = {...snake[0]};
    if (direction === "LEFT") head.x--;
    if (direction === "UP") head.y--;
    if (direction === "RIGHT") head.x++;
    if (direction === "DOWN") head.y++;
   
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) return endGame();
   
    if (snake.some(part => part.x === head.x && part.y === head.y)) return endGame();
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
      score++;
      updateScore();
      spawnFood();
    } else {
      snake.pop();
    }
    drawSnake();
  }
  function endGame() {
    gameOver = true;
    clearInterval(interval);
    ctx.font = "bold 22px Poppins,Arial,sans-serif";
    ctx.fillStyle = "#ea0029";
    ctx.textAlign = "center";
    ctx.fillText("Koniec gry!", snakeCanvas.width/2, snakeCanvas.height/2-10);
    ctx.font = "16px Poppins,Arial,sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("Wynik: " + score, snakeCanvas.width/2, snakeCanvas.height/2+20);
  }
  function startGame() {
    initSnake();
    drawSnake();
    clearInterval(interval);
    interval = setInterval(moveSnake, 110);
    snakeCanvas.focus();
  }
  document.getElementById('snake-restart').addEventListener('click', startGame);
 
  document.querySelector('[data-modal="snake-modal"]').addEventListener('click', function() {
    setTimeout(startGame, 350);
  });
  
  snakeCanvas.addEventListener('keydown', function(e) {
    const key = e.key;
    let newDir = direction;
    if      (key === "ArrowLeft" && direction !== "RIGHT") newDir = "LEFT";
    else if (key === "ArrowUp" && direction !== "DOWN") newDir = "UP";
    else if (key === "ArrowRight" && direction !== "LEFT") newDir = "RIGHT";
    else if (key === "ArrowDown" && direction !== "UP") newDir = "DOWN";
    if (newDir !== direction) pendingDir = newDir;
    if (gameOver && (key === "Enter" || key === " " || key === "ArrowUp")) startGame();
  });
  
  snakeCanvas.addEventListener('click', function(){ this.focus(); });
}


document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('transitionend', function() {
    if (!m.classList.contains('open')) {
      const inputs = m.querySelectorAll('[tabindex]');
      inputs.forEach(i => { if(+i.getAttribute('tabindex')===-1) i.removeAttribute('tabindex'); });
    }
  });
});

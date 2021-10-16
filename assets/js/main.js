let bullets = [];
let enemies = [];
let enemyCount = 1;
let enemiesCount = 7;
let gameLoopInterval;
let hero = {
  x: 500,
  y: 520
};
let heroElem = document.getElementById("hero");
let invulnerable = false;
let keys = {};
let keysInterval;
let score = 0;
let spawnEnemyInterval;

addBullet = () => {
  bullets.push({ x: hero.x + 8, y: hero.y - 15 });
};

detectBulletCollision = () => {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      let isCollideX = Math.abs(bullets[i].x - enemies[j].x) <= 20;
      let isCollideY = Math.abs(bullets[i].y - enemies[j].y) <= 20;
      if (isCollideX && isCollideY) {
        enemies[j].dead = true;
        const enemyDead = new Audio("assets/audio/enemy-dead.mp3");
        enemyDead.play();
        updateScore(10);
        document.getElementById(`enemy_${enemies[j].id}`).style.backgroundPosition = "-110px -30px";
        bullets.splice(i, 1);
        enemies.splice(j, 1);

        return;
      }
    }
  }
};

detectHeroCollision = () => {
  if (invulnerable) {
    setTimeout(() => {
      invulnerable = false;
    }, 2500);
    return;
  }
  for (let i = 0; i < enemies.length; i++) {
    let isCollideX = Math.abs(hero.x - enemies[i].x) <= 20;
    let isCollideY = Math.abs(hero.y - enemies[i].y) <= 20;
    if (isCollideX && isCollideY) {
      invulnerable = true;
      updateScore(-500);

      return;
    }
  }
};

displayBullet = () => {
  let output = "";
  bullets.forEach(({ x, y }) => {
    output += `<div class="bullet" style="top: ${y}px; left: ${x}px"></div>`;
  });
  document.getElementById("bullets").innerHTML = output;
};

displayEnemy = () => {
  let output = "";
  enemies.forEach(({ id, x, y, type }) => {
    output += `<div id="enemy_${id}" class="enemy enemy${type}" style="top: ${y}px; left: ${x}px"></div>`;
  });
  document.getElementById("enemies").innerHTML = output;
};

displayHero = () => {
  heroElem.style.opacity = invulnerable ? 0.5 : 1;
  heroElem.style.left = `${hero.x}px`;
  heroElem.style.top = `${hero.y}px`;
};

gameLoop = () => {
  displayHero();
  moveBullet();
  displayBullet();
  moveEnemy();
  displayEnemy();
  detectBulletCollision();
  detectHeroCollision();
  document.getElementById("score").innerText = score;
};

gameOver = () => {
  invulnerable = false;
  heroElem.style.backgroundPositionY = "-30px";
  heroElem.style.backgroundPositionX = "-35px";
  setTimeout(() => {
    heroElem.style.backgroundPositionX = "-60px";
  }, 250);
  setTimeout(() => {
    heroElem.style.backgroundPositionX = "-85px";
  }, 500);
  setTimeout(() => {
    heroElem.style.backgroundPositionX = "-115px";
  }, 750);
  setTimeout(() => {
    heroElem.style.backgroundPositionX = "-145px";
  }, 1000);
  const heroDead = new Audio("assets/audio/hero-dead.mp3");
  heroDead.play();
  document.onkeydown = null;
  document.onkeyup = null;
  clearInterval(gameLoopInterval);
  clearInterval(spawnEnemyInterval);
  document.getElementById("game-over").style.display = "block";
};

moveBullet = () => {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= 5;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
};

moveEnemy = () => {
  for (let i = 0; i < enemies.length; i++) {
    if (!enemies[i].dead) {
      enemies[i].y += 3;
      if (enemies[i].y >= 520) {
        enemies[i].x = Math.floor(Math.random() * 973);
        enemies[i].y = -50;
        updateScore(-10);
      }
    }
  }
};

moveHero = () => {
  if (keys["ArrowLeft"] && hero.x >= 10) {
    hero.x -= 20;
  }
  if (keys["ArrowUp"] && hero.y >= 360) {
    hero.y -= 20;
  }
  if (keys["ArrowRight"] && hero.x <= 960) {
    hero.x += 20;
  }
  if (keys["ArrowDown"] && hero.y <= 500) {
    hero.y += 20;
  }
};

spawnEnemy = (count = 1) => {
  if (enemies.length > 20) {
    return;
  }
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 973);
    const y = -50;
    const type = Math.floor(Math.random() * 2) + 1;
    enemies.push({ id: enemyCount, x, y, type });
    enemyCount += 1;
  }
};

startGame = () => {
  document.onkeydown = e => {
    if (!keys[e.code]) {
      keys[e.code] = true;
    }
  };
  document.onkeyup = e => {
    keys[e.code] = false;
    if (e.code === "Space") {
      addBullet();
    }
  };
  spawnEnemy(enemiesCount);
  gameLoopInterval = setInterval(gameLoop, 50);
  keysInterval = setInterval(moveHero, 100);
  spawnEnemyInterval = setInterval(spawnEnemy, 2000);
};

updateScore = val => {
  if (score + val < 0) {
    gameOver();

    return;
  }
  score += val;
};

startGame();

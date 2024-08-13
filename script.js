const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOver');
const victoryText = document.getElementById('victory');

let playerPosition = { x: gameArea.clientWidth / 2 - 25, y: gameArea.clientHeight - 100 };
let lives = 5;
let score = 0;
let enemies = [];
let missiles = [];
let enemyFollowDelay = 1000; // 적 비행기가 내 비행기를 쫓아오는 지연 시간 (ms)
let enemyInterval;
let gameInterval;
let isGameOver = false;

// 비행기 위치 업데이트
function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// 하트 모양으로 목숨 표시
function updateLivesDisplay() {
    livesDisplay.innerHTML = '❤️'.repeat(lives);
}

// 점수 업데이트
function updateScoreDisplay() {
    scoreDisplay.innerText = `Score: ${score}`;
}

// 적 비행기 생성
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
    gameArea.appendChild(enemy);
    enemies.push(enemy);
    setTimeout(() => followPlayer(enemy), enemyFollowDelay);
}

// 적 비행기가 내 비행기를 쫓아오게
function followPlayer(enemy) {
    if (isGameOver) return;
    const followInterval = setInterval(() => {
        const enemyX = parseInt(enemy.style.left);
        if (enemyX < playerPosition.x) {
            enemy.style.left = `${enemyX + 5}px`;
        } else if (enemyX > playerPosition.x) {
            enemy.style.left = `${enemyX - 5}px`;
        }
    }, 50);
    enemy.followInterval = followInterval;
}

// 미사일 발사
function shootMissile() {
    const missile = document.createElement('div');
    missile.classList.add('missile');
    missile.style.left = `${playerPosition.x + 22.5}px`;
    missile.style.top = `${playerPosition.y}px`;
    gameArea.appendChild(missile);
    missiles.push(missile);
}

// 충돌 감지
function checkCollision() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const enemyRect = enemy.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // 적 비행기와 플레이어 비행기 충돌 체크
        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {
            lives--;
            updateLivesDisplay();
            gameArea.removeChild(enemy);
            enemies.splice(i, 1);
            clearInterval(enemy.followInterval);
            i--;
            if (lives <= 0) {
                endGame();
            }
        }
    }

    for (let i = 0; i < missiles.length; i++) {
        const missile = missiles[i];
        const missileRect = missile.getBoundingClientRect();

        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            const enemyRect = enemy.getBoundingClientRect();

            // 미사일과 적 비행기 충돌 체크
            if (
                missileRect.left < enemyRect.right &&
                missileRect.right > enemyRect.left &&
                missileRect.top < enemyRect.bottom &&
                missileRect.bottom > enemyRect.top
            ) {
                score++;
                updateScoreDisplay();
                gameArea.removeChild(enemy);
                gameArea.removeChild(missile);
                enemies.splice(j, 1);
                missiles.splice(i, 1);
                i--;
                if (score >= 10) {
                    victory();
                }
                break;
            }
        }
    }
}

// 게임 종료
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    gameOverText.style.display = 'block';
}

// 승리 시 처리
function victory() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    victoryText.style.display = 'block';
}

// 게임 루프
function gameLoop() {
    // 미사일 이동 및 화면 밖으로 나간 미사일 제거
    for (let i = 0; i < missiles.length; i++) {
        const missile = missiles[i];
        missile.style.top = `${parseInt(missile.style.top) - 5}px`;
        if (parseInt(missile.style.top) < 0) {
            gameArea.removeChild(missile);
            missiles.splice(i, 1);
            i--;
        }
    }

    // 적 비행기 이동 및 화면 아래로 내려간 적 비행기 제거
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.style.top = `${parseInt(enemy.style.top) + 2}px`;
        if (parseInt(enemy.style.top) > gameArea.clientHeight) {
            gameArea.removeChild(enemy);
            enemies.splice(i, 1);
            i--;
        }
    }

    checkCollision();
}

// 키 입력 처리
document.addEventListener('keydown', function(event) {
    if (isGameOver) return;

    switch (event.key) {
        case 'ArrowLeft':
            if (playerPosition.x > 0) playerPosition.x -= 10;
            break;
        case 'ArrowRight':
            if (playerPosition.x < gameArea.clientWidth - player.clientWidth) playerPosition.x += 10;
            break;
        case 'ArrowUp':
            if (playerPosition.y > 0) playerPosition.y -= 10;
            break;
        case 'ArrowDown':
            if (playerPosition.y < gameArea.clientHeight - player.clientHeight) playerPosition.y += 10;
            break;
        case ' ':
            shootMissile();
            break;
    }
    updatePlayerPosition();
});

// 게임 시작
function startGame() {
    updatePlayerPosition();
    updateLivesDisplay();
    updateScoreDisplay();
    enemyInterval = setInterval(createEnemy, 2000); // 2초마다 적 비행기 생성
    gameInterval = setInterval(gameLoop, 20); // 20ms마다 게임 루프 실행
}

startGame();

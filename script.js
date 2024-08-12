let player = document.getElementById('player');
let gameArea = document.getElementById('gameArea');
let gameOverText = document.getElementById('gameOver');
let livesText = document.getElementById('lives');
let scoreText = document.getElementById('score');
let playerPosition = gameArea.clientWidth / 2 - 25; // 초기 위치
let lives = 5; // 비행기 목숨
let score = 0; // 점수
let enemies = [];
let missiles = [];
let gameInterval;
let enemyInterval;

// 비행기 위치 업데이트 함수
function updatePlayerPosition() {
    player.style.left = `${playerPosition}px`;
}

// 적 비행기 생성 함수
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
    enemy.style.top = '0px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

// 미사일 발사 함수
function shootMissile() {
    const missile = document.createElement('div');
    missile.classList.add('missile');
    missile.style.left = `${playerPosition + 22}px`; // 비행기 중앙에서 발사
    missile.style.bottom = '50px'; // 비행기 위에서 발사
    gameArea.appendChild(missile);
    missiles.push(missile);
}

// 충돌 체크 함수
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
            lives -= 1; // 목숨 감소
            livesText.innerText = `Lives: ${lives}`;
            gameArea.removeChild(enemy); // 적 비행기 제거
            enemies.splice(i, 1); // 배열에서 적 비행기 제거
            i--; // 인덱스 조정
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
                score += 10; // 점수 증가
                scoreText.innerText = `Score: ${score}`;
                gameArea.removeChild(enemy); // 적 비행기 제거
                gameArea.removeChild(missile); // 미사일 제거
                enemies.splice(j, 1); // 배열에서 적 비행기 제거
                missiles.splice(i, 1); // 배열에서 미사일 제거
                i--; // 인덱스 조정
                break; // 한 번의 미사일에 대해 여러 적 비행기를 처리하지 않도록
            }
        }
    }
}

// 게임 종료 함수
function endGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    gameOverText.style.display = 'block'; // 게임 오버 메시지 표시
}

// 게임 루프
function gameLoop() {
    // 적 비행기 위치 업데이트
    for (let enemy of enemies) {
        enemy.style.top = `${parseInt(enemy.style.top) + 2}px`; // 아래로 이동
        if (parseInt(enemy.style.top) > gameArea.clientHeight) {
            endGame(); // 화면 아래로 내려가면 게임 종료
        }
    }
    checkCollision(); // 충돌 체크
}

// 키 입력 처리
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 10; // 왼쪽으로 이동
    } else if (event.key === 'ArrowRight' && playerPosition < gameArea.clientWidth - player.clientWidth) {
        playerPosition += 10; // 오른쪽으로 이동
    } else if (event.key === ' ') {
        shootMissile(); // 스페이스바로 미사일 발사
    }
    updatePlayerPosition(); // 비행기 위치 업데이트
});

// 게임 시작
enemyInterval = setInterval(createEnemy, 2000); // 2초마다 적 비행기 생성
gameInterval = setInterval(gameLoop, 100); // 100ms마다 게임 루프 실행

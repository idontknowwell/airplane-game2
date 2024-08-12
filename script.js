const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const gameOverMessage = document.getElementById('gameOver');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const fireworksContainer = document.getElementById('fireworks');
let playerPosition = gameArea.clientWidth / 2 - player.clientWidth / 2;
let enemyPlanes = [];
let enemySpeed = 1; // 적 비행기의 기본 속도
let missiles = []; // 미사일 배열
let missileSpeed = 5; // 미사일 속도
let lives = 5; // 비행기 목숨
let score = 0; // 점수
let isGameOver = false; // 게임 오버 상태
let isVictory = false; // 승리 상태

// 목숨 표시 함수
function updateLivesDisplay() {
    livesDisplay.innerHTML = ''; // 현재 목숨 표시 초기화
    for (let i = 0; i < lives; i++) {
        livesDisplay.innerHTML += '♥'; // 하트 추가
    }
}

// 점수 표시 함수
function updateScoreDisplay() {
    scoreDisplay.innerHTML = `Score: ${score}`; // 점수 업데이트
}

// 폭죽 효과 함수
function showFireworks(x, y) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${x - 50}px`; // 폭죽 위치 조정
    firework.style.top = `${y - 50}px`; // 폭죽 위치 조정
    fireworksContainer.appendChild(firework);

    // 폭죽 효과가 끝난 후 제거
    setTimeout(() => {
        fireworksContainer.removeChild(firework);
    }, 800);
}

// 적 비행기 생성 함수
function createEnemy() {
    if (isGameOver || isVictory) return; // 게임 오버 또는 승리 상태에서는 적 비행기 생성하지 않음

    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.width = '50px';
    enemy.style.height = '50px';
    enemy.style.backgroundColor = 'red'; // 적 비행기를 빨간색으로 표시
    enemy.style.position = 'absolute';
    enemy.style.top = '0px'; // 적 비행기가 화면 위에서 떨어지도록 설정
    enemy.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px'; // 랜덤한 위치에서 생성
    gameArea.appendChild(enemy);
    enemyPlanes.push(enemy);
}

// 적 비행기 이동 함수
function moveEnemies() {
    for (let i = 0; i < enemyPlanes.length; i++) {
        const enemy = enemyPlanes[i];
        const enemyTop = parseInt(enemy.style.top);
        const enemyLeft = parseInt(enemy.style.left);
        const playerLeft = playerPosition + 25; // 플레이어 비행기 중앙 위치

        // 적 비행기가 플레이어 비행기를 따라가도록 좌우 이동
        if (enemyLeft < playerLeft) {
            enemy.style.left = (enemyLeft + enemySpeed) + 'px'; // 플레이어 비행기를 향해 오른쪽으로 이동
        } else if (enemyLeft > playerLeft) {
            enemy.style.left = (enemyLeft - enemySpeed) + 'px'; // 플레이어 비행기를 향해 왼쪽으로 이동
        }

        enemy.style.top = (enemyTop + enemySpeed) + 'px'; // 적 비행기 아래로 이동

        // 화면 아래로 나가면 제거
        if (enemyTop > gameArea.clientHeight) {
            gameArea.removeChild(enemy);
            enemyPlanes.splice(i, 1);
            i--; // 인덱스 조정
        }
    }

    // 적 비행기가 점점 더 빨리 내려오도록 설정
    if (enemySpeed < 10) { // 최대 속도 설정
        enemySpeed += 0.001; // 점진적으로 속도 증가
    }
}

// 미사일 생성 함수
function shootMissile() {
    const missile = document.createElement('div');
    missile.className = 'missile';
    missile.style.left = `${playerPosition + 22.5}px`; // 미사일이 비행기 중앙에서 발사
    missile.style.bottom = '60px'; // 비행기 위에 위치
    gameArea.appendChild(missile);
    missiles.push(missile);
}

// 미사일 이동 함수
function moveMissiles() {
    for (let i = 0; i < missiles.length; i++) {
        const missile = missiles[i];
        const missileBottom = parseInt(missile.style.bottom);
        missile.style.bottom = (missileBottom + missileSpeed) + 'px'; // 미사일 위로 이동

        // 미사일이 화면을 벗어나면 제거
        if (missileBottom > gameArea.clientHeight) {
            gameArea.removeChild(missile);
            missiles.splice(i, 1);
            i--; // 인덱스 조정
        }
    }
}

// 적 비행기와 미사일 충돌 검사 함수
function checkCollisions() {
    for (let i = missiles.length - 1; i >= 0; i--) {
        const missile = missiles[i];
        const missileRect = missile.getBoundingClientRect();

        for (let j = enemyPlanes.length - 1; j >= 0; j--) {
            const enemy = enemyPlanes[j];
            const enemyRect = enemy.getBoundingClientRect();

            // 충돌 검사
            if (
                missileRect.left < enemyRect.right &&
                missileRect.right > enemyRect.left &&
                missileRect.top < enemyRect.bottom &&
                missileRect.bottom > enemyRect.top
            ) {
                // 적 비행기 제거
                gameArea.removeChild(enemy);
                enemyPlanes.splice(j, 1);

                // 미사일 제거
                gameArea.removeChild(missile);
                missiles.splice(i, 1);

                // 점수 추가
                score += 10; // 10점 추가
                updateScoreDisplay(); // 점수 표시 업데이트

                // 점수가 50점이 되면 폭죽 효과 표시
                if (score === 50) {
                    showFireworks(enemyRect.left + 25, enemyRect.top + 25); // 폭죽 효과 위치
                }

                // 점수가 100점이 되면 승리 메시지 표시
                if (score === 100) {
                    isVictory = true; // 승리 상태 설정
                    gameOverMessage.innerHTML = 'VICTORY'; // 승리 메시지 설정
                    gameOverMessage.style.display = 'block'; // 메시지 표시
                    clearInterval(enemyInterval); // 적 비행기 생성 중단
                    return; // 충돌 검사 종료
                }

                break; // 충돌 후 외부 루프에서 나가기
            }
        }
    }

    // 비행기와 적 비행기 충돌 검사
    for (let i = enemyPlanes.length - 1; i >= 0; i--) {
        const enemy = enemyPlanes[i];
        const enemyRect = enemy.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // 충돌 검사
        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {
            // 목숨 감소
            lives--;
            gameArea.removeChild(enemy);
            enemyPlanes.splice(i, 1);

            // 목숨이 다 사라지면 게임 종료
            if (lives <= 0) {
                isGameOver = true;
                clearInterval(enemyInterval); // 적 비행기 생성 중단
                gameOverMessage.style.display = 'block';
                return;
            }
            updateLivesDisplay(); // 목숨 표시 업데이트
        }
    }
}

// 게임 루프 함수
function gameLoop() {
    if (!isGameOver && !isVictory) {
        moveEnemies();
        moveMissiles();
        checkCollisions();
        requestAnimationFrame(gameLoop); // 애니메이션 프레임 요청
    }
}

// 키 입력 처리
document.addEventListener('keydown', function(event) {
    if (isGameOver || isVictory) return; // 게임 오버 또는 승리 상태에서는 키 입력 무시

    if (event.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 10;
    } else if (event.key === 'ArrowRight' && playerPosition < gameArea.clientWidth - player.clientWidth) {
        playerPosition += 10;
    } else if (event.key === ' ') { // 스페이스바로 미사일 발사
        shootMissile();
    }
    player.style.left = `${playerPosition}px`;
});

// 적 비행기 생성 간격 설정
const enemyInterval = setInterval(createEnemy, 1000); // 1초마다 적 비행기 생성

// 게임 루프 시작
updateLivesDisplay(); // 초기 목숨 표시 업데이트
updateScoreDisplay(); // 초기 점수 표시 업데이트
gameLoop();

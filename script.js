const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
let playerPosition = gameArea.clientWidth / 2 - player.clientWidth / 2;
let enemyPlanes = [];
let enemySpeed = 2; // 적 비행기의 속도
let missiles = []; // 미사일 배열
let missileSpeed = 5; // 미사일 속도

// 적 비행기 생성 함수
function createEnemy() {
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
        enemy.style.top = (enemyTop + enemySpeed) + 'px'; // 적 비행기 아래로 이동

        // 화면 아래로 나가면 제거
        if (enemyTop > gameArea.clientHeight) {
            gameArea.removeChild(enemy);
            enemyPlanes.splice(i, 1);
            i--; // 인덱스 조정
        }
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
                break; // 충돌 후 외부 루프에서 나가기
            }
        }
    }
}

// 게임 루프 함수
function gameLoop() {
    moveEnemies();
    moveMissiles();
    checkCollisions();
    requestAnimationFrame(gameLoop); // 애니메이션 프레임 요청
}

// 키 입력 처리
document.addEventListener('keydown', function(event) {
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
setInterval(createEnemy, 1000); // 1초마다 적 비행기 생성

// 게임 루프 시작
gameLoop();

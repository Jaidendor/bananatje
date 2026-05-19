let gameActive = false;
let score = 0;
let gameInterval;
let obstacleTimeout;
let gameSpeed = 10; // Pixels to move per frame
let obstacleFrequency = 2000; // Base interval for obstacles in ms

function startMinigame() {
    if (gameActive) return;

    // Create game elements if they don't exist
    if (!document.getElementById('game-container')) {
        const overlay = document.createElement('div');
        overlay.id = 'game-overlay';
        document.body.appendChild(overlay);

        const container = document.createElement('div');
        container.id = 'game-container';
        container.innerHTML = `
            <div id="game-msg">Press Space to Jump. Close with ESC.</div>
            <div id="score">0</div>
            <div id="dino" data-jumping="false">🍌</div>
        `;
        document.body.appendChild(container);
    }

    const overlay = document.getElementById('game-overlay');
    const container = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    const dino = document.getElementById('dino');

    overlay.style.display = 'block';
    container.style.display = 'block';
    gameActive = true;
    score = 0;
    gameSpeed = 10;
    obstacleFrequency = 1500; // Increased base frequency
    scoreElement.innerText = score;

    // Reset dino position
    dino.style.bottom = '0px';

    document.addEventListener('keydown', handleGameInput);
    
    gameLoop();
}

function handleGameInput(e) {
    if (e.code === 'Space') {
        jump();
    } else if (e.code === 'Escape') {
        stopGame();
    }
}

function jump() {
    const dino = document.getElementById('dino');
    if (dino.dataset.jumping === 'true') return;
    
    dino.dataset.jumping = 'true';
    dino.animate([
        { bottom: '0px' },
        { bottom: '100px' },
        { bottom: '0px' }
    ], {
        duration: 500,
        easing: 'ease-out'
    }).onfinish = () => {
        dino.dataset.jumping = 'false';
    };
}

function gameLoop() {
    if (!gameActive) return;

    const container = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    
    // Create obstacle
    createObstacle();

    gameInterval = setInterval(() => {
        score += 10;
        scoreElement.innerText = score;

        // Increase speed slowly
        if (score % 200 === 0) {
            gameSpeed += 0.5;
            obstacleFrequency = Math.max(500, obstacleFrequency - 50);
        }

        if (score >= 4540) {
            stopGame();
            window.location.href = 'secret_page.html';
        }

        checkCollision();
    }, 100);
}

function createObstacle() {
    if (!gameActive) return;
    
    const container = document.getElementById('game-container');
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    container.appendChild(obstacle);

    let position = 600;
    const moveInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(moveInterval);
            obstacle.remove();
            return;
        }

        position -= gameSpeed;
        obstacle.style.left = position + 'px';

        if (position < -20) {
            clearInterval(moveInterval);
            obstacle.remove();
        }
    }, 20);

    const nextObstacleTime = Math.random() * obstacleFrequency + 500;
    obstacleTimeout = setTimeout(createObstacle, nextObstacleTime);
}

function checkCollision() {
    const dino = document.getElementById('dino');
    const obstacles = document.querySelectorAll('.obstacle');
    
    const dinoRect = dino.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        // Shrink collision box slightly for better feel with emoji
        const padding = 5;
        if (
            dinoRect.left + padding < obstacleRect.right &&
            dinoRect.right - padding > obstacleRect.left &&
            dinoRect.top + padding < obstacleRect.bottom &&
            dinoRect.bottom - padding > obstacleRect.top
        ) {
            alert('Game Over! Your score: ' + score);
            stopGame();
        }
    });
}

function stopGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearTimeout(obstacleTimeout);
    document.removeEventListener('keydown', handleGameInput);
    
    const overlay = document.getElementById('game-overlay');
    const container = document.getElementById('game-container');
    if (overlay) overlay.style.display = 'none';
    if (container) {
        container.style.display = 'none';
        // Remove existing obstacles
        document.querySelectorAll('.obstacle').forEach(obs => obs.remove());
    }
}

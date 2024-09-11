import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import dinoImage from './dino.png'; // Загрузите ваше изображение динозавра
import ramImage from './ram.png';  // Загрузите ваше изображение динозавра

function App() {
    const [isJumping, setIsJumping] = useState(false);
    const [position, setPosition] = useState(0); // Позиция динозаврика по оси Y
    const [obstaclePosition, setObstaclePosition] = useState(1000); // Позиция препятствия по оси X
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dino = new Image();
        const ram= new Image();
        dino.src = dinoImage; // Загружаем изображение динозавра
        ram.src = ramImage;

        dino.onload = () => {
            ram.onload = () => {
                const draw = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Рисуем динозавра
                    ctx.drawImage(dino, 50, 115 - position, 100, 100);

                    // Рисуем препятствие
                    ctx.drawImage(ram, obstaclePosition, 135, 70, 70);

                    // Проверка на столкновение
                    if (obstaclePosition < 100 && obstaclePosition > 50 && position < 50) {
                        setIsGameOver(true);
                    }
                };

                draw();
            };
        };

    }, [position, obstaclePosition]);

    useEffect(() => {
        if (!isGameOver) {
            const obstacleTimer = setInterval(() => {
                setObstaclePosition((prev) => (prev > -50 ? prev - 5 : 1000));
                setScore((prev) => prev + 1);
            }, 20);

            return () => clearInterval(obstacleTimer);
        }
    }, [isGameOver]);

    const handleJump = () => {
        console.log('Jump');
        if (!isJumping && !isGameOver) {
            setIsJumping(true);
            let upInterval = setInterval(() => {
                setPosition((prev) => {
                    if (prev >= 100) {
                        clearInterval(upInterval);
                        let downInterval = setInterval(() => {
                            setPosition((prev) => {
                                if (prev <= 0) {
                                    clearInterval(downInterval);
                                    setIsJumping(false);
                                    return 0;
                                }
                                return prev - 5;
                            });
                        }, 20);
                        return prev;
                    }
                    return prev + 5;
                });
            }, 20);
        }
    };

    const handleKeyDown = (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            handleJump();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const restartGame = () => {
        setIsGameOver(false);
        setObstaclePosition(1000);
        setScore(0);
        setPosition(0);
    };

    return (
        <div className="App">
            <h1 className="sa">Dino/Ram</h1>
            <canvas ref={canvasRef} width="1000" height="200" />
            {isGameOver ? (
                <div>
                    <h2 className="sa">Game Over! Score: {score}</h2>
                    <button className="na" onClick={restartGame}>Restart </button>
                </div>
            ) : (
                <h2>Score: {score}</h2>
            )}
        </div>
    );
}

export default App;

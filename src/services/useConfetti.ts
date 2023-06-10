import confetti from 'canvas-confetti';

export const useConfetti = () => {
    const confettiEffect = () => {
        // Top left corner
        confetti({
            particleCount: 250,
            angle: 0,
            spread: 180,
            origin: { x: 0, y: 0 },
        });

        // Top right corner
        confetti({
            particleCount: 250,
            angle: 180,
            spread: 180,
            origin: { x: 1, y: 0 },
        });
    }
    return confettiEffect;
}
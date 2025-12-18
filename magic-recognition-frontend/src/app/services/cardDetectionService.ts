import { CardDetector } from "./detection/CardDetector";

interface VideoRef {
    current: HTMLVideoElement | null;
}

interface CanvasRef {
    current: HTMLCanvasElement | null;
}

const detector = new CardDetector();

export const detectCard = async (videoRef: VideoRef, canvasRef: CanvasRef, canvasRef2: CanvasRef) => {
    if (!videoRef.current || !canvasRef.current || !canvasRef2.current) return;

    await detector.detect(videoRef.current, canvasRef.current, canvasRef2.current);
};

'use client'
import { useRef, useState, useEffect } from "react";
import { loadOpenCV } from "../utils/loadOpenCV";
import { detectCard } from "../services/cardDetectionService";

export default function WebcamCapture() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const [bestMatch, setBestMatch] = useState(null);
    const [cvReady, setCvReady] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Start Webcam
    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };
        loadOpenCV().then((cv) => {
            console.log("OpenCV.js Loaded");
            setCvReady(true);
        }).catch(err => console.error("Failed to load OpenCV", err));

        startWebcam();
    }, []);

    // Detect Card on Button Click
    const handleCapture = async () => {
        if (cvReady && !isProcessing) {
            setIsProcessing(true);
            const match = await detectCard(videoRef, canvasRef, canvasRef2);
            //setBestMatch(match);
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold">MTG Card Detection</h2>

            {/* Video Stream */}
            <div className="position relative" >
                <video ref={videoRef} autoPlay playsInline className="border rounded-md transform scale-x-[-1]" />

                {/* Canvas for Drawing the Detection Box */}
            </div>
            <canvas ref={canvasRef} className="absolute top-0 left-0 transform scale-x-[-1]" />
            <canvas ref={canvasRef2} className="absolute top-100 left-0 transform scale-x-[-1]" />

            {/* Capture Button */}
            <button onClick={handleCapture} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Capture
            </button>

            {/* Status Message */}
            <p className="text-sm text-gray-500">
                {cvReady ? "Detecting card..." : "Loading OpenCV..."}
                {bestMatch && <p className="text-lg font-bold">Best Match: {bestMatch}</p>}
            </p>
        </div>
    );
}
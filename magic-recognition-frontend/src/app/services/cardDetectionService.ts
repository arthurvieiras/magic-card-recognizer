import { loadOpenCV } from "../utils/loadOpenCV";

interface VideoRef {
    current: HTMLVideoElement | null;
}

interface CanvasRef {
    current: HTMLCanvasElement | null;
}

type Point = [number, number];

export const detectCard = async (videoRef: VideoRef, canvasRef: CanvasRef, canvasRef2: CanvasRef) => {
    const cv = await loadOpenCV();
    if (!videoRef.current || !canvasRef.current || !canvasRef2.current) return;

    const video: HTMLVideoElement = videoRef.current;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const canvas2: HTMLCanvasElement = canvasRef2.current;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    const ctx2: CanvasRenderingContext2D | null = canvas2.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Capture current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const src: any = cv.imread(canvas);
    const gray: any = new cv.Mat();
    const blur: any = new cv.Mat();
    const edges: any = new cv.Mat();
    const contours: any = new cv.MatVector();
    const hierarchy: any = new cv.Mat();

    // Adjust brightness and contrast
    const alpha: number = 1.2; // Contrast control (1.0-3.0)
    const beta: number = 50; // Brightness control (0-100)
    cv.convertScaleAbs(src, src, alpha, beta);
    // Convert to grayscale and detect edges
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    // add thresholding to make it more robust
    cv.GaussianBlur(gray, blur, new cv.Size(3, 3), 0, 0, cv.BORDER_DEFAULT);
    cv.Canny(blur, edges, 40, 120);
    // Find contours
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    // // Draw contours on canvas
    cv.drawContours(src, contours, -1, new cv.Scalar(255, 255, 0), 2);
    //cv.drawContours(edges, contours, -1, new cv.Scalar(255, 255, 0), 3);
    cv.imshow(canvas, src);
    cv.imshow(canvas2, edges);
    let largestArea: number = 0;
    let biggestContour: any = null;

    // Loop through contours to find the biggest quadrilateral
    for (let i = 0; i < contours.size(); i++) {
        const contour: any = contours.get(i);
        const peri: number = cv.arcLength(contour, true);
        const approx: any = new cv.Mat();
        cv.approxPolyDP(contour, approx, 0.1 * peri, true);

        if (approx && approx.rows === 4) {
            const area: number = cv.contourArea(approx);
            if (area > largestArea) {
                largestArea = area;
                biggestContour = approx;
                const sortedCorners: Point[] = sortCorners(biggestContour);
                drawRectangle(ctx, sortedCorners);
            }
        }
    }

    // Cleanup
    src.delete();
    gray.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();
};

// Draws a rectangle around the detected card
const drawRectangle = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length !== 4) return;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.stroke();
};

// Sorts corners of the card (Top-Left, Top-Right, Bottom-Right, Bottom-Left)
const sortCorners = (contour: any): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i < contour.rows; i++) {
        const pt = contour.data32S.slice(i * 2, i * 2 + 2);
        points.push(pt);
    }

    // Sort based on Y, then X
    points.sort((a, b) => a[1] - b[1]); // Sort by Y first
    let [top1, top2] = points.slice(0, 2).sort((a, b) => a[0] - b[0]);
    let [bottom1, bottom2] = points.slice(2, 4).sort((a, b) => a[0] - b[0]);

    return [top1, top2, bottom2, bottom1]; // [Top-Left, Top-Right, Bottom-Right, Bottom-Left]
};
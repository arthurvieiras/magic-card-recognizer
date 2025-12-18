import { OpenCVLoader } from "../core/OpenCVLoader";
import { ImageProcessor } from "../processing/ImageProcessor";
import { ContourAnalyzer } from "../processing/ContourAnalyzer";
import { CanvasVisualizer } from "../visualization/CanvasVisualizer";

export class CardDetector {
    private cv: any = null;
    private imageProcessor: ImageProcessor | null = null;
    private contourAnalyzer: ContourAnalyzer | null = null;
    private visualizer: CanvasVisualizer;

    constructor() {
        this.visualizer = new CanvasVisualizer();
    }

    private async init(): Promise<void> {
        if (!this.cv) {
            this.cv = await OpenCVLoader.getInstance().load();
            this.imageProcessor = new ImageProcessor(this.cv);
            this.contourAnalyzer = new ContourAnalyzer(this.cv);
        }
    }

    public async detect(
        video: HTMLVideoElement,
        outputCanvas: HTMLCanvasElement,
        debugCanvas: HTMLCanvasElement
    ): Promise<void> {
        await this.init();
        if (!this.cv || !this.imageProcessor || !this.contourAnalyzer) return;

        const ctx = outputCanvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        outputCanvas.width = video.videoWidth;
        outputCanvas.height = video.videoHeight;
        debugCanvas.width = video.videoWidth;
        debugCanvas.height = video.videoHeight;

        // Capture frame
        ctx.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height);

        let src;
        try {
            src = this.cv.imread(outputCanvas);
        } catch (e) {
            console.error("Failed to read image from canvas", e);
            return;
        }

        const { gray, blur, edges } = this.imageProcessor.process(src);

        // Find contours
        const contours = new this.cv.MatVector();
        const hierarchy = new this.cv.Mat();
        this.cv.findContours(edges, contours, hierarchy, this.cv.RETR_EXTERNAL, this.cv.CHAIN_APPROX_SIMPLE);

        // Visaulization
        // Draw contours on source image (not edges)
        this.visualizer.drawContours(this.cv, src, contours, outputCanvas);
        // Draw edges on debug canvas
        this.visualizer.drawEdges(this.cv, edges, debugCanvas);

        // Find largest quadrilateral
        const biggestContour = this.contourAnalyzer.findLargestQuadrilateral(contours);

        if (biggestContour) {
            const sortedCorners = this.contourAnalyzer.sortCorners(biggestContour);
            this.visualizer.drawRectangle(ctx, sortedCorners);
            biggestContour.delete(); // Cleanup the result
        }

        // Cleanup
        src.delete();
        gray.delete();
        blur.delete();
        edges.delete();
        contours.delete();
        hierarchy.delete();
    }
}

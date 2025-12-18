export class ImageProcessor {
    constructor(private cv: any) { }

    public process(src: any): { gray: any; blur: any; edges: any } {
        const gray = new this.cv.Mat();
        const blur = new this.cv.Mat();
        const edges = new this.cv.Mat();

        // Adjust brightness and contrast
        const alpha = 1.2; // Contrast control (1.0-3.0)
        const beta = 50; // Brightness control (0-100)
        this.cv.convertScaleAbs(src, src, alpha, beta);

        // Convert to grayscale and detect edges
        this.cv.cvtColor(src, gray, this.cv.COLOR_RGBA2GRAY, 0);

        // Add thresholding to make it more robust
        this.cv.GaussianBlur(gray, blur, new this.cv.Size(3, 3), 0, 0, this.cv.BORDER_DEFAULT);
        this.cv.Canny(blur, edges, 40, 120);

        return { gray, blur, edges };
    }
}

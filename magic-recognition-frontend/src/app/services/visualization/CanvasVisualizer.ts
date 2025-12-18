type Point = [number, number];

export class CanvasVisualizer {
    constructor() { }

    public drawContours(cv: any, src: any, contours: any, canvas: HTMLCanvasElement): void {
        cv.drawContours(src, contours, -1, new cv.Scalar(255, 255, 0), 2);
        cv.imshow(canvas, src);
    }

    public drawEdges(cv: any, edges: any, canvas: HTMLCanvasElement): void {
        cv.imshow(canvas, edges);
    }

    public drawRectangle(ctx: CanvasRenderingContext2D, points: Point[]): void {
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
    }
}

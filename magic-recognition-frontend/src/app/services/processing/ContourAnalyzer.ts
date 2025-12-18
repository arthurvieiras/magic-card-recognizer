type Point = [number, number];

export class ContourAnalyzer {
    constructor(private cv: any) { }

    public findLargestQuadrilateral(contours: any): any | null {
        let largestArea = 0;
        let biggestContour = null;

        for (let i = 0; i < contours.size(); i++) {
            const contour = contours.get(i);
            const peri = this.cv.arcLength(contour, true);
            const approx = new this.cv.Mat();
            this.cv.approxPolyDP(contour, approx, 0.1 * peri, true);

            if (approx && approx.rows === 4) {
                const area = this.cv.contourArea(approx);
                if (area > largestArea) {
                    if (biggestContour) {
                        biggestContour.delete();
                    }
                    largestArea = area;
                    biggestContour = approx;
                } else {
                    approx.delete();
                }
            } else {
                approx.delete();
            }
        }
        return biggestContour;
    }

    public sortCorners(contour: any): Point[] {
        const points: Point[] = [];
        for (let i = 0; i < contour.rows; i++) {
            // contour.data32S contains the points
            const pt = contour.data32S.slice(i * 2, i * 2 + 2);
            points.push([pt[0], pt[1]]);
        }

        // Sort based on Y, then X
        points.sort((a, b) => a[1] - b[1]); // Sort by Y first

        // Take top 2 (lowest Y) and sort by X
        const [top1, top2] = points.slice(0, 2).sort((a, b) => a[0] - b[0]);
        // Take bottom 2 (highest Y) and sort by X
        const [bottom1, bottom2] = points.slice(2, 4).sort((a, b) => a[0] - b[0]);

        return [top1, top2, bottom2, bottom1];
    }
}

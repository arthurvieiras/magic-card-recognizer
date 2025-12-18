export class OpenCVLoader {
    private static instance: OpenCVLoader;
    private cvPromise: Promise<any> | null = null;

    private constructor() {}

    public static getInstance(): OpenCVLoader {
        if (!OpenCVLoader.instance) {
            OpenCVLoader.instance = new OpenCVLoader();
        }
        return OpenCVLoader.instance;
    }

    public load(): Promise<any> {
        if (this.cvPromise) {
            return this.cvPromise;
        }

        this.cvPromise = new Promise((resolve, reject) => {
            if (typeof window === "undefined") {
                reject("OpenCV can only be loaded in the browser");
                return;
            }

            if ((window as any).cv) {
                (window as any).cv.then((cv: any) => {
                    resolve(cv);
                }).catch((err: any) => {
                    reject("Error loading OpenCV");
                });
                return;
            }

            const script = document.createElement("script");
            script.src = "/opencv/opencv.js";
            script.async = true;
            script.onload = () => {
                if ((window as any).cv) {
                    (window as any).cv.then((cv: any) => {
                        resolve(cv);
                    });
                } else {
                    reject("OpenCV did not initialize properly.");
                }
            };
            script.onerror = () => reject("Failed to load OpenCV.js");
            document.body.appendChild(script);
        });

        return this.cvPromise;
    }
}

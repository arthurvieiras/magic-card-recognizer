export const loadOpenCV = () => {
    return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
            reject("OpenCV can only be loaded in the browser");
            return;
        }

        if (window.cv) {
            window.cv.then((cv) => {
                resolve(cv);
            }).catch((err) => {
                reject("Error loading OpenCV");
            });
            return;
        }

        const script = document.createElement("script");
        script.src = "/opencv/opencv.js";
        script.async = true;
        script.onload = () => {
            if (window.cv) {
                window.cv.then((cv) => {
                    resolve(cv);
                });
            } else {
                reject("OpenCV did not initialize properly.");
            }
        };
        script.onerror = () => reject("Failed to load OpenCV.js");
        document.body.appendChild(script);
    });
};
import { chromium } from 'playwright';

class CameraKitBridge {
    #targetUrl;
    #logHandler;
    #browser;
    #page;

    constructor({ targetUrl = 'https://localhost:8080/?websocketPort=3000', logHandler = console.log } = {}) {
        this.#targetUrl = targetUrl;
        this.#logHandler = logHandler;
        this.#browser = null;
        this.#page = null;
    }

    start() {
        if (this.#browser) {
            return Promise.resolve(false);
        }

        return new Promise(async (resolve, reject) => {
            try {
                this.#browser = await chromium.launch({
                    headless: true,
                    bypassCSP: true,
                    ignoreHTTPSErrors: true,
                    args: [
                        // use OpenGL for Embedded Systems
                        '--use-gl=egl',
                        // deactivate sandbox for stability
                        '--no-sandbox',
                        // deactivate gpu sandbox for docker stability
                        '--disable-gpu-sandbox',
                        // load insecure websites (flag removed as of chrome 119)
                        '--allow-insecure-localhost',
                        // remove warning log message
                        '--enable-unsafe-swiftshader',
                        // ignore possible ssl errors
                        '--ignore-certificate-errors',
                        // web security needs to be enabled
                        //'--disable-web-security',
                    ],
                });

                this.#page = await this.#browser.newPage();

                if (this.#logHandler) {
                    this.#page.on('console', (msg) => {
                        this.#logHandler(msg.text());
                    });
                }

                await this.#page.goto(this.#targetUrl, { waitUntil: 'domcontentloaded' });

                return resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    close() {
        if (!this.#browser) {
            return Promise.resolve(false);
        }

        return new Promise(async (resolve, reject) => {
            try {
                await this.#page.close();
                await this.#browser.close();

                this.#page = null;
                this.#browser = null;

                return resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export { CameraKitBridge };
export default CameraKitBridge;

import { createServer } from 'http-server';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

class HttpServer {
    static #CERTIFICATE_BASE64 = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tDQpNSUlGWlRDQ0EwMmdBd0lCQWdJVVBuSlNhbnFta3orU29BK1plTzJvS3hUYWt1Y3dEUVlKS29aSWh2Y05BUUVMDQpCUUF3UWpFTE1Ba0dBMVVFQmhNQ1EwRXhDekFKQmdOVkJBZ01BbEZETVJJd0VBWURWUVFLREFsVGJtRndJRWx1DQpZeTR4RWpBUUJnTlZCQU1NQ1d4dlkyRnNhRzl6ZERBZUZ3MHlOVEF6TWpnd01EQTFOVE5hRncwek5UQXpNall3DQpNREExTlROYU1FSXhDekFKQmdOVkJBWVRBa05CTVFzd0NRWURWUVFJREFKUlF6RVNNQkFHQTFVRUNnd0pVMjVoDQpjQ0JKYm1NdU1SSXdFQVlEVlFRRERBbHNiMk5oYkdodmMzUXdnZ0lpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElDDQpEd0F3Z2dJS0FvSUNBUUMwTGxYTDJDb1lDaDI4S21wMGZYZHNaMElkKzYwbHEzc0VsYkhXMzdhclZ6aFcydCtuDQpuNnlBNE41N1lmUncxWStZcXEyWnVKN0x0WjdGYVBaTGhrSkR6WFpkNFBzbHdhdkcxeDRRZVVmTWFaTG5pdFVkDQp0U1NmU093U3pNQ3hQWkNJa1RPaTluRS9kY1U0UGEvMHZwV3hObzVUclJad21zNmprbjhQK0dLSktOV0xFVmhLDQpIWjVmSTMyQXJuenZ5NFNSM3I5NHJ0Q1QrL3o1SmFVNUlGQVYydGF2dzYvanN6T1dkVXQ3TzhpUVB6VEZQTWZDDQpnbGlGc0NkOHJSTUZZaktPWTlvbng4d0NLSDFDbUE3N2hId0dZZjV3b0pXd3BVS0RZU2Q4MlB6K1NkdEVsVDJwDQpKRVZib2Nua2xXWk9zWjFtQWNHS0E4bmQ5Mi9HcVFpWWk4NHBqRHlQV0xLWitKakdLVm5QbWdwQkxtSE13cVFPDQpVYWpTS2RFWGpzNzVZZVd1OVJkc3MveWJTRlNRM3lDTk1rOVhST1cvcWRjSm5qdmxINmpsQmxscWp1YmMyWERSDQp5VHM3MHEyQTcxSU9GR2t4MDRQS2Ywa3JGTWl4OUpjSnN2QzArekY3MzA1V1V2R0dRWGFzMThPWW1ZRG1ZMjVCDQpLa2lDZW0yTWhzdWJIaER5TmhocVQySEc2aitwRkxhNG83NVlNSWdpbDlNY2RocG5tVzZyK2NramllVkl2MmIyDQpsWHlKVERqVEFid0FHT092WEZqODRhRU1FRW5LZWgwaWJxZDZNMjd1Y2ZMY01XTGdkS1BLZEFDdUIwbTdOaGowDQp4LzFnaGdZTVk4UXEwTi9BZ3IzQS9sZERCU1dQbWFIZ214N1VWbU5zdFhmREVkMTJFZHhYY1Y5ZlZ3SURBUUFCDQpvMU13VVRBZEJnTlZIUTRFRmdRVXNiRjVsMHVjcGplUDRwSmFmWWNab1lvUHFPZ3dId1lEVlIwakJCZ3dGb0FVDQpzYkY1bDB1Y3BqZVA0cEphZlljWm9Zb1BxT2d3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFOQmdrcWhraUc5dzBCDQpBUXNGQUFPQ0FnRUFPaHZHQ2J4ODEvZTlKbktMQmdrMlIweVlRUmZzWXRRYWlLdFBRRC9kR2dIeG5pZElnMEZ0DQpSdENmc0p0S1Y0anRpbGliSTlNMVZEcGFoVzRGVTNNLytiVWJ3WE1iMTV2TG1FWVJXa3R5VGR6SlhibEZGWWt3DQpDSGZWL1dhYjlod0RRazhDWjI0VEp5c3JCeVVvRlBZa3R5Y2Q3T0ozRDlqdXJ5a3R6ZnVQdk9XVm55ZHRaSEFLDQpXZERQQ2NremN3djJZeFF0NkRpNzNoZVpMcFRheFYyTG8veER1bndwOTZkUnpISGZhVUdIQm1HL2lEd3NWVFZ3DQp6bUlISmRaSFd4c3hIR2w2YVp2NDh2UFp2d2g2aWZuT3FYNkw4QllRcGhLdFhMbk9xZUFESEZCK1lzRm0yQXdyDQptd3liYzFpTFRPVDNvWFNjV240Tm9lV1hXMlk3bCsvTHVSQmZGa24vUG9FdE45ZS9VYTFyaHJwcGExQnhmVGN4DQpnOHpzK0FkbkNKNmFvVVJLMTFGYWR4UzBJUVZLYXJPZW5SMm80LzdnU3FheEJXTmpjM09vWDNWZkNYemYxVUlODQpIM0ZJYVVnblVPU1Z6ckxLbHQvT3pDdjYvRmVkUXVYNFRoS2xCaHhhZUIxNEEyNUMzbTJrdzFBazdaMHM5VmtMDQpDdm5jUXQxanpteDJsZDRCbnEwV1F2MUhUdHFiblc2SkZva203eUF0WmVCQXB3ZElJRjZNdVpQdTM2VVIrSmFRDQpVVWd0aDVRR0RUUGVWMzlBOENBdXpRRnZwd2RhcEFBZkFjSEovanhRZDk5em5Kd0ZxYU5XbHJibGROQlhTQk5VDQova2RWM1VOZGN4UFRzUGUwK0VCaFVCUEhTUlIrakVVSFZ0VnNVcUVMRVU0UXdNN0FuSU5LNy8wPQ0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ0K';
    static #PRIVATE_KEY_BASE64 = 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tDQpNSUlKUWdJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0NTd3dnZ2tvQWdFQUFvSUNBUUMwTGxYTDJDb1lDaDI4DQpLbXAwZlhkc1owSWQrNjBscTNzRWxiSFczN2FyVnpoVzJ0K25uNnlBNE41N1lmUncxWStZcXEyWnVKN0x0WjdGDQphUFpMaGtKRHpYWmQ0UHNsd2F2RzF4NFFlVWZNYVpMbml0VWR0U1NmU093U3pNQ3hQWkNJa1RPaTluRS9kY1U0DQpQYS8wdnBXeE5vNVRyUlp3bXM2amtuOFArR0tKS05XTEVWaEtIWjVmSTMyQXJuenZ5NFNSM3I5NHJ0Q1QrL3o1DQpKYVU1SUZBVjJ0YXZ3Ni9qc3pPV2RVdDdPOGlRUHpURlBNZkNnbGlGc0NkOHJSTUZZaktPWTlvbng4d0NLSDFDDQptQTc3aEh3R1lmNXdvSld3cFVLRFlTZDgyUHorU2R0RWxUMnBKRVZib2Nua2xXWk9zWjFtQWNHS0E4bmQ5Mi9HDQpxUWlZaTg0cGpEeVBXTEtaK0pqR0tWblBtZ3BCTG1ITXdxUU9VYWpTS2RFWGpzNzVZZVd1OVJkc3MveWJTRlNRDQozeUNOTWs5WFJPVy9xZGNKbmp2bEg2amxCbGxxanViYzJYRFJ5VHM3MHEyQTcxSU9GR2t4MDRQS2Ywa3JGTWl4DQo5SmNKc3ZDMCt6RjczMDVXVXZHR1FYYXMxOE9ZbVlEbVkyNUJLa2lDZW0yTWhzdWJIaER5TmhocVQySEc2aitwDQpGTGE0bzc1WU1JZ2lsOU1jZGhwbm1XNnIrY2tqaWVWSXYyYjJsWHlKVERqVEFid0FHT092WEZqODRhRU1FRW5LDQplaDBpYnFkNk0yN3VjZkxjTVdMZ2RLUEtkQUN1QjBtN05oajB4LzFnaGdZTVk4UXEwTi9BZ3IzQS9sZERCU1dQDQptYUhnbXg3VVZtTnN0WGZERWQxMkVkeFhjVjlmVndJREFRQUJBb0lDQUFWTFpibUw3c256YnhJL3VEWGNqVmx1DQpNaHBUbVp3Mm05VUhXVnpXcGpWcEJBTjlxZXJKazZ3cDBlSkZNSVdNUnlBcFpHTFUxVW9GYmlWNFF4eUFRVHc1DQpsTld1d2I3UklDZzVqSjZJc0pKcXZqcEdMRlE3RWdvd3pUY1J2dUh4ZmdaTjdDSndTK1QvM3RzSGh0eWxzdUVpDQp3RU55UlNaMUoxRFZlRmdOdDBib1cwVE1wSVkxNzlQTjJ6L2JkRzEyaEF1K3prVEdrcFVVTEc4MkYwa0pjdUk2DQpJcS9HYmpZRERoMW1aNUh4L3oxSmppN2Zza1YzS1YrRTZuUWdiVGN5dm43emo3cUZOckNaMmtuMXFxeml3a1diDQpsc2tqRW85SXBidzlMK28rdDVodkpTZDFuQ0lvZU1TcEV6OGlEUW54M0hvWTgwUWJ6U2o3U0ptaDUrM0J3ajIvDQpYNXVQKzZodTRlWFZ6YzRYemNvdmxMdmV4SUU2NU9JV0IyMG5heDZ3ODIxWlR2bi9YcnM5VzQrZjJRSVI4RVdyDQpDdUlKaW9oTDFCdndQTVYvMmkyWEYzYzV5QmNZL1ZQOS9iakZkcm5WVHhXQTV0K1pibHhKdjJEU09QVkEyeW1nDQp6bWwxcUNGSVVDdE5qNWh6b0xIc25wZmVuSXJUTGRSR01WMmhGdW9HV0dWMVVzSFIwbTlDRVJEblduaVJwdXBvDQpXZTV4Y0hIWUhaeHN1eWdvVHIrMTBVaXZobjFSdWxpVWFUbXZQVXZPN2xBSzMwMW5xWHFiNlNtSmNaeUZVU0VjDQo0RCtsUHdxKzI2cFBHZVYyTjZrS0c5QUcwWG1hcXNncW9RWGl4aFhPT1NYci80UFdHdCtreGF3bVQ3RUhDdUhXDQpmNFhlZWxQZHNGelVTT0s5ZHkyQkFvSUJBUURZa1JoNkZNREltZDAzZzZjcFpIcVdDaWdtTmJBb1VoelBtSjU2DQpyb0kybjBROTlFdXFpTjVPMDFTN1Jsa0Nvb21YZHRYMFViZTdXVlkydGZWU3kyWDA4WGo0ZGUwT2VRVTg2ZzNzDQpleWZYek96QVVzWmpTcnhCbjZlOWhjRURRZG5QOCtpOHR4TWxzSS9ram9Oei9CWTBhL0c5amUyOWw2RG0rNWRzDQpkZFVtUGdXSU1KTGxGdUNjTEt0aUlVdzA5RFVzQzFUNEgxRHZ6MnluTTV5U0dCSTh2c3N1dml4d2pxQ1VCaFhYDQpDOTZ4bnNBVHZhNUVoWlkzbnU4eEE4bjRHMjdNUnZGQXFZR3VpS0taeWszbHlRLzRnREw2TjdYeTRBVGFjOXlsDQo1MTJmUmxqZGFmclc3TEZHemV3dlBNeUJJQjE1a0lZd0NmOEZJa1RlZ2huMXlPWEJBb0lCQVFEVS9TMFMrVFh2DQpKczZrbVVIY3FCYVAwSWhORWlTSEVwNURwKzNWN2JETlE4elYxUlk3d2ZIcFVEbkJGeVpPalU4NXloQjFpM1RaDQozUG11YjIyWlVVK0ZFZjEzWmhXOXFFTkxSRGppVThiZXRYQ1JFaGFicUJxbk1YNFZrN3NvSmN4YkpIeUpsbDdoDQpibjlLUDQ4Vnp6ZThlU3lHU1JkaXZ4WHk4SVlmMWZlK0xVako1VGNGR3plREY1aTBRSFZkS0U2eVpEemU4KzhKDQpGSW5ZZDJxd2VGZmxVYzBMUXkvN3ppTkxPb0lLbWpYaXpNYTIxYWl0RUlZUzV3UWd6NEFZM1d5OWs1aWVWWGphDQprejR4Vk9CcUo4NFdmSVBJbnUva1NoWSttZllPRG1Gay9VejlDK09YMWNuUkwrbG5BQ1dhTk5XVXhEL1hxeE1BDQpBc0VVK3EySHIzc1hBb0lCQUh5bUh0bDlnbXl6cXRFZUZLUE5jb1ZUZVVKczJtU0t4b3h5UXAxSVBpaGtTU29EDQpwMTJUZzZrSkdCYm1hYXNMbEhnNmJQRS82Nm1JeFFlZWVZSmJFZWNHNldMUXRVNEVPQkNVZ3NrZkpaS2ZINUdlDQoweE1wVyt2RmtnMlNvOEpWTDZIeXVIMk9QaFlPWnZQZFZ5bjE2VzNveDI0Yjk3K05PNDVYTnhPMVNxYkZRZmZlDQpSVjVZYVpWYVhKYVJwY1JBM3kzbm85TmdhdnhzZmhSS3I0NmpEalFxZU5ZQm5hQjNaMU5yb1R4eVY0NFNXbW5DDQpYa0NRUnlMaWRyZldmM1F2amZsRHgrNDQ0aXhyOW5MZ0x5L1lKem9YeDcrZk96bDgyUzVIUzdPdDFJUXRRRTdJDQpoaGtZaVB6QTMzVmM0RFJlSUxqc2gxKzFFVFNLUWV0MEpLOEVIOEVDZ2dFQVAzRCtPUldVTkIwS0ZrczBMQWJCDQpXYXNTdm1vMkNTbkpqSHQ3dzJvZWJMWFNVS3M5Q1NXMjZma2tpdGhiWjdCOXRjZnphUi9WK1lMeHVEeW1sN0Y1DQpqemlSbUR3SEk4djM1M1oxdnl5WEl3VkdkMSs4N2paL1llZkRGNmcrYWpJQUVmSG5TcEJJeUx0Q0hScWJnektLDQo5by9kYkU1Zk1lR2JKeGJ2ekpIT1RvNXNqUDdDaWJuV3FpeWdKcWpBakxRUjVOOG9wbnhnYWdMOUlFWkp1RERRDQpkWlVORDFxKzh6RXVvQnpZV1ZJZjFPT01HUy9CSTNPMWkvSFY3L1Ard3VsSmw1cGNMbVZsTHk0R3Eya053M0VCDQoyUDdUdmpGaFlVMlVIS2Q5ZkNoYWFGdHUwRHozV09Xc1RLd0p5TTFwWmVwdzUvUWcxQnUzK0J2WjZXYlZ3NEhJDQpsd0tDQVFFQWlycWJzSGYrZFZNSGFPOXBlWmhzK2VDd3k3bGVncnlyTHI5b3pkMzNhY3VENGZPbm5CcjBQZ2lzDQplMmRnN3FFazRPMWM3ckJaM3VMYlJkUEpEeGJtUHdxWlNhaG9HdjQ0OVk3V040V3FzRVdzVFVoU2srZFl1YTA5DQpQWVJKSU5yVW9adWRRcmNPbkxyMVlHWDVWSCt4MnQrNWd4Um0waHVzanE4eDlDUGVUMGtOb0RGZElhaWRTMmE2DQpNUnNjd0RYYW80T2d5cDgreWNQcHpGNlg1QjRydDVTK0RUUUZlbXJGcThpQk5zQTd2WUpGWjBXWFk5T0NjOFdSDQpabHk5d2U4dzU4TmtQZHVqRTNXSnVxNU5uUC9rcmJQejErZ0tPTjJwWm5lSXRCL2xleTNuQUo2K1M0dkl0MTlLDQo2VmRKLzFPQi9hdGpXWmFzN0ZUNzhkY2UvOWVZdHc9PQ0KLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ0K';

    #server;
    #port;
    #rootDir;
    #enableHttps
    #keyPath;
    #certPath;

    constructor({ rootDir = dirname(fileURLToPath(import.meta.url)), port = 8080, enableHttps = true } = {}) {
        this.#port = port;
        this.#rootDir = rootDir;
        this.#enableHttps = enableHttps;

        const tempDir = tmpdir();
        this.#keyPath = join(tempDir, `key-${randomBytes(8).toString('hex')}.pem`);
        this.#certPath = join(tempDir, `cert-${randomBytes(8).toString('hex')}.pem`);
    }

    getPort() {
        return this.#port;
    }

    start() {
        if (this.#server) {
            return Promise.resolve(false);
        }

        return new Promise(async (resolve, reject) => {
            try {
                if (this.#enableHttps) {
                    await this.#writeCertificateFiles();

                    this.#server = createServer({
                        root: this.#rootDir,
                        https: {
                            cert: this.#certPath,
                            key: this.#keyPath,
                        }
                    });

                    await unlink(this.#keyPath);
                    await unlink(this.#certPath);
                } else {
                    this.#server = createServer({
                        root: this.#rootDir,
                    });
                }

                this.#server.listen(this.#port, () => {
                    resolve(true);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    close() {
        if (!this.#server) {
            return Promise.resolve(false);
        }

        return new Promise((resolve, reject) => {
            try {
                if (this.#server) {
                    this.#server.close();
                    this.#server = null;
                }

                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    #writeCertificateFiles() {
        return new Promise(async (resolve, reject) => {
            try {
                const cert = this.#decodeBase64(HttpServer.#CERTIFICATE_BASE64);
                const key = this.#decodeBase64(HttpServer.#PRIVATE_KEY_BASE64);

                await writeFile(this.#keyPath, key);
                await writeFile(this.#certPath, cert);

                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }

    #decodeBase64(base64String) {
        return Buffer.from(base64String, 'base64');
    }
}

export { HttpServer };
export default HttpServer;

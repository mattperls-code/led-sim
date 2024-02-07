{

const canvas = document.getElementById("canvas4")
const ctx = canvas.getContext("2d")

const length = 60
const buf = new Array(length).fill({ r: 0, g: 0, b: 0 })

const wavefrontSpeed = 10
const fadeSpeed = 2000
const fadeProbability = 0.15
const wavefrontSeparation = 12
const wavefrontLength = 1
let wavefrontPosition = -1

let hue = 0

const fadeToBlack = (i, dt) => {
    const r = Math.max(buf[i].r - fadeSpeed * dt, 0)
    const g = Math.max(buf[i].g - fadeSpeed * dt, 0)
    const b = Math.max(buf[i].b - fadeSpeed * dt, 0)

    buf[i] = { r, g, b }
}

const meteor = (dt) => {
    for(let i = 0;i<length;i++){
        if(Math.random() < fadeProbability){
            fadeToBlack(i, dt)
        }
    }

    wavefrontPosition += wavefrontSpeed * dt
    if(wavefrontPosition - wavefrontLength >= length){
        wavefrontPosition -= wavefrontSeparation
        hue += 0.1
    }

    let hueOffset = 0
    let nthWavefrontPosition = wavefrontPosition
    while(nthWavefrontPosition >= 0){
        for(let i = 0;i<wavefrontLength;i++){
            if(Math.round(nthWavefrontPosition - i) >= 0) buf[Math.round(nthWavefrontPosition - i)] = hslToRgb((hue + hueOffset) % 1, 1, 0.5)
        }
        hueOffset += 0.1
        nthWavefrontPosition -= wavefrontSeparation
    }
}

// algorithm from stack overflow:
const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;

    return p;
}

const hslToRgb = (h, s, l) => {
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1/3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1/3);
    }
  
    return {
        r: Math.round(255 * r),
        g: Math.round(255 * g),
        b: Math.round(255 * b)
    }
}

let timestamp = Date.now()

const update = () => {
    const now = Date.now()
    const dt = (now - timestamp) / 1000
    timestamp = now

    meteor(dt)

    for(let i = 0;i<length;i++){
        ctx.fillStyle = `rgb(${Math.round(buf[i].r)}, ${Math.round(buf[i].g)}, ${Math.round(buf[i].b)})`
        ctx.fillRect(i * 20, 0, i * 20 + 20, 20)
    }

    requestAnimationFrame(update)
}

update()

}
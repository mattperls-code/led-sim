{

    const canvas = document.getElementById("canvas2")
    const ctx = canvas.getContext("2d")

    const length = 60
    const buf = new Array(length).fill({ r: 0, g: 0, b: 0 })

    const wavefrontSpeed = 10
    const fadeSpeed = 2000
    const fadeProbability = 0.15
    const wavefrontSeparation = 12
    const wavefrontLength = 1
    let wavefrontPosition = -1

    const color1 = { r: 255, g: 0, b: 0 }
    const color2 = { r: 255, g: 200, b: 0 }
    let colorIndex = 0

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
            colorIndex++
        }

        let colorOffset = 0
        let nthWavefrontPosition = wavefrontPosition
        while(nthWavefrontPosition >= 0){
            for(let i = 0;i<wavefrontLength;i++){
                if(Math.round(nthWavefrontPosition - i) >= 0) buf[Math.round(nthWavefrontPosition - i)] = (colorIndex + colorOffset) % 2 == 0 ? color1 : color2
            }
            colorOffset++
            nthWavefrontPosition -= wavefrontSeparation
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
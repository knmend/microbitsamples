let strip: neopixel.Strip = null
let red:number = 0
let green:number = 0
let blue:number = 0
let colorcode:number = 0
let codes: number[][][] = []
let matrix:number[][][] = []
let width:number = 0
let height:number = 0
let size:number = 0
let weights:number[] = []

width = 8
height = 8
for (let i = 0; i < 8; i++) {
    let row:number[][] = []
    for (let j = 0; j < 8; j++) {
        row.push([0,0,0])
    }
    matrix.push(row)
}
for (let i = 0; i < 8; i++) {
    weights.push(Math.exp(-(i * i * 0.3)))
}

function clearMatrix() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 3; k++) {
                matrix[i][j][k] = 0
            }
        }
    }
}

function displayMatrix() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pos:number = (j & 2) == 0 ? i + j * 8: (7 - i) + j * 8
            let pixel:number[] = matrix[j][i]
            strip.setPixelColor(pos, neopixel.rgb(pixel[0], pixel[1], pixel[2]))
        }
    }
}

function distributeStar(edge:number) {
    
}

function plotStar(x:number, y:number, scale:number, color:number[]) {
    let x0:number = 0
    let y0:number = 0
    let x1:number = 0
    let y1:number = 0
    x0 = x / scale - 1
    y0 = y / scale - 1
    x1 = x0 + 2
    y1 = y0 + 2
    x0 = Math.max(0, Math.round(x0))
    y0 = Math.max(0, Math.round(y0))
    x1 = Math.min(7, Math.round(x1))
    y1 = Math.min(7, Math.round(y1))
    for (let x_ = x0; x_ <= x1; x_++) {
        let dx_ = Math.pow(x_ - x / scale, 2)
        for (let y_ = y0; y_ < y1; y_++) {
            let dy_ = Math.pow(y_ - y / scale, 2)
            let dist2_ = dx_ + dy_
            if (dist2_ >= 1) {
                continue
            }
            let index = Math.floor(dist2_ * weights.length)
            for (let i = 0; i < 3; i++) {
                matrix[y_][x_][i] = Math.min(255, matrix[y_][x_][i] + color[i] * weights[index])
            }
        }
    }   
}
function LEDIcon(index: number) {
    for (let i = 0; i <= 64 - 1; i++) {
        let slot = i < 32 ? 2 : 1
        let mask = 1 << (i & 0x1f)
        red = 0
        green = 0
        blue = 0
        for (let j = 0; j <= codes[index].length - 1; j++) {
            colorcode = codes[index][j][0]
            if ((codes[index][j][slot] & mask) != 0) {
                red += colorcode & 0xf00
                green += colorcode & 0x0f0
                blue += colorcode & 0xf
            }
        }
        red = Math.min(255, red >> 4)
        green = Math.min(255, green)
        blue = Math.min(255, blue << 4)
        let pos = (i & 8) == 0 ? i : (i | 7) - (i & 7)
        strip.setPixelColor(pos, neopixel.rgb(red, green, blue))
    }
    strip.show()
}

strip = neopixel.create(DigitalPin.P1, 64, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.setBrightness(64)


basic.forever(function () {
	
})

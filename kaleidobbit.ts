let dy = 0
let dx = 0
let norm = 0
let ay_ = 0
let ax_ = 0
let pixel: number[] = []
let y = 0
let x = 0
let strip: neopixel.Strip = null
let d = 0
let scale = 0
let num_stars = 0
let canvas_height = 0
let canvas_width = 0
let stars:number[][] = []
let weights:number[][] = []
let matrix:number[][][] = []
let pixels_width = 8
let pixels_height = 8
canvas_width = 800
canvas_height = 800
num_stars = 10
scale = 100
let weight_step = 8

function initializeStars() {
    for (let index = 0; index < stars.length; index++) {
        let x = stars[index][0]
        let y = stars[index][1]
        if (x < 0 || x >= canvas_width || y < 0 || y >= canvas_height) {
            x = Math.floor(Math.random() * (canvas_width - 1))
            y = Math.floor(Math.random() * (canvas_height - 1))
            stars[index] = [x, y, 128, 192, 255]
        }
    }
}

// function initializeStars (num: number, scale: number) {
//     let points: number[][] = []
//     for (let index = 0; index < num_stars; index++) {
//         if (Math.random() < 0.5) {
//             x_2 = Math.random() * scale
//             y_2 = Math.random() < 0.5 ? 0 : scale - 1
//         } else {
//             y_2 = Math.random() * scale
//             x_2 = Math.random() < 0.5 ? 0 : scale - 1
//         }
//         points.push([x_2, y_2])
//     }
//     return points
// }
function showStars() {
    clearMatrix()
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i]
        plotStar(matrix, star[0], star[1], [star[2], star[3], star[4]])
    }
    displayMatrix()
}
input.onButtonPressed(Button.A, function () {
    showStars()
    // clearMatrix()
    // for (let index = 0; index < 10; index++) {
    //     x = Math.floor(Math.random() * canvas_width)
    //     y = Math.floor(Math.random() * canvas_height)
    //     plotStar(matrix, x, y, [128,128,255])
    // }
    // displayMatrix()
})
input.onButtonPressed(Button.B, function () {
    moveStars(0.5)
    clearMatrix()
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i]
        plotStar(matrix, star[0], star[1], [star[2], star[3], star[4]])
    }
    displayMatrix()
})
function displayMatrix () {
    for (let p = 0; p <= 7; p++) {
        for (let q = 0; q <= 7; q++) {
            let pos:number = (q & 2) == 0 ? p + q * 8: (7 - p) + q * 8
            pixel = matrix[q][p]
            strip.setPixelColor(pos, neopixel.rgb(pixel[0], pixel[1], pixel[2]))
        }
    }
    strip.show()
}
function clearMatrix () {
    for (let m = 0; m <= 7; m++) {
        for (let n = 0; n <= 7; n++) {
            for (let o = 0; o <= 2; o++) {
                matrix[m][n][o] = 0
            }
        }
    }
}
function moveStars (dt: number) {
    ax_ = input.acceleration(Dimension.X)
    ay_ = input.acceleration(Dimension.Y)
    if (Math.abs(ax_) < 0.001) {
        ax_ = 0.001
    }
    norm = Math.sqrt(ax_ * ax_ + ay_ * ay_)
    dx = ay_ / norm * dt * scale
    dy = ax_ / norm * dt * scale
    for (let i = 0; i < stars.length; i++) {
        let x_ = stars[i][0]
        let y_ = stars[i][1]
        x_ += dx
        y_ += dy
        if (x_ < 0 || x >= canvas_width || y_ < 0 || y_ >= canvas_height) {
            if (Math.random() < 0.5) {
                x_ = Math.floor(Math.random() * canvas_width - 1)
                y_ = Math.random() < 0.5 ? 0 : canvas_height - 1
            } else {
                y_ = Math.floor(Math.random() * canvas_height - 1)
                x_ = Math.random() < 0.5 ? 0 : canvas_width - 1
            }
        }
        stars[i][0] = x_
        stars[i][1] = y_
    }
}


function initialize() {
    // clear matrix
    for (let index = 0; index < pixels_height; index++) {
        let row: number[][] = []
        for (let index = 0; index < pixels_width; index++) {
            row.push([0, 0, 0])
        }
        matrix.push(row)
    }
    // set coefficient constants
    for (let k = 0; k < weight_step; k++) {
        let row_:number[] = []
        for (let l = 0; l < weight_step; l++) {
            d = k * k + l * l
            row_.push(Math.exp(- (d * d / 200)))
        }
        weights.push(row_)
    }
    // set random stars
    stars = []
    for (let index = 0; index < num_stars; index++) {
        stars.push([-1,-1, 0xffffff])
    }
}

function plotStar(matrix:number[][][], x:number, y:number, color:number[]) {
    let x_:number = x / scale
    let y_:number = y / scale
    for (let r = 0; r < 2; r++) {
        let my = Math.floor(y / scale + r)
        if (my < 0 || my >= 8) {
            continue
        }
        let wy = Math.abs(y_ - my) * weight_step
        if (wy >= weight_step) {
            continue
        }
        for (let s = 0; s < 2; s++) {
            let mx = Math.floor(x / scale + s)
            if (mx < 0 || mx >= 8) {
                continue
            }
            let wx = Math.abs(x_ - mx) * weight_step
            if (wx >= weight_step) {
                continue
            }
            let w = weights[Math.floor(wy)][Math.floor(wx)]
            for (let t = 0; t < 3; t++) {
                // let c = matrix[my][mx][k]
                // c += Math.round(color[k] * w)
                matrix[my][mx][t] = Math.min(255, matrix[my][mx][t] + Math.round(color[t] * w))
            }
        }
    }
}
strip = neopixel.create(DigitalPin.P1, 64, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.setBrightness(64)
initialize()
initializeStars()
basic.forever(function () {
	
})

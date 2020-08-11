let dy = 0
let dx = 0
let norm = 0
let ay_ = 0
let ax_ = 0
// let pixel: number[] = []
let y = 0
let x = 0
let strip: neopixel.Strip = null
let d = 0
// let scale = 0
let num_stars = 0
let canvas_height = 0
let canvas_width = 0
let stars:number[][] = []
let weights:number[][] = []
let matrix:number[][][] = []
let pixels_width = 8
let pixels_height = 8
let mode = 0
//scale = 1
let weight_step:number = 8
let test_mode:boolean = false

canvas_width = 8
canvas_height = 8
num_stars = 5

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
            row_.push(Math.exp(- d / 10))
        }
        weights.push(row_)
    }
    // set random stars
    stars = []
    for (let index = 0; index < num_stars; index++) {
        stars.push([-1,-1, 255, 255, 255])
    }
}

// distribute stars
function initializeStars() {
    stars[0] = [0, 0, 7, 7, 0]
    stars[1] = [2, 0, 15, 7, 0]
    stars[2] = [4, 0, 31, 7, 0]
    stars[3] = [6, 0, 63, 7, 0]
    stars[4] = [0, 2, 127, 7, 0]
    // for (let index = 0; index < stars.length; index++) {
    //     let x = stars[index][0]
    //     let y = stars[index][1]
    //     if (x < 0 || x >= canvas_width || y < 0 || y >= canvas_height) {
    //         x = Math.floor(Math.random() * (canvas_width - 1))
    //         y = Math.floor(Math.random() * (canvas_height - 1))
    //         stars[index] = [x, y, 128, 192, 255]
    //     }
    // }
}

// set stars on matrix 
function showStars() {
    clearMatrix()
    for (let i = 0; i < stars.length; i++) {
        let star = stars[i]
        drawStar(star[0], star[1], star.slice(2))
    }
    displayMatrix()
}

input.onButtonPressed(Button.A, function () {
    // initializeStars()
    for (let i = 0; i < 1000; i++) {
        moveStars(0.1)
        basic.pause(10)
        showStars()
    }
    // showStars()
})

// input.onButtonPressed(Button.A, function () {
//     clearMatrix()
//     for (let index = 0; index < stars.length; index++) {
//         let x = Math.floor(index * 1.1) % 8 * scale
//         let y = Math.floor(index * 0.8 + 2) % 8 * scale
//         stars[index] = [x, y, 128, 192, 255]
//         plotStar(matrix, x, y, [128,192,255])
//     }
//     displayMatrix()
// })

input.onButtonPressed(Button.B, function () {
    for (let index = 0; index < 32 * 32; index++) {
        let x = (index % 32) / 4
        let y = Math.floor(index / 32) / 4
        clearMatrix()
        drawStar(x, y, [15,31,63])
        displayMatrix()
        basic.pause(10)
    }
})

function displayMatrix () {
    strip.clear()
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let pos:number = (j & 2) == 0 ? i : (7 - i)
            // if (test_mode) {
            //     pos = i
            // }
            pos += (j << 3)
            let rgb = matrix[j][i]
            if (rgb[0] > 0 || rgb[1] > 0 || rgb[2] > 0) {
                // strip.setMatrixColor(i, j, neopixel.rgb(rgb[0], rgb[1], rgb[2]))
                strip.setPixelColor(pos, neopixel.rgb(rgb[0], rgb[1], rgb[2]))
            }
        }
    }
    strip.show()
}
function clearMatrix () {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 3; k++) {
                matrix[i][j][k] = 0
            }
        }
    }
    // for (let i = 0; i < 64 * 3; i++) {
    //     matrix[i % 24][Math.floor(i / 24)][i % 3] = 0
    // }
}

function moveStars (dt: number):void {
    ax_ = input.acceleration(Dimension.X)
    ay_ = input.acceleration(Dimension.Y)
    if (test_mode) {
        ax_ = 0.0
        ay_ = 10.0
    }
    if (Math.abs(ax_) < 5 && Math.abs(ay_) < 5) {
        return
    }
    if (Math.abs(ax_) < 0.001) {
        ax_ = 0.001
    }
    norm = Math.sqrt(ax_ * ax_ + ay_ * ay_)
    dx = ax_ / norm * dt
    dy = ay_ / norm * dt
    for (let i = 0; i < stars.length; i++) {
        let x_ = stars[i][0]
        let y_ = stars[i][1]
        let velocity = (stars[i][4] + 256) / 512
        x_ += dx * velocity
        y_ += dy * velocity
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


///
/// Plot points at float position (X, Y)
///
function drawStar(x:number, y:number, rgb:number[]) {
    let mx = Math.floor(x)
    let my = Math.floor(y)
    for (let i = 0; i < 2; i++) {
        if (my + i < 0 || my + i >= 8) {
            continue
        }        
        let iy = Math.min(weight_step - 1, Math.floor(Math.abs(my + i - y) * weight_step))
        // if (iy < 0) {
        //     iy += weight_step
        // }
        for (let j = 0; j < 2; j++) {
            if (mx + j < 0 || mx + j >= 8) {
                continue
            }
            let ix = Math.min(weight_step - 1, Math.floor(Math.abs(mx + j - x) * weight_step))            
            // if (ix < 0) {
            //     ix += weight_step
            // }
            let w = weights[ix][iy]
            for (let k = 0; k < 3; k++) {
                matrix[my + i][mx + j][k] = Math.min(250, Math.floor(matrix[my + i][mx + j][k] + rgb[k] * w))
            }
        }
    }
}

// function plotStar(matrix:number[][][], x:number, y:number, color:number[]) {
//     let x_:number = x / scale
//     let y_:number = y / scale
//     for (let r = 0; r < 2; r++) {
//         let my = Math.floor(y / scale + r)
//         if (my < 0 || my >= 8) {
//             continue
//         }
//         let wy = Math.abs(y_ - my) * weight_step
//         if (wy >= weight_step) {
//             continue
//         }
//         for (let s = 0; s < 2; s++) {
//             let mx = Math.floor(x / scale + s)
//             if (mx < 0 || mx >= 8) {
//                 continue
//             }
//             let wx = Math.abs(x_ - mx) * weight_step
//             if (wx >= weight_step) {
//                 continue
//             }
//             let w = weights[Math.floor(wy)][Math.floor(wx)]
//             for (let t = 0; t < 3; t++) {
//                 // let c = matrix[my][mx][k]
//                 // c += Math.round(color[k] * w)
//                 matrix[my][mx][t] = Math.min(255, matrix[my][mx][t] + Math.round(color[t] * w))
//             }
//         }
//     }
// }

strip = neopixel.create(DigitalPin.P1, 64, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.setBrightness(100)
// strip.setMatrixWidth(8)

initialize()
initializeStars()
showStars()

basic.forever(function () {
	
})

let strip: neopixel.Strip = null
let num_stars:number = 0
let matrix:number[][][] = []
let stars:number[][] = []
let weights:number[][] = []
let weight_step:number = 8

let canvas_height:number = 0
let canvas_width:number = 0
let mode:number = 0
let test_mode:boolean = false
let running:boolean = false

canvas_width = 8
canvas_height = 8
num_stars = 20

function initialize():void {
    // clear matrix
    for (let i = 0; i < canvas_height; i++) {
        matrix.push([])
        for (let j = 0;j < canvas_width; j++) {
            matrix[i].push([0,0,0])
        }
    }
    clearMatrix()
    // set coefficient constants
    for (let i = 0; i < weight_step; i++) {
        let row_:number[] = []
        for (let j = 0; j < weight_step; j++) {
            let d = i * i + j * j
            row_.push(Math.exp(- d / 10))
        }
        weights.push(row_)
    }
    // set random stars
    stars = []
    for (let i = 0; i < num_stars; i++) {
        stars.push([-1,-1, 255, 255, 255])
    }
}

// distribute stars
function initializeStars():void {
    // stars[0] = [0, 0, 7, 7, 0]
    // stars[1] = [2, 2, 15, 7, 0]
    // stars[2] = [4, 4, 31, 127, 0]
    // stars[3] = [6, 6, 63, 7, 120]
    // stars[4] = [2, 4, 127, 7, 150]
    for (let i = 0; i < stars.length; i++) {
        let x = stars[i][0]
        let y = stars[i][1]
        if (x < 0 || x >= canvas_width || y < 0 || y >= canvas_height) {
            x = Math.floor(Math.random() * (canvas_width - 1))
            y = Math.floor(Math.random() * (canvas_height - 1))
            stars[i][0] = x
            stars[i][1] = y
            for (let j = 0; j < 3; j++) {
                stars[i][j + 2] = Math.floor(Math.random() * 250)
            }
        }
    }
}

// set stars on matrix 
function showStars():void {
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
    running = !running
})

input.onButtonPressed(Button.AB, function () {
    for (let i = 0; i < 1000; i++) {
        let theta = i * Math.PI / 500
        let x = 3.5 * Math.cos(theta) + 4
        let y = 3.5 * Math.sin(theta) + 4
        let s = 3.5 * Math.cos(theta + Math.PI) + 4
        let t = 3.5 * Math.cos(theta + Math.PI) + 4
        // let x = (index % 32) / 4
        // let y = Math.floor(index / 32) / 4
        clearMatrix()
        drawStar(x, y, [100,255,100])
        drawStar(s, t, [100,100,255])
        displayMatrix()
        basic.pause(10)
    }
})

// Light 
function displayMatrix ():void {
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

// Clear all buffer
function clearMatrix ():void {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 3; k++) {
                matrix[i][j][k] = 0
            }
        }
    }
}

// Move pixels using accelerameter values
function moveStars (dt: number):void {
    let ax_ = input.acceleration(Dimension.X)
    let ay_ = input.acceleration(Dimension.Y)
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
    let norm = Math.sqrt(ax_ * ax_ + ay_ * ay_)
    let dx = ax_ / norm * dt
    let dy = ay_ / norm * dt
    for (let i = 0; i < stars.length; i++) {
        let x_ = stars[i][0]
        let y_ = stars[i][1]
        let velocity = (stars[i][3] + 256) / 512
        x_ += dx * velocity
        y_ += dy * velocity
        if (x_ < 0 || x_ >= canvas_width || y_ < 0 || y_ >= canvas_height) {
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
function drawStar(x:number, y:number, rgb:number[]):void {
    let mx = Math.floor(x)
    let my = Math.floor(y)
    for (let i = 0; i < 2; i++) {
        if (my + i < 0 || my + i >= 8) {
            continue
        }        
        let iy = Math.min(weight_step - 1, Math.floor(Math.abs(my + i - y) * weight_step))
        for (let j = 0; j < 2; j++) {
            if (mx + j < 0 || mx + j >= 8) {
                continue
            }
            let ix = Math.min(weight_step - 1, Math.floor(Math.abs(mx + j - x) * weight_step))            
            let w = weights[ix][iy]
            for (let k = 0; k < 3; k++) {
                matrix[my + i][mx + j][k] = Math.min(250, Math.floor(matrix[my + i][mx + j][k] + rgb[k] * w))
            }
        }
    }
}


strip = neopixel.create(DigitalPin.P1, 64, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.setBrightness(100)
// strip.setMatrixWidth(8)

initialize()
initializeStars()
showStars()

basic.forever(function () {
    if (running) {
        clearMatrix()
        moveStars(0.1)
        showStars()
        basic.pause(100)
    }
})

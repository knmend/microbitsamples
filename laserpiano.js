let theta = 0
let score: number[] = []
let span = 0
let freqs: number[] = []
let rad = 0
let laser = 0
input.onButtonPressed(Button.A, function () {
    laser = 1 - laser
    pins.digitalWritePin(DigitalPin.P1, laser)
    basic.showNumber(laser)
})
input.onButtonPressed(Button.B, function () {
    for (let i = 0; i <= 3 - 1; i++) {
        basic.showNumber(3 - i)
        basic.pause(250)
    }
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    for (let j = 0; j <= score.length / 2 - 1; j++) {
        tone = score[j * 2] - 1
        span = score[j * 2 + 1] * 100
        if (tone < 0) {
            basic.pause(span - 10)
            music.rest(10)
        } else {
            rad = Math.atan((tone - 9) * xstep) * 180 / Math.PI
            pins.digitalWritePin(DigitalPin.P1, 0)
            servos.P2.setAngle(rad + 90)
            basic.pause(150)
            pins.digitalWritePin(DigitalPin.P1, 1)
            music.ringTone(2 ** Math.floor(tone / 7) * freqs[tone % 7])
            basic.pause(span - 140)
            music.rest(10)
            pins.digitalWritePin(DigitalPin.P1, 0)
        }
    }
    servos.P2.setAngle(90)
    music.rest(100)
})
input.onButtonPressed(Button.AB, function () {
    for (let k = 0; k <= 20 - 1; k++) {
        rad = Math.atan((k - 10) * xstep) * 180 / Math.PI
        pins.digitalWritePin(DigitalPin.P1, 0)
        servos.P2.setAngle(rad + 90)
        basic.pause(200)
        pins.digitalWritePin(DigitalPin.P1, 1)
        basic.pause(200)
        pins.digitalWritePin(DigitalPin.P1, 0)
    }
    servos.P2.setAngle(90)
})
let xstep = 0
let tone = 0
freqs = [131, 147, 165, 175, 196, 220, 247, 262]
xstep = 0.106
score = [10, 4, 10, 4, 11, 4, 12, 4, 12, 4, 11, 4, 10, 4, 9, 4, 8, 4, 8, 4, 9, 4, 10, 4, 10, 6, 9, 2, 9, 4, -1, 4, 10, 4, 10, 4, 11, 4, 12, 4, 12, 4, 11, 4, 10, 4, 9, 4, 8, 4, 8, 4, 9, 4, 10, 4, 9, 6, 8, 2, 8, 4, -1, 4, 9, 4, 9, 4, 10, 4, 8, 4, 9, 4, 10, 2, 11, 2, 10, 4, 8, 4, 9, 4, 10, 2, 11, 2, 10, 4, 8, 4, 8, 4, 9, 4, 5, 4, 10, 8, 10, 4, 11, 4, 12, 4, 11, 4, 10, 4, 9, 4, 8, 4, 8, 4, 9, 4, 10, 4, 9, 6, 8, 2, 8, 4, -1, 4]
laser = 0
theta = 0
pins.digitalWritePin(DigitalPin.P1, laser)
// basic.showNumber(score.length)
servos.P2.setAngle(theta + 90)
basic.forever(function () {

})

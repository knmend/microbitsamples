let かたむき = 0
let 今 = 0
let 秒 = 0
let はじめ = 0
let ゲーム中 = 0
let 難しさ = 5
let 左はじ = -150
let 右はじ = 150
basic.forever(function () {
    if (ゲーム中 == 0) {
        if (pins.digitalReadPin(DigitalPin.P1) == 1) {
            ゲーム中 = 1
            basic.showIcon(IconNames.StickFigure)
            music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
            basic.pause(750)
            はじめ = input.runningTime()
            秒 = 0
        } else if (input.buttonIsPressed(Button.AB)) {
            music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once)
            ゲーム中 = 2
            左はじ = 0
            右はじ = 0
        }
    } else {
        if (ゲーム中 == 1) {
            if (input.acceleration(Dimension.X) < 左はじ + 10 || input.acceleration(Dimension.X) > 右はじ - 10) {
                basic.showIcon(IconNames.Sad)
                music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once)
                ゲーム中 = 0
                basic.pause(5000)
                basic.clearScreen()
            } else {
                今 = input.runningTime()
                if (今 - はじめ > 難しさ * 1000) {
                    music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)
                    basic.showIcon(IconNames.Heart)
                    basic.pause(1000)
                    basic.clearScreen()
                    ゲーム中 = 0
                } else {
                    if (Math.round((今 - はじめ) / 1000) > 秒) {
                        music.playTone(880, 10)
                        basic.showNumber(Math.round((今 - はじめ) / 1000) % 10)
                        秒 = Math.round((今 - はじめ) / 1000)
                    }
                }
            }
        } else if (ゲーム中 == 2) {
            かたむき = input.acceleration(Dimension.X)
            左はじ = Math.min(左はじ, かたむき)
            右はじ = Math.max(右はじ, かたむき)
            if (かたむき > 90) {
                basic.showLeds(`
                    . . . . #
                    . . . . #
                    . . . . #
                    . . . . #
                    . . . . #
                    `)
            } else if (かたむき < -90) {
                basic.showLeds(`
                    # . . . .
                    # . . . .
                    # . . . .
                    # . . . .
                    # . . . .
                    `)
            } else if (かたむき > 30) {
                basic.showLeds(`
                    . . . # .
                    . . . # .
                    . . . # .
                    . . . # .
                    . . . # .
                    `)
            } else if (かたむき < -30) {
                basic.showLeds(`
                    . # . . .
                    . # . . .
                    . # . . .
                    . # . . .
                    . # . . .
                    `)
            } else {
                basic.showLeds(`
                    . . # . .
                    . . # . .
                    . . # . .
                    . . # . .
                    . . # . .
                    `)
            }
            if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once)
                basic.pause(1000)
                basic.clearScreen()
                ゲーム中 = 0
            }
            if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                if (input.buttonIsPressed(Button.A)) {
                    難しさ = Math.max(5, 難しさ - 1)
                } else if (input.buttonIsPressed(Button.B)) {
                    難しさ = Math.min(10, 難しさ + 1)
                }
                if (難しさ <= 5) {
                    music.playTone(262, 60)
                } else if (難しさ <= 6) {
                    music.playTone(294, 60)
                } else if (難しさ <= 7) {
                    music.playTone(330, 60)
                } else if (難しさ <= 8) {
                    music.playTone(349, 60)
                } else if (難しさ <= 9) {
                    music.playTone(392, 60)
                } else {
                    music.playTone(440, 60)
                }
            }
        }
    }
})

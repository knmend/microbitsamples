input.onButtonPressed(Button.A, function () {
    basic.showNumber(Math.round(input.temperature()))
    basic.showNumber(Math.round(input.lightLevel()))
    basic.pause(1000)
    basic.clearScreen()
})
input.onButtonPressed(Button.B, function () {
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
})
function LEDIcon (index: number) {
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
let pinsignal = 0
let colorcode = 0
let codes: number[][][] = []
let blue = 0
let green = 0
let red = 0
let strip: neopixel.Strip = null
let inputPins = []
let currentPins = [1, 1, 1]
strip = neopixel.create(DigitalPin.P1, 64, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.setBrightness(128)
red = 0
green = 0
blue = 0
codes.push([[36, 3687554, 2189575224]])
codes.push([[1024, 8537128, 271074434]])
codes.push([[4, 61680, 4026531840], [801, 3598, 235407360]])
codes.push([[4, 240, 4042260480], [801, 526350, 235798528]])
basic.forever(function () {
    if (input.lightLevel() > 0) {
        for (let l = 0; l <= 2; l++) {
            if (l == 0) {
                pinsignal = pins.digitalReadPin(DigitalPin.P8)
            } else if (l == 1) {
                pinsignal = pins.digitalReadPin(DigitalPin.P2)
            } else if (l == 2) {
                pinsignal = pins.digitalReadPin(DigitalPin.P16)
            }
            if (currentPins[l] != pinsignal) {
                currentPins[l] = pinsignal
                if (pinsignal == 1) {
                    if (Math.randomRange(0, 1) == 0) {
                        LEDIcon(Math.randomRange(0, 1) * 2)
                        music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once)
                    } else {
                        LEDIcon(Math.randomRange(0, 1) * 2 + 1)
                        music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once)
                    }
                    basic.pause(2000)
                    strip.showColor(neopixel.colors(NeoPixelColors.Black))
                }
            }
        }
    } else {
        control.waitMicros(1000)
    }
})

input.onButtonPressed(Button.A, function () {
    basic.showNumber(Math.round(input.temperature()))
    basic.showNumber(Math.round(input.lightLevel()))
    basic.pause(1000)
    basic.clearScreen()
})
input.onButtonPressed(Button.B, function () {
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
})
function ShowAnimation() {
    for (let k = 4; k < 9; k++) {
        LEDIcon(k)
        basic.pause(500)
    }
    basic.pause(1000)
}
function LEDIcon(index: number) {

    codes = [[[512, 8537128, 271074434]], [[35, 3687554, 2189575224]], [[4, 61680, 4026531840], [801, 3598, 235407360]], [[4, 240, 4042260480], [801, 526350, 235798528]], [[562, 16, 0]], [[562, 4136, 268435456]], [[562, 3687492, 1144520704]], [[562, 1011006849, 2913288764]], [[562, 3950080, 572793344]]]
    codes[1] = [[0x400, 0x00824428, 0x10284482]]
    codes[0] = [[0x024, 0x00384482, 0x82824438]]
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
let green = 0
let strip: neopixel.Strip = null
let red = 0
let blue = 0
let codes: number[][][] = []
let colorcode = 0
let state = 1
let currentPins = [1, 1, 1]
strip = neopixel.create(DigitalPin.P1, 64, NeoPixelMode.RGB)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
strip.setBrightness(128)
basic.forever(function () {
    if (input.lightLevel() > 0) {
        let inputPins: number[] = []
        let flag = 0
        for (let l = 0; l <= 2; l++) {
            let p = 0
            if (l == 0) {
                p = pins.digitalReadPin(DigitalPin.P8)
            } else if (l == 1) {
                p = pins.digitalReadPin(DigitalPin.P2)
            } else if (l == 2) {
                p = pins.digitalReadPin(DigitalPin.P16)
            }
            flag |= pins.digitalReadPin(inputPins[l]) << l
            if (currentPins[l] != p) {
                currentPins[l] = p
                if (p == 1) {
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
        // if (pins.digitalReadPin(DigitalPin.P2) == 1) {
        //     strip.showColor(neopixel.colors(NeoPixelColors.Black))
        //     music.playTone(330, music.beat(BeatFraction.Whole))
        //     LEDIcon(Math.randomRange(0, 3))
        //     basic.pause(100)
        // }
    } else {
        control.waitMicros(1000)
    }
})

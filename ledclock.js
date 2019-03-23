let time_to_sleep = 0
let sleep_counter = 0
let state = 0
function dimToSleep2() {
    state = -1
    for (let i = 0; i <= 20; i++) {
        displayClock((input.runningTime() - time_offset) / 1000, colorModel_normal)
        //       displayClock((input.runningTime() - time_offset) / 1000, 1.0 - i / 20, false)
        basic.pause(10)
    }
    strip.clear()
    state = 0
}
function wakeUp2() {
    state = -1
    for (let l = 0; l <= 20; l++) {
        displayClock((input.runningTime() - time_offset) / 1000, colorModel_normal)
        //        displayClock((input.runningTime() - time_offset) / 1000, l / 20, false)
        basic.pause(10)
    }
    state = 2
    sleep_counter = input.runningTime()
}
input.onButtonPressed(Button.AB, function () {
    if (state == 0 || state == 2) {
        state = 1
        time_user = input.runningTime() - time_offset
        time_user = Math.round(time_user / 60000) * 60000
        music.playTone(392, 30)
        basic.showString("S")
        displayClock(time_user / 1000, colorModel_setting)
    } else if (state == 1) {
        time_offset = input.runningTime() - time_user
        music.playTone(392, 30)
        basic.clearScreen()
        wakeUp2()
    }
})
input.onButtonPressed(Button.B, function () {
    if (state == 1) {
        time_user = (time_user + 60 * 1000) % 43200000
        music.playTone(440, 30)
        //        displayClock(time_user / 1000, 1, true)
        displayClock(time_user / 1000, colorModel_setting)
    } else if (state == 2) {
        dimToSleep2()
    }
})
input.onButtonPressed(Button.A, function () {
    if (state == 0) {
        wakeUp2()
    } else if (state == 1) {
        time_user = (time_user + 3600 * 1000) % 43200000
        music.playTone(262, 30)
        displayClock(time_user / 1000, colorModel_setting)
    }
})
let strip: neopixel.Strip = null
let num_leds: number = 0
let time_offset: number = 0
let time_user: number = 0
let tm = 0
time_to_sleep = 15 * 60 * 1000
state = 0
num_leds = 30
state = 2
strip = neopixel.create(DigitalPin.P1, num_leds, NeoPixelMode.RGB)
strip.setBrightness(255)
time_offset = input.runningTime()
strip.clear()
strip.show()
let colorModel_normal: number[][] = [[128, 16, 32], [32, 224, 32], [64, 16, 192]]
let colorModel_setting: number[][] = [[0, 0, 0], [0, 255, 0], [0, 0, 255]]

function displayClock(value: number, colormodel: number[][]) {
    let seconds = value / 60 - Math.round(value / 60)
    let minutes = value / 3600 - Math.round(value / 3600)
    let hours = Math.min(1, value / 43200 - Math.round(value / 432000))
    let pos: number[] = [seconds, minutes, hours]
    let max_distance = 0.05
    strip.clear()
    for (let j = 0; j < num_leds; j++) {
        let rgb: number[] = [0, 0, 0]
        for (let k = 0; k < 3; k++) {
            let d = Math.abs(j / num_leds - pos[k])
            d = Math.min(d, Math.abs(d - 1))
            if (d < max_distance) {
                for (let l = 0; l < 3; l++) {
                    rgb[l] += Math.round(colormodel[k][l] * (Math.cos(d / max_distance * Math.PI) + 1) * .5)
                }
            }
        }
        strip.setPixelColor(j, neopixel.rgb(rgb[0] / 2, rgb[1], rgb[2]));
    }
    strip.show()
}
basic.forever(function () {
    if (state == 0) {
        basic.pause(1000)
    } else if (state == 1) {
        basic.pause(100)
    } else if (state == 2) {
        tm = input.runningTime()
        displayClock((tm - time_offset) / 1000, colorModel_normal)
        basic.pause(100)
        if (tm - sleep_counter > time_to_sleep) {
            dimToSleep2()
        }
    }
})

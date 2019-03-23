let state = 0
let strip: neopixel.Strip = null
let num_leds: number = 0
let time_offset: number = 0
//let range = 0
let sleep_counter: number = 0
let time_user: number = 0
let time_to_sleep: number = 15 * 60 * 1000

state = 0
//range = null
num_leds = 30
state = 2

strip = neopixel.create(DigitalPin.P1, num_leds, NeoPixelMode.RGB)
strip.setBrightness(255)
time_offset = input.runningTime()
strip.clear()
strip.show()

function displayClock(value: number, brightness: number, nosecond: boolean) {
    let seconds = value / 60 - Math.round(value / 60)
    let minutes = value / 3600 - Math.round(value / 3600)
    let hours = Math.min(1, value / 43200 - Math.round(value / 432000))
    let pos: number[] = [seconds, hours, minutes]
    let rgb: number[] = [0, 0, 0]
    strip.clear()
    for (let j = 0; j < num_leds; j++) {
        for (let k = 0; k < 3; k++) {
            if (nosecond && k == 0) {
                rgb[k] = 0
                continue
            }
            let d = Math.abs(j / num_leds - pos[k]);
            d = Math.min(d, Math.abs(d - 1));
            if (d < 0.04) {
                rgb[k] = Math.round((255 - d * 6000) * brightness);
            } else {
                rgb[k] = 0;
            }
        }
        strip.setPixelColor(j, neopixel.rgb(rgb[0] / 2, rgb[1], rgb[2]));
    }
    strip.show()
}

function dimToSleep() {
    state = -1
    for (let i = 0; i <= 20; i++) {
        displayClock((input.runningTime() - time_offset) / 1000, 1.0 - i / 20, false)
        basic.pause(10)
    }
    strip.clear()
    state = 0
}

function wakeUp() {
    state = -1
    for (let i = 0; i <= 20; i++) {
        displayClock((input.runningTime() - time_offset) / 1000, i / 20, false)
        basic.pause(10)
    }
    state = 2
    sleep_counter = input.runningTime()
}
input.onButtonPressed(Button.A, function () {
    if (state == 0) {
        wakeUp()
    } else if (state == 1) {
        time_user = (time_user + 3600 * 1000) % 43200000
        displayClock(time_user / 1000, 1, true)
    }
})
input.onButtonPressed(Button.B, function () {
    if (state == 1) {
        time_user = (time_user + 60 * 1000) % 43200000
        displayClock(time_user / 1000, 1, true)
    } else if (state == 2) {
        dimToSleep()
    }
})
input.onButtonPressed(Button.AB, function () {
    if (state == 0 || state == 2) {
        state = 1
        time_user = input.runningTime() - time_offset
        time_user = Math.round(time_user / 60000) * 60000
        displayClock(time_user, 1, false)
        basic.showString("S")
    } else if (state == 1) {
        time_offset = input.runningTime() - time_user
        basic.clearScreen()
        wakeUp()
    }
})

basic.forever(function () {
    if (state == 0) { // silent
        basic.pause(1000)
    } else if (state == 1) { // set clock
        basic.pause(100)
    } else if (state == 2) { // clock
        let tm = input.runningTime()
        displayClock((tm - time_offset) / 1000, 1, false)
        basic.pause(100)
        if (tm - sleep_counter > time_to_sleep) {
            dimToSleep()
        }
    }
})

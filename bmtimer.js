let elapsed_min = 0
let last_minute = 0
let tunit = 0
let elapsed_sec = 0
let next_lap = 0
let minutes = 0
let start_flag = false
let mode = 0
let ticker = 0
let ticker_period = 2
// B button management Start when the time is set,
// stop or resume when the timer is running
input.onButtonPressed(Button.B, () => {
    if (mode == 0 && minutes > 0) {
        // start
        mode = 1
        start_time = game.currentTime()
        next_lap = tunit * 60
        last_minute = minutes
        start_flag = true
    } else if (mode == 1) {
        mode = 2
        wait_start = game.currentTime()
        music.playTone(900, 66)
    } else if (mode == 2) {
        mode = 1
        start_time += game.currentTime() - wait_start
        music.playTone(900, 66)
    }
})
// A button management Set requested time
input.onButtonPressed(Button.A, () => {
    if (mode <= 0) {
        mode = 0
        if (minutes < 9) {
            minutes += 1
            music.playTone(900, 66)
            basic.showNumber(minutes)
        }
    }
})
// AB button mangement Cancel timer
input.onButtonPressed(Button.AB, () => {
    if (mode == 1) {
        music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.OnceInBackground)
        music.playTone(550, 100)
        mode = -1
        minutes = 0
    }
})
let wait_start = 0
let start_time = 0
// Timer mode -1: Initial screen 0: Waiting for count
// 1: Counting down timer 2: Waiting
mode = -1
// Miliseconds per second. Fast debugging is available
// with a small value.
tunit = 100
// Main loop
basic.forever(() => {
    if (mode == -1) {
        basic.showLeds(`.###.\n#.#.#\n#.#.#\n#####\n.###.\n`)
        basic.pause(100)
    } else if (mode == 0) {
        basic.pause(10)
    } else if (mode == 1) {
        if (start_flag) { // display start animation
            basic.showLeds(`.###.\n#.#.#\n#.#.#\n#####\n.###.\n`)
            music.playTone(150, 33)
            basic.showLeds(`#.#.#\n#.#.#\n#####\n.###.\n.....`)
            music.playTone(175, 33)
            basic.showLeds(`#.#.#\n#####\n.###.\n.....\n.....`)
            music.playTone(200, 33)
            basic.showLeds(`#####\n.###.\n.....\n.....\n.....`)
            music.playTone(225, 33)
            basic.showLeds(`.###.\n.....\n.....\n.....\n.....`)
            basic.clearScreen()
            start_flag = false
        }
        let tm = game.currentTime()
        elapsed_sec = (tm - start_time) / tunit
        elapsed_min = elapsed_sec / 60
        if (elapsed_min >= minutes) { // display yummy mark
            basic.showLeds(`.#..#\n.#.#.\n....#\n#....\n.####`)
            music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
            basic.pause(1000)
            mode = -1
            minutes = 0
        } else {
            if (last_minute != minutes - elapsed_min) {
                last_minute = minutes - elapsed_min
                basic.showLeds(`..#.#\n####.\n...#.\n...#.\n###..`)
                music.playTone(200, 66)
            }
            ticker = (ticker + 1) % ticker_period
            basic.showNumber(minutes - elapsed_min)
            if (ticker == 0) {
                led.plot(4,0)
            }
            if (elapsed_sec > next_lap) {
                next_lap += tunit * 60
            }
            basic.pause(tunit)
        }
    } else if (mode == 2) {
        basic.pause(100)
    } else {
        music.playTone(900, 100)
        basic.showString("?")
        basic.pause(100)
    }
})

let じばの引き算 = 0
let うごかし中 = 0
let はじめのじば = 0
let val = 0
let じば = 0
input.onButtonPressed(Button.A, function () {
    if (うごかし中 == 0) {
        うごかし中 = 1
    } else {
        うごかし中 = 0
    }
})
// This function was written by a parent
function じばをはかる() {
    じば = Math.sqrt(input.magneticForce(Dimension.X) * input.magneticForce(Dimension.X) + input.magneticForce(Dimension.Y) * input.magneticForce(Dimension.Y) + input.magneticForce(Dimension.Z) * input.magneticForce(Dimension.Z))
    じばの引き算 = じば - はじめのじば
}
// This function was written by a parent
function グラフひょうじ() {
    val = Math.floor(じばの引き算)
    if (val < 0) {
        led.plot(0, 0)
        val = 0 - val
    } else {
        led.unplot(0, 0)
    }
    if (val > 1295) {
        val = 1295
    }
    if (val < -1295) {
        val = -1295
    }
    for (let x = 0; x <= 4 - 1; x++) {
        for (let y = 0; y <= 6 - 1; y++) {
            if (y < val % 6) {
                led.plot(4 - x, 4 - y)
            } else {
                led.unplot(4 - x, 4 - y)
            }
        }
        val = Math.floor(val / 6)
    }
}
input.onButtonPressed(Button.B, function () {
    じばをはかる()
    はじめのじば = じば
})
input.onButtonPressed(Button.AB, function () {
    じばをはかる()
    グラフひょうじ()
})
じばをはかる()
はじめのじば = じば
basic.forever(function () {
    if (うごかし中 == 1) {
        じばをはかる()
        グラフひょうじ()
        if (じばの引き算 > 500) {
            music.playTone(50, music.beat(BeatFraction.Quarter))
        } else if (じばの引き算 > 100) {
            music.playTone(100, music.beat(BeatFraction.Quarter))
        } else if (じばの引き算 > 10) {
            music.playTone(200, music.beat(BeatFraction.Quarter))
        }
        if (じばの引き算 < -500) {
            music.playTone(1600, music.beat(BeatFraction.Quarter))
        } else if (じばの引き算 < -30) {
            music.playTone(800, music.beat(BeatFraction.Quarter))
        } else if (じばの引き算 < -7) {
            music.playTone(400, music.beat(BeatFraction.Quarter))
        }
    }
})

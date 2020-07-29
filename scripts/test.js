import Wav from './riff-wave-pcm.js'

let option = {
    duration: 7,
    numberOfChannel: 1,
    samplesPerSecond: 44100,
    bytesPerSample: 1
}

let melody = [523, 587, 659, 698, 784, 880, 988]

let volume = 50

let wav = new Wav(option, melody, volume)

document.body.appendChild(wav.audio)

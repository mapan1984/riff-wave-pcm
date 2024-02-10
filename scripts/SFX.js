import {put} from "./encode.js"
import {_audioData, wave, _data} from './riff-wave-pcm.js'


class Wav {
    constructor(option, melody, waveType, volume) {
        this.duration = option.duration  // 音频持续时间（单位：秒）
        this.numberOfChannel = option.numberOfChannel
        this.samplesPerSecond = option.samplesPerSecond  // 每秒包含的样本数
        this.bytesPerSample = 1

        this.melody = melody  // 旋律，用数组表示，数组内容为代表音符的频率
        this.waveType = waveType  // 波形（音色）
        this.volume = volume  // 音量

        // waveType+frequency+volume 与 data 的映射
        this.dataCache = new Map()
    }

    update(option, melody, waveType, volume) {
        this.duration = option.duration  // 音频持续时间（单位：秒）
        this.numberOfChannel = option.numberOfChannel
        this.samplesPerSecond = option.samplesPerSecond  // 每秒包含的样本数

        this.melody = melody  // 旋律，用数组表示，数组内容为代表音符的频率
        this.waveType = waveType  // 波形（音色）
        this.volume = volume  // 音量
    }

    getData(waveType, frequency, volume) {
        // 将这一频率音频数据加入缓存
        let key = waveType + frequency + volume
        if (!this.dataCache.has(key)) {
            this.dataCache.set(key, _data(
                waveType,
                frequency,
                volume,
                this.samplesPerSecond,
                this.bytesPerSample
            ))
        }

        return this.dataCache.get(key)
    }

    data() {
        let data = ""
        for (let i = 0; i < this.duration; i++) {
            let frequency = this.melody[i] // 这一秒声波的频率
            console.log('--', frequency)

            // 将这一频率音频数据加入缓存
            let key = this.waveType + frequency + this.volume

            data += this.getData(this.waveType, frequency, this.volume)
        }

        return data
    }

    get audioData() {
        return _audioData(
            this.duration,
            this.numberOfChannel,
            this.samplesPerSecond,
            this.bytesPerSample,
            this.data()
        )
    }

    get audio() {
        let audio = new Audio("data:Audio/WAV;base64," + this.audioData);
        audio.controls = true
        return audio
    }

    play(frequency) {
        let data = _audioData(
            1,
            1,
            this.samplesPerSecond,
            this.bytesPerSample,
            this.getData(this.waveType, frequency, this.volume),
        )

        let audio = new Audio("data:Audio/WAV;base64," + data);
        audio.play()
    }
}

export default Wav

import {put} from "./encode.js"


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

    get audioData() {
        let DUR = this.duration
        let NCH = this.numberOfChannel
        let SPS = this.samplesPerSecond
        let BPS = this.bytesPerSample

        let dataSize = DUR * NCH * SPS * BPS;
        let fileSize = 44 + dataSize

        let data = "RIFF"
        data += put(fileSize, 4)          // file size
        data += "WAVE"
        data += "fmt "                    // ckID
        data += put(16, 4);               // cksize
        data += put(1, 2);                // wFormatTag (pcm)
        data += put(NCH, 2);              // nChannels
        data += put(SPS, 4);              // nSamplesPerSec
        data += put(NCH * BPS * SPS, 4);  // nAvgBytesPerSec
        data += put(NCH * BPS, 2);        // nBlockAlign
        data += put(BPS * 8, 2);          // wBitsPerSample
        data += "data"
        data += put(dataSize, 4);         // data size

        data += this.data()

        return btoa(data)
    }

    get audio() {
        let audio = new Audio("data:Audio/WAV;base64," + this.audioData);
        audio.controls = true
        return audio
    }

    /**
     * 波形 waveType
     * 频率 frequency
     * 振幅 amplitude
     * 在 1 秒采集 samples 个样本
     */
    _wave(waveType, frequency, amplitude, xOffset, yOffset, samples) {
        let cycleLength = 2 * Math.PI  // 一个周期长度
        let totalCycleLength = cycleLength * frequency  // 一秒内所有周期长度
        let step = totalCycleLength / samples  // 每个样本之间的间隔

        let points = []
        // 计算每个样本的坐标
        for (let i = 0; i < samples; i++) {
            let x = step * i + xOffset

            let y
            if (waveType === "sine") {
                y = Math.sin(x) * amplitude + yOffset
            } else if (waveType === "square") {
                y = (Math.sin(x) >= 0 ? 1 : -1) * amplitude + yOffset;
            }

            points.push({x: x, y: y})
        }

        return points
    }

    wave(waveType, frequency, amplitude, samples) {
        return this._wave(waveType, frequency, amplitude, 0, 128, samples)
    }

    _data(waveType, frequency, volume) {
        let key = waveType + frequency + volume

        if (!this.dataCache.has(key)) {
            console.log("cal")
            let data = ""

            let points = this.wave(
                waveType,
                frequency,
                volume,
                this.samplesPerSecond
            )

            for (let point of points) {
                let y = point.y

                data += put(Math.floor(y), this.bytesPerSample)
            }

            this.dataCache.set(key, data)
        }

        return this.dataCache.get(key)
    }

    data() {
        let data = ""
        for (let i = 0; i < this.duration; i++) {
            let frequency = this.melody[i] // 这一秒声波的频率

            data += this._data(this.waveType, frequency, this.volume, this.samplesPerSecond)
        }
        return data
    }
}

export default Wav

import {put} from "./encode.js"

/**
 * 生成一秒的波形样本
 */
function wave(
    waveType,  // 波形
    frequency, // 频率
    amplitude, // 振幅
    xOffset,
    yOffset,
    samples,   // 在 1 秒采集 samples 个样本
) {
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

/**
 * 生成一秒的音频数据
 */
function _data(
    waveType,
    frequency,
    volume,
    samplesPerSecond,
    bytesPerSample
) {
    console.log(waveType, frequency, volume, samplesPerSecond, bytesPerSample)

    let data = ""

    let points = wave(
        waveType,
        frequency,
        volume,
        0,
        128,
        samplesPerSecond
    )

    for (let point of points) {
        let y = point.y
        // console.log(y)

        data += put(Math.floor(y), bytesPerSample)
    }

    return data
}

/**
 * 组装完整的 RIFF 格式
 */
function _audioData(
    duration,  // 音频时长(秒)
    numberOfChannel,  // 声道数
    samplesPerSecond,  // 每秒包含的样本数(采样率)
    bytesPerSample,
    data
) {
    let DUR = duration
    let NCH = numberOfChannel
    let SPS = samplesPerSecond
    let BPS = bytesPerSample

    let dataSize = DUR * NCH * SPS * BPS;
    let fileSize = 44 + dataSize

    let audioData = "RIFF"
    audioData += put(fileSize, 4)          // file size
    audioData += "WAVE"
    audioData += "fmt "                    // ckID
    audioData += put(16, 4);               // cksize
    audioData += put(1, 2);                // wFormatTag (pcm)
    audioData += put(NCH, 2);              // nChannels
    audioData += put(SPS, 4);              // nSamplesPerSec
    audioData += put(NCH * BPS * SPS, 4);  // nAvgBytesPerSec
    audioData += put(NCH * BPS, 2);        // nBlockAlign
    audioData += put(BPS * 8, 2);          // wBitsPerSample
    audioData += "data"
    audioData += put(dataSize, 4);         // data size

    audioData += data

    return btoa(audioData)  // base64 encode
}

export {wave, _data, _audioData}

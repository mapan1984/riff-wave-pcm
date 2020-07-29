/**
 * 将 n 转换成 16 进制的 string 表示(长度为 2 * l，空余部分用 0 补全)
 * 即：将十进制的 n 转换成 l byte 大小的十六进制的 string 表示
 * 示例：
 *      dec2hex(255, 4) ==> "000000ff"
 *      dec2hex(16, 4) ==> "00000010"
 *
 * @param {number} n
 * @param {number} l
 * @return {string}
 */
function dec2hex(n, l) {
    n = (n).toString(16);
    return new Array(l * 2 - n.length + 1).join("0") + n;
}

/**
 * 将 string 表示的十六进制数字的每 byte 转换成对应的 assic 字符
 *
 * @param {string} hex
 * @return {string}
 *
 */
function hex2str(hex) {
    var str = [];

    if (hex.length % 2) {
        throw new Error("hex2str(\"" + hex + "\"): invalid input (# of digits must be divisible by 2)");
    }

    for (var i = 0; i < hex.length; i += 2) {
        str.push(
            String.fromCharCode( // 将得到的整数转换成对应的 assic 字符
                parseInt( // 将取到的 1 byte 的值视为 16 进制表示的整数，转换成 10 进制的值
                    hex.substr(i, 2), // 每次取 1 byte 的值
                    16
                )
            )
        );
    }

    return str.reverse().join("");
}

function put(n, l) {
    return hex2str(dec2hex(n, l));
}

class Wav {
    constructor(option, melody, volume) {
        this.duration = option.duration  // 音频持续时间（单位：秒）
        this.numberOfChannel = option.numberOfChannel
        this.samplesPerSecond = option.samplesPerSecond  // 每秒包含的样本数
        this.bytesPerSample = 1

        this.melody = melody  // 旋律，用数组表示，数组内容为代表音符的频率
        this.volume = volume  // 音量
    }

    get audioData() {
        let DUR = this.duration
        let NCH = this.numberOfChannel
        let SPS = this.samplesPerSecond
        let BPS = this.bytesPerSample

        let size = DUR * NCH * SPS * BPS;

        let data = "RIFF" + put(44 + size, 4) + "WAVEfmt " + put(16, 4);


        data += put(1, 2); // wFormatTag (pcm)
        data += put(NCH, 2); // nChannels
        data += put(SPS, 4); // nSamplesPerSec
        data += put(NCH * BPS * SPS, 4); // nAvgBytesPerSec
        data += put(NCH * BPS, 2); // nBlockAlign
        data += put(BPS * 8, 2); // wBitsPerSample

        data += "data" + put(size, 4);

        data += this.data()

        return btoa(data)
    }

    get audio() {
        let audio = new Audio("data:Audio/WAV;base64," + this.audioData);
        audio.controls = true
        return audio
    }

    data() {
        let data = ""
        for (let i = 0; i < this.duration; i++) {
            let frequency = this.melody[i] // 这一秒声波的频率
            let 一个周期长度 = 2 * Math.PI
            let 一秒的总周期长度 = 一个周期长度 * frequency
            let 每个样本分割周期长度 = 一秒的总周期长度 / this.samplesPerSecond
            for (let j = 0; j < this.samplesPerSecond; j++) {
                let 当前样本的横坐标点 = 每个样本分割周期长度 * j
                let v = Math.sin(当前样本的横坐标点) * this.volume + 128
                data += put(Math.floor(v), this.bytesPerSample)
            }
        }
        return data
    }
}

export default Wav


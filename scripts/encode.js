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


export {dec2hex, hex2str, put}


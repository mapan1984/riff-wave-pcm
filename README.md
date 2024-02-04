### file format

|         | Field           | Bytes | Content          |
|---------|-----------------|-------|------------------|
|  0 ~  4 |                 | 4     | "RIFF"           |
|  4 ~  8 |                 | 4     | file size        |
|  8 ~ 12 |                 | 4     | "WAVE"           |
| 12 ~ 16 | ckID            | 4     | "fmt "           |
| 16 ~ 20 | cksize          | 4     | 0x0000010 (16)   |
| 20 ~ 22 | wFormatTag      | 2     | 0x0001 (PCM)     |
| 22 ~ 24 | nChannels       | 2     | NCH              |
| 24 ~ 28 | nSamplesPerSec  | 4     | SPS              |
| 28 ~ 32 | nAvgBytesPerSec | 4     | NCH * BPS * SPS  |
| 32 ~ 34 | nBlockAlign     | 2     | NCH * BPS        |
| 34 ~ 36 | wBitsPerSample  | 2     | BPS * 8          |
| 36 ~ 40 |                 | 4     | "data"           |
| 40 ~ 44 |                 | 4     | data size        |

- data_size = DUR * NCH * SPS * BPS
- file_size = 44 (Header) + data_size

### data format

* 频率决定音符
* 波形决定音色
* 振幅决定音量

### Reference:

- http://www.topherlee.com/software/pcm-tut-wavformat.html

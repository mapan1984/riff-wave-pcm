### file format


| Field           | Bytes | Content          |
|-----------------|-------|------------------|
|                 | 4     | "RIFF"           |
|                 | 4     | file size        |
|                 | 4     | "WAVE"           |
| ckID            | 4     | "fmt "           |
| cksize          | 4     | 0x0000010 (16)   |
| wFormatTag      | 2     | 0x0001 (PCM)     |
| nChannels       | 2     | NCH              |
| nSamplesPerSec  | 4     | SPS              |
| nAvgBytesPerSec | 4     | NCH * BPS * SPS  |
| nBlockAlign     | 2     | NCH * BPS * NCH  |
| wBitsPerSample  | 2     | BPS * 8          |
|                 | 4     | "data"           |
|                 | 4     | file size (data) |

data_size = DUR * NCH * SPS * BPS
file_size = 44 (Header) + data_size

### Reference:

http://www.topherlee.com/software/pcm-tut-wavformat.html
http://www-mmsp.ece.mcgill.ca/documents/audioformats/wave/wave.html
https://de.wikipedia.org/wiki/RIFF_WAVE

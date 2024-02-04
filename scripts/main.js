import Wav from './riff-wave-pcm.js'


const React = window.React
const ReactDOM = window.ReactDOM
const e = React.createElement

const radioOptions = [
    { label: 'sine', value: 'sine' },
    { label: 'square', value: 'square' },
]

const notes = [
    {
        frequency: 262,
        note: 'C/Do'
    },
    {
        frequency: 294,
        note: 'D/Re'
    },
    {
        frequency: 330,
        note: 'E/Mi'
    },
    {
        frequency: 349,
        note: 'F/Fa'
    },
    {
        frequency: 392,
        note: 'G/So'
    },
    {
        frequency: 440,
        note: 'A/La'
    },
    {
        frequency: 494,
        note: 'B/Si'
    },
    {
        frequency: 523,
        note: 'C/Do'
    },
    {
        frequency: 587,
        note: 'D/Re'
    },
    {
        frequency: 659,
        note: 'E/Mi'
    },
    {
        frequency: 698,
        note: 'F/Fa'
    },
    {
        frequency: 784,
        note: 'G/So'
    },
    {
        frequency: 880,
        note: 'A/La'
    },
    {
        frequency: 988,
        note: 'B/Si'
    }
]

class WavController extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            melody: [],
            notes: [],
            volume: 5,
            waveType: 'sine',
        }

        this.wav = new Wav(
            {
                duration: this.state.melody.length,
                numberOfChannel: 1,
                samplesPerSecond: 44100,
                bytesPerSample: 1,
            },
            this.state.melody,
            this.state.waveType,
            this.state.volume
        )
    }

    handleOptionChange = (e) => {
        console.log(e.target.value)
        this.setState({ waveType: e.target.value })
    }

    render() {
        this.wav.update(
            {
                duration: this.state.melody.length,
                numberOfChannel: 1,
                samplesPerSecond: 44100,
                bytesPerSample: 1,
            },
            this.state.melody,
            this.state.waveType,
            this.state.volume
        )

        return (
            e('div', {},
                // 音符选择
                e('div', {
                        onClick: e => {
                            // console.log(e)
                            // console.log(e.target)
                            // console.log(e.target.value)
                            // console.log(e.target.name)
                            let name = e.target.name
                            let value = e.target.value
                            if (!value) {
                                return
                            }
                            this.setState(prevState => {
                                // console.log(prevState.melody)
                                return {
                                    melody: [...prevState.melody, value],
                                    notes: [...prevState.notes, name],
                                }
                            })
                        }
                    },

                    notes.map(
                        (note) => e('button', {value: note.frequency, name: note.note}, note.note)
                    ),

                    e('p', {}, this.state.notes.join(",")),
                ),

                // 波形选择
                e('div', {},
                    radioOptions.map((option) => e(
                        'label', {key : option.label},
                        e('input', {
                            type: 'radio',
                            name: 'option',
                            value: option.value,
                            checked: this.state.waveType === option.value,
                            onChange: this.handleOptionChange.bind(this),
                        }), option.label
                    )),
                ),

                // 播放控件
                e('Audio', {
                    preload: 'auto',
                    src: "data:Audio/WAV;base64," + this.wav.audioData,
                    controls: "controls",
                })
            )
        )
    }
}

ReactDOM.render(e(WavController, {}), document.querySelector('#app'))

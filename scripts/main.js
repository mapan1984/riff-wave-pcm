import Wav from './SFX.js'
import {notes} from './data.js'


const React = window.React
const ReactDOM = window.ReactDOM
const e = React.createElement

const radioOptions = [
    { label: 'sine', value: 'sine' },
    { label: 'square', value: 'square' },
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
                            this.wav.play(value)
                            this.setState(prevState => {
                                // console.log(prevState.melody)
                                return {
                                    melody: [...prevState.melody, value],
                                    notes: [...prevState.notes, name],
                                }
                            })
                        }
                    },

                    e('div', {},
                        e('p', {}, '3'),
                        notes[3].map(
                            (note) => e('button', {value: note.frequency, name: note.note}, note.note)
                        ),
                    ),
                    e('div', {},
                        e('p', {}, '4'),
                        notes[4].map(
                            (note) => e('button', {value: note.frequency, name: note.note}, note.note)
                        ),
                    ),
                    e('div', {},
                        e('p', {}, '5'),
                        notes[5].map(
                            (note) => e('button', {value: note.frequency, name: note.note}, note.note)
                        ),
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

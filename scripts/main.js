import Wav from './riff-wave-pcm.js'
const React = window.React
const ReactDOM = window.ReactDOM
const e = React.createElement

class WavController extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            melody: [],
            volume: 50,
        }
    }

    render() {
        let option = {
            duration: this.state.melody.length,
            numberOfChannel: 1,
            samplesPerSecond: 44100,
            bytesPerSample: 1,
        }
        let wav = new Wav(option, this.state.melody, this.state.volume)
        return (
            e('div', {},
                e('div', {
                    onClick: e => {
                        let value = e.target.value
                        if (!value) {
                            return
                        }
                        this.setState(prevState => {
                            console.log(prevState.melody)
                            return {melody: [...prevState.melody, value]}
                        })
                    }
                },
                e('button', {value: 523}, '1'),
                e('button', {value: 587}, '2'),
                e('button', {value: 659}, '3'),
                e('button', {value: 698}, '4'),
                e('button', {value: 784}, '5'),
                e('button', {value: 880}, '6'),
                e('button', {value: 988}, '7'),
                e('p', {}, this.state.melody.join(","))
                ),
                e('Audio', {
                    preload: 'auto',
                    src: "data:Audio/WAV;base64," + wav.audioData,
                    controls: "controls",
                })
            )
        )
    }
}

ReactDOM.render(e(WavController, {}), document.querySelector('#app'))

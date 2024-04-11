
module lcc$gba {

const CHANNELSIZE = 4096;
const BUFFERSIZE = CHANNELSIZE * 4;

/**
 * 音频播放器
 */
export class AudioPlayer implements core.AudioDevice {
	private _buffer:RingBuffer = null;
	private _audioCtx:AudioContext = null;
	private _jsAudio:any = null;
	private _running:boolean = false;
	enable:boolean = true;

	constructor(){
		this._buffer = new RingBuffer(BUFFERSIZE * 2);
		//@ts-ignore
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if(window.AudioContext){
			this._audioCtx = new AudioContext();
			if (this._audioCtx.createScriptProcessor) {
				this._jsAudio = this._audioCtx.createScriptProcessor(CHANNELSIZE, 0, 2);
			} else {
				//@ts-ignore
				this._jsAudio = this._audioCtx.createJavaScriptNode(CHANNELSIZE, 0, 2);
			}
			this._jsAudio.onaudioprocess = this.onaudioprocess.bind(this);
		}
	}

	destory(){
		this.stop();
		this._jsAudio = null;
		if(this._audioCtx){
			this._audioCtx.close();
			this._audioCtx = null;
		}
	}

	play() {
		if(this._jsAudio){
			if(!this._running){
				this._running = true;
				try {
					this._jsAudio.connect(this._audioCtx.destination);
				} catch (e) {
					// Sigh
				}
			}
		}
	}
	
	stop() {
		if (this._jsAudio) {
			if(this._running){
				this._running = false;
				try {
					this._jsAudio.disconnect(this._audioCtx.destination);
				} catch (e) {
					// Sigh
				}
			}
		}
	}

	getSampleRate() {
		if(this._audioCtx){
			return this._audioCtx.sampleRate;
		}else{
			return 32768;
		}
	}
    
	writeSample(left, right) {
		if(this.enable){
			if (this._buffer.size() / 2 >= BUFFERSIZE) {
				console.log(`Buffer overrun`);
				this._buffer.deqN(BUFFERSIZE / 2);
			}
			this._buffer.enq(left);
			this._buffer.enq(right);
		}
	};
	
	onaudioprocess(e) {
		let left = e.outputBuffer.getChannelData(0);
		let right = e.outputBuffer.getChannelData(1);
		if(this.enable){
			let size = Math.min(CHANNELSIZE, this._buffer.size() / 2);
			let samples = this._buffer.deqN(size * 2);
			for (let i = 0; i < size; i++) {
				left[i] = samples[i * 2];
				right[i] = samples[i * 2 + 1];
			}
			for (let i = size; i< CHANNELSIZE; i++){
				left[i] = 0;
				right[i] = 0;
			}
		}else{
			for (let j = 0; j < CHANNELSIZE; j++) {
				left[j] = 0;
				right[j] = 0;
			}
		}
	};
}

}

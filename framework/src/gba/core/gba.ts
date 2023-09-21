
module lcc$gba.core {

export interface SaveData {
	code:string;
	data:string;
}

export interface StorageDevice {
	save(code:string, sdata:SaveData):void;
	load(code:string):SaveData;
}

export class GameBoyAdvance {
	LOG_ERROR = 1;
	LOG_WARN = 2;
	LOG_STUB = 4;
	LOG_INFO = 8;
	LOG_DEBUG = 16;

	storeDevice:StorageDevice;

	cpu:ARMCore;
	mmu:GameBoyAdvanceMMU;
	irq:GameBoyAdvanceInterruptHandler;
	io:GameBoyAdvanceIO;
	audio:GameBoyAdvanceAudio;
	video:GameBoyAdvanceVideo;
	keypad:GameBoyAdvanceKeypad;
	sio:GameBoyAdvanceSIO;

	rom:any;
	logLevel:number;

	doStep:Function;
	queueFrame:Function;
	paused:boolean;
	seenFrame:boolean;
	seenSave:boolean;
	lastVblank:number;
	queue:any;
	reportFPS:any;
	throttle:number;
	interval:boolean;

	constructor(opt:{
		audioDevice?:AudioDevice,
		storeDevice?:StorageDevice,
		videoDevice?:VideoDevice,
		onPollButtons?:Function,
	}){
		this.storeDevice = opt.storeDevice;
		this.logLevel = this.LOG_ERROR | this.LOG_WARN;

		this.rom = null;
	
		this.cpu = new ARMCore();
		this.mmu = new GameBoyAdvanceMMU()
		this.irq = new GameBoyAdvanceInterruptHandler();
		this.io = new GameBoyAdvanceIO();
		this.sio = new GameBoyAdvanceSIO();
		this.audio = new GameBoyAdvanceAudio(opt.audioDevice);
		this.video = new GameBoyAdvanceVideo(opt.videoDevice);
		this.keypad = new GameBoyAdvanceKeypad();
		
		// TODO: simplify this graph
		this.cpu.mmu = this.mmu;
		this.cpu.irq = this.irq;
	
		this.mmu.cpu = this.cpu;
		this.mmu.core = this;
	
		this.irq.cpu = this.cpu;
		this.irq.io = this.io;
		this.irq.audio = this.audio;
		this.irq.video = this.video;
		this.irq.core = this;
	
		this.io.cpu = this.cpu;
		this.io.audio = this.audio;
		this.io.video = this.video;
		this.io.keypad = this.keypad;
		this.io.sio = this.sio;
		this.io.core = this;
	
		this.audio.cpu = this.cpu;
		this.audio.core = this;
	
		this.video.cpu = this.cpu;
		this.video.core = this;
		
		this.sio.core = this;
	
		this.keypad.onPollButtons = opt.onPollButtons;
		this.doStep = this.waitFrame;
		this.paused = false;
		
		this.seenFrame = false;
		this.seenSave = false;
		this.lastVblank = 0;
	
		this.queue = null;
		this.reportFPS = null;
		this.throttle = 16; // This is rough, but the 2/3ms difference gives us a good overhead
	
		this.queueFrame = (f) => {
			this.queue = window.setTimeout(f, this.throttle);
		};
	
		this.video.vblankCallback = () => {
			this.seenFrame = true;
		};
	}

	setBios(bios, real?) {
		this.mmu.loadBios(bios, real);
	};
	
	setRom(rom) {
		this.reset();
	
		this.rom = this.mmu.loadRom(rom, true);
		if (!this.rom) {
			return false;
		}
		if(this.storeDevice){
			this.loadSavedata(this.storeDevice.load(this.mmu.cart.code));
		}
		return true;
	};
	
	hasRom() {
		return !!this.rom;
	};
	
	reset() {
		this.audio.pause(true);
	
		this.mmu.clear();
		this.io.clear();
		this.audio.clear();
		this.video.clear();
		this.sio.clear();
	
		this.mmu.mmap(this.mmu.REGION_IO, this.io);
		this.mmu.mmap(this.mmu.REGION_PALETTE_RAM, this.video.renderPath.palette);
		this.mmu.mmap(this.mmu.REGION_VRAM, this.video.renderPath.vram);
		this.mmu.mmap(this.mmu.REGION_OAM, this.video.renderPath.oam);
	
		this.cpu.resetCPU(0);
	};
	
	step() {
		while (this.doStep()) {
			this.cpu.step();
		}
	};
	
	waitFrame() {
		let seen = this.seenFrame;
		this.seenFrame = false;
		return !seen;
	};
	
	pause() {
		this.paused = true;
		this.audio.pause(true);
		if (this.queue) {
			clearTimeout(this.queue);
			this.queue = null;
		}
	};
	
	advanceFrame() {
		this.step();
		if (this.seenSave) {
			if (!this.mmu.saveNeedsFlush()) {
				this.seenSave = false;
				if(this.storeDevice){
					this.storeDevice.save(this.mmu.cart.code, this.getSavedata());
				}
			} else {
				this.mmu.flushSave();
			}
		} else if (this.mmu.saveNeedsFlush()) {
			this.seenSave = true;
			this.mmu.flushSave();
		}
	};
	
	runStable() {
		if (this.interval) {
			return; // Already running
		}
		let self = this;
		let timer = 0;
		let frames = 0;
		let runFunc;
		let start = Date.now();
		this.paused = false;
		this.audio.pause(false);
	
		if (this.reportFPS) {
			runFunc = () => {
				try {
					timer += Date.now() - start;
					if (self.paused) {
						return;
					} else {
						self.queueFrame(runFunc);
					}
					start = Date.now();
					self.advanceFrame();
					++frames;
					if (frames == 60) {
						self.reportFPS((frames * 1000) / timer);
						frames = 0;
						timer = 0;
					}
				} catch(exception) {
					self.ERROR(exception);
					if (exception.stack) {
						self.logStackTrace(exception.stack.split('\n'));
					}
					throw exception;
				}
			};
		} else {
			runFunc = () => {
				try {
					if (self.paused) {
						return;
					} else {
						self.queueFrame(runFunc);
					}
					self.advanceFrame();
				} catch(exception) {
					self.ERROR(exception);
					if (exception.stack) {
						self.logStackTrace(exception.stack.split('\n'));
					}
					throw exception;
				}
			};
		}
		self.queueFrame(runFunc);
	};

	buttonDown(b:Button){
		this.keypad.buttonDown(b);
	}

	buttonUp(b:Button){
		this.keypad.buttonUp(b);
	}

	updateButtons(value:number){
		this.keypad.updateButtons(value);
	}
	
	decodeBase64(string) {
		let length = (string.length * 3 / 4);
		if (string[string.length - 2] == '=') {
			length -= 2;
		} else if (string[string.length - 1] == '=') {
			length -= 1;
		}
		let buffer = new ArrayBuffer(length);
		let view = new Uint8Array(buffer);
		let bits = string.match(/..../g);
		let i = 0;
		for (; i + 2 < length; i += 3) {
			let s = atob(bits.shift());
			view[i] = s.charCodeAt(0);
			view[i + 1] = s.charCodeAt(1);
			view[i + 2] = s.charCodeAt(2);
		}
		if (i < length) {
			let s = atob(bits.shift());
			view[i++] = s.charCodeAt(0);
			if (s.length > 1) {
				view[i++] = s.charCodeAt(1);
			}
		}
	
		return buffer;
	};
	
	encodeBase64(view) {
		let data = [];
		let b;
		let wordstring = [];
		let triplet;
		for (let i = 0; i < view.byteLength; ++i) {
			b = view.getUint8(i, true);
			wordstring.push(String.fromCharCode(b));
			while (wordstring.length >= 3) {
				triplet = wordstring.splice(0, 3);
				data.push(btoa(triplet.join('')));
			}
		};
		if (wordstring.length) {
			data.push(btoa(wordstring.join('')));
		}
		return data.join('');
	};
	
	loadSavedata(sdata:SaveData) {
		if(this.hasRom()){
			if(sdata && sdata.code == this.mmu.cart.code){
				this.mmu.loadSavedata(this.decodeBase64(sdata.data));
				return true;
			}
		}
	};

	getSavedata():SaveData{
		if(this.hasRom()){
			let sram = this.mmu.save;
			return {
				code : this.mmu.cart.code,
				data : this.encodeBase64(sram.view),
			}
		}
	}
	
	freeze() {
		return {
			'cpu': this.cpu.freeze(),
			'mmu': this.mmu.freeze(),
			'irq': this.irq.freeze(),
			'io': this.io.freeze(),
			'audio': this.audio.freeze(),
			'video': this.video.freeze()
		}
	};
	
	defrost(frost) {
		this.cpu.defrost(frost.cpu);
		this.mmu.defrost(frost.mmu);
		this.audio.defrost(frost.audio);
		this.video.defrost(frost.video);
		this.irq.defrost(frost.irq);
		this.io.defrost(frost.io);
	};
	
	log(level, message) {};
	
	setLogger(logger) {
		this.log = logger;
	};
	
	logStackTrace(stack) {
		let overflow = stack.length - 32;
		this.ERROR('Stack trace follows:');
		if (overflow > 0) {
			this.log(-1, '> (Too many frames)');
		}
		for (let i = Math.max(overflow, 0); i < stack.length; ++i) {
			this.log(-1, '> ' + stack[i]);
		}
	};
	
	ERROR(error) {
		if (this.logLevel & this.LOG_ERROR) {
			this.log(this.LOG_ERROR, error);
		}
	};
	
	WARN(warn) {
		if (this.logLevel & this.LOG_WARN) {
			this.log(this.LOG_WARN, warn);
		}
	};
	
	STUB(func) {
		if (this.logLevel & this.LOG_STUB) {
			this.log(this.LOG_STUB, func);
		}
	};
	
	INFO(info) {
		if (this.logLevel & this.LOG_INFO) {
			this.log(this.LOG_INFO, info);
		}
	};
	
	DEBUG(info) {
		if (this.logLevel & this.LOG_DEBUG) {
			this.log(this.LOG_DEBUG, info);
		}
	};
	
	ASSERT_UNREACHED(err) {
		throw new Error("Should be unreached: " + err);
	};
	
	ASSERT(test, err) {
		if (!test) {
			throw new Error("Assertion failed: " + err);
		}
	};
	
}

}

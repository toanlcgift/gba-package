
module lcc$gba.core {

export class GameBoyAdvanceInterruptHandler {
	FREQUENCY = 0x1000000;

	IRQ_VBLANK = 0x0;
	IRQ_HBLANK = 0x1;
	IRQ_VCOUNTER = 0x2;
	IRQ_TIMER0 = 0x3;
	IRQ_TIMER1 = 0x4;
	IRQ_TIMER2 = 0x5;
	IRQ_TIMER3 = 0x6;
	IRQ_SIO = 0x7;
	IRQ_DMA0 = 0x8;
	IRQ_DMA1 = 0x9;
	IRQ_DMA2 = 0xA;
	IRQ_DMA3 = 0xB;
	IRQ_KEYPAD = 0xC;
	IRQ_GAMEPAK = 0xD;

	MASK_VBLANK = 0x0001;
	MASK_HBLANK = 0x0002;
	MASK_VCOUNTER = 0x0004;
	MASK_TIMER0 = 0x0008;
	MASK_TIMER1 = 0x0010;
	MASK_TIMER2 = 0x0020;
	MASK_TIMER3 = 0x0040;
	MASK_SIO = 0x0080;
	MASK_DMA0 = 0x0100;
	MASK_DMA1 = 0x0200;
	MASK_DMA2 = 0x0400;
	MASK_DMA3 = 0x0800;
	MASK_KEYPAD = 0x1000;
	MASK_GAMEPAK = 0x2000;
	
	cpu:ARMCore = null;
	video:GameBoyAdvanceVideo;
	audio:GameBoyAdvanceAudio;
	io:GameBoyAdvanceIO;
	core:GameBoyAdvance;
	
	enable = false;
	
	enabledIRQs:number;
	interruptFlags:number;
	dma:Array<any>;
	timersEnabled:number;
	timers:Array<any>;
	nextEvent:number;
	springIRQ:boolean;

	clear() {
		this.enable = false;
		this.enabledIRQs = 0;
		this.interruptFlags = 0;
	
		this.dma = new Array();
		for (let i = 0; i < 4; ++i) {
			this.dma.push({
				source: 0,
				dest: 0,
				count: 0,
				nextSource: 0,
				nextDest: 0,
				nextCount: 0,
				srcControl: 0,
				dstControl: 0,
				repeat: false,
				width: 0,
				drq: false,
				timing: 0,
				doIrq: false,
				enable: false,
				nextIRQ: 0
			});
		}
	
		this.timersEnabled = 0;
		this.timers = new Array();
		for (let i = 0; i < 4; ++i) {
			this.timers.push({
				reload: 0,
				oldReload: 0,
				prescaleBits: 0,
				countUp: false,
				doIrq: false,
				enable: false,
				lastEvent: 0,
				nextEvent: 0,
				overflowInterval: 1
			});
		}
	
		this.nextEvent = 0;
		this.springIRQ = false;
		this.resetSP();
	};
	
	freeze() {
		return {
			'enable': this.enable,
			'enabledIRQs': this.enabledIRQs,
			'interruptFlags': this.interruptFlags,
			'dma': this.dma,
			'timers': this.timers,
			'nextEvent': this.nextEvent,
			'springIRQ': this.springIRQ
		};
	};
	
	defrost(frost) {
		this.enable = frost.enable;
		this.enabledIRQs = frost.enabledIRQs;
		this.interruptFlags = frost.interruptFlags;
		this.dma = frost.dma;
		this.timers = frost.timers;
		this.timersEnabled = 0;
		if (this.timers[0].enable) {
			++this.timersEnabled;
		}
		if (this.timers[1].enable) {
			++this.timersEnabled;
		}
		if (this.timers[2].enable) {
			++this.timersEnabled;
		}
		if (this.timers[3].enable) {
			++this.timersEnabled;
		}
		this.nextEvent = frost.nextEvent;
		this.springIRQ = frost.springIRQ;
	};
	
	updateTimers() {
		if (this.nextEvent > this.cpu.cycles) {
			return;
		}
	
		if (this.springIRQ) {
			this.cpu.raiseIRQ();
			this.springIRQ = false;
		}
	
		this.video.updateTimers(this.cpu);
		this.audio.updateTimers();
		if (this.timersEnabled) {
			let timer = this.timers[0];
			if (timer.enable) {
				if (this.cpu.cycles >= timer.nextEvent) {
					timer.lastEvent = timer.nextEvent;
					timer.nextEvent += timer.overflowInterval;
					this.io.registers[this.io.TM0CNT_LO >> 1] = timer.reload;
					timer.oldReload = timer.reload;
	
					if (timer.doIrq) {
						this.raiseIRQ(this.IRQ_TIMER0);
					}
	
					if (this.audio.enabled) {
						if (this.audio.enableChannelA && !this.audio.soundTimerA && this.audio.dmaA >= 0) {
							this.audio.sampleFifoA();
						}
		
						if (this.audio.enableChannelB && !this.audio.soundTimerB && this.audio.dmaB >= 0) {
							this.audio.sampleFifoB();
						}
					}
	
					timer = this.timers[1];
					if (timer.countUp) {
						if (++this.io.registers[this.io.TM1CNT_LO >> 1] == 0x10000) {
							timer.nextEvent = this.cpu.cycles;
						}
					}
				}
			}
	
			timer = this.timers[1];
			if (timer.enable) {
				if (this.cpu.cycles >= timer.nextEvent) {
					timer.lastEvent = timer.nextEvent;
					timer.nextEvent += timer.overflowInterval;
					if (!timer.countUp || this.io.registers[this.io.TM1CNT_LO >> 1] == 0x10000) {
						this.io.registers[this.io.TM1CNT_LO >> 1] = timer.reload;
					}
					timer.oldReload = timer.reload;
	
					if (timer.doIrq) {
						this.raiseIRQ(this.IRQ_TIMER1);
					}
	
					if (timer.countUp) {
						timer.nextEvent = 0;
					}
	
					if (this.audio.enabled) {
						if (this.audio.enableChannelA && this.audio.soundTimerA && this.audio.dmaA >= 0) {
							this.audio.sampleFifoA();
						}
		
						if (this.audio.enableChannelB && this.audio.soundTimerB && this.audio.dmaB >= 0) {
							this.audio.sampleFifoB();
						}
					}
	
					timer = this.timers[2];
					if (timer.countUp) {
						if (++this.io.registers[this.io.TM2CNT_LO >> 1] == 0x10000) {
							timer.nextEvent = this.cpu.cycles;
						}
					}
				}
			}
	
			timer = this.timers[2];
			if (timer.enable) {
				if (this.cpu.cycles >= timer.nextEvent) {
					timer.lastEvent = timer.nextEvent;
					timer.nextEvent += timer.overflowInterval;
					if (!timer.countUp || this.io.registers[this.io.TM2CNT_LO >> 1] == 0x10000) {
						this.io.registers[this.io.TM2CNT_LO >> 1] = timer.reload;
					}
					timer.oldReload = timer.reload;
	
					if (timer.doIrq) {
						this.raiseIRQ(this.IRQ_TIMER2);
					}
	
					if (timer.countUp) {
						timer.nextEvent = 0;
					}
	
					timer = this.timers[3];
					if (timer.countUp) {
						if (++this.io.registers[this.io.TM3CNT_LO >> 1] == 0x10000) {
							timer.nextEvent = this.cpu.cycles;
						}
					}
				}
			}
	
			timer = this.timers[3];
			if (timer.enable) {
				if (this.cpu.cycles >= timer.nextEvent) {
					timer.lastEvent = timer.nextEvent;
					timer.nextEvent += timer.overflowInterval;
					if (!timer.countUp || this.io.registers[this.io.TM3CNT_LO >> 1] == 0x10000) {
						this.io.registers[this.io.TM3CNT_LO >> 1] = timer.reload;
					}
					timer.oldReload = timer.reload;
	
					if (timer.doIrq) {
						this.raiseIRQ(this.IRQ_TIMER3);
					}
	
					if (timer.countUp) {
						timer.nextEvent = 0;
					}
				}
			}
		}
	
		let dma = this.dma[0];
		if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
			dma.nextIRQ = 0;
			this.raiseIRQ(this.IRQ_DMA0);
		}
	
		dma = this.dma[1];
		if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
			dma.nextIRQ = 0;
			this.raiseIRQ(this.IRQ_DMA1);
		}
	
		dma = this.dma[2];
		if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
			dma.nextIRQ = 0;
			this.raiseIRQ(this.IRQ_DMA2);
		}
	
		dma = this.dma[3];
		if (dma.enable && dma.doIrq && dma.nextIRQ && this.cpu.cycles >= dma.nextIRQ) {
			dma.nextIRQ = 0;
			this.raiseIRQ(this.IRQ_DMA3);
		}
	
		this.pollNextEvent();
	}
	
	resetSP() {
		this.cpu.switchMode(this.cpu.MODE_SUPERVISOR);
		this.cpu.gprs[this.cpu.SP] = 0x3007FE0;
		this.cpu.switchMode(this.cpu.MODE_IRQ);
		this.cpu.gprs[this.cpu.SP] = 0x3007FA0;
		this.cpu.switchMode(this.cpu.MODE_SYSTEM);
		this.cpu.gprs[this.cpu.SP] = 0x3007F00;
	};
	
	swi32(opcode) {
		this.swi(opcode >> 16);
	};
	
	swi(opcode) {
		if (this.core.mmu.bios.real) {
			this.cpu.raiseTrap();
			return;
		}
		let result:number;
		let mod:number;

		switch (opcode) {
		case 0x00:
			// SoftReset
			let mem = this.core.mmu.memory[this.core.mmu.REGION_WORKING_IRAM];
			let flag = mem.loadU8(0x7FFA);
			for (let i = 0x7E00; i < 0x8000; i += 4) {
				mem.store32(i, 0);
			}
			this.resetSP();
			if (!flag) {
				this.cpu.gprs[this.cpu.LR] = 0x08000000;
			} else {
				this.cpu.gprs[this.cpu.LR] = 0x02000000;
			}
			this.cpu.switchExecMode(this.cpu.MODE_ARM);
			this.cpu.instruction.writesPC = true;
			this.cpu.gprs[this.cpu.PC] = this.cpu.gprs[this.cpu.LR];
			break;
		case 0x01:
			// RegisterRamReset
			let regions = this.cpu.gprs[0];
			if (regions & 0x01) {
				this.core.mmu.memory[this.core.mmu.REGION_WORKING_RAM] = new MemoryBlock(this.core.mmu.SIZE_WORKING_RAM, 9);
			}
			if (regions & 0x02) {
				for (let i = 0; i < this.core.mmu.SIZE_WORKING_IRAM - 0x200; i += 4) {
					this.core.mmu.memory[this.core.mmu.REGION_WORKING_IRAM].store32(i, 0);
				}
			}
			if (regions & 0x1C) {
				this.video.renderPath.clearSubsets(this.core.mmu, regions);
			}
			if (regions & 0xE0) {
				this.core.STUB('Unimplemented RegisterRamReset');
			}
			break;
		case 0x02:
			// Halt
			this.halt();
			break;
		case 0x05:
			// VBlankIntrWait
			this.cpu.gprs[0] = 1;
			this.cpu.gprs[1] = 1;
			// Fall through:
		case 0x04:
			// IntrWait
			if (!this.enable) {
				this.io.store16(this.io.IME, 1);
			}
			if (!this.cpu.gprs[0] && this.interruptFlags & this.cpu.gprs[1]) {
				return;
			}
			this.dismissIRQs(0xFFFFFFFF);
			this.cpu.raiseTrap();
			break;
		case 0x06:{
			// Div
			let result = (this.cpu.gprs[0] | 0) / (this.cpu.gprs[1] | 0);
			let mod = (this.cpu.gprs[0] | 0) % (this.cpu.gprs[1] | 0);
			this.cpu.gprs[0] = result | 0;
			this.cpu.gprs[1] = mod | 0;
			this.cpu.gprs[3] = Math.abs(result | 0);
			break;
		}
		case 0x07:
			// DivArm
			let result = (this.cpu.gprs[1] | 0) / (this.cpu.gprs[0] | 0);
			let mod = (this.cpu.gprs[1] | 0) % (this.cpu.gprs[0] | 0);
			this.cpu.gprs[0] = result | 0;
			this.cpu.gprs[1] = mod | 0;
			this.cpu.gprs[3] = Math.abs(result | 0);
			break;
		case 0x08:
			// Sqrt
			let root = Math.sqrt(this.cpu.gprs[0]);
			this.cpu.gprs[0] = root | 0; // Coerce down to int
			break;
		case 0x0A:
			// ArcTan2
			let x = this.cpu.gprs[0] / 16384;
			let y = this.cpu.gprs[1] / 16384;
			this.cpu.gprs[0] = (Math.atan2(y, x) / (2 * Math.PI)) * 0x10000;
			break;
		case 0x0B:{
			// CpuSet
			let source = this.cpu.gprs[0];
			let dest = this.cpu.gprs[1];
			let mode = this.cpu.gprs[2];
			let count = mode & 0x000FFFFF;
			let fill = mode & 0x01000000;
			let wordsize = (mode & 0x04000000) ? 4 : 2;
			if (fill) {
				if (wordsize == 4) {
					source &= 0xFFFFFFFC;
					dest &= 0xFFFFFFFC;
					let word = this.cpu.mmu.load32(source);
					for (let i = 0; i < count; ++i) {
						this.cpu.mmu.store32(dest + (i << 2), word);
					}
				} else {
					source &= 0xFFFFFFFE;
					dest &= 0xFFFFFFFE;
					let word = this.cpu.mmu.load16(source);
					for (let i = 0; i < count; ++i) {
						this.cpu.mmu.store16(dest + (i << 1), word);
					}
				}
			} else {
				if (wordsize == 4) {
					source &= 0xFFFFFFFC;
					dest &= 0xFFFFFFFC;
					for (let i = 0; i < count; ++i) {
						let word = this.cpu.mmu.load32(source + (i << 2));
						this.cpu.mmu.store32(dest + (i << 2), word);
					}
				} else {
					source &= 0xFFFFFFFE;
					dest &= 0xFFFFFFFE;
					for (let i = 0; i < count; ++i) {
						let word = this.cpu.mmu.load16(source + (i << 1));
						this.cpu.mmu.store16(dest + (i << 1), word);
					}
				}
			}
			return;
		}
		case 0x0C:
			// FastCpuSet
			let source = this.cpu.gprs[0] & 0xFFFFFFFC;
			let dest = this.cpu.gprs[1] & 0xFFFFFFFC;
			let mode = this.cpu.gprs[2];
			let count = mode & 0x000FFFFF;
			count = ((count + 7) >> 3) << 3;
			let fill = mode & 0x01000000;
			if (fill) {
				let word = this.cpu.mmu.load32(source);
				for (let i = 0; i < count; ++i) {
					this.cpu.mmu.store32(dest + (i << 2), word);
				}
			} else {
				for (let i = 0; i < count; ++i) {
					let word = this.cpu.mmu.load32(source + (i << 2));
					this.cpu.mmu.store32(dest + (i << 2), word);
				}
			}
			return;
		case 0x0E:{
			// BgAffineSet
			let i = this.cpu.gprs[2];
			let ox, oy;
			let cx, cy;
			let sx, sy;
			let theta;
			let offset = this.cpu.gprs[0];
			let destination = this.cpu.gprs[1];
			let a, b, c, d;
			let rx, ry;
			while (i--) {
				// [ sx   0  0 ]   [ cos(theta)  -sin(theta)  0 ]   [ 1  0  cx - ox ]   [ A B rx ]
				// [  0  sy  0 ] * [ sin(theta)   cos(theta)  0 ] * [ 0  1  cy - oy ] = [ C D ry ]
				// [  0   0  1 ]   [     0            0       1 ]   [ 0  0     1    ]   [ 0 0  1 ]
				ox = this.core.mmu.load32(offset) / 256;
				oy = this.core.mmu.load32(offset + 4) / 256;
				cx = this.core.mmu.load16(offset + 8);
				cy = this.core.mmu.load16(offset + 10);
				sx = this.core.mmu.load16(offset + 12) / 256;
				sy = this.core.mmu.load16(offset + 14) / 256;
				theta = (this.core.mmu.loadU16(offset + 16) >> 8) / 128 * Math.PI;
				offset += 20;
				// Rotation
				a = d = Math.cos(theta);
				b = c = Math.sin(theta);
				// Scale
				a *= sx;
				b *= -sx;
				c *= sy;
				d *= sy;
				// Translate
				rx = ox - (a * cx + b * cy);
				ry = oy - (c * cx + d * cy);
				this.core.mmu.store16(destination, (a * 256) | 0);
				this.core.mmu.store16(destination + 2, (b * 256) | 0);
				this.core.mmu.store16(destination + 4, (c * 256) | 0);
				this.core.mmu.store16(destination + 6, (d * 256) | 0);
				this.core.mmu.store32(destination + 8, (rx * 256) | 0);
				this.core.mmu.store32(destination + 12, (ry * 256) | 0);
				destination += 16;
			}
			break;
		}
		case 0x0F:
			// ObjAffineSet
			let i = this.cpu.gprs[2];
			let sx, sy;
			let theta;
			let offset = this.cpu.gprs[0];
			let destination = this.cpu.gprs[1]
			let diff = this.cpu.gprs[3];
			let a, b, c, d;
			while (i--) {
				// [ sx   0 ]   [ cos(theta)  -sin(theta) ]   [ A B ]
				// [  0  sy ] * [ sin(theta)   cos(theta) ] = [ C D ]
				sx = this.core.mmu.load16(offset) / 256;
				sy = this.core.mmu.load16(offset + 2) / 256;
				theta = (this.core.mmu.loadU16(offset + 4) >> 8) / 128 * Math.PI;
				offset += 6;
				// Rotation
				a = d = Math.cos(theta);
				b = c = Math.sin(theta);
				// Scale
				a *= sx;
				b *= -sx;
				c *= sy;
				d *= sy;
				this.core.mmu.store16(destination, (a * 256) | 0);
				this.core.mmu.store16(destination + diff, (b * 256) | 0);
				this.core.mmu.store16(destination + diff * 2, (c * 256) | 0);
				this.core.mmu.store16(destination + diff * 3, (d * 256) | 0);
				destination += diff * 4;
			}
			break;
		case 0x11:
			// LZ77UnCompWram
			this.lz77(this.cpu.gprs[0], this.cpu.gprs[1], 1);
			break;
		case 0x12:
			// LZ77UnCompVram
			this.lz77(this.cpu.gprs[0], this.cpu.gprs[1], 2);
			break;
		case 0x13:
			// HuffUnComp
			this.huffman(this.cpu.gprs[0], this.cpu.gprs[1]);
			break;
		case 0x14:
			// RlUnCompWram
			this.rl(this.cpu.gprs[0], this.cpu.gprs[1], 1);
			break;
		case 0x15:
			// RlUnCompVram
			this.rl(this.cpu.gprs[0], this.cpu.gprs[1], 2);
			break;
		case 0x1F:
			// MidiKey2Freq
			let key = this.cpu.mmu.load32(this.cpu.gprs[0] + 4);
			this.cpu.gprs[0] = key / Math.pow(2, (180 - this.cpu.gprs[1] - this.cpu.gprs[2] / 256) / 12) >>> 0;
			break;
		default:
			throw "Unimplemented software interrupt: 0x" + opcode.toString(16);
		}
	};
	
	masterEnable(value) {
		this.enable = value;
	
		if (this.enable && this.enabledIRQs & this.interruptFlags) {
			this.cpu.raiseIRQ();
		}
	};
	
	setInterruptsEnabled(value) {
		this.enabledIRQs = value;
	
		if (this.enabledIRQs & this.MASK_SIO) {
			this.core.STUB('Serial I/O interrupts not implemented');
		}
	
		if (this.enabledIRQs & this.MASK_KEYPAD) {
			this.core.STUB('Keypad interrupts not implemented');
		}
	
		if (this.enable && this.enabledIRQs & this.interruptFlags) {
			this.cpu.raiseIRQ();
		}
	};
	
	pollNextEvent() {
		let nextEvent = this.video.nextEvent;
		let test;
	
		if (this.audio.enabled) {
			test = this.audio.nextEvent;
			if (!nextEvent || test < nextEvent) {
				nextEvent = test;
			}
		}
	
		if (this.timersEnabled) {
			let timer = this.timers[0];
			test = timer.nextEvent;
			if (timer.enable && test && (!nextEvent || test < nextEvent)) {
				nextEvent = test;
			}
	
			timer = this.timers[1];
			test = timer.nextEvent;
			if (timer.enable && test && (!nextEvent || test < nextEvent)) {
				nextEvent = test;
			}
			timer = this.timers[2];
			test = timer.nextEvent;
			if (timer.enable && test && (!nextEvent || test < nextEvent)) {
				nextEvent = test;
			}
			timer = this.timers[3];
			test = timer.nextEvent;
			if (timer.enable && test && (!nextEvent || test < nextEvent)) {
				nextEvent = test;
			}
		}
	
		let dma = this.dma[0];
		test = dma.nextIRQ;
		if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
	
		dma = this.dma[1];
		test = dma.nextIRQ;
		if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
	
		dma = this.dma[2];
		test = dma.nextIRQ;
		if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
	
		dma = this.dma[3];
		test = dma.nextIRQ;
		if (dma.enable && dma.doIrq && test && (!nextEvent || test < nextEvent)) {
			nextEvent = test;
		}
	
		this.core.ASSERT(nextEvent >= this.cpu.cycles, "Next event is before present");
		this.nextEvent = nextEvent;
	};
	
	waitForIRQ() {
		let timer;
		let irqPending = this.testIRQ() || this.video.hblankIRQ || this.video.vblankIRQ || this.video.vcounterIRQ;
		if (this.timersEnabled) {
			timer = this.timers[0];
			irqPending = irqPending || timer.doIrq;
			timer = this.timers[1];
			irqPending = irqPending || timer.doIrq;
			timer = this.timers[2];
			irqPending = irqPending || timer.doIrq;
			timer = this.timers[3];
			irqPending = irqPending || timer.doIrq;
		}
		if (!irqPending) {
			return false;
		}
	
		for (;;) {
			this.pollNextEvent();
	
			if (!this.nextEvent) {
				return false;
			} else {
				this.cpu.cycles = this.nextEvent;
				this.updateTimers();
				if (this.interruptFlags) {
					return true;
				}
			}
		}
	};
	
	testIRQ() {
		if (this.enable && this.enabledIRQs & this.interruptFlags) {
			this.springIRQ = true;
			this.nextEvent = this.cpu.cycles;
			return true;
		}
		return false;
	};
	
	raiseIRQ(irqType) {
		this.interruptFlags |= 1 << irqType;
		this.io.registers[this.io.IF >> 1] = this.interruptFlags;
	
		if (this.enable && (this.enabledIRQs & 1 << irqType)) {
			this.cpu.raiseIRQ();
		}
	};
	
	dismissIRQs(irqMask) {
		this.interruptFlags &= ~irqMask;
		this.io.registers[this.io.IF >> 1] = this.interruptFlags;
	};
	
	dmaSetSourceAddress(dma, address) {
		this.dma[dma].source = address & 0xFFFFFFFE;
	};
	
	dmaSetDestAddress(dma, address) {
		this.dma[dma].dest = address & 0xFFFFFFFE;
	};
	
	dmaSetWordCount(dma, count) {
		this.dma[dma].count = count ? count : (dma == 3 ? 0x10000 : 0x4000);
	};
	
	dmaWriteControl(dma, control) {
		let currentDma = this.dma[dma];
		let wasEnabled = currentDma.enable;
		currentDma.dstControl = (control & 0x0060) >> 5;
		currentDma.srcControl = (control & 0x0180) >> 7;
		currentDma.repeat = !!(control & 0x0200);
		currentDma.width = (control & 0x0400) ? 4 : 2;
		currentDma.drq = !!(control & 0x0800);
		currentDma.timing = (control & 0x3000) >> 12;
		currentDma.doIrq = !!(control & 0x4000);
		currentDma.enable = !!(control & 0x8000);
		currentDma.nextIRQ = 0;
	
		if (currentDma.drq) {
			this.core.WARN('DRQ not implemented');
		}
	
		if (!wasEnabled && currentDma.enable) {
			currentDma.nextSource = currentDma.source;
			currentDma.nextDest = currentDma.dest;
			currentDma.nextCount = currentDma.count;
			this.cpu.mmu.scheduleDma(dma, currentDma);
		}
	};
	
	timerSetReload(timer, reload) {
		this.timers[timer].reload = reload & 0xFFFF;
	};
	
	timerWriteControl(timer, control) {
		let currentTimer = this.timers[timer];
		let oldPrescale = currentTimer.prescaleBits;
		switch (control & 0x0003) {
		case 0x0000:
			currentTimer.prescaleBits = 0;
			break;
		case 0x0001:
			currentTimer.prescaleBits = 6;
			break;
		case 0x0002:
			currentTimer.prescaleBits = 8;
			break;
		case 0x0003:
			currentTimer.prescaleBits = 10;
			break;
		}
		currentTimer.countUp = !!(control & 0x0004);
		currentTimer.doIrq = !!(control & 0x0040);
		currentTimer.overflowInterval = (0x10000 - currentTimer.reload) << currentTimer.prescaleBits;
		let wasEnabled = currentTimer.enable;
		currentTimer.enable = !!(((control & 0x0080) >> 7) << timer);
		if (!wasEnabled && currentTimer.enable) {
			if (!currentTimer.countUp) {
				currentTimer.lastEvent = this.cpu.cycles;
				currentTimer.nextEvent = this.cpu.cycles + currentTimer.overflowInterval;
			} else {
				currentTimer.nextEvent = 0;
			}
			this.io.registers[(this.io.TM0CNT_LO + (timer << 2)) >> 1] = currentTimer.reload;
			currentTimer.oldReload = currentTimer.reload;
			++this.timersEnabled;
		} else if (wasEnabled && !currentTimer.enable) {
			if (!currentTimer.countUp) {
				this.io.registers[(this.io.TM0CNT_LO + (timer << 2)) >> 1] = currentTimer.oldReload + (this.cpu.cycles - currentTimer.lastEvent) >> oldPrescale;
			}
			--this.timersEnabled;
		} else if (currentTimer.prescaleBits != oldPrescale && !currentTimer.countUp) {
			// FIXME: this might be before present
			currentTimer.nextEvent = currentTimer.lastEvent + currentTimer.overflowInterval;
		}
	
		// We've changed the timers somehow...we need to reset the next event
		this.pollNextEvent();
	};
	
	timerRead(timer) {
		let currentTimer = this.timers[timer];
		if (currentTimer.enable && !currentTimer.countUp) {
			return currentTimer.oldReload + (this.cpu.cycles - currentTimer.lastEvent) >> currentTimer.prescaleBits;
		} else {
			return this.io.registers[(this.io.TM0CNT_LO + (timer << 2)) >> 1];
		}
	};
	
	halt() {
		if (!this.enable) {
			throw "Requested HALT when interrupts were disabled!";
		}
		if (!this.waitForIRQ()) {
			throw "Waiting on interrupt forever.";
		}
	}
	
	lz77(source, dest, unitsize) {
		// TODO: move to a different file
		let remaining = (this.cpu.mmu.load32(source) & 0xFFFFFF00) >> 8;
		// We assume the signature byte (0x10) is correct
		let blockheader;
		let sPointer = source + 4;
		let dPointer = dest;
		let blocksRemaining = 0;
		let block;
		let disp;
		let bytes;
		let buffer = 0;
		let loaded;
		while (remaining > 0) {
			if (blocksRemaining) {
				if (blockheader & 0x80) {
					// Compressed
					block = this.cpu.mmu.loadU8(sPointer) | (this.cpu.mmu.loadU8(sPointer + 1) << 8);
					sPointer += 2;
					disp = dPointer - (((block & 0x000F) << 8) | ((block & 0xFF00) >> 8)) - 1;
					bytes = ((block & 0x00F0) >> 4) + 3;
					while (bytes-- && remaining) {
						loaded = this.cpu.mmu.loadU8(disp++);
						if (unitsize == 2) {
							buffer >>= 8;
							buffer |= loaded << 8;
							if (dPointer & 1) {
								this.cpu.mmu.store16(dPointer - 1, buffer);
							}
						} else {
							this.cpu.mmu.store8(dPointer, loaded);
						}
						--remaining;
						++dPointer;
					}
				} else {
					// Uncompressed
					loaded = this.cpu.mmu.loadU8(sPointer++);
					if (unitsize == 2) {
						buffer >>= 8;
						buffer |= loaded << 8;
						if (dPointer & 1) {
							this.cpu.mmu.store16(dPointer - 1, buffer);
						}
					} else {
						this.cpu.mmu.store8(dPointer, loaded);
					}
					--remaining;
					++dPointer;
				}
				blockheader <<= 1;
				--blocksRemaining;
			} else {
				blockheader = this.cpu.mmu.loadU8(sPointer++);
				blocksRemaining = 8;
			}
		}
	};
	
	huffman(source, dest) {
		source = source & 0xFFFFFFFC;
		let header = this.cpu.mmu.load32(source);
		let remaining = header >> 8;
		let bits = header & 0xF;
		if (32 % bits) {
			throw 'Unimplemented unaligned Huffman';
		}
		let padding = (4 - remaining) & 0x3;
		remaining &= 0xFFFFFFFC;
		// We assume the signature byte (0x20) is correct
		let tree = [];
		let treesize = (this.cpu.mmu.loadU8(source + 4) << 1) + 1;
		let block;
		let sPointer = source + 5 + treesize;
		let dPointer = dest & 0xFFFFFFFC;
		let i;
		for (i = 0; i < treesize; ++i) {
			tree.push(this.cpu.mmu.loadU8(source + 5 + i));
		}
		let node;
		let offset = 0;
		let bitsRemaining;
		let readBits;
		let bitsSeen = 0;
		node = tree[0];
		while (remaining > 0) {
			let bitstream = this.cpu.mmu.load32(sPointer);
			sPointer += 4;
			for (bitsRemaining = 32; bitsRemaining > 0; --bitsRemaining, bitstream <<= 1) {
				if (typeof (node) === 'number') {
					// Lazily construct tree
					let next = (offset - 1 | 1) + ((node & 0x3F) << 1) + 2;
					node = {
						l: next,
						r: next + 1,
						lTerm: node & 0x80,
						rTerm: node & 0x40
					};
					tree[offset] = node;
				}
	
				if (bitstream & 0x80000000) {
					// Go right
					if (node.rTerm) {
						readBits = tree[node.r];
					} else {
						offset = node.r;
						node = tree[node.r];
						continue;
					}
				} else {
					// Go left
					if (node.lTerm) {
						readBits = tree[node.l];
					} else {
						offset = node.l;
						node = tree[offset];
						continue;
					}
				}
	
				block |= (readBits & ((1 << bits) - 1)) << bitsSeen;
				bitsSeen += bits;
				offset = 0;
				node = tree[0];
				if (bitsSeen == 32) {
					bitsSeen = 0;
					this.cpu.mmu.store32(dPointer, block);
					dPointer += 4;
					remaining -= 4;
					block = 0;
				}
			}
	
		}
		if (padding) {
			this.cpu.mmu.store32(dPointer, block);
		}
	};
	
	rl(source, dest, unitsize) {
		source = source & 0xFFFFFFFC;
		let remaining = (this.cpu.mmu.load32(source) & 0xFFFFFF00) >> 8;
		let padding = (4 - remaining) & 0x3;
		// We assume the signature byte (0x30) is correct
		let blockheader;
		let block;
		let sPointer = source + 4;
		let dPointer = dest;
		let buffer = 0;
		while (remaining > 0) {
			blockheader = this.cpu.mmu.loadU8(sPointer++);
			if (blockheader & 0x80) {
				// Compressed
				blockheader &= 0x7F;
				blockheader += 3;
				block = this.cpu.mmu.loadU8(sPointer++);
				while (blockheader-- && remaining) {
					--remaining;
					if (unitsize == 2) {
						buffer >>= 8;
						buffer |= block << 8;
						if (dPointer & 1) {
							this.cpu.mmu.store16(dPointer - 1, buffer);
						}
					} else {
						this.cpu.mmu.store8(dPointer, block);
					}
					++dPointer;
				}
			} else {
				// Uncompressed
				blockheader++;
				while (blockheader-- && remaining) {
					--remaining;
					block = this.cpu.mmu.loadU8(sPointer++);
					if (unitsize == 2) {
						buffer >>= 8;
						buffer |= block << 8;
						if (dPointer & 1) {
							this.cpu.mmu.store16(dPointer - 1, buffer);
						}
					} else {
						this.cpu.mmu.store8(dPointer, block);
					}
					++dPointer;
				}
			}
		}
		while (padding--) {
			this.cpu.mmu.store8(dPointer++, 0);
		}
	};
	
}

}

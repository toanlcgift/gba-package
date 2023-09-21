
module lcc$gba.core {

export class ARMCoreArm {
	cpu:ARMCore = null;
	
	addressingMode23Immediate:((rn, offset, condOp)=>Function | null)[] = null;
	addressingMode23Register:((rn, rm, condOp)=>Function | null)[] = null;
	addressingMode2RegisterShifted:((rn, shiftOp, condOp)=>Function | null)[] = null;

	constructor(cpu:ARMCore){
		this.cpu = cpu;

		this.addressingMode23Immediate = [
			// 000x0
			function(rn, offset, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn];
					if (!condOp || condOp()) {
						gprs[rn] -= offset;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			// 000xW
			null,

			null,
			null,

			// 00Ux0
			function(rn, offset, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn];
					if (!condOp || condOp()) {
						gprs[rn] += offset;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			// 00UxW
			null,

			null,
			null,

			// 0P0x0
			function(rn, offset, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] - offset;
					return addr;
				};
				// @ts-ignore
				address.writesPC = false;
				return address;
			},

			// 0P0xW
			function(rn, offset, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] - offset;
					if (!condOp || condOp()) {
						gprs[rn] = addr;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			null,
			null,

			// 0PUx0
			function(rn, offset, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] + offset;
					return addr;
				};
				// @ts-ignore
				address.writesPC = false;
				return address;
			},

			// 0PUxW
			function(rn, offset, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] + offset;
					if (!condOp || condOp()) {
						gprs[rn] = addr;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			null,
			null,
		];

		this.addressingMode23Register = [
			// I00x0
			function(rn, rm, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn];
					if (!condOp || condOp()) {
						gprs[rn] -= gprs[rm];
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			// I00xW
			null,

			null,
			null,

			// I0Ux0
			function(rn, rm, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn];
					if (!condOp || condOp()) {
						gprs[rn] += gprs[rm];
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			// I0UxW
			null,

			null,
			null,

			// IP0x0
			function(rn, rm, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					return gprs[rn] - gprs[rm];
				};
				// @ts-ignore
				address.writesPC = false;
				return address;
			},

			// IP0xW
			function(rn, rm, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] - gprs[rm];
					if (!condOp || condOp()) {
						gprs[rn] = addr;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			null,
			null,

			// IPUx0
			function(rn, rm, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] + gprs[rm];
					return addr;
				};
				// @ts-ignore
				address.writesPC = false;
				return address;
			},

			// IPUxW
			function(rn, rm, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn] + gprs[rm];
					if (!condOp || condOp()) {
						gprs[rn] = addr;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			null,
			null
		];

		this.addressingMode2RegisterShifted = [
			// I00x0
			function(rn, shiftOp, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn];
					if (!condOp || condOp()) {
						shiftOp();
						gprs[rn] -= cpu.shifterOperand;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			// I00xW
			null,

			null,
			null,

			// I0Ux0
			function(rn, shiftOp, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					let addr = gprs[rn];
					if (!condOp || condOp()) {
						shiftOp();
						gprs[rn] += cpu.shifterOperand;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},
			// I0UxW
			null,

			null,
			null,

			// IP0x0
			function(rn, shiftOp, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					shiftOp();
					return gprs[rn] - cpu.shifterOperand;
				};
				// @ts-ignore
				address.writesPC = false;
				return address;
			},

			// IP0xW
			function(rn, shiftOp, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					shiftOp();
					let addr = gprs[rn] - cpu.shifterOperand;
					if (!condOp || condOp()) {
						gprs[rn] = addr;
					}
					return addr;
				};
				// @ts-ignore
				address.writesPC = rn == cpu.PC;
				return address;
			},

			null,
			null,

			// IPUx0
			function(rn, shiftOp, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					shiftOp();
					return gprs[rn] + cpu.shifterOperand;
				};
				// @ts-ignore
				address.writesPC = false;
				return address;
			},

			// IPUxW
			function(rn, shiftOp, condOp) {
				let gprs = cpu.gprs;
				let address = function() {
					shiftOp();
					let addr = gprs[rn] + cpu.shifterOperand;
					if (!condOp || condOp()) {
						gprs[rn] = addr;
					}
					return addr;
				};
				// @ts-ignore
				address.writePC = rn == cpu.PC;
				return address;
			},

			null,
			null,
		];
	}

	constructAddressingMode1ASR(rs, rm) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			++cpu.cycles;
			let shift = gprs[rs];
			if (rs == cpu.PC) {
				shift += 4;
			}
			shift &= 0xFF;
			let shiftVal =  gprs[rm];
			if (rm == cpu.PC) {
				shiftVal += 4;
			}
			if (shift == 0) {
				cpu.shifterOperand = shiftVal;
				cpu.shifterCarryOut = cpu.cpsrC;
			} else if (shift < 32) {
				cpu.shifterOperand = shiftVal >> shift;
				cpu.shifterCarryOut = shiftVal & (1 << (shift - 1));
			} else if (gprs[rm] >> 31) {
				cpu.shifterOperand = 0xFFFFFFFF;
				cpu.shifterCarryOut = 0x80000000;
			} else {
				cpu.shifterOperand = 0;
				cpu.shifterCarryOut = 0;
			}
		};
	};
	
	constructAddressingMode1Immediate(immediate) {
		let cpu = this.cpu;
		return function() {
			cpu.shifterOperand = immediate;
			cpu.shifterCarryOut = cpu.cpsrC;
		};
	};
	
	constructAddressingMode1ImmediateRotate(immediate, rotate) {
		let cpu = this.cpu;
		return function() {
			cpu.shifterOperand = (immediate >>> rotate) | (immediate << (32 - rotate));
			cpu.shifterCarryOut = cpu.shifterOperand >> 31;
		}
	};
	
	constructAddressingMode1LSL(rs, rm) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			++cpu.cycles;
			let shift = gprs[rs];
			if (rs == cpu.PC) {
				shift += 4;
			}
			shift &= 0xFF;
			let shiftVal =  gprs[rm];
			if (rm == cpu.PC) {
				shiftVal += 4;
			}
			if (shift == 0) {
				cpu.shifterOperand = shiftVal;
				cpu.shifterCarryOut = cpu.cpsrC;
			} else if (shift < 32) {
				cpu.shifterOperand = shiftVal << shift;
				cpu.shifterCarryOut = shiftVal & (1 << (32 - shift));
			} else if (shift == 32) {
				cpu.shifterOperand = 0;
				cpu.shifterCarryOut = shiftVal & 1;
			} else {
				cpu.shifterOperand = 0;
				cpu.shifterCarryOut = 0;
			}
		};
	};
	
	constructAddressingMode1LSR(rs, rm) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			++cpu.cycles;
			let shift = gprs[rs];
			if (rs == cpu.PC) {
				shift += 4;
			}
			shift &= 0xFF;
			let shiftVal =  gprs[rm];
			if (rm == cpu.PC) {
				shiftVal += 4;
			}
			if (shift == 0) {
				cpu.shifterOperand = shiftVal;
				cpu.shifterCarryOut = cpu.cpsrC;
			} else if (shift < 32) {
				cpu.shifterOperand = shiftVal >>> shift;
				cpu.shifterCarryOut = shiftVal & (1 << (shift - 1));
			} else if (shift == 32) {
				cpu.shifterOperand = 0;
				cpu.shifterCarryOut = shiftVal >> 31;
			} else {
				cpu.shifterOperand = 0;
				cpu.shifterCarryOut = 0;
			}
		};
	};
	
	constructAddressingMode1ROR(rs, rm) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			++cpu.cycles;
			let shift = gprs[rs];
			if (rs == cpu.PC) {
				shift += 4;
			}
			shift &= 0xFF;
			let shiftVal =  gprs[rm];
			if (rm == cpu.PC) {
				shiftVal += 4;
			}
			let rotate = shift & 0x1F;
			if (shift == 0) {
				cpu.shifterOperand = shiftVal;
				cpu.shifterCarryOut = cpu.cpsrC;
			} else if (rotate) {
				cpu.shifterOperand = (gprs[rm] >>> rotate) | (gprs[rm] << (32 - rotate));
				cpu.shifterCarryOut = shiftVal & (1 << (rotate - 1));
			} else {
				cpu.shifterOperand = shiftVal;
				cpu.shifterCarryOut = shiftVal >> 31;
			}
		};
	};
	
	constructAddressingMode23Immediate(instruction, immediate, condOp) {
		let rn = (instruction & 0x000F0000) >> 16;
		return this.addressingMode23Immediate[(instruction & 0x01A00000) >> 21](rn, immediate, condOp);
	};
	
	constructAddressingMode23Register(instruction, rm, condOp) {
		let rn = (instruction & 0x000F0000) >> 16;
		return this.addressingMode23Register[(instruction & 0x01A00000) >> 21](rn, rm, condOp);
	};
	
	constructAddressingMode2RegisterShifted(instruction, shiftOp, condOp) {
		let rn = (instruction & 0x000F0000) >> 16;
		return this.addressingMode2RegisterShifted[(instruction & 0x01A00000) >> 21](rn, shiftOp, condOp);
	};
	
	constructAddressingMode4(immediate, rn) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			let addr = gprs[rn] + immediate;
			return addr;
		}
	};
	
	constructAddressingMode4Writeback(immediate, offset, rn, overlap) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function(writeInitial) {
			let addr = gprs[rn] + immediate;
			if (writeInitial && overlap) {
				cpu.mmu.store32(gprs[rn] + immediate - 4, gprs[rn]);
			}
			gprs[rn] += offset;
			return addr;
		}
	};
	

	constructADC(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			//@ts-ignore
			let shifterOperand = (cpu.shifterOperand >>> 0) + !!cpu.cpsrC;
			gprs[rd] = (gprs[rn] >>> 0) + shifterOperand;
		};
	};
	
	constructADCS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			//@ts-ignore
			let shifterOperand = (cpu.shifterOperand >>> 0) + !!cpu.cpsrC;
			let d = (gprs[rn] >>> 0) + shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(d >> 31);
				cpu.cpsrZ = !(d & 0xFFFFFFFF);
				cpu.cpsrC = d > 0xFFFFFFFF;
				cpu.cpsrV = (gprs[rn] >> 31) == (shifterOperand >> 31) &&
							(gprs[rn] >> 31) != (d >> 31) &&
							(shifterOperand >> 31) != (d >> 31);
			}
			gprs[rd] = d;
		};
	};
	
	constructADD(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = (gprs[rn] >>> 0) + (cpu.shifterOperand >>> 0);
		};
	};
	
	constructADDS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let d = (gprs[rn] >>> 0) + (cpu.shifterOperand >>> 0);
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(d >> 31);
				cpu.cpsrZ = !(d & 0xFFFFFFFF);
				cpu.cpsrC = d > 0xFFFFFFFF;
				cpu.cpsrV = (gprs[rn] >> 31) == (cpu.shifterOperand >> 31) &&
							(gprs[rn] >> 31) != (d >> 31) &&
							(cpu.shifterOperand >> 31) != (d >> 31);
			}
			gprs[rd] = d;
		};
	};
	
	constructAND(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] & cpu.shifterOperand;
		};
	};
	
	constructANDS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] & cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(gprs[rd] >> 31);
				cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
				cpu.cpsrC = !!(cpu.shifterCarryOut);
			}
		};
	};
	
	constructB(immediate, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			gprs[cpu.PC] += immediate;
		};
	};
	
	constructBIC(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] & ~cpu.shifterOperand;
		};
	};
	
	constructBICS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] & ~cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(gprs[rd] >> 31);
				cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
				cpu.cpsrC = !!(cpu.shifterCarryOut);
			}
		};
	};
	
	constructBL(immediate, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			gprs[cpu.LR] = gprs[cpu.PC] - 4;
			gprs[cpu.PC] += immediate;
		};
	};
	
	constructBX(rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			cpu.switchExecMode(gprs[rm] & 0x00000001);
			gprs[cpu.PC] = gprs[rm] & 0xFFFFFFFE;
		};
	};
	
	constructCMN(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let aluOut = (gprs[rn] >>> 0) + (cpu.shifterOperand >>> 0);
			cpu.cpsrN = !!(aluOut >> 31);
			cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
			cpu.cpsrC = aluOut > 0xFFFFFFFF;
			cpu.cpsrV = (gprs[rn] >> 31) == (cpu.shifterOperand >> 31) &&
						(gprs[rn] >> 31) != (aluOut >> 31) &&
						(cpu.shifterOperand >> 31) != (aluOut >> 31);
		};
	};
	
	constructCMP(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let aluOut = gprs[rn] - cpu.shifterOperand;
			cpu.cpsrN = !!(aluOut >> 31);
			cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
			cpu.cpsrC = (gprs[rn] >>> 0) >= (cpu.shifterOperand >>> 0);
			cpu.cpsrV = (gprs[rn] >> 31) != (cpu.shifterOperand >> 31) &&
						(gprs[rn] >> 31) != (aluOut >> 31);
		};
	};
	
	constructEOR(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] ^ cpu.shifterOperand;
		};
	};
	
	constructEORS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] ^ cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(gprs[rd] >> 31);
				cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
				cpu.cpsrC = !!(cpu.shifterCarryOut);
			}
		};
	};
	
	constructLDM(rs, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		let mmu = cpu.mmu;
		return function() {
			mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address(false);
			let total = 0;
			let m, i;
			for (m = rs, i = 0; m; m >>= 1, ++i) {
				if (m & 1) {
					gprs[i] = mmu.load32(addr & 0xFFFFFFFC);
					addr += 4;
					++total;
				}
			}
			mmu.waitMulti32(addr, total);
			++cpu.cycles;
		};
	};
	
	constructLDMS(rs, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		let mmu = cpu.mmu;
		return function() {
			mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address(false);
			let total = 0;
			let mode = cpu.mode;
			cpu.switchMode(cpu.MODE_SYSTEM);
			let m, i;
			for (m = rs, i = 0; m; m >>= 1, ++i) {
				if (m & 1) {
					gprs[i] = mmu.load32(addr & 0xFFFFFFFC);
					addr += 4;
					++total;
				}
			}
			cpu.switchMode(mode);
			mmu.waitMulti32(addr, total);
			++cpu.cycles;
		};
	};
	
	constructLDR(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address();
			gprs[rd] = cpu.mmu.load32(addr);
			cpu.mmu.wait32(addr);
			++cpu.cycles;
		};
	};
	
	constructLDRB(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address();
			gprs[rd] = cpu.mmu.loadU8(addr);
			cpu.mmu.wait(addr);
			++cpu.cycles;
		};
	};
	
	constructLDRH(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address();
			gprs[rd] = cpu.mmu.loadU16(addr);
			cpu.mmu.wait(addr);
			++cpu.cycles;
		};
	};
	
	constructLDRSB(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address();
			gprs[rd] = cpu.mmu.load8(addr);
			cpu.mmu.wait(addr);
			++cpu.cycles;
		};
	};
	
	constructLDRSH(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let addr = address();
			gprs[rd] = cpu.mmu.load16(addr);
			cpu.mmu.wait(addr);
			++cpu.cycles;
		};
	};
	
	constructMLA(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			++cpu.cycles;
			cpu.mmu.waitMul(rs);
			if ((gprs[rm] & 0xFFFF0000) && (gprs[rs] & 0xFFFF0000)) {
				// Our data type is a double--we'll lose bits if we do it all at once!
				let hi = ((gprs[rm] & 0xFFFF0000) * gprs[rs]) & 0xFFFFFFFF;
				let lo = ((gprs[rm] & 0x0000FFFF) * gprs[rs]) & 0xFFFFFFFF;
				gprs[rd] = (hi + lo + gprs[rn]) & 0xFFFFFFFF;
			} else {
				gprs[rd] = gprs[rm] * gprs[rs] + gprs[rn];
			}
		};
	};
	
	constructMLAS(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			++cpu.cycles;
			cpu.mmu.waitMul(rs);
			if ((gprs[rm] & 0xFFFF0000) && (gprs[rs] & 0xFFFF0000)) {
				// Our data type is a double--we'll lose bits if we do it all at once!
				let hi = ((gprs[rm] & 0xFFFF0000) * gprs[rs]) & 0xFFFFFFFF;
				let lo = ((gprs[rm] & 0x0000FFFF) * gprs[rs]) & 0xFFFFFFFF;
				gprs[rd] = (hi + lo + gprs[rn]) & 0xFFFFFFFF;
			} else {
				gprs[rd] = gprs[rm] * gprs[rs] + gprs[rn];
			}
			cpu.cpsrN = !!(gprs[rd] >> 31);
			cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
		};
	};
	
	constructMOV(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = cpu.shifterOperand;
		};
	};
	
	constructMOVS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(gprs[rd] >> 31);
				cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
				cpu.cpsrC = !!(cpu.shifterCarryOut);
			}
		};
	};
	
	constructMRS(rd, r, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			if (r) {
				gprs[rd] = cpu.spsr;
			} else {
				gprs[rd] = cpu.packCPSR();
			}
		};
	};
	
	constructMSR(rm, r, instruction, immediate, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		let c = instruction & 0x00010000;
		//let x = instruction & 0x00020000;
		//let s = instruction & 0x00040000;
		let f = instruction & 0x00080000;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			let operand;
			if (instruction & 0x02000000) {
				operand = immediate;
			} else {
				operand = gprs[rm];
			}
			let mask = (c ? 0x000000FF : 0x00000000) |
					   //(x ? 0x0000FF00 : 0x00000000) | // Irrelevant on ARMv4T
					   //(s ? 0x00FF0000 : 0x00000000) | // Irrelevant on ARMv4T
					   (f ? 0xFF000000 : 0x00000000);
	
			if (r) {
				mask &= cpu.USER_MASK | cpu.PRIV_MASK | cpu.STATE_MASK;
				cpu.spsr = (cpu.spsr & ~mask) | (operand & mask);
			} else {
				if (mask & cpu.USER_MASK) {
					cpu.cpsrN = !!(operand >> 31);
					cpu.cpsrZ = !!(operand & 0x40000000);
					cpu.cpsrC = !!(operand & 0x20000000);
					cpu.cpsrV = !!(operand & 0x10000000);
				}
				if (cpu.mode != cpu.MODE_USER && (mask & cpu.PRIV_MASK)) {
					cpu.switchMode((operand & 0x0000000F) | 0x00000010);
					cpu.cpsrI = !!(operand & 0x00000080);
					cpu.cpsrF = !!(operand & 0x00000040);
				}
			}
		};
	};
	
	constructMUL(rd, rs, rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.mmu.waitMul(gprs[rs]);
			if ((gprs[rm] & 0xFFFF0000) && (gprs[rs] & 0xFFFF0000)) {
				// Our data type is a double--we'll lose bits if we do it all at once!
				let hi = ((gprs[rm] & 0xFFFF0000) * gprs[rs]) | 0;
				let lo = ((gprs[rm] & 0x0000FFFF) * gprs[rs]) | 0;
				gprs[rd] = hi + lo;
			} else {
				gprs[rd] = gprs[rm] * gprs[rs];
			}
		};
	};
	
	constructMULS(rd, rs, rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.mmu.waitMul(gprs[rs]);
			if ((gprs[rm] & 0xFFFF0000) && (gprs[rs] & 0xFFFF0000)) {
				// Our data type is a double--we'll lose bits if we do it all at once!
				let hi = ((gprs[rm] & 0xFFFF0000) * gprs[rs]) | 0;
				let lo = ((gprs[rm] & 0x0000FFFF) * gprs[rs]) | 0;
				gprs[rd] = hi + lo;
			} else {
				gprs[rd] = gprs[rm] * gprs[rs];
			}
			cpu.cpsrN = !!(gprs[rd] >> 31);
			cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
		};
	};
	
	constructMVN(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = ~cpu.shifterOperand;
		};
	};
	
	constructMVNS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = ~cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(gprs[rd] >> 31);
				cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
				cpu.cpsrC = !!(cpu.shifterCarryOut);
			}
		};
	};
	
	constructORR(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] | cpu.shifterOperand;
		}
	};
	
	constructORRS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] | cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(gprs[rd] >> 31);
				cpu.cpsrZ = !(gprs[rd] & 0xFFFFFFFF);
				cpu.cpsrC = !!(cpu.shifterCarryOut);
			}
		};
	};
	
	constructRSB(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = cpu.shifterOperand - gprs[rn];
		};
	};
	
	constructRSBS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let d = cpu.shifterOperand - gprs[rn];
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(d >> 31);
				cpu.cpsrZ = !(d & 0xFFFFFFFF);
				cpu.cpsrC = (cpu.shifterOperand >>> 0) >= (gprs[rn] >>> 0);
				cpu.cpsrV = (cpu.shifterOperand >> 31) != (gprs[rn] >> 31) &&
							(cpu.shifterOperand >> 31) != (d >> 31);
			}
			gprs[rd] = d;
		};
	};
	
	constructRSC(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			//@ts-ignore
			let n = (gprs[rn] >>> 0) + !cpu.cpsrC;
			gprs[rd] = (cpu.shifterOperand >>> 0) - n;
		};
	};
	
	constructRSCS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			//@ts-ignore
			let n = (gprs[rn] >>> 0) + !cpu.cpsrC;
			let d = (cpu.shifterOperand >>> 0) - n;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(d >> 31);
				cpu.cpsrZ = !(d & 0xFFFFFFFF);
				cpu.cpsrC = (cpu.shifterOperand >>> 0) >= (d >>> 0);
				cpu.cpsrV = (cpu.shifterOperand >> 31) != (n >> 31) &&
							(cpu.shifterOperand >> 31) != (d >> 31);
			}
			gprs[rd] = d;
		};
	};
	
	constructSBC(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			//@ts-ignore
			let shifterOperand = (cpu.shifterOperand >>> 0) + !cpu.cpsrC;
			gprs[rd] = (gprs[rn] >>> 0) - shifterOperand;
		};
	};
	
	constructSBCS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			//@ts-ignore
			let shifterOperand = (cpu.shifterOperand >>> 0) + !cpu.cpsrC;
			let d = (gprs[rn] >>> 0) - shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(d >> 31);
				cpu.cpsrZ = !(d & 0xFFFFFFFF);
				cpu.cpsrC = (gprs[rn] >>> 0) >= (d >>> 0);
				cpu.cpsrV = (gprs[rn] >> 31) != (shifterOperand >> 31) &&
							(gprs[rn] >> 31) != (d >> 31);
			}
			gprs[rd] = d;
		};
	};
	
	constructSMLAL(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.cycles += 2;
			cpu.mmu.waitMul(rs);
			let hi = (gprs[rm] & 0xFFFF0000) * gprs[rs];
			let lo = (gprs[rm] & 0x0000FFFF) * gprs[rs];
			let carry = (gprs[rn] >>> 0) + hi + lo;
			gprs[rn] = carry;
			gprs[rd] += Math.floor(carry * SHIFT_32);
		};
	};
	
	constructSMLALS(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.cycles += 2;
			cpu.mmu.waitMul(rs);
			let hi = (gprs[rm] & 0xFFFF0000) * gprs[rs];
			let lo = (gprs[rm] & 0x0000FFFF) * gprs[rs];
			let carry = (gprs[rn] >>> 0) + hi + lo;
			gprs[rn] = carry;
			gprs[rd] += Math.floor(carry * SHIFT_32);
			cpu.cpsrN = !!(gprs[rd] >> 31);
			cpu.cpsrZ = !((gprs[rd] & 0xFFFFFFFF) || (gprs[rn] & 0xFFFFFFFF));
		};
	};
	
	constructSMULL(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			++cpu.cycles;
			cpu.mmu.waitMul(gprs[rs]);
			let hi = ((gprs[rm] & 0xFFFF0000) >> 0) * (gprs[rs] >> 0);
			let lo = ((gprs[rm] & 0x0000FFFF) >> 0) * (gprs[rs] >> 0);
			gprs[rn] = ((hi & 0xFFFFFFFF) + (lo & 0xFFFFFFFF)) & 0xFFFFFFFF;
			gprs[rd] = Math.floor(hi * SHIFT_32 + lo * SHIFT_32);
		};
	};
	
	constructSMULLS(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			++cpu.cycles;
			cpu.mmu.waitMul(gprs[rs]);
			let hi = ((gprs[rm] & 0xFFFF0000) >> 0) * (gprs[rs] >> 0);
			let lo = ((gprs[rm] & 0x0000FFFF) >> 0) * (gprs[rs] >> 0);
			gprs[rn] = ((hi & 0xFFFFFFFF) + (lo & 0xFFFFFFFF)) & 0xFFFFFFFF;
			gprs[rd] = Math.floor(hi * SHIFT_32 + lo * SHIFT_32);
			cpu.cpsrN = !!(gprs[rd] >> 31);
			cpu.cpsrZ = !((gprs[rd] & 0xFFFFFFFF) || (gprs[rn] & 0xFFFFFFFF));
		};
	};
	
	constructSTM(rs, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		let mmu = cpu.mmu;
		return function() {
			if (condOp && !condOp()) {
				mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			mmu.wait32(gprs[cpu.PC]);
			let addr = address(true);
			let total = 0;
			let m, i;
			for (m = rs, i = 0; m; m >>= 1, ++i) {
				if (m & 1) {
					mmu.store32(addr, gprs[i]);
					addr += 4;
					++total;
				}
			}
			mmu.waitMulti32(addr, total);
		};
	};
	
	constructSTMS(rs, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		let mmu = cpu.mmu;
		return function() {
			if (condOp && !condOp()) {
				mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			mmu.wait32(gprs[cpu.PC]);
			let mode = cpu.mode;
			let addr = address(true);
			let total = 0;
			let m, i;
			cpu.switchMode(cpu.MODE_SYSTEM);
			for (m = rs, i = 0; m; m >>= 1, ++i) {
				if (m & 1) {
					mmu.store32(addr, gprs[i]);
					addr += 4;
					++total;
				}
			}
			cpu.switchMode(mode);
			mmu.waitMulti32(addr, total);
		};
	};
	
	constructSTR(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			let addr = address();
			cpu.mmu.store32(addr, gprs[rd]);
			cpu.mmu.wait32(addr);
			cpu.mmu.wait32(gprs[cpu.PC]);
		};
	};
	
	constructSTRB(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			let addr = address();
			cpu.mmu.store8(addr, gprs[rd]);
			cpu.mmu.wait(addr);
			cpu.mmu.wait32(gprs[cpu.PC]);
		};
	};
	
	constructSTRH(rd, address, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			let addr = address();
			cpu.mmu.store16(addr, gprs[rd]);
			cpu.mmu.wait(addr);
			cpu.mmu.wait32(gprs[cpu.PC]);
		};
	};
	
	constructSUB(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			gprs[rd] = gprs[rn] - cpu.shifterOperand;
		};
	};
	
	constructSUBS(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let d = gprs[rn] - cpu.shifterOperand;
			if (rd == cpu.PC && cpu.hasSPSR()) {
				cpu.unpackCPSR(cpu.spsr);
			} else {
				cpu.cpsrN = !!(d >> 31);
				cpu.cpsrZ = !(d & 0xFFFFFFFF);
				cpu.cpsrC = (gprs[rn] >>> 0) >= (cpu.shifterOperand >>> 0);
				cpu.cpsrV = (gprs[rn] >> 31) != (cpu.shifterOperand >> 31) &&
							(gprs[rn] >> 31) != (d >> 31);
			}
			gprs[rd] = d;
		};
	};
	
	constructSWI(immediate, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			if (condOp && !condOp()) {
				cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
				return;
			}
			cpu.irq.swi32(immediate);
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
		};
	};
	
	constructSWP(rd, rn, rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.mmu.wait32(gprs[rn]);
			cpu.mmu.wait32(gprs[rn]);
			let d = cpu.mmu.load32(gprs[rn]);
			cpu.mmu.store32(gprs[rn], gprs[rm]);
			gprs[rd] = d;
			++cpu.cycles;
		}
	};
	
	constructSWPB(rd, rn, rm, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.mmu.wait(gprs[rn]);
			cpu.mmu.wait(gprs[rn]);
			let d = cpu.mmu.load8(gprs[rn]);
			cpu.mmu.store8(gprs[rn], gprs[rm]);
			gprs[rd] = d;
			++cpu.cycles;
		}
	};
	
	constructTEQ(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let aluOut = gprs[rn] ^ cpu.shifterOperand;
			cpu.cpsrN = !!(aluOut >> 31);
			cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
			cpu.cpsrC = !!(cpu.shifterCarryOut);
		};
	};
	
	constructTST(rd, rn, shiftOp, condOp) {
		let cpu = this.cpu;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			shiftOp();
			let aluOut = gprs[rn] & cpu.shifterOperand;
			cpu.cpsrN = !!(aluOut >> 31);
			cpu.cpsrZ = !(aluOut & 0xFFFFFFFF);
			cpu.cpsrC = !!(cpu.shifterCarryOut);
		};
	};
	
	constructUMLAL(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.cycles += 2;
			cpu.mmu.waitMul(rs);
			let hi = ((gprs[rm] & 0xFFFF0000) >>> 0) * (gprs[rs] >>> 0);
			let lo = (gprs[rm] & 0x0000FFFF) * (gprs[rs] >>> 0);
			let carry = (gprs[rn] >>> 0) + hi + lo;
			gprs[rn] = carry;
			gprs[rd] += carry * SHIFT_32;
		};
	};
	
	constructUMLALS(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			cpu.cycles += 2;
			cpu.mmu.waitMul(rs);
			let hi = ((gprs[rm] & 0xFFFF0000) >>> 0) * (gprs[rs] >>> 0);
			let lo = (gprs[rm] & 0x0000FFFF) * (gprs[rs] >>> 0);
			let carry = (gprs[rn] >>> 0) + hi + lo;
			gprs[rn] = carry;
			gprs[rd] += carry * SHIFT_32;
			cpu.cpsrN = !!(gprs[rd] >> 31);
			cpu.cpsrZ = !((gprs[rd] & 0xFFFFFFFF) || (gprs[rn] & 0xFFFFFFFF));
		};
	};
	
	constructUMULL(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			++cpu.cycles;
			cpu.mmu.waitMul(gprs[rs]);
			let hi = ((gprs[rm] & 0xFFFF0000) >>> 0) * (gprs[rs] >>> 0);
			let lo = ((gprs[rm] & 0x0000FFFF) >>> 0) * (gprs[rs] >>> 0);
			gprs[rn] = ((hi & 0xFFFFFFFF) + (lo & 0xFFFFFFFF)) & 0xFFFFFFFF;
			gprs[rd] = (hi * SHIFT_32 + lo * SHIFT_32) >>> 0;
		};
	};
	
	constructUMULLS(rd, rn, rs, rm, condOp) {
		let cpu = this.cpu;
		let SHIFT_32 = 1/0x100000000;
		let gprs = cpu.gprs;
		return function() {
			cpu.mmu.waitPrefetch32(gprs[cpu.PC]);
			if (condOp && !condOp()) {
				return;
			}
			++cpu.cycles;
			cpu.mmu.waitMul(gprs[rs]);
			let hi = ((gprs[rm] & 0xFFFF0000) >>> 0) * (gprs[rs] >>> 0);
			let lo = ((gprs[rm] & 0x0000FFFF) >>> 0) * (gprs[rs] >>> 0);
			gprs[rn] = ((hi & 0xFFFFFFFF) + (lo & 0xFFFFFFFF)) & 0xFFFFFFFF;
			gprs[rd] = (hi * SHIFT_32 + lo * SHIFT_32) >>> 0;
			cpu.cpsrN = !!(gprs[rd] >> 31);
			cpu.cpsrZ = !((gprs[rd] & 0xFFFFFFFF) || (gprs[rn] & 0xFFFFFFFF));
		};
	};
	
}

}

declare module lcc$gba {
    class Emulator extends cc.Component {
        _bios: cc.BufferAsset;
        get bios(): cc.BufferAsset;
        set bios(value: cc.BufferAsset);
        _rom: cc.BufferAsset;
        get rom(): cc.BufferAsset;
        set rom(value: cc.BufferAsset);
        _sound: boolean;
        get sound(): boolean;
        set sound(value: boolean);
        playOnLoad: boolean;
        private _gba;
        private _video;
        private _audio;
        private _storage;
        onLoad(): void;
        setupBios(): Promise<void>;
        getGBA(): core.GameBoyAdvance;
        getVideo(): VideoPlayer;
        getAudio(): AudioPlayer;
        getStorage(): Storage;
        private setBiosData;
        private setRomData;
        reset(): void;
        start(): void;
        getState(): core.SaveData;
        loadState(s: any): boolean;
    }
}
declare module lcc$gba {
    class RingBuffer {
        private _elements;
        private _first;
        private _last;
        private _size;
        private _evictedCb;
        constructor(capacity: number, evictedCb?: Function);
        capacity(): number;
        size(): number;
        isEmpty(): boolean;
        isFull(): boolean;
        peek(): any;
        peekN(count: number): any[];
        deq(): any;
        deqN(count: number): any[];
        enq(element: any): number;
    }
}
declare module lcc$gba {
    class Utils {
        static getAssetByUUID<T extends cc.Asset>(uuid: string): Promise<T>;
    }
}
declare module lcc$gba {
    let UUID: {
        bioss: {
            bios: string;
        };
    };
}
declare module lcc$gba {
    class AudioPlayer implements core.AudioDevice {
        private _buffer;
        private _audioCtx;
        private _jsAudio;
        private _running;
        enable: boolean;
        constructor();
        destory(): void;
        play(): void;
        stop(): void;
        getSampleRate(): number;
        writeSample(left: any, right: any): void;
        onaudioprocess(e: any): void;
    }
}
declare module lcc$gba {
    enum Button {
        A = 0,
        B = 1,
        SELECT = 2,
        START = 3,
        RIGHT = 4,
        LEFT = 5,
        UP = 6,
        DOWN = 7,
        R = 8,
        L = 9
    }
    enum Keyboard {
        back = 0,
        menu = 1,
        backspace = 2,
        tab = 3,
        enter = 4,
        shift = 5,
        ctrl = 6,
        alt = 7,
        pause = 8,
        capslock = 9,
        escape = 10,
        space = 11,
        pageup = 12,
        pagedown = 13,
        end = 14,
        home = 15,
        left = 16,
        up = 17,
        right = 18,
        down = 19,
        select = 20,
        insert = 21,
        Delete = 22,
        a = 23,
        b = 24,
        c = 25,
        d = 26,
        e = 27,
        f = 28,
        g = 29,
        h = 30,
        i = 31,
        j = 32,
        k = 33,
        l = 34,
        m = 35,
        n = 36,
        o = 37,
        p = 38,
        q = 39,
        r = 40,
        s = 41,
        t = 42,
        u = 43,
        v = 44,
        w = 45,
        x = 46,
        y = 47,
        z = 48,
        num0 = 49,
        num1 = 50,
        num2 = 51,
        num3 = 52,
        num4 = 53,
        num5 = 54,
        num6 = 55,
        num7 = 56,
        num8 = 57,
        num9 = 58,
        '*' = 59,
        '+' = 60,
        '-' = 61,
        numdel = 62,
        '/' = 63,
        f1 = 64,
        f2 = 65,
        f3 = 66,
        f4 = 67,
        f5 = 68,
        f6 = 69,
        f7 = 70,
        f8 = 71,
        f9 = 72,
        f10 = 73,
        f11 = 74,
        f12 = 75,
        numlock = 76,
        scrolllock = 77,
        ';' = 78,
        semicolon = 79,
        equal = 80,
        '=' = 81,
        ',' = 82,
        comma = 83,
        dash = 84,
        '.' = 85,
        period = 86,
        forwardslash = 87,
        grave = 88,
        '[' = 89,
        openbracket = 90,
        backslash = 91,
        ']' = 92,
        closebracket = 93,
        quote = 94,
        dpadLeft = 95,
        dpadRight = 96,
        dpadUp = 97,
        dpadDown = 98,
        dpadCenter = 99
    }
    function getKeyCode(key: Keyboard): any;
    class ButtonMap {
        button: Button;
        key: Keyboard;
        constructor(...args: any[]);
    }
    class Controller extends cc.Component {
        _buttons: ButtonMap[];
        get buttons(): ButtonMap[];
        set buttons(value: ButtonMap[]);
        private _gba;
        private _keymap;
        onLoad(): void;
        onDestroy(): void;
        private onNodeButtonEvent;
        onButtonEvent(button: Button, down: boolean): void;
        private onKeyDown;
        private onKeyUp;
        private updateButtonMap;
    }
}
declare module lcc$gba {
    class DisplaySprites extends cc.Component {
        _sprites: cc.Sprite[];
        get sprites(): cc.Sprite[];
        set sprites(value: cc.Sprite[]);
        private _emulator;
        onLoad(): void;
        private setDisplaySprites;
    }
}
declare module lcc$gba {
    class Storage implements core.StorageDevice {
        SYS_ID: string;
        save(code: string, sdata: core.SaveData): void;
        load(code: string): any;
    }
}
declare module lcc$gba {
    class VideoPlayer implements core.VideoDevice {
        HORIZONTAL_PIXELS: number;
        VERTICAL_PIXELS: number;
        private _texture;
        private _framebuffer;
        constructor();
        getTexture(): cc.Texture2D;
        getFrameBuffer(): Uint8Array;
        drawFrame(pixelData: Uint8Array): void;
    }
}
declare module lcc$gba.core {
    class ARMCoreArm {
        cpu: ARMCore;
        addressingMode23Immediate: ((rn: any, offset: any, condOp: any) => Function | null)[];
        addressingMode23Register: ((rn: any, rm: any, condOp: any) => Function | null)[];
        addressingMode2RegisterShifted: ((rn: any, shiftOp: any, condOp: any) => Function | null)[];
        constructor(cpu: ARMCore);
        constructAddressingMode1ASR(rs: any, rm: any): () => void;
        constructAddressingMode1Immediate(immediate: any): () => void;
        constructAddressingMode1ImmediateRotate(immediate: any, rotate: any): () => void;
        constructAddressingMode1LSL(rs: any, rm: any): () => void;
        constructAddressingMode1LSR(rs: any, rm: any): () => void;
        constructAddressingMode1ROR(rs: any, rm: any): () => void;
        constructAddressingMode23Immediate(instruction: any, immediate: any, condOp: any): Function;
        constructAddressingMode23Register(instruction: any, rm: any, condOp: any): Function;
        constructAddressingMode2RegisterShifted(instruction: any, shiftOp: any, condOp: any): Function;
        constructAddressingMode4(immediate: any, rn: any): () => any;
        constructAddressingMode4Writeback(immediate: any, offset: any, rn: any, overlap: any): (writeInitial: any) => any;
        constructADC(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructADCS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructADD(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructADDS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructAND(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructANDS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructB(immediate: any, condOp: any): () => void;
        constructBIC(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructBICS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructBL(immediate: any, condOp: any): () => void;
        constructBX(rm: any, condOp: any): () => void;
        constructCMN(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructCMP(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructEOR(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructEORS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructLDM(rs: any, address: any, condOp: any): () => void;
        constructLDMS(rs: any, address: any, condOp: any): () => void;
        constructLDR(rd: any, address: any, condOp: any): () => void;
        constructLDRB(rd: any, address: any, condOp: any): () => void;
        constructLDRH(rd: any, address: any, condOp: any): () => void;
        constructLDRSB(rd: any, address: any, condOp: any): () => void;
        constructLDRSH(rd: any, address: any, condOp: any): () => void;
        constructMLA(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructMLAS(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructMOV(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructMOVS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructMRS(rd: any, r: any, condOp: any): () => void;
        constructMSR(rm: any, r: any, instruction: any, immediate: any, condOp: any): () => void;
        constructMUL(rd: any, rs: any, rm: any, condOp: any): () => void;
        constructMULS(rd: any, rs: any, rm: any, condOp: any): () => void;
        constructMVN(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructMVNS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructORR(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructORRS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructRSB(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructRSBS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructRSC(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructRSCS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructSBC(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructSBCS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructSMLAL(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructSMLALS(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructSMULL(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructSMULLS(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructSTM(rs: any, address: any, condOp: any): () => void;
        constructSTMS(rs: any, address: any, condOp: any): () => void;
        constructSTR(rd: any, address: any, condOp: any): () => void;
        constructSTRB(rd: any, address: any, condOp: any): () => void;
        constructSTRH(rd: any, address: any, condOp: any): () => void;
        constructSUB(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructSUBS(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructSWI(immediate: any, condOp: any): () => void;
        constructSWP(rd: any, rn: any, rm: any, condOp: any): () => void;
        constructSWPB(rd: any, rn: any, rm: any, condOp: any): () => void;
        constructTEQ(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructTST(rd: any, rn: any, shiftOp: any, condOp: any): () => void;
        constructUMLAL(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructUMLALS(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructUMULL(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
        constructUMULLS(rd: any, rn: any, rs: any, rm: any, condOp: any): () => void;
    }
}
declare module lcc$gba.core {
    interface AudioDevice {
        play(): void;
        stop(): void;
        getSampleRate(): number;
        writeSample(left: any, right: any): void;
    }
    class GameBoyAdvanceAudio {
        SOUND_MAX: number;
        FIFO_MAX: number;
        PSG_MAX: number;
        audioDevice: AudioDevice;
        cpu: ARMCore;
        core: GameBoyAdvance;
        masterEnable: boolean;
        masterVolume: number;
        fifoA: any[];
        fifoB: any[];
        fifoASample: number;
        fifoBSample: number;
        enabled: boolean;
        enableChannel3: boolean;
        enableChannel4: boolean;
        enableChannelA: boolean;
        enableChannelB: boolean;
        enableRightChannelA: boolean;
        enableLeftChannelA: boolean;
        enableRightChannelB: boolean;
        enableLeftChannelB: boolean;
        playingChannel3: boolean;
        playingChannel4: boolean;
        volumeLeft: number;
        volumeRight: number;
        ratioChannelA: number;
        ratioChannelB: number;
        enabledLeft: number;
        enabledRight: number;
        dmaA: number;
        dmaB: number;
        soundTimerA: number;
        soundTimerB: number;
        soundRatio: number;
        soundBias: number;
        squareChannels: Array<any>;
        waveData: Uint8Array;
        channel3Dimension: number;
        channel3Bank: number;
        channel3Volume: number;
        channel3Interval: number;
        channel3Next: number;
        channel3Length: number;
        channel3Timed: boolean;
        channel3End: number;
        channel3Pointer: number;
        channel3Sample: number;
        cpuFrequency: number;
        channel4: any;
        nextEvent: number;
        nextSample: number;
        backup: number;
        totalSamples: number;
        sampleRate: number;
        sampleInterval: number;
        resampleRatio: number;
        channel3Write: boolean;
        masterVolumeLeft: number;
        masterVolumeRight: number;
        constructor(audioDevice?: AudioDevice);
        printSampleRate(): void;
        clear(): void;
        freeze(): {
            nextSample: number;
        };
        defrost(frost: any): void;
        pause(paused: any): void;
        updateTimers(): void;
        writeEnable(value: any): void;
        writeSoundControlLo(value: any): void;
        writeSoundControlHi(value: any): void;
        resetSquareChannel(channel: any): void;
        setSquareChannelEnabled(channel: any, enable: any): void;
        writeSquareChannelSweep(channelId: any, value: any): void;
        writeSquareChannelDLE(channelId: any, value: any): void;
        writeSquareChannelFC(channelId: any, value: any): void;
        updateSquareChannel(channel: any, cycles: any): void;
        writeChannel3Lo(value: any): void;
        writeChannel3Hi(value: any): void;
        writeChannel3X(value: any): void;
        resetChannel3(): void;
        writeWaveData(offset: any, data: any, width: any): void;
        setChannel4Enabled(enable: any): void;
        writeChannel4LE(value: any): void;
        writeChannel4FC(value: any): void;
        resetChannel4(): void;
        writeChannelLE(channel: any, value: any): void;
        updateEnvelope(channel: any, cycles: any): void;
        appendToFifoA(value: any): void;
        appendToFifoB(value: any): void;
        sampleFifoA(): void;
        sampleFifoB(): void;
        scheduleFIFODma(number: any, info: any): void;
        sample(): void;
    }
}
declare module lcc$gba.core {
    class ARMCore {
        SP: number;
        LR: number;
        PC: number;
        MODE_ARM: number;
        MODE_THUMB: number;
        MODE_USER: number;
        MODE_FIQ: number;
        MODE_IRQ: number;
        MODE_SUPERVISOR: number;
        MODE_ABORT: number;
        MODE_UNDEFINED: number;
        MODE_SYSTEM: number;
        BANK_NONE: number;
        BANK_FIQ: number;
        BANK_IRQ: number;
        BANK_SUPERVISOR: number;
        BANK_ABORT: number;
        BANK_UNDEFINED: number;
        UNALLOC_MASK: number;
        USER_MASK: number;
        PRIV_MASK: number;
        STATE_MASK: number;
        WORD_SIZE_ARM: number;
        WORD_SIZE_THUMB: number;
        BASE_RESET: number;
        BASE_UNDEF: number;
        BASE_SWI: number;
        BASE_PABT: number;
        BASE_DABT: number;
        BASE_IRQ: number;
        BASE_FIQ: number;
        irq: GameBoyAdvanceInterruptHandler;
        mmu: GameBoyAdvanceMMU;
        armCompiler: ARMCoreArm;
        thumbCompiler: ARMCoreThumb;
        gprs: Int32Array;
        loadInstruction: Function;
        execMode: number;
        instructionWidth: number;
        mode: number;
        cpsrI: boolean;
        cpsrF: boolean;
        cpsrV: boolean;
        cpsrC: boolean;
        cpsrZ: boolean;
        cpsrN: boolean;
        bankedRegisters: Int32Array[];
        spsr: number;
        bankedSPSRs: Int32Array;
        cycles: number;
        shifterOperand: number;
        shifterCarryOut: number | boolean;
        page: any;
        pageId: number;
        pageRegion: number;
        instruction: any;
        step: Function;
        pageMask: any;
        conds: Function[];
        conditionPassed: boolean;
        constructor();
        resetCPU(startOffset: any): void;
        freeze(): {
            gprs: number[];
            mode: number;
            cpsrI: boolean;
            cpsrF: boolean;
            cpsrV: boolean;
            cpsrC: boolean;
            cpsrZ: boolean;
            cpsrN: boolean;
            bankedRegisters: number[][];
            spsr: number;
            bankedSPSRs: number[];
            cycles: number;
        };
        defrost(frost: any): void;
        fetchPage(address: any): void;
        loadInstructionArm(address: any): any;
        loadInstructionThumb(address: any): any;
        selectBank(mode: any): number;
        switchExecMode(newMode: any): void;
        switchMode(newMode: any): void;
        packCPSR(): number;
        unpackCPSR(spsr: any): void;
        hasSPSR(): boolean;
        raiseIRQ(): void;
        raiseTrap(): void;
        badOp(instruction: any): () => never;
        generateConds(): void;
        barrelShiftImmediate(shiftType: any, immediate: any, rm: any): Function;
        compileArm(instruction: any): Function;
        compileThumb(instruction: any): Function;
    }
}
declare module lcc$gba.core {
    interface SaveData {
        code: string;
        data: string;
    }
    interface StorageDevice {
        save(code: string, sdata: SaveData): void;
        load(code: string): SaveData;
    }
    class GameBoyAdvance {
        LOG_ERROR: number;
        LOG_WARN: number;
        LOG_STUB: number;
        LOG_INFO: number;
        LOG_DEBUG: number;
        storeDevice: StorageDevice;
        cpu: ARMCore;
        mmu: GameBoyAdvanceMMU;
        irq: GameBoyAdvanceInterruptHandler;
        io: GameBoyAdvanceIO;
        audio: GameBoyAdvanceAudio;
        video: GameBoyAdvanceVideo;
        keypad: GameBoyAdvanceKeypad;
        sio: GameBoyAdvanceSIO;
        rom: any;
        logLevel: number;
        doStep: Function;
        queueFrame: Function;
        paused: boolean;
        seenFrame: boolean;
        seenSave: boolean;
        lastVblank: number;
        queue: any;
        reportFPS: any;
        throttle: number;
        interval: boolean;
        constructor(opt: {
            audioDevice?: AudioDevice;
            storeDevice?: StorageDevice;
            videoDevice?: VideoDevice;
            onPollButtons?: Function;
        });
        setBios(bios: any, real?: any): void;
        setRom(rom: any): boolean;
        hasRom(): boolean;
        reset(): void;
        step(): void;
        waitFrame(): boolean;
        pause(): void;
        advanceFrame(): void;
        runStable(): void;
        buttonDown(b: Button): void;
        buttonUp(b: Button): void;
        updateButtons(value: number): void;
        decodeBase64(string: any): ArrayBuffer;
        encodeBase64(view: any): string;
        loadSavedata(sdata: SaveData): boolean;
        getSavedata(): SaveData;
        freeze(): {
            cpu: {
                gprs: number[];
                mode: number;
                cpsrI: boolean;
                cpsrF: boolean;
                cpsrV: boolean;
                cpsrC: boolean;
                cpsrZ: boolean;
                cpsrN: boolean;
                bankedRegisters: number[][];
                spsr: number;
                bankedSPSRs: number[];
                cycles: number;
            };
            mmu: {
                ram: ArrayBuffer;
                iram: ArrayBuffer;
            };
            irq: {
                enable: boolean;
                enabledIRQs: number;
                interruptFlags: number;
                dma: any[];
                timers: any[];
                nextEvent: number;
                springIRQ: boolean;
            };
            io: {
                registers: ArrayBuffer;
            };
            audio: {
                nextSample: number;
            };
            video: {
                inHblank: boolean;
                inVblank: boolean;
                vcounter: number;
                vblankIRQ: number;
                hblankIRQ: number;
                vcounterIRQ: number;
                vcountSetting: number;
                vcount: number;
                lastHblank: number;
                nextHblank: number;
                nextEvent: number;
                nextHblankIRQ: number;
                nextVblankIRQ: number;
                nextVcounterIRQ: number;
                renderPath: void;
            };
        };
        defrost(frost: any): void;
        log(level: any, message: any): void;
        setLogger(logger: any): void;
        logStackTrace(stack: any): void;
        ERROR(error: any): void;
        WARN(warn: any): void;
        STUB(func: any): void;
        INFO(info: any): void;
        DEBUG(info: any): void;
        ASSERT_UNREACHED(err: any): void;
        ASSERT(test: any, err: any): void;
    }
}
declare module lcc$gba.core {
    class GameBoyAdvanceGPIO {
        core: GameBoyAdvance;
        rom: ROMView;
        readWrite: number;
        direction: number;
        device: GameBoyAdvanceRTC;
        constructor(core: GameBoyAdvance, rom: ROMView);
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        outputPins(nybble: any): void;
    }
    class GameBoyAdvanceRTC {
        gpio: GameBoyAdvanceGPIO;
        pins: number;
        direction: number;
        totalBytes: number[];
        bytesRemaining: number;
        transferStep: number;
        reading: number;
        bitsRead: number;
        bits: number;
        command: number;
        control: number;
        time: number[];
        read: any;
        constructor(gpio: any);
        setPins(nybble: any): void;
        setDirection(direction: any): void;
        processByte(): void;
        sioOutputPin(): number;
        updateClock(): void;
        bcd(binary: any): number;
    }
}
declare module lcc$gba.core {
    class GameBoyAdvanceIO {
        DISPCNT: number;
        GREENSWP: number;
        DISPSTAT: number;
        VCOUNT: number;
        BG0CNT: number;
        BG1CNT: number;
        BG2CNT: number;
        BG3CNT: number;
        BG0HOFS: number;
        BG0VOFS: number;
        BG1HOFS: number;
        BG1VOFS: number;
        BG2HOFS: number;
        BG2VOFS: number;
        BG3HOFS: number;
        BG3VOFS: number;
        BG2PA: number;
        BG2PB: number;
        BG2PC: number;
        BG2PD: number;
        BG2X_LO: number;
        BG2X_HI: number;
        BG2Y_LO: number;
        BG2Y_HI: number;
        BG3PA: number;
        BG3PB: number;
        BG3PC: number;
        BG3PD: number;
        BG3X_LO: number;
        BG3X_HI: number;
        BG3Y_LO: number;
        BG3Y_HI: number;
        WIN0H: number;
        WIN1H: number;
        WIN0V: number;
        WIN1V: number;
        WININ: number;
        WINOUT: number;
        MOSAIC: number;
        BLDCNT: number;
        BLDALPHA: number;
        BLDY: number;
        SOUND1CNT_LO: number;
        SOUND1CNT_HI: number;
        SOUND1CNT_X: number;
        SOUND2CNT_LO: number;
        SOUND2CNT_HI: number;
        SOUND3CNT_LO: number;
        SOUND3CNT_HI: number;
        SOUND3CNT_X: number;
        SOUND4CNT_LO: number;
        SOUND4CNT_HI: number;
        SOUNDCNT_LO: number;
        SOUNDCNT_HI: number;
        SOUNDCNT_X: number;
        SOUNDBIAS: number;
        WAVE_RAM0_LO: number;
        WAVE_RAM0_HI: number;
        WAVE_RAM1_LO: number;
        WAVE_RAM1_HI: number;
        WAVE_RAM2_LO: number;
        WAVE_RAM2_HI: number;
        WAVE_RAM3_LO: number;
        WAVE_RAM3_HI: number;
        FIFO_A_LO: number;
        FIFO_A_HI: number;
        FIFO_B_LO: number;
        FIFO_B_HI: number;
        DMA0SAD_LO: number;
        DMA0SAD_HI: number;
        DMA0DAD_LO: number;
        DMA0DAD_HI: number;
        DMA0CNT_LO: number;
        DMA0CNT_HI: number;
        DMA1SAD_LO: number;
        DMA1SAD_HI: number;
        DMA1DAD_LO: number;
        DMA1DAD_HI: number;
        DMA1CNT_LO: number;
        DMA1CNT_HI: number;
        DMA2SAD_LO: number;
        DMA2SAD_HI: number;
        DMA2DAD_LO: number;
        DMA2DAD_HI: number;
        DMA2CNT_LO: number;
        DMA2CNT_HI: number;
        DMA3SAD_LO: number;
        DMA3SAD_HI: number;
        DMA3DAD_LO: number;
        DMA3DAD_HI: number;
        DMA3CNT_LO: number;
        DMA3CNT_HI: number;
        TM0CNT_LO: number;
        TM0CNT_HI: number;
        TM1CNT_LO: number;
        TM1CNT_HI: number;
        TM2CNT_LO: number;
        TM2CNT_HI: number;
        TM3CNT_LO: number;
        TM3CNT_HI: number;
        SIODATA32_LO: number;
        SIOMULTI0: number;
        SIODATA32_HI: number;
        SIOMULTI1: number;
        SIOMULTI2: number;
        SIOMULTI3: number;
        SIOCNT: number;
        SIOMLT_SEND: number;
        SIODATA8: number;
        RCNT: number;
        JOYCNT: number;
        JOY_RECV: number;
        JOY_TRANS: number;
        JOYSTAT: number;
        KEYINPUT: number;
        KEYCNT: number;
        IE: number;
        IF: number;
        WAITCNT: number;
        IME: number;
        POSTFLG: number;
        HALTCNT: number;
        DEFAULT_DISPCNT: number;
        DEFAULT_SOUNDBIAS: number;
        DEFAULT_BGPA: number;
        DEFAULT_BGPD: number;
        DEFAULT_RCNT: number;
        cpu: ARMCore;
        core: GameBoyAdvance;
        video: GameBoyAdvanceVideo;
        sio: GameBoyAdvanceSIO;
        keypad: GameBoyAdvanceKeypad;
        audio: GameBoyAdvanceAudio;
        registers: Uint16Array;
        clear(): void;
        freeze(): {
            registers: ArrayBuffer;
        };
        defrost(frost: any): void;
        load8(offset: any): void;
        load16(offset: any): number;
        load32(offset: any): number;
        loadU8(offset: any): number;
        loadU16(offset: any): any;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        invalidatePage(address: any): void;
        STUB_REG(type: any, offset: any): void;
    }
}
declare module lcc$gba.core {
    class GameBoyAdvanceInterruptHandler {
        FREQUENCY: number;
        IRQ_VBLANK: number;
        IRQ_HBLANK: number;
        IRQ_VCOUNTER: number;
        IRQ_TIMER0: number;
        IRQ_TIMER1: number;
        IRQ_TIMER2: number;
        IRQ_TIMER3: number;
        IRQ_SIO: number;
        IRQ_DMA0: number;
        IRQ_DMA1: number;
        IRQ_DMA2: number;
        IRQ_DMA3: number;
        IRQ_KEYPAD: number;
        IRQ_GAMEPAK: number;
        MASK_VBLANK: number;
        MASK_HBLANK: number;
        MASK_VCOUNTER: number;
        MASK_TIMER0: number;
        MASK_TIMER1: number;
        MASK_TIMER2: number;
        MASK_TIMER3: number;
        MASK_SIO: number;
        MASK_DMA0: number;
        MASK_DMA1: number;
        MASK_DMA2: number;
        MASK_DMA3: number;
        MASK_KEYPAD: number;
        MASK_GAMEPAK: number;
        cpu: ARMCore;
        video: GameBoyAdvanceVideo;
        audio: GameBoyAdvanceAudio;
        io: GameBoyAdvanceIO;
        core: GameBoyAdvance;
        enable: boolean;
        enabledIRQs: number;
        interruptFlags: number;
        dma: Array<any>;
        timersEnabled: number;
        timers: Array<any>;
        nextEvent: number;
        springIRQ: boolean;
        clear(): void;
        freeze(): {
            enable: boolean;
            enabledIRQs: number;
            interruptFlags: number;
            dma: any[];
            timers: any[];
            nextEvent: number;
            springIRQ: boolean;
        };
        defrost(frost: any): void;
        updateTimers(): void;
        resetSP(): void;
        swi32(opcode: any): void;
        swi(opcode: any): void;
        masterEnable(value: any): void;
        setInterruptsEnabled(value: any): void;
        pollNextEvent(): void;
        waitForIRQ(): boolean;
        testIRQ(): boolean;
        raiseIRQ(irqType: any): void;
        dismissIRQs(irqMask: any): void;
        dmaSetSourceAddress(dma: any, address: any): void;
        dmaSetDestAddress(dma: any, address: any): void;
        dmaSetWordCount(dma: any, count: any): void;
        dmaWriteControl(dma: any, control: any): void;
        timerSetReload(timer: any, reload: any): void;
        timerWriteControl(timer: any, control: any): void;
        timerRead(timer: any): number;
        halt(): void;
        lz77(source: any, dest: any, unitsize: any): void;
        huffman(source: any, dest: any): void;
        rl(source: any, dest: any, unitsize: any): void;
    }
}
declare module lcc$gba.core {
    enum Button {
        A = 0,
        B = 1,
        SELECT = 2,
        START = 3,
        RIGHT = 4,
        LEFT = 5,
        UP = 6,
        DOWN = 7,
        R = 8,
        L = 9
    }
    class GameBoyAdvanceKeypad {
        currentDown: number;
        onPollButtons: Function;
        buttonDown(b: Button): void;
        buttonUp(b: Button): void;
        updateButtons(value: number): void;
        pollButtons(): void;
    }
}
declare module lcc$gba.core {
    class MemoryView {
        buffer: ArrayBuffer;
        view: DataView;
        mask: number;
        mask8: number;
        mask16: number;
        mask32: number;
        icache: Array<any>;
        constructor(memory: ArrayBuffer, offset?: number);
        resetMask(): void;
        load8(offset: any): number;
        load16(offset: any): number;
        loadU8(offset: any): number;
        loadU16(offset: any): number;
        load32(offset: any): number;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        invalidatePage(address: any): void;
        replaceData(memory: any, offset: any): void;
    }
    class MemoryBlock extends MemoryView {
        ICACHE_PAGE_BITS: number;
        PAGE_MASK: number;
        constructor(size: number, cacheBits: number);
        invalidatePage(address: number): void;
    }
    class ROMView extends MemoryView {
        ICACHE_PAGE_BITS: number;
        PAGE_MASK: number;
        gpio: GameBoyAdvanceGPIO;
        mmu: GameBoyAdvanceMMU;
        constructor(rom: ArrayBuffer, offset?: number);
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
    }
    class BIOSView extends MemoryView {
        ICACHE_PAGE_BITS: number;
        PAGE_MASK: number;
        real: boolean;
        constructor(rom: ArrayBuffer, offset?: number);
        load8(offset: any): number;
        load16(offset: any): number;
        loadU8(offset: any): number;
        loadU16(offset: any): number;
        load32(offset: any): number;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
    }
    class BadMemory {
        cpu: ARMCore;
        mmu: GameBoyAdvanceMMU;
        constructor(mmu: GameBoyAdvanceMMU, cpu: ARMCore);
        load8(offset: any): any;
        load16(offset: any): any;
        loadU8(offset: any): any;
        loadU16(offset: any): any;
        load32(offset: any): any;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        invalidatePage(address: any): void;
    }
    class GameBoyAdvanceMMU {
        REGION_BIOS: number;
        REGION_WORKING_RAM: number;
        REGION_WORKING_IRAM: number;
        REGION_IO: number;
        REGION_PALETTE_RAM: number;
        REGION_VRAM: number;
        REGION_OAM: number;
        REGION_CART0: number;
        REGION_CART1: number;
        REGION_CART2: number;
        REGION_CART_SRAM: number;
        BASE_BIOS: number;
        BASE_WORKING_RAM: number;
        BASE_WORKING_IRAM: number;
        BASE_IO: number;
        BASE_PALETTE_RAM: number;
        BASE_VRAM: number;
        BASE_OAM: number;
        BASE_CART0: number;
        BASE_CART1: number;
        BASE_CART2: number;
        BASE_CART_SRAM: number;
        BASE_MASK: number;
        BASE_OFFSET: number;
        OFFSET_MASK: number;
        SIZE_BIOS: number;
        SIZE_WORKING_RAM: number;
        SIZE_WORKING_IRAM: number;
        SIZE_IO: number;
        SIZE_PALETTE_RAM: number;
        SIZE_VRAM: number;
        SIZE_OAM: number;
        SIZE_CART0: number;
        SIZE_CART1: number;
        SIZE_CART2: number;
        SIZE_CART_SRAM: number;
        SIZE_CART_FLASH512: number;
        SIZE_CART_FLASH1M: number;
        SIZE_CART_EEPROM: number;
        DMA_TIMING_NOW: number;
        DMA_TIMING_VBLANK: number;
        DMA_TIMING_HBLANK: number;
        DMA_TIMING_CUSTOM: number;
        DMA_INCREMENT: number;
        DMA_DECREMENT: number;
        DMA_FIXED: number;
        DMA_INCREMENT_RELOAD: number;
        DMA_OFFSET: number[];
        WAITSTATES: number[];
        WAITSTATES_32: number[];
        WAITSTATES_SEQ: number[];
        WAITSTATES_SEQ_32: number[];
        NULLWAIT: number[];
        ROM_WS: number[];
        ROM_WS_SEQ: number[][];
        ICACHE_PAGE_BITS: number;
        PAGE_MASK: number;
        bios: BIOSView;
        cpu: ARMCore;
        core: GameBoyAdvance;
        memory: any[];
        badMemory: BadMemory;
        waitstates: number[];
        waitstatesSeq: number[];
        waitstates32: number[];
        waitstatesSeq32: number[];
        waitstatesPrefetch: number[];
        waitstatesPrefetch32: number[];
        cart: any;
        save: any;
        DMA_REGISTER: number[];
        constructor();
        mmap(region: any, object: any): void;
        clear(): void;
        freeze(): {
            ram: ArrayBuffer;
            iram: ArrayBuffer;
        };
        defrost(frost: any): void;
        loadBios(bios: any, real: any): void;
        loadRom(rom: any, process: any): {
            title: any;
            code: any;
            maker: any;
            memory: any;
            saveType: any;
        };
        loadSavedata(save: any): void;
        load8(offset: any): any;
        load16(offset: any): any;
        load32(offset: any): any;
        loadU8(offset: any): any;
        loadU16(offset: any): any;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        waitPrefetch(memory: any): void;
        waitPrefetch32(memory: any): void;
        wait(memory: any): void;
        wait32(memory: any): void;
        waitSeq(memory: any): void;
        waitSeq32(memory: any): void;
        waitMul(rs: any): void;
        waitMulti32(memory: any, seq: any): void;
        addressToPage(region: any, address: any): number;
        accessPage(region: any, pageId: any): any;
        scheduleDma(number: any, info: any): void;
        runHblankDmas(): void;
        runVblankDmas(): void;
        serviceDma(number: any, info: any): void;
        adjustTimings(word: any): void;
        saveNeedsFlush(): any;
        flushSave(): void;
        allocGPIO(rom: any): GameBoyAdvanceGPIO;
    }
}
declare module lcc$gba.core {
    class SRAMSavedata extends MemoryView {
        writePending: boolean;
        constructor(size: number);
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
    }
    class FlashSavedata extends MemoryView {
        COMMAND_WIPE: number;
        COMMAND_ERASE_SECTOR: number;
        COMMAND_ERASE: number;
        COMMAND_ID: number;
        COMMAND_WRITE: number;
        COMMAND_SWITCH_BANK: number;
        COMMAND_TERMINATE_ID: number;
        ID_PANASONIC: number;
        ID_SANYO: number;
        idMode: boolean;
        writePending: boolean;
        first: number;
        second: number;
        command: number;
        pendingCommand: number;
        bank: DataView;
        bank0: DataView;
        bank1: DataView;
        id: number;
        constructor(size: number);
        load8(offset: any): number;
        load16(offset: any): number;
        load32(offset: any): number;
        loadU8(offset: any): number;
        loadU16(offset: any): number;
        store8(offset: number, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        replaceData(memory: any): void;
    }
    class EEPROMSavedata extends MemoryView {
        COMMAND_NULL: number;
        COMMAND_PENDING: number;
        COMMAND_WRITE: number;
        COMMAND_READ_PENDING: number;
        COMMAND_READ: number;
        writeAddress: number;
        readBitsRemaining: number;
        readAddress: number;
        command: number;
        commandBitsRemaining: number;
        realSize: number;
        addressBits: number;
        writePending: boolean;
        dma: any;
        constructor(size: number, mmu: GameBoyAdvanceMMU);
        load8(offset: any): number;
        load16(offset: any): number;
        loadU8(offset: any): number;
        loadU16(offset: any): number;
        load32(offset: any): number;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        replaceData(memory: any): void;
    }
}
declare module lcc$gba.core {
    class GameBoyAdvanceSIO {
        SIO_NORMAL_8: number;
        SIO_NORMAL_32: number;
        SIO_MULTI: number;
        SIO_UART: number;
        SIO_GPIO: number;
        SIO_JOYBUS: number;
        BAUD: number[];
        core: GameBoyAdvance;
        mode: number;
        sd: boolean;
        irq: boolean;
        multiplayer: any;
        linkLayer: any;
        clear(): void;
        setMode(mode: any): void;
        writeRCNT(value: any): void;
        writeSIOCNT(value: any): void;
        readSIOCNT(): number;
        read(slot: any): any;
    }
}
declare module lcc$gba.core {
    class ARMCoreThumb {
        cpu: ARMCore;
        constructor(cpu: any);
        constructADC(rd: any, rm: any): () => void;
        constructADD1(rd: any, rn: any, immediate: any): () => void;
        constructADD2(rn: any, immediate: any): () => void;
        constructADD3(rd: any, rn: any, rm: any): () => void;
        constructADD4(rd: any, rm: any): () => void;
        constructADD5(rd: any, immediate: any): () => void;
        constructADD6(rd: any, immediate: any): () => void;
        constructADD7(immediate: any): () => void;
        constructAND(rd: any, rm: any): () => void;
        constructASR1(rd: any, rm: any, immediate: any): () => void;
        constructASR2(rd: any, rm: any): () => void;
        constructB1(immediate: any, condOp: any): () => void;
        constructB2(immediate: any): () => void;
        constructBIC(rd: any, rm: any): () => void;
        constructBL1(immediate: any): () => void;
        constructBL2(immediate: any): () => void;
        constructBX(rd: any, rm: any): () => void;
        constructCMN(rd: any, rm: any): () => void;
        constructCMP1(rn: any, immediate: any): () => void;
        constructCMP2(rd: any, rm: any): () => void;
        constructCMP3(rd: any, rm: any): () => void;
        constructEOR(rd: any, rm: any): () => void;
        constructLDMIA(rn: any, rs: any): () => void;
        constructLDR1(rd: any, rn: any, immediate: any): () => void;
        constructLDR2(rd: any, rn: any, rm: any): () => void;
        constructLDR3(rd: any, immediate: any): () => void;
        constructLDR4(rd: any, immediate: any): () => void;
        constructLDRB1(rd: any, rn: any, immediate: any): () => void;
        constructLDRB2(rd: any, rn: any, rm: any): () => void;
        constructLDRH1(rd: any, rn: any, immediate: any): () => void;
        constructLDRH2(rd: any, rn: any, rm: any): () => void;
        constructLDRSB(rd: any, rn: any, rm: any): () => void;
        constructLDRSH(rd: any, rn: any, rm: any): () => void;
        constructLSL1(rd: any, rm: any, immediate: any): () => void;
        constructLSL2(rd: any, rm: any): () => void;
        constructLSR1(rd: any, rm: any, immediate: any): () => void;
        constructLSR2(rd: any, rm: any): () => void;
        constructMOV1(rn: any, immediate: any): () => void;
        constructMOV2(rd: any, rn: any, rm: any): () => void;
        constructMOV3(rd: any, rm: any): () => void;
        constructMUL(rd: any, rm: any): () => void;
        constructMVN(rd: any, rm: any): () => void;
        constructNEG(rd: any, rm: any): () => void;
        constructORR(rd: any, rm: any): () => void;
        constructPOP(rs: any, r: any): () => void;
        constructPUSH(rs: any, r: any): () => void;
        constructROR(rd: any, rm: any): () => void;
        constructSBC(rd: any, rm: any): () => void;
        constructSTMIA(rn: any, rs: any): () => void;
        constructSTR1(rd: any, rn: any, immediate: any): () => void;
        constructSTR2(rd: any, rn: any, rm: any): () => void;
        constructSTR3(rd: any, immediate: any): () => void;
        constructSTRB1(rd: any, rn: any, immediate: any): () => void;
        constructSTRB2(rd: any, rn: any, rm: any): () => void;
        constructSTRH1(rd: any, rn: any, immediate: any): () => void;
        constructSTRH2(rd: any, rn: any, rm: any): () => void;
        constructSUB1(rd: any, rn: any, immediate: any): () => void;
        constructSUB2(rn: any, immediate: any): () => void;
        constructSUB3(rd: any, rn: any, rm: any): () => void;
        constructSWI(immediate: any): () => void;
        constructTST(rd: any, rm: any): () => void;
    }
}
declare module lcc$gba.core {
    function hex(number: any, leading: any, usePrefix?: boolean): string;
    function str2ab(str: string, cs?: number): ArrayBuffer;
    function concatab(...abs: ArrayBuffer[]): ArrayBuffer;
    module Serializer {
        class Pointer {
            index: number;
            top: number;
            stack: any[];
            advance(amount: any): number;
            mark(): number;
            push(): void;
            pop(): void;
            readString(view: any): string;
        }
        function packUint32(value: number): ArrayBuffer;
        function packUint8(value: number): ArrayBuffer;
        function packBytes(value: ArrayBuffer): ArrayBuffer;
        function serialize(stream: {}): ArrayBuffer;
        function deserialize(data: ArrayBuffer): {};
    }
}
declare module lcc$gba.core {
    interface VideoDevice {
        getFrameBuffer(): Uint8Array;
        drawFrame(pixelData: Uint8Array): void;
    }
    class GameBoyAdvanceVideo {
        CYCLES_PER_PIXEL: number;
        HORIZONTAL_PIXELS: number;
        HBLANK_PIXELS: number;
        HDRAW_LENGTH: number;
        HBLANK_LENGTH: number;
        HORIZONTAL_LENGTH: number;
        VERTICAL_PIXELS: number;
        VBLANK_PIXELS: number;
        VERTICAL_TOTAL_PIXELS: number;
        TOTAL_LENGTH: number;
        videoDevice: VideoDevice;
        cpu: ARMCore;
        core: GameBoyAdvance;
        renderPath: video.GameBoyAdvanceSoftwareRenderer;
        vblankCallback: Function;
        pixelData: Uint8Array;
        DISPSTAT_MASK: number;
        inHblank: boolean;
        inVblank: boolean;
        vcounter: number;
        vblankIRQ: number;
        hblankIRQ: number;
        vcounterIRQ: number;
        vcountSetting: number;
        vcount: number;
        lastHblank: number;
        nextHblank: number;
        nextEvent: number;
        nextHblankIRQ: number;
        nextVblankIRQ: number;
        nextVcounterIRQ: number;
        constructor(videoDevice?: VideoDevice);
        clear(): void;
        freeze(): {
            inHblank: boolean;
            inVblank: boolean;
            vcounter: number;
            vblankIRQ: number;
            hblankIRQ: number;
            vcounterIRQ: number;
            vcountSetting: number;
            vcount: number;
            lastHblank: number;
            nextHblank: number;
            nextEvent: number;
            nextHblankIRQ: number;
            nextVblankIRQ: number;
            nextVcounterIRQ: number;
            renderPath: void;
        };
        defrost(frost: any): void;
        updateTimers(cpu: any): void;
        writeDisplayStat(value: any): void;
        readDisplayStat(): number;
        finishDraw(pixelData: any): void;
    }
}
declare module lcc$gba.core.video {
    class MemoryAligned16 {
        buffer: Uint16Array;
        constructor(size: number);
        load8(offset: any): number;
        load16(offset: any): number;
        loadU8(offset: any): number;
        loadU16(offset: any): number;
        load32(offset: any): number;
        store8(offset: any, value: any): void;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        insert(start: any, data: any): void;
        invalidatePage(address: any): void;
    }
    class GameBoyAdvanceVRAM extends MemoryAligned16 {
        vram: Uint16Array;
        constructor(size: number);
    }
    class GameBoyAdvanceOAM extends MemoryAligned16 {
        video: GameBoyAdvanceSoftwareRenderer;
        oam: Uint16Array;
        objs: Array<any>;
        scalerot: Array<any>;
        constructor(size: number);
        overwrite(memory: any): void;
        store16(offset: any, value: any): void;
    }
    class GameBoyAdvancePalette {
        colors: Array<any>[];
        adjustedColors: Array<any>[];
        passthroughColors: Array<any>[];
        blendY: number;
        adjustColor: Function;
        constructor();
        overwrite(memory: any): void;
        loadU8(offset: any): number;
        loadU16(offset: any): any;
        load16(offset: any): number;
        load32(offset: any): number;
        store16(offset: any, value: any): void;
        store32(offset: any, value: any): void;
        invalidatePage(address: any): void;
        convert16To32(value: any, input: any): void;
        mix(aWeight: any, aColor: any, bWeight: any, bColor: any): number;
        makeDarkPalettes(layers: any): void;
        makeBrightPalettes(layers: any): void;
        makeNormalPalettes(): void;
        makeSpecialPalette(layer: any): void;
        makeNormalPalette(layer: any): void;
        resetPaletteLayers(layers: any): void;
        resetPalettes(): void;
        accessColor(layer: any, index: any): any;
        adjustColorDark(color: any): number;
        adjustColorBright(color: any): number;
        setBlendY(y: any): void;
    }
    class GameBoyAdvanceOBJ {
        TILE_OFFSET: number;
        x: number;
        y: number;
        scalerot: number;
        doublesize: boolean;
        disable: number;
        mode: number;
        mosaic: boolean;
        multipalette: boolean;
        shape: number;
        scalerotParam: number;
        hflip: number;
        vflip: number;
        tileBase: number;
        priority: number;
        palette: number;
        cachedWidth: number;
        cachedHeight: number;
        oam: any;
        index: number;
        drawScanline: Function;
        pushPixel: Function;
        scalerotOam: any;
        size: number;
        constructor(oam: any, index: number);
        drawScanlineNormal(backing: any, y: any, yOff: any, start: any, end: any): void;
        drawScanlineAffine(backing: any, y: any, yOff: any, start: any, end: any): void;
        recalcSize(): void;
    }
    class GameBoyAdvanceOBJLayer {
        video: GameBoyAdvanceSoftwareRenderer;
        bg: boolean;
        index: number;
        priority: number;
        enabled: boolean;
        objwin: number;
        constructor(video: GameBoyAdvanceSoftwareRenderer, index: number);
        drawScanline(backing: any, layer: any, start: any, end: any): void;
        objComparator(a: any, b: any): number;
    }
    class GameBoyAdvanceSoftwareRenderer {
        HDRAW_LENGTH: number;
        LAYER_BG0: number;
        LAYER_BG1: number;
        LAYER_BG2: number;
        LAYER_BG3: number;
        LAYER_OBJ: number;
        LAYER_BACKDROP: number;
        HORIZONTAL_PIXELS: number;
        VERTICAL_PIXELS: number;
        LAYER_MASK: number;
        BACKGROUND_MASK: number;
        TARGET2_MASK: number;
        TARGET1_MASK: number;
        OBJWIN_MASK: number;
        WRITTEN_MASK: number;
        PRIORITY_MASK: number;
        drawBackdrop: any;
        pixelData: Uint8Array;
        palette: GameBoyAdvancePalette;
        vram: GameBoyAdvanceVRAM;
        oam: GameBoyAdvanceOAM;
        objLayers: GameBoyAdvanceOBJLayer[];
        objwinLayer: GameBoyAdvanceOBJLayer;
        backgroundMode: number;
        displayFrameSelect: number;
        hblankIntervalFree: number;
        objCharacterMapping: number;
        forcedBlank: number;
        win0: number;
        win1: number;
        objwin: number;
        vcount: number;
        win0Left: number;
        win0Right: number;
        win1Left: number;
        win1Right: number;
        win0Top: number;
        win0Bottom: number;
        win1Top: number;
        win1Bottom: number;
        windows: Array<any>;
        target1: Array<any>;
        target2: Array<any>;
        blendMode: number;
        blendA: number;
        blendB: number;
        blendY: number;
        bgMosaicX: number;
        bgMosaicY: number;
        objMosaicX: number;
        objMosaicY: number;
        lastHblank: number;
        nextHblank: number;
        nextEvent: number;
        nextHblankIRQ: number;
        nextVblankIRQ: number;
        nextVcounterIRQ: number;
        bg: Array<any>;
        bgModes: Function[];
        drawLayers: any[];
        objwinActive: boolean;
        alphaEnabled: boolean;
        scanline: any;
        sharedColor: number[];
        sharedMap: any;
        mosaic: boolean;
        constructor();
        clear(mmu: GameBoyAdvanceMMU): void;
        clearSubsets(mmu: any, regions: any): void;
        freeze(): void;
        defrost(frost: any): void;
        setBacking(backing: any): void;
        writeDisplayControl(value: any): void;
        writeBackgroundControl(bg: any, value: any): void;
        writeBackgroundHOffset(bg: any, value: any): void;
        writeBackgroundVOffset(bg: any, value: any): void;
        writeBackgroundRefX(bg: any, value: any): void;
        writeBackgroundRefY(bg: any, value: any): void;
        writeBackgroundParamA(bg: any, value: any): void;
        writeBackgroundParamB(bg: any, value: any): void;
        writeBackgroundParamC(bg: any, value: any): void;
        writeBackgroundParamD(bg: any, value: any): void;
        writeWin0H(value: any): void;
        writeWin1H(value: any): void;
        writeWin0V(value: any): void;
        writeWin1V(value: any): void;
        writeWindow(index: any, value: any): void;
        writeWinIn(value: any): void;
        writeWinOut(value: any): void;
        writeBlendControl(value: any): void;
        setBlendEnabled(layer: any, enabled: any, override: any): void;
        writeBlendAlpha(value: any): void;
        writeBlendY(value: any): void;
        writeMosaic(value: any): void;
        resetLayers(): void;
        layerComparator(a: any, b: any): number;
        accessMapMode0(base: any, size: any, x: any, yBase: any, out: any): void;
        accessMapMode1(base: any, size: any, x: any, yBase: any, out: any): void;
        accessTile(base: any, tile: any, y: any): number;
        static pushPixel(layer: any, map: any, video: any, row: any, x: any, offset: any, backing: any, mask: any, raw: any): void;
        identity(x: any): any;
        drawScanlineBlank(backing: any): void;
        prepareScanline(backing: any): void;
        drawScanlineBGMode0(backing: any, bg: any, start: any, end: any): void;
        drawScanlineBGMode2(backing: any, bg: any, start: any, end: any): void;
        drawScanlineBGMode3(backing: any, bg: any, start: any, end: any): void;
        drawScanlineBGMode4(backing: any, bg: any, start: any, end: any): void;
        drawScanlineBGMode5(backing: any, bg: any, start: any, end: any): void;
        drawScanline(y: any): void;
        finishScanline(backing: any): void;
        startDraw(): void;
        finishDraw(caller: any): void;
    }
}

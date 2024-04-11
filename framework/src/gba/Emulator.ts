
module lcc$gba {

const {ccclass, property, menu, executeInEditMode } = cc._decorator;

//@ts-ignore
let gfx = cc.gfx;

@ccclass("lcc$gba.Emulator")
@executeInEditMode()
@menu("i18n:lcc-gba.menu_component/Emulator")
export class Emulator extends cc.Component {

    @property(cc.BufferAsset)
    _bios: cc.BufferAsset = null;
	@property({
		type : cc.BufferAsset,
		tooltip : "BIOS 数据"
	})
	get bios(){
		return this._bios;
	}
	set bios(value:cc.BufferAsset){
		this._bios = value;
		this.setBiosData(value);
    }

    @property(cc.BufferAsset)
    _rom: cc.BufferAsset = null;
	@property({
		type : cc.BufferAsset,
		tooltip : "ROM 数据"
	})
	get rom(){
		return this._rom;
	}
	set rom(value:cc.BufferAsset){
		this._rom = value;
		this.setRomData(value);
	}
	
	@property()
	_sound:boolean = false;
	@property({
		tooltip:"播放声音"
	})
	get sound(){
		return this._sound;
	}
	set sound(value:boolean){
		if(this._sound != value){
			this._sound = value;
			this._audio.enable = value;
		}
	}

	@property({
		tooltip:"立即播放"
	})
	playOnLoad:boolean = false;

    /**
     * GBA 对象
     */
    private _gba:core.GameBoyAdvance = null;
    
	/**
	 * 音频播放器
	 */
	private _video:VideoPlayer = null;

	/**
	 * 音频播放器
	 */
	private _audio:AudioPlayer = null;

	/**
	 * 音频播放器
	 */
	private _storage:Storage = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this._video = new VideoPlayer();
		this._audio = new AudioPlayer();
		this._storage = new Storage();
		this._gba = new core.GameBoyAdvance({
			audioDevice : this._audio,
			storeDevice : this._storage,
			videoDevice : this._video,
			onPollButtons : ()=>{
				this.node.emit("gba_poll_buttons");
			},
		});
		this._audio.enable = this.sound;
		this.setupBios();
	}
	
	/**
	 * 安装BIOS
	 */
	async setupBios(){
		if(CC_EDITOR){
			if(!this._bios){
				this.bios = await Utils.getAssetByUUID<cc.Material>(UUID.bioss["bios"]);
			}
		}
		this.setBiosData(this.bios);
	}
	
    /**
     * 获得GBA对象
     */
    public getGBA(){
        return this._gba;
    }
    
    /**
     * 获得视频对象
     */
    public getVideo(){
        return this._video;
	}
	
	/**
	 * 获得音频对象
	 */
	public getAudio(){
		return this._audio;
	}

	/**
	 * 获得存储对象
	 */
	public getStorage(){
		return this._storage;
	}

    /**
     * 设置BIOS数据
     */
    private setBiosData(data:cc.BufferAsset){
		if(!CC_EDITOR && this._gba){
			if(data){
				// @ts-ignore
				this._gba.setBios(data._buffer);
			}
		}
    }
    
    /**
     * 设置ROM数据,并且开始
     */
    private setRomData(data:cc.BufferAsset){
		if(!CC_EDITOR && this._gba){
			if(data){
				// @ts-ignore
				this._gba.setRom(data._buffer);
				this._gba.runStable();
			}
		}
	}

	/**
	 * 重置
	 */
	public reset(){
		if(!CC_EDITOR && this._gba){
			this._gba.reset();
		}
	}
	
    start () {
		if(this.playOnLoad){
			this.setRomData(this.rom);
		}
	}
	
	/**
	 * 获得存档
	 * @returns 存档JSON数据
	 */
	public getState(){
		return this._gba.getSavedata();
	}
	
	/**
	 * 加载存档
	 * @param json 存档JSON数据
	 */
	public loadState(s){
		return this._gba.loadSavedata(s);
	}
    
    // update (dt) {}
}

}

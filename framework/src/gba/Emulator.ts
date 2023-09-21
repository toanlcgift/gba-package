
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
		tooltip : "BIOS"
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
		tooltip : "ROM"
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
		tooltip:"sound"
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
		tooltip:"playOnLoad"
	})
	playOnLoad:boolean = false;


    private _gba:core.GameBoyAdvance = null;
    

	private _video:VideoPlayer = null;

	private _audio:AudioPlayer = null;

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
	
	async setupBios(){
		if(CC_EDITOR){
			if(!this._bios){
				this.bios = await Utils.getAssetByUUID<cc.Material>(UUID.bioss["bios"]);
			}
		}
		this.setBiosData(this.bios);
	}
	
    public getGBA(){
        return this._gba;
    }
    
    public getVideo(){
        return this._video;
	}
	
	public getAudio(){
		return this._audio;
	}

	public getStorage(){
		return this._storage;
	}

    private setBiosData(data:cc.BufferAsset){
		if(!CC_EDITOR && this._gba){
			if(data){
				// @ts-ignore
				this._gba.setBios(data._buffer);
			}
		}
    }
    
    private setRomData(data:cc.BufferAsset){
		if(!CC_EDITOR && this._gba){
			if(data){
				// @ts-ignore
				this._gba.setRom(data._buffer);
				this._gba.runStable();
			}
		}
	}

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
	
	public getState(){
		return this._gba.getSavedata();
	}
	
	public loadState(s){
		return this._gba.loadSavedata(s);
	}
    
    // update (dt) {}
}

}

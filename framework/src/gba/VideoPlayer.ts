
module lcc$gba {

//@ts-ignore
	let gfx = cc.gfx;

export class VideoPlayer implements core.VideoDevice {
	HORIZONTAL_PIXELS = 240;
	VERTICAL_PIXELS = 160;

    
    private _texture:cc.Texture2D = null;

   
    private _framebuffer:Uint8Array = null;

	constructor(){
		this._texture = new cc.Texture2D();
		this._framebuffer = new Uint8Array(new ArrayBuffer(this.HORIZONTAL_PIXELS * this.VERTICAL_PIXELS * 4));
	}

    
    public getTexture(){
        return this._texture;
    }

	getFrameBuffer(){
		return this._framebuffer;
	}
	
	
	drawFrame(pixelData:Uint8Array){
        this._texture.initWithData(pixelData, gfx.TEXTURE_FMT_RGBA8, this.HORIZONTAL_PIXELS, this.VERTICAL_PIXELS);
	}
}

}


module lcc$gba {

//@ts-ignore
let gfx = cc.gfx;

/**
 * 视频播放器
 */
export class VideoPlayer implements core.VideoDevice {
	HORIZONTAL_PIXELS = 240;
	VERTICAL_PIXELS = 160;

    /**
     * 纹理对象
     */
    private _texture:cc.Texture2D = null;

    /**
     * 帧缓冲 Uint8视图
     */
    private _framebuffer:Uint8Array = null;

	constructor(){
		this._texture = new cc.Texture2D();
		this._framebuffer = new Uint8Array(new ArrayBuffer(this.HORIZONTAL_PIXELS * this.VERTICAL_PIXELS * 4));
	}

    /**
     * 获得纹理对象
     */
    public getTexture(){
        return this._texture;
    }

	/**
	 * 获得帧缓冲
	 */
	getFrameBuffer(){
		return this._framebuffer;
	}
	
	/**
	 * 更新帧数据
	 * @param pixelData 
	 */
	drawFrame(pixelData:Uint8Array){
        this._texture.initWithData(pixelData, gfx.TEXTURE_FMT_RGBA8, this.HORIZONTAL_PIXELS, this.VERTICAL_PIXELS);
	}
}

}

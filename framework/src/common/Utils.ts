
module lcc$gba {

export class Utils {

/**
 * 通过UUID获得资源
 */
static getAssetByUUID<T extends cc.Asset>(uuid:string){
	return new Promise<T>((resolve)=>{
		cc.assetManager.loadAny([ uuid ], function (err, asset:T) {
			if(!err && asset){
				resolve(asset);
			}else{
				cc.warn("not found asset : %s", uuid);
				resolve(null);
			}
		});
	});
}

}

}

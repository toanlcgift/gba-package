
module lcc$gba {

/**
 * 存储器
 */
export class Storage implements core.StorageDevice {
	
	SYS_ID = 'com.endrift.gbajs';
	
	/**
	 * 保存存档
	 * @param code 
	 * @param sdata 
	 */
	save(code:string, sdata:core.SaveData){
		if(code && sdata){
			cc.sys.localStorage.setItem(this.SYS_ID + "-" +code, JSON.stringify(sdata));
		}
	}
	
	/**
	 * 加载存档
	 * @param code 
	 */
	load(code:string){
		let data:string = cc.sys.localStorage.getItem(this.SYS_ID + "-" +code);
		if(data){
			return JSON.parse(data);
		}
	}
}

}

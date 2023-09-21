
module lcc$gba {

export class Storage implements core.StorageDevice {
	
	SYS_ID = 'gba';
	
	save(code:string, sdata:core.SaveData){
		if(code && sdata){
			cc.sys.localStorage.setItem(this.SYS_ID + "-" +code, JSON.stringify(sdata));
		}
	}
	
	load(code:string){
		let data:string = cc.sys.localStorage.getItem(this.SYS_ID + "-" +code);
		if(data){
			return JSON.parse(data);
		}
	}
}

}

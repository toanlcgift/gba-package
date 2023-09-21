
module lcc$gba.core {

export enum Button {
	A = 0,
	B = 1,
	SELECT = 2,
	START = 3,
	RIGHT = 4,
	LEFT = 5,
	UP = 6,
	DOWN = 7,
	R = 8,
	L = 9,
}

export class GameBoyAdvanceKeypad {
	
	currentDown = 0x03FF;
	onPollButtons:Function = null;

	buttonDown(b:Button){
		let toggle = 1 << b;
		this.currentDown &= ~toggle;
	}

	buttonUp(b:Button){
		let toggle = 1 << b;
		this.currentDown |= toggle;
	}

	updateButtons(value:number){
		this.currentDown = ~value & 0x03FF;
	}
	
	pollButtons() {
		if(this.onPollButtons){
			this.onPollButtons();
		}
	};
}

}

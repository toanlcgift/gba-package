
module lcc$gba.core {

export function hex(number, leading, usePrefix?:boolean) {
	if (typeof(usePrefix) === 'undefined') {
		usePrefix = true;
	}
	if (typeof(leading) === 'undefined') {
		leading = 8;
	}
	let string = (number >>> 0).toString(16).toUpperCase();
	leading -= string.length;
	if (leading < 0)
		return string;
	return (usePrefix ? '0x' : '') + new Array(leading + 1).join('0') + string;
}

export function str2ab(str:string, cs:number = 1){
	let buf = new ArrayBuffer(str.length * cs);
	let bufView = new Uint16Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
	  bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

export function concatab(...abs:ArrayBuffer[]){
	let l = 0;
	for (let ab of abs){
		l += ab.byteLength;
	}
	let result = new ArrayBuffer(l);
	let ru8 = new Uint8Array(result);
    let offset = 0;
    for (let ab of abs) {
        ru8.set(new Uint8Array(ab), offset);
        offset += ab.byteLength;
    }
    return result;
}

export module Serializer {

export class Pointer {
	index = 0;
	top = 0;
	stack = [];

	advance(amount) {
		let index = this.index;
		this.index += amount;
		return index;
	};
	
	mark() {
		return this.index - this.top;
	};
	
	push() {
		this.stack.push(this.top);
		this.top = this.index;
	};
	
	pop() {
		this.top = this.stack.pop();
	};
	
	readString(view) {
		let length = view.getUint32(this.advance(4), true);
		let bytes = [];
		for (let i = 0; i < length; ++i) {
			bytes.push(String.fromCharCode(view.getUint8(this.advance(1))));
		}
		return bytes.join('');
	};
}

const TAG_INT 		= 1;
const TAG_STRING 	= 2;
const TAG_STRUCT 	= 3;
const TAG_BOOLEAN 	= 5;

export function packUint32(value:number) {
	let object = new DataView(new ArrayBuffer(4));
	object.setUint32(0, value, true);
	return object.buffer;
}

export function packUint8(value:number) {
	let object = new DataView(new ArrayBuffer(1));
	object.setUint8(0, value);
	return object.buffer;
}

export function packBytes(value:ArrayBuffer) {
	return concatab(packUint32(value.byteLength), value);
}

export function serialize(stream:{}) {
	let parts:ArrayBuffer[] = [];
	let size = 4;
	for (let i in stream) {
		if (Object.prototype.hasOwnProperty.call(stream, i)) {
			let tag:number;
			let head = packBytes(str2ab(i));
			let body:ArrayBuffer;
			switch (typeof(stream[i])) {
			case 'number':
				tag = TAG_INT;
				body = packUint32(stream[i]);
				break;
			case 'string':
				tag = TAG_STRING;
				body = packBytes(stream[i]);
				break;
			case 'object':
				tag = TAG_STRUCT;
				body = serialize(stream[i]);
				break;
			case 'boolean':
				tag = TAG_BOOLEAN;
				body = packUint8(stream[i]);
				break;
			default:
				console.log(stream[i]);
				break;
			}
			size += 1 + head.byteLength + body.byteLength;
			parts.push(packUint8(tag));
			parts.push(head);
			parts.push(body);
		}
	}
	parts.unshift(packUint32(size));
	return concatab(...parts);
}

export function deserialize(data:ArrayBuffer) {
	let view = new DataView(data);
	let pointer = new Pointer();
	return deserealizeStream(view, pointer);
}

function deserealizeStream(view:DataView, pointer:Pointer) {
	pointer.push();
	let object = {};
	let remaining = view.getUint32(pointer.advance(4), true);
	while (pointer.mark() < remaining) {
		let tag = view.getUint8(pointer.advance(1));
		let head = pointer.readString(view);
		let body:any;
		switch (tag) {
		case TAG_INT:
			body = view.getUint32(pointer.advance(4), true);
			break;
		case TAG_STRING:
			body = pointer.readString(view);
			break;
		case TAG_STRUCT:
			body = deserealizeStream(view, pointer);
			break;
		case TAG_BOOLEAN:
			body = !!view.getUint8(pointer.advance(1));
			break;
		}
		object[head] = body;
	}
	if (pointer.mark() > remaining) {
		throw "Size of serialized data exceeded";
	}
	pointer.pop();
	return object;
}

}

}

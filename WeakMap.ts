import core = require('./interfaces');
import has = require('./has');
import lang = require('./lang');

has.add('es6-weak-map', typeof (<any> WeakMap) !== 'undefined');

var startId = 1;

class WeakMapPolyfill<K, V> implements core.IWeakMap<K, V>, WeakMap<K, V> {
	private _name:string = undefined;
	static length:number = 1;

	constructor(iterable?:any) {
		this._name = '__wm' + lang.getUID() + (startId++ + '__');
		if (iterable && 'forEach' in iterable) {
			iterable.forEach((item:any, i:number) => {
				if (Array.isArray(item) && item.length === 2) {
					this.set(iterable[i][0], iterable[i][1]);
				}
				else {
					this.set(iterable[i], i);
				}
			});
		}
	}

	set(key:any, value:any):any {
		var entry = key[this._name];
		if (entry && entry[0] === key) {
			entry[1] = value;
		}
		else {
			Object.defineProperty(key, this._name, {
				value: [key, value],
				writable: true
			});
		}
		return this;
	}

	get(key:any):any {
		var entry = key[this._name];
		return entry && entry[0] === key ? entry[1] : undefined;
	}

	has(key:any):boolean {
		var entry = key[this._name];
		return Boolean(entry && entry[0] === key && entry[1]);
	}

    delete(key: K): boolean {
        var result = false;
        if (this.has(key)) {
            this.set(key, undefined);
            result = true;
        } 

        return result;
        
    }

    clear(): void {
        //Must do something here!
    }
}

if (has('es6-weak-map')) {
    WeakMap = WeakMapPolyfill;
}

export = WeakMap;

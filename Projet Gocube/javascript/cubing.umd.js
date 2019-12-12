! function(e, t) {
	"object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t((e = e || self).cubing = {})
}(this, function(e) {

	class BlockMove {
		constructor(e, t, n, r = 1) {
			if (this.family = n, this.amount = r, this.type = "blockMove", t && (this.innerLayer = t, e && (this.outerLayer = e)), e && !t) throw new Error("Attempted to contruct block move with outer layer but no inner layer");
			Object.freeze(this)
		}
		getMove(){
			return this.family;
		}
	}

	function l(e, t) {
		return new BlockMove(void 0, void 0, e, t)
	}

	//Return the state of the cube
	// . called in BluetoothPuzzle.getState
	// . called in GoCube.connect "..addEventListener"
	function G(e, t, n, r) {
		return new(n || (n = Promise))(function(i, o) {
			function a(e) {
				try {
					c(r.next(e))
				} catch (e) {
					o(e)
				}
			}

			function s(e) {
				try {
					c(r.throw(e))
				} catch (e) {
					o(e)
				}
			}

			function c(e) {
				e.done ? i(e.value) : new n(function(t) {
					t(e.value)
				}).then(a, s)
			}
			c((r = r.apply(e, t || [])).next())
		})
	}

	class BluetoothPuzzle {
		constructor() {
			this.listeners = [],
			this.orientationListeners = []
		}
		getState() {
			return G(this, void 0, void 0, function*() {
				throw new Error("cannot get state")
			})
		}
		addMoveListener(e) {
			this.listeners.push(e)
		}
		addOrientationListener(e) {
			this.orientationListeners.push(e)
		}
		dispatchMove(e) {
			for (const t of this.listeners) t(e)
		}
		dispatchOrientation(e) {
			for (const t of this.orientationListeners) t(e)
		}
	}

	//Mapping table of the value given by the cube
	const Bp = [l("B", 1), l("B", 0), l("F", 1), l("F", 0), l("U", 1), l("U", 0), l("D", 1), l("D", 0), l("R", 1), l("R", 0), l("L", 1), l("L", 0)];
	
	class GoCube extends BluetoothPuzzle {
		constructor(e, t) {
			super(),
				this.server = e,
				this.goCubeStateCharacteristic = t,
				this.recorded = [],
				this.homeQuatInverse = null
		}

		static connect(e) {
			return G(this, void 0, void 0, function*() {
				const t = yield e.getPrimaryService(zp.goCubeService); {
					service: t
				};
				const n = yield t.getCharacteristic(zp.goCubeStateCharacteristic); {
					goCubeStateCharacteristic: n
				};
				const r = new GoCube(e, n);

				return yield n.startNotifications(),
					n.addEventListener("characteristicvaluechanged", r.onCubeCharacteristicChanged.bind(r)),
					r
			})
		}

		//Name of the device
		name() {
			return this.server.device.name
		}

		//Function called by connect
		// . attached to the listener "characteristicvaluechanged"
		onCubeCharacteristicChanged(e) {
			const t = e.target.value;
			const n = Bp[t.getUint8(3)];
			console.log(t);
			this.dispatchMove({
				latestMove: Bp[t.getUint8(3)],
				timeStamp: e.timeStamp
			});
			console.log("LastMove: " + t.getUint8(3));
		}
	}

	//UUIDs bluetooth of the GoCube
	const zp = {
				goCubeService: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
				goCubeStateCharacteristic: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
			};

	//Main
	var Up = Object.freeze({
		connect: function() {
			return G(this, void 0, void 0, function*() {
				//Connection bluetooth
				const e = yield navigator.bluetooth.requestDevice(function() {
					const e = {
						filters: [{namePrefix: "GoCube"}],
						optionalServices: [zp.goCubeService]
					};
					return {
						requestOptions: e
					}, e
				}());
				if (void 0 === e.gatt) 
					return Promise.reject("Device did not have a GATT server.");
				const t = yield e.gatt.connect();
					return yield GoCube.connect(t)
			})
		}
	});

	e.bluetooth = Up
});
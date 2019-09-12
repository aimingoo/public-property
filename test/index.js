var execute = require('./prepack-core/prepack.min.js').default;
var fancy = require('fancy-test').fancy;
var expect = require('chai').expect;

describe("Simple declaration", ()=> {
	fancy.stdout().stderr().
	it('A public property vs. normal property', output => {
		execute(`
			class MyClass {
				public x = 100;
				y = 200;
				get z() {
					return 300;
				}
			}

			var {x, y, z} = new MyClass;
			console.log([x,y,z]);
		`);
		expect(output.stdout).to.eql('100,200,300\n');
	});

	fancy.stdout().stderr().
	it('Public property with computed property name', output => {
		execute(`
			var x;
			class MyClass {
				public [x=Symbol] = 100;
			}

			console.log((new MyClass)[x]);
		`);
		expect(output.stdout).to.eql('100\n');
	});


	fancy.stdout().stderr().
	it('Public property using arrow function', output => {
		execute(`
			var x = "outer";
			class MyClass {
				public x = 100;
				public f = () => {
					console.log(this.x);
				}
			}
			(new MyClass).f();
		`);
		expect(output.stdout).to.eql('outer\n');
	});


	fancy.stdout().stderr().
	it('Static public property', output => {
		execute(`
			class MyClass {
				public static x = 100;
				static y = 200;
				static get z() {
					return 300;
				}
			}
			var {x, y, z} = MyClass;
			console.log([x,y,z]);
		`);
		expect(output.stdout).to.eql('100,200,300\n');
	});
});

describe("Publish or alias", ()=> {
	fancy.stdout().stderr().
	it('Publish private name', output => {
		execute(`
			class MyClass {
				private x = 100;
				public as x;
			}
			console.log((new MyClass).x);
		`);
		expect(output.stdout).to.eql('100\n');
	});

	fancy.stdout().stderr().
	it('Publish protected name', output => {
		execute(`
			class MyClass {
				protected x = 200;
			}
			class MyClassEx extends MyClass {
				public as x;
			}
			console.log((new MyClassEx).x);
		`);
		expect(output.stdout).to.eql('200\n');
	});


	fancy.stdout().stderr().
	it('Publish private name using alias', output => {
		execute(`
			class MyClass {
				private x = 100;
				public x as y;
			}
			console.log((new MyClass).y);
		`);
		expect(output.stdout).to.eql('100\n');
	});

	fancy.stdout().stderr().
	it('Publish protected name using alias', output => {
		execute(`
			class MyClass {
				protected x = 200;
			}
			class MyClassEx extends MyClass {
				public x as y;
			}
			console.log((new MyClassEx).y);
		`);
		expect(output.stdout).to.eql('200\n');
	});

	fancy.stdout().stderr().
	it('Access published property', output => {
		execute(`
			class MyClass {
				protected x = 200;
			}
			class MyClassEx extends MyClass {
				public as x;
			}

			var a = new MyClassEx;
			console.log(a.x);
			a.x = 300;
			console.log(a.x);
		`);
		expect(output.stdout).to.eql('200\n300\n');
	});
});

describe("Different from some expected features", ()=> {
	fancy.stdout().stderr().
	it('Feature: public property is NOT own-property of instance', output => {
		execute(`
			class MyClass {
				public x = 100;
			}
			console.log(Object.getOwnPropertyDescriptor(new MyClass, 'x'));
		`);
		expect(output.stdout).to.eql('undefined\n');
	});

	fancy.stdout().stderr().
	it('Feature: public property base on prototype', output => {
		execute(`
			class MyClass {
				public x = 100;
			}
			console.log(Object.getOwnPropertyDescriptor(MyClass.prototype, 'x').value);
		`);
		expect(output.stdout).to.eql('100\n');
	});
});

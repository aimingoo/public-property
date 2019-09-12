# Public property in class member definition

The proposal is an enhancement of public property of class definition syntax.

The proposal will implementation `public`  keyword in class definition:

* Nothing NEW

  Concept cleanly. All the features are grammatical sugar, except that the `public` keyword is enabled.




The proposal is not tc39 officailly now but implemented at [prepack-core with proposal-public-property](https://github.com/aimingoo/prepack-core/tree/proposal-public-property) ([@here](https://github.com/aimingoo/prepack-core/tree/proposal-public-property)).

You could see more test case in this project ([@here](#testcases)).



Table of Contents
=================

* [Public property in class member definition](#public-property-in-class-member-definition)
  * [Syntax design](#syntax-design)
  * [Concepts](#concepts)
  * [Implementation](#implementation)
  * [Testcases](#testcases)
  * [References](#references)
  * [History](#history)




## Syntax design

>  **Key principle:**
>
> ​	All the features of grammatical sugar can be implement base on existing.



**1. using `public` define public property, or default** 

Ex:

```java
class f {
  public data = 100;
  public static data = 200;
}

// equal
let f = class {};
let defaultAttr = { writable: true, enumerable: true, configurable: true };
Object.defineProperty(f.prototype, 'data', {value: 100, ...defaultAttr});
Object.defineProperty(f, 'data', {value: 200, ...defaultAttr});
```

case 2:

```javascript
class f {
  public foo() {
    // enabled, can be remove `public`
  }

  // equal
  foo() {
  }
}
```



**2. publish member from private scope**

example, for private property:

```javascript
class MyClass {
  private x = 100;
  public as x;
}

// equal
class MyClass {
  private x = 100;

  get x() {
    return x;
  }
  set x(v) {
    x = v;
  }
}
```



case 2, for protected property:

```javascript
class MyClass {
  protected x = 100;
}

class MyClassEx extends MyClass {
  public as x; // accept
}
```



**3. publish with alias**

Ex:

```javascript
class MyClass {
  protected x = 100;
}

class MyClassEx extends MyClass {
  public x as valueX;  // alias `valueX`
}

// equal
class MyClassEx extends MyClass {
  get valueX() {
    return x;
  }
  set valueX(v) {
    x = v;
  }
}
```



## Concepts

The truth is "*All the normal properties are published in JavaScript*".



## Implementation

**Core rules:**

- Can not publish a no-private member using `public as` syntax.
- Can not assignment initialization value when `public as` a member.

**Key implementation steps:**

- eta `public` keyword when evaluate definition item.
- make `get` and `set` method for *"**public** [name] **as** \<name\>"* grammatical.

Done.



## Testcases

The proposal has full test case in repository, current syntax based.

```bash
# install test framework
> mkdir node_modules
> npm install fancy-test chai mocha --no-save
# test it
> mocha

# (OR)
> bash run.sh
```



## References

* [Objections to fields, especially the private field syntax](https://github.com/tc39/proposal-class-fields/issues/150)
* [The proposal should be rejected!](https://github.com/tc39/proposal-class-fields/issues/148)
* [My comments at #100](https://github.com/tc39/proposal-class-fields/issues/100#issuecomment-429533532)



## History

2019.09.11 initial release.
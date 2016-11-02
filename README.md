# JavaScript object type binding

## Type binding

Given an ES6/TypeScript class

```typescript
class Person {

    name: string;

    sayHello() {
        return `Hello, my name is ${this.name}!`;
    }

}
```

from a plain JavaScript object you can easily create an instance of `Person`

```typescript
let object = { name: "Foo" }; // or JSON.parse('{ "name": "Foo" }');

let foo = new TypeBinder().bind(object, Person);

foo.sayHello(); // returns "Hello,  my name is Foo!"
```

To bind also object properties, you can use a decorator

```typescript
import { bind } from "type-binder";

class Person {

    name: string;

    @bind(Person) parent;

}

let foo = new TypeBinder().bind({ name: "Foo", parent: { name: "Bar" } }, Person);

foo.parent.sayHello(); // returns "Hello, my name is Bar!";
```

This works also with generic typing, using the `@generics` decorator

```typescript
import { generics } from "type-binder";

class Person {

    name: string;

    @generics(Person) children: Set<Person>;

}

let foo = new TypeBinder().bind({ name: "Foo", children: [ { name: "Bar" }, { name: "Baz" } ] });

for (let child of foo.children) {
    child.sayHello();
}
```

And you can add binding callbacks for additional types

```typescript
class Person {

    name: string;

    constructor(name: string) {
        this.name = name;
    }

}

let binder = new TypeBinder();

binder.setBindingCallback(Person, object => new Person(object.name));
```

## Object identity

The `@identifier` decorator takes a function which returns an identifier of that
object, which the binder will use to return same instances for all objects with
the same identifier (could be scoped, see code).

```typescript
import { identifier } from "type-binder";

@identifier<Person>(person => person.name)
class Person {

    name: string

}

let binder = new TypeBinder();

let foo1 = binder.bind({ "name": "Foo" });

let foo2 = binder.bind({ "name": "Foo" });

foo1 === foo2; // true
```

## Property tracker

Decorating a property with `@track` will instruct the binder to save the initial
property value in the object's metadata.

```typescript
import { track } from "type-binder";

class Person {

    @track() name: string

}

let person = new TypeBinder().bind({ name: "Foo" });

person.name = "Bar";

let changed = new TypeBinder().propertyHasChanged(person, "name");

changed === true; // true
```

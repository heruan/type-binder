/// <reference path="../../typings/index.d.ts" />

import "reflect-metadata";
import { bind, generics, track, identifier } from "../../src/decorators";
import { TypeBinder } from "../../src/type-binder";

@identifier<Foo>(foo => foo.id)
class Foo {
    id: number;
}

class Bar extends Foo {}

@identifier<Baz>((baz, binder) => binder.bind(baz.foo, Foo))
class Baz {
    @bind(Foo) foo: Foo;
    @bind(Set) @generics(Bar) set: Set<Bar>;
    @bind(Map) @generics(Foo, Bar) map: Map<Foo, Bar>;
    @bind(Number) @track() number: number;
    @bind(String) string: string;
    bool: boolean;
}

describe("object-mapper", () => {

    it("maps an object", () => {

        let object = {
            foo: {},
            set: [
                {}
            ],
            map: [
                [ {}, {} ]
            ],
            number: 123,
            bool: true,
            string: "foobar"
        }

        let baz = new TypeBinder().bind(object, Baz);
        expect(baz).toEqual(jasmine.any(Baz));
        expect(baz.foo).toEqual(jasmine.any(Foo));
        expect(baz.set).toEqual(jasmine.any(Set));
        baz.set.forEach(element => expect(element).toEqual(jasmine.any(Bar)));
        expect(baz.map).toEqual(jasmine.any(Map));
        baz.map.forEach((value, key) => {
            expect(key).toEqual(jasmine.any(Foo));
            expect(value).toEqual(jasmine.any(Bar));
        });
    });

    it("maps an array of objects", () => {

        let array = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ];

        let foos = new TypeBinder().bind(array, Array, Foo);
        foos.forEach(foo => expect(foo).toEqual(jasmine.any(Foo)));
    });

    it("tracks original values", () => {

        let object = {
            number: 123
        }

        let baz = new TypeBinder().bind(object, Baz);
        let diff = TypeBinder.propertyHasChanged(baz, "number");
        expect(diff).toBe(false);
        baz.number = 456;
        diff = TypeBinder.propertyHasChanged(baz, "number");
        expect(diff).toBe(true);
    });

    it("reuses object instances", () => {
        let baz = {
            foo: {
                id: 1
            }
        };
        let foo = {
            id: 1
        };
        let binder = new TypeBinder();
        let mBaz = binder.bind(baz, Baz);
        let mFoo = binder.bind(foo, Foo);
        let mBaz2 = binder.bind({ foo: mFoo }, Baz);
        expect(mBaz.foo).toBe(mFoo);
        expect(mBaz2).toBe(mBaz);
    });

});

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("reflect-metadata");
var decorators_1 = require("../../main/decorators");
var type_binder_1 = require("../../main/type-binder");
var Foo = (function () {
    function Foo() {
    }
    return Foo;
}());
Foo = __decorate([
    decorators_1.identifier(function (foo) { return foo.id; }),
    __metadata("design:paramtypes", [])
], Foo);
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        return _super.apply(this, arguments) || this;
    }
    return Bar;
}(Foo));
var Baz = (function () {
    function Baz() {
    }
    return Baz;
}());
__decorate([
    decorators_1.bind(Foo),
    __metadata("design:type", Foo)
], Baz.prototype, "foo", void 0);
__decorate([
    decorators_1.bind(Set), decorators_1.generics(Bar),
    __metadata("design:type", Set)
], Baz.prototype, "set", void 0);
__decorate([
    decorators_1.bind(Map), decorators_1.generics(Foo, Bar),
    __metadata("design:type", Map)
], Baz.prototype, "map", void 0);
__decorate([
    decorators_1.bind(Array),
    __metadata("design:type", Array)
], Baz.prototype, "digits", void 0);
__decorate([
    decorators_1.bind(Number), decorators_1.track(),
    __metadata("design:type", Number)
], Baz.prototype, "number", void 0);
__decorate([
    decorators_1.bind(String),
    __metadata("design:type", String)
], Baz.prototype, "string", void 0);
Baz = __decorate([
    decorators_1.identifier(function (baz) { return baz.number; }),
    __metadata("design:paramtypes", [])
], Baz);
describe("object-mapper", function () {
    it("maps an object", function () {
        var object = {
            foo: {},
            set: [
                {}
            ],
            map: [
                [{}, {}]
            ],
            digits: [1, 2, 3],
            number: 123,
            bool: true,
            string: "foobar"
        };
        var baz = new type_binder_1.TypeBinder().bind(object, Baz);
        expect(baz).toEqual(jasmine.any(Baz));
        expect(baz.foo).toEqual(jasmine.any(Foo));
        expect(baz.set).toEqual(jasmine.any(Set));
        baz.set.forEach(function (element) { return expect(element).toEqual(jasmine.any(Bar)); });
        expect(baz.map).toEqual(jasmine.any(Map));
        baz.map.forEach(function (value, key) {
            expect(key).toEqual(jasmine.any(Foo));
            expect(value).toEqual(jasmine.any(Bar));
        });
    });
    it("maps an array of objects", function () {
        var array = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ];
        var foos = new type_binder_1.TypeBinder().bind(array, Array, Foo);
        foos.forEach(function (foo) { return expect(foo).toEqual(jasmine.any(Foo)); });
    });
    it("tracks original values", function () {
        var object = {
            number: 123
        };
        var baz = new type_binder_1.TypeBinder().bind(object, Baz);
        var diff = type_binder_1.TypeBinder.propertyHasChanged(baz, "number");
        expect(diff).toBe(false);
        baz.number = 456;
        diff = type_binder_1.TypeBinder.propertyHasChanged(baz, "number");
        expect(diff).toBe(true);
    });
    it("reuses object instances", function () {
        var object = {
            foo: {
                id: 1
            }
        };
        var binder = new type_binder_1.TypeBinder();
        var baz = binder.bind(object, Baz);
        var foo = binder.bind({ id: 1 }, Foo);
        expect(baz.foo).toBe(foo);
    });
});

//# sourceMappingURL=type-binder.js.map

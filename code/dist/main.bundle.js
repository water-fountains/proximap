webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/actions.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return EDIT_FILTER_TEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SELECT_FOUNTAIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DESELECT_FOUNTAIN; });
var EDIT_FILTER_TEXT = 'EDIT_FILTER_TEXT';
var SELECT_FOUNTAIN = 'SELECT_FOUNTAIN';
var DESELECT_FOUNTAIN = 'DESELECT_FOUNTAIN';


/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".holder{\r\n  display: -ms-grid;\r\n  display: grid;\r\n\r\n      grid-template-areas:\r\n    \"top top\"\r\n    \"side mainmap\"\r\n    \"side detail\";\r\n  -ms-grid-columns: auto 1fr;\r\n      grid-template-columns: auto 1fr;\r\n  -ms-grid-rows: 60px 1fr auto;\r\n      grid-template-rows: 60px 1fr auto;\r\n  grid-gap: 0;\r\n  height: 100vh;\r\n}\r\n\r\napp-list {\r\n  -ms-grid-row: 2;\r\n  -ms-grid-row-span: 2;\r\n  -ms-grid-column: 1;\r\n  grid-area: side;\r\n  overflow-y: scroll;\r\n  width: 300px;\r\n}\r\n\r\napp-map {\r\n  -ms-grid-row: 2;\r\n  -ms-grid-column: 2;\r\n  grid-area: mainmap;\r\n}\r\n\r\napp-navbar {\r\n  -ms-grid-row: 1;\r\n  -ms-grid-column: 1;\r\n  -ms-grid-column-span: 2;\r\n  grid-area: top;\r\n}\r\n\r\napp-detail {\r\n  -ms-grid-row: 3;\r\n  -ms-grid-column: 2;\r\n  grid-area: detail;\r\n  padding: 50px;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "\n<div class=\"holder\">\n  <app-navbar></app-navbar>\n  <app-list></app-list>\n  <app-map></app-map>\n  <app-detail *ngIf=\"((mode | async) == 'details')\"></app-detail>\n</div>\n\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_redux__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'app';
    }
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ng2_redux__["select"])(),
        __metadata("design:type", Object)
    ], AppComponent.prototype, "mode", void 0);
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng2_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__navbar_navbar_component__ = __webpack_require__("../../../../../src/app/navbar/navbar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__map_map_component__ = __webpack_require__("../../../../../src/app/map/map.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__yaga_leaflet_ng2__ = __webpack_require__("../../../../@yaga/leaflet-ng2/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__yaga_leaflet_ng2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__yaga_leaflet_ng2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__list_list_component__ = __webpack_require__("../../../../../src/app/list/list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__store__ = __webpack_require__("../../../../../src/app/store.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__data_service__ = __webpack_require__("../../../../../src/app/data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__map_map_config__ = __webpack_require__("../../../../../src/app/map/map.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__detail_detail_component__ = __webpack_require__("../../../../../src/app/detail/detail.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var AppModule = /** @class */ (function () {
    function AppModule(ngRedux) {
        ngRedux.configureStore(__WEBPACK_IMPORTED_MODULE_8__store__["b" /* rootReducer */], __WEBPACK_IMPORTED_MODULE_8__store__["a" /* INITIAL_STATE */]);
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_4__navbar_navbar_component__["a" /* NavbarComponent */],
                __WEBPACK_IMPORTED_MODULE_5__map_map_component__["a" /* MapComponent */],
                __WEBPACK_IMPORTED_MODULE_7__list_list_component__["a" /* ListComponent */],
                __WEBPACK_IMPORTED_MODULE_13__detail_detail_component__["a" /* DetailComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_6__yaga_leaflet_ng2__["YagaModule"],
                __WEBPACK_IMPORTED_MODULE_2_ng2_redux__["NgReduxModule"],
                __WEBPACK_IMPORTED_MODULE_9__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_12__angular_forms__["a" /* FormsModule */]
            ],
            exports: [],
            providers: [
                __WEBPACK_IMPORTED_MODULE_10__data_service__["a" /* DataService */],
                __WEBPACK_IMPORTED_MODULE_11__map_map_config__["a" /* MapConfig */],
                __WEBPACK_IMPORTED_MODULE_6__yaga_leaflet_ng2__["MapProvider"]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ng2_redux__["NgRedux"]])
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/data.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__("../../../../rxjs/_esm5/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("../../../../rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ng2_redux__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var fountainsUrl = '../assets/brunnen.json';
var DataService = /** @class */ (function () {
    function DataService(http) {
        var _this = this;
        this.http = http;
        this._fountains = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this._filteredFountains = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.loadInitialData();
        this.filterText.subscribe(function (text) {
            _this.filterFountains(text);
        });
    }
    // Return info for specified fountain
    DataService.prototype.getFountain = function (id) {
        return this._fountains.getValue().filter(function (f) {
            return f['properties']['nummer'] == id;
        })[0];
    };
    Object.defineProperty(DataService.prototype, "fountains", {
        // public observables used by external components
        get: function () {
            return this.asObservable(this._fountains);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataService.prototype, "filteredFountains", {
        get: function () {
            return this.asObservable(this._filteredFountains);
        },
        enumerable: true,
        configurable: true
    });
    // Get the initial data
    DataService.prototype.loadInitialData = function () {
        var _this = this;
        this.http.get(fountainsUrl)
            .subscribe(function (data) {
            _this._fountains.next(data['features']);
            _this._filteredFountains.next(data['features']);
        });
    };
    DataService.prototype.filterFountains = function (text) {
        if (text.length <= 3) {
            this._filteredFountains.next(this._fountains.getValue());
        }
        else {
            this._filteredFountains.next(this._fountains.getValue().filter(function (f) {
                return (f.properties.nummer + f.properties.bezeichnung).includes(text);
            }));
        }
    };
    DataService.prototype.asObservable = function (subject) {
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"](function (fn) { return subject.subscribe(fn); });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4_ng2_redux__["select"])(),
        __metadata("design:type", Object)
    ], DataService.prototype, "filterText", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4_ng2_redux__["select"])(),
        __metadata("design:type", Object)
    ], DataService.prototype, "fountainId", void 0);
    DataService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "../../../../../src/app/detail/detail.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/detail/detail.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>{{title}}</h1>\n<h2>{{fountainId | async}}</h2>\n<p>Some really interesting story about the fountain</p>\n<p></p>\n<button class=\"btn btn-danger\" (click)=\"deselectFountain()\">close</button>\n"

/***/ }),

/***/ "../../../../../src/app/detail/detail.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetailComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__("../../../../../src/app/actions.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_service__ = __webpack_require__("../../../../../src/app/data.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DetailComponent = /** @class */ (function () {
    function DetailComponent(ngRedux, dataService) {
        this.ngRedux = ngRedux;
        this.dataService = dataService;
        this.title = 'This is the detail of fountain ';
    }
    DetailComponent.prototype.deselectFountain = function () {
        this.ngRedux.dispatch({ type: __WEBPACK_IMPORTED_MODULE_2__actions__["a" /* DESELECT_FOUNTAIN */] });
    };
    DetailComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1_ng2_redux__["select"])(),
        __metadata("design:type", Object)
    ], DetailComponent.prototype, "fountainId", void 0);
    DetailComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-detail',
            template: __webpack_require__("../../../../../src/app/detail/detail.component.html"),
            styles: [__webpack_require__("../../../../../src/app/detail/detail.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ng2_redux__["NgRedux"], __WEBPACK_IMPORTED_MODULE_3__data_service__["a" /* DataService */]])
    ], DetailComponent);
    return DetailComponent;
}());



/***/ }),

/***/ "../../../../../src/app/list/list.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/list/list.component.html":
/***/ (function(module, exports) {

module.exports = "<ul class=\"list-group\">\n  <li *ngFor=\"let fountain of dataService.filteredFountains | async\" class=\"list-group-item\">\n    {{fountain.properties.bezeichnung}} - {{fountain.properties.nummer}}\n    <button class=\"btn btn-default\" (click)=\"selectFountain(fountain.properties.nummer)\">view</button>\n  </li>\n</ul>\n"

/***/ }),

/***/ "../../../../../src/app/list/list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__data_service__ = __webpack_require__("../../../../../src/app/data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng2_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions__ = __webpack_require__("../../../../../src/app/actions.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ListComponent = /** @class */ (function () {
    function ListComponent(dataService, ngRedux) {
        this.dataService = dataService;
        this.ngRedux = ngRedux;
    }
    ListComponent.prototype.ngOnInit = function () {
    };
    ListComponent.prototype.selectFountain = function (id) {
        this.ngRedux.dispatch({ type: __WEBPACK_IMPORTED_MODULE_3__actions__["c" /* SELECT_FOUNTAIN */], fountainId: id });
    };
    ListComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-list',
            template: __webpack_require__("../../../../../src/app/list/list.component.html"),
            styles: [__webpack_require__("../../../../../src/app/list/list.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__data_service__["a" /* DataService */], __WEBPACK_IMPORTED_MODULE_2_ng2_redux__["NgRedux"]])
    ], ListComponent);
    return ListComponent;
}());



/***/ }),

/***/ "../../../../../src/app/map/map.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\r\n#map {\r\n  height: 100%;\r\n  width: 100%;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/map/map.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"map\"></div>\r\n"

/***/ }),

/***/ "../../../../../src/app/map/map.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service__ = __webpack_require__("../../../../../src/app/data.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__map_config__ = __webpack_require__("../../../../../src/app/map/map.config.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ng2_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions__ = __webpack_require__("../../../../../src/app/actions.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet__ = __webpack_require__("../../../../leaflet/dist/leaflet-src.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_leaflet__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MapComponent = /** @class */ (function () {
    function MapComponent(dataService, mc, ngRedux) {
        this.dataService = dataService;
        this.mc = mc;
        this.ngRedux = ngRedux;
        this.fountains = [];
        this.lat = this.mc.map.initialLat;
        this.lng = this.mc.map.initialLng;
        this.zoom = this.mc.map.initialZoom;
    }
    MapComponent.prototype.selectFountain = function (fountainId) {
        this.ngRedux.dispatch({ type: __WEBPACK_IMPORTED_MODULE_5__actions__["c" /* SELECT_FOUNTAIN */], fountainId: fountainId });
    };
    MapComponent.prototype.deselectFountain = function () {
        this.ngRedux.dispatch({ type: __WEBPACK_IMPORTED_MODULE_5__actions__["a" /* DESELECT_FOUNTAIN */] });
    };
    MapComponent.prototype.zoomToFountain = function (f) {
        this.map.flyTo([
            f['geometry']['coordinates'][1],
            f['geometry']['coordinates'][0],
        ], this.mc.map.maxMapZoom);
    };
    MapComponent.prototype.zoomOut = function () {
        this.map.setZoom(this.mc.map.initialZoom);
    };
    MapComponent.prototype.initializeMap = function () {
        var _this = this;
        // Create map
        this.map = new __WEBPACK_IMPORTED_MODULE_6_leaflet__["Map"]('map', {
            center: [this.lat, this.lng],
            zoom: this.zoom // starting zoom
        })
            .on('click', function () { return _this.deselectFountain(); }); // is it necessary to disable event bubbling on markers?
        // Add background
        __WEBPACK_IMPORTED_MODULE_6_leaflet__["tileLayer"](this.mc.map.tileLayerUrl, { apikey: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].mapboxApiKey, zIndex: 2, maxZoom: this.mc.map.maxMapZoom })
            .addTo(this.map);
        // Add layer to contain fountains
        this.fountainLayer = new __WEBPACK_IMPORTED_MODULE_6_leaflet__["LayerGroup"]().addTo(this.map);
    };
    MapComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initializeMap();
        // When the app changes mode, change behaviour
        this.mode.subscribe(function (m) {
            // adjust map shape because of details panel
            setTimeout(function () { return _this.map.invalidateSize(); }, 100);
            switch (m) {
                case 'map': {
                    _this.zoomOut();
                }
            }
        });
        // When app loads or city changes, update fountains
        this.dataService.fountains.subscribe(function (fountains) {
            _this.fountains = [];
            fountains.forEach(function (f) {
                var markerLayer = __WEBPACK_IMPORTED_MODULE_6_leaflet__["marker"]([
                    f['geometry']['coordinates'][1],
                    f['geometry']['coordinates'][0]
                ], {
                    icon: __WEBPACK_IMPORTED_MODULE_6_leaflet__["icon"]({
                        iconUrl: _this.mc.fountainMarker.iconUrl,
                        shadowUrl: _this.mc.fountainMarker.shadowUrl,
                        iconSize: _this.mc.fountainMarker.iconSize,
                        shadowSize: _this.mc.fountainMarker.shadowSize,
                        iconAnchor: _this.mc.fountainMarker.iconAnchor,
                        shadowAnchor: _this.mc.fountainMarker.shadowAnchor,
                    })
                });
                markerLayer['id'] = f['properties']['nummer'];
                markerLayer.on('click', function () { return _this.selectFountain(markerLayer['id']); });
                _this.fountains.push(markerLayer);
            });
        });
        // When fountains are filtered, update map
        this.dataService.filteredFountains.subscribe(function (fountains) {
            var ids = fountains.map(function (f) { return f['properties']['nummer']; });
            _this.fountains.forEach(function (l) {
                if (ids.indexOf(l['id']) > -1) {
                    //  add to map if in list
                    l.addTo(_this.fountainLayer);
                }
                else {
                    l.remove();
                }
            });
        });
        // When a fountain is selected, zoom to it
        this.fountainId.subscribe(function (id) {
            if (id) {
                var f = _this.dataService.getFountain(id);
                _this.zoomToFountain(f);
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4_ng2_redux__["select"])(),
        __metadata("design:type", Object)
    ], MapComponent.prototype, "mode", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4_ng2_redux__["select"])(),
        __metadata("design:type", Object)
    ], MapComponent.prototype, "fountainId", void 0);
    MapComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-map',
            template: __webpack_require__("../../../../../src/app/map/map.component.html"),
            styles: [__webpack_require__("../../../../../src/app/map/map.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__data_service__["a" /* DataService */], __WEBPACK_IMPORTED_MODULE_3__map_config__["a" /* MapConfig */], __WEBPACK_IMPORTED_MODULE_4_ng2_redux__["NgRedux"]])
    ], MapComponent);
    return MapComponent;
}());



/***/ }),

/***/ "../../../../../src/app/map/map.config.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_leaflet__ = __webpack_require__("../../../../leaflet/dist/leaflet-src.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_leaflet___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_leaflet__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var MapConfig = /** @class */ (function () {
    function MapConfig() {
        this.map = {
            initialZoom: 15,
            initialLat: 47.3769,
            initialLng: 8.5417,
            minMapZoom: 13,
            maxMapZoom: 18,
            tileLayerUrl: 'https://api.mapbox.com/styles/v1/water-fountains/cjdfuslg5ftqo2squxk76q8pl/tiles/256/{z}/{x}/{y}?access_token={apikey}'
        };
        this.fountainMarker = {
            iconUrl: "../../assets/fountainIcon.png",
            iconSize: new __WEBPACK_IMPORTED_MODULE_1_leaflet__["Point"](8, 24),
            iconAnchor: new __WEBPACK_IMPORTED_MODULE_1_leaflet__["Point"](4, 24),
            shadowUrl: "../../assets/fountainIconShadow.png",
            shadowSize: new __WEBPACK_IMPORTED_MODULE_1_leaflet__["Point"](21, 29),
            shadowAnchor: new __WEBPACK_IMPORTED_MODULE_1_leaflet__["Point"](9, 22)
        };
    }
    MapConfig = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
    ], MapConfig);
    return MapConfig;
}());



/***/ }),

/***/ "../../../../../src/app/navbar/navbar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/navbar/navbar.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-default\">\n  <div class=\"container-fluid\">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">Water-Fountains.org</a>\n    </div>\n\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n\n      <form class=\"navbar-form navbar-left\">\n        <div class=\"form-group\">\n          <input\n            #filtertext\n            (keyup)=\"textFilter(filtertext.value)\"\n            type=\"text\"\n            class=\"form-control\"\n            placeholder=\"find fountain\">\n        </div>\n      </form>\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"dropdown\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Zurich <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li><a href=\"#\">Zurich</a></li>\n            <li><a href=\"#\">Geneva</a></li>\n            <li><a href=\"#\">Luzern</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div><!-- /.navbar-collapse -->\n  </div><!-- /.container-fluid -->\n</nav>\n"

/***/ }),

/***/ "../../../../../src/app/navbar/navbar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_redux__ = __webpack_require__("../../../../ng2-redux/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__("../../../../../src/app/actions.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(ngRedux) {
        this.ngRedux = ngRedux;
    }
    NavbarComponent.prototype.ngOnInit = function () {
    };
    NavbarComponent.prototype.textFilter = function (search_text) {
        this.ngRedux.dispatch({ type: __WEBPACK_IMPORTED_MODULE_2__actions__["b" /* EDIT_FILTER_TEXT */], text: search_text });
    };
    NavbarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-navbar',
            template: __webpack_require__("../../../../../src/app/navbar/navbar.component.html"),
            styles: [__webpack_require__("../../../../../src/app/navbar/navbar.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ng2_redux__["NgRedux"]])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "../../../../../src/app/store.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return INITIAL_STATE; });
/* harmony export (immutable) */ __webpack_exports__["b"] = rootReducer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__("../../../../../src/app/actions.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tassign__ = __webpack_require__("../../../../tassign/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tassign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_tassign__);


var INITIAL_STATE = {
    filterText: '',
    filterCategory: [],
    hideList: false,
    city: 'zurich',
    mode: 'map',
    fountainId: null,
    lang: 'en',
    fountain: {},
};
function rootReducer(state, action) {
    switch (action.type) {
        // change fountain filter text
        case __WEBPACK_IMPORTED_MODULE_0__actions__["b" /* EDIT_FILTER_TEXT */]: return Object(__WEBPACK_IMPORTED_MODULE_1_tassign__["tassign"])(state, { filterText: action.text });
        case __WEBPACK_IMPORTED_MODULE_0__actions__["c" /* SELECT_FOUNTAIN */]: return Object(__WEBPACK_IMPORTED_MODULE_1_tassign__["tassign"])(state, { fountainId: action.fountainId, mode: 'details' });
        case __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* DESELECT_FOUNTAIN */]: {
            return Object(__WEBPACK_IMPORTED_MODULE_1_tassign__["tassign"])(state, { mode: 'map' });
        }
        default: return state;
    }
}


/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    mapboxApiKey: 'pk.eyJ1Ijoid2F0ZXItZm91bnRhaW5zIiwiYSI6ImNqZGZ1cDR4bTA5OGcyeGxuamYzZnI2c20ifQ.aE2ji5z01HuLBGXNYraZYQ'
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map
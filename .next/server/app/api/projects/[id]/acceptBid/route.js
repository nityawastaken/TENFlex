/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/projects/[id]/acceptBid/route";
exports.ids = ["app/api/projects/[id]/acceptBid/route"];
exports.modules = {

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&page=%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute.js&appDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&page=%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute.js&appDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_dishanthooda_Projects_TENFLEX_tenflex_main_front_TENFlex_src_app_api_projects_id_acceptBid_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/projects/[id]/acceptBid/route.js */ \"(rsc)/./src/app/api/projects/[id]/acceptBid/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/projects/[id]/acceptBid/route\",\n        pathname: \"/api/projects/[id]/acceptBid\",\n        filename: \"route\",\n        bundlePath: \"app/api/projects/[id]/acceptBid/route\"\n    },\n    resolvedPagePath: \"/Users/dishanthooda/Projects/TENFLEX/tenflex_main_front/TENFlex/src/app/api/projects/[id]/acceptBid/route.js\",\n    nextConfigOutput,\n    userland: _Users_dishanthooda_Projects_TENFLEX_tenflex_main_front_TENFlex_src_app_api_projects_id_acceptBid_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwcm9qZWN0cyUyRiU1QmlkJTVEJTJGYWNjZXB0QmlkJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwcm9qZWN0cyUyRiU1QmlkJTVEJTJGYWNjZXB0QmlkJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcHJvamVjdHMlMkYlNUJpZCU1RCUyRmFjY2VwdEJpZCUyRnJvdXRlLmpzJmFwcERpcj0lMkZVc2VycyUyRmRpc2hhbnRob29kYSUyRlByb2plY3RzJTJGVEVORkxFWCUyRnRlbmZsZXhfbWFpbl9mcm9udCUyRlRFTkZsZXglMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZGlzaGFudGhvb2RhJTJGUHJvamVjdHMlMkZURU5GTEVYJTJGdGVuZmxleF9tYWluX2Zyb250JTJGVEVORmxleCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDNEQ7QUFDekk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9kaXNoYW50aG9vZGEvUHJvamVjdHMvVEVORkxFWC90ZW5mbGV4X21haW5fZnJvbnQvVEVORmxleC9zcmMvYXBwL2FwaS9wcm9qZWN0cy9baWRdL2FjY2VwdEJpZC9yb3V0ZS5qc1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcHJvamVjdHMvW2lkXS9hY2NlcHRCaWQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9wcm9qZWN0cy9baWRdL2FjY2VwdEJpZFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcHJvamVjdHMvW2lkXS9hY2NlcHRCaWQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZGlzaGFudGhvb2RhL1Byb2plY3RzL1RFTkZMRVgvdGVuZmxleF9tYWluX2Zyb250L1RFTkZsZXgvc3JjL2FwcC9hcGkvcHJvamVjdHMvW2lkXS9hY2NlcHRCaWQvcm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&page=%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute.js&appDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/projects/[id]/acceptBid/route.js":
/*!******************************************************!*\
  !*** ./src/app/api/projects/[id]/acceptBid/route.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var _utils_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/utils/db */ \"(rsc)/./src/utils/db.js\");\n/* harmony import */ var _models_Project__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/models/Project */ \"(rsc)/./src/models/Project.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\n\nasync function PUT(req, context) {\n    await (0,_utils_db__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n    const { id } = context.params;\n    const { bidIndex, userEmail } = await req.json();\n    const project = await _models_Project__WEBPACK_IMPORTED_MODULE_1__[\"default\"].findById(id);\n    if (!project) {\n        return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.json({\n            message: \"Project not found\"\n        }, {\n            status: 404\n        });\n    }\n    if (project.email !== userEmail) {\n        return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.json({\n            message: \"Unauthorized\"\n        }, {\n            status: 403\n        });\n    }\n    // Accept only one bid\n    project.bids = project.bids.map((bid, index)=>({\n            ...bid.toObject(),\n            isAccepted: index === bidIndex\n        }));\n    // ✅ Update project status\n    project.status = \"in-progress\";\n    await project.save();\n    return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.json({\n        message: \"Bid accepted\",\n        project\n    }, {\n        status: 200\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9wcm9qZWN0cy9baWRdL2FjY2VwdEJpZC9yb3V0ZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQW1DO0FBQ0k7QUFDSTtBQUVwQyxlQUFlRyxJQUFJQyxHQUFHLEVBQUVDLE9BQU87SUFDcEMsTUFBTUwscURBQVNBO0lBQ2YsTUFBTSxFQUFFTSxFQUFFLEVBQUUsR0FBR0QsUUFBUUUsTUFBTTtJQUM3QixNQUFNLEVBQUVDLFFBQVEsRUFBRUMsU0FBUyxFQUFFLEdBQUcsTUFBTUwsSUFBSU0sSUFBSTtJQUU5QyxNQUFNQyxVQUFVLE1BQU1WLHVEQUFPQSxDQUFDVyxRQUFRLENBQUNOO0lBQ3ZDLElBQUksQ0FBQ0ssU0FBUztRQUNaLE9BQU9ULHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUcsU0FBUztRQUFvQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUMzRTtJQUVBLElBQUlILFFBQVFJLEtBQUssS0FBS04sV0FBVztRQUMvQixPQUFPUCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVHLFNBQVM7UUFBZSxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUN0RTtJQUVBLHNCQUFzQjtJQUN0QkgsUUFBUUssSUFBSSxHQUFHTCxRQUFRSyxJQUFJLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyxLQUFLQyxRQUFXO1lBQy9DLEdBQUdELElBQUlFLFFBQVEsRUFBRTtZQUNqQkMsWUFBWUYsVUFBVVg7UUFDeEI7SUFFQSwwQkFBMEI7SUFDMUJHLFFBQVFHLE1BQU0sR0FBRztJQUVqQixNQUFNSCxRQUFRVyxJQUFJO0lBRWxCLE9BQU9wQixxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1FBQUVHLFNBQVM7UUFBZ0JGO0lBQVEsR0FBRztRQUFFRyxRQUFRO0lBQUk7QUFDL0UiLCJzb3VyY2VzIjpbIi9Vc2Vycy9kaXNoYW50aG9vZGEvUHJvamVjdHMvVEVORkxFWC90ZW5mbGV4X21haW5fZnJvbnQvVEVORmxleC9zcmMvYXBwL2FwaS9wcm9qZWN0cy9baWRdL2FjY2VwdEJpZC9yb3V0ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29ubmVjdERCIGZyb20gXCJAL3V0aWxzL2RiXCI7XG5pbXBvcnQgUHJvamVjdCBmcm9tIFwiQC9tb2RlbHMvUHJvamVjdFwiO1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQVVQocmVxLCBjb250ZXh0KSB7XG4gIGF3YWl0IGNvbm5lY3REQigpO1xuICBjb25zdCB7IGlkIH0gPSBjb250ZXh0LnBhcmFtcztcbiAgY29uc3QgeyBiaWRJbmRleCwgdXNlckVtYWlsIH0gPSBhd2FpdCByZXEuanNvbigpO1xuXG4gIGNvbnN0IHByb2plY3QgPSBhd2FpdCBQcm9qZWN0LmZpbmRCeUlkKGlkKTtcbiAgaWYgKCFwcm9qZWN0KSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJQcm9qZWN0IG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG4gIH1cblxuICBpZiAocHJvamVjdC5lbWFpbCAhPT0gdXNlckVtYWlsKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJVbmF1dGhvcml6ZWRcIiB9LCB7IHN0YXR1czogNDAzIH0pO1xuICB9XG5cbiAgLy8gQWNjZXB0IG9ubHkgb25lIGJpZFxuICBwcm9qZWN0LmJpZHMgPSBwcm9qZWN0LmJpZHMubWFwKChiaWQsIGluZGV4KSA9PiAoe1xuICAgIC4uLmJpZC50b09iamVjdCgpLFxuICAgIGlzQWNjZXB0ZWQ6IGluZGV4ID09PSBiaWRJbmRleCxcbiAgfSkpO1xuXG4gIC8vIOKchSBVcGRhdGUgcHJvamVjdCBzdGF0dXNcbiAgcHJvamVjdC5zdGF0dXMgPSBcImluLXByb2dyZXNzXCI7XG5cbiAgYXdhaXQgcHJvamVjdC5zYXZlKCk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJCaWQgYWNjZXB0ZWRcIiwgcHJvamVjdCB9LCB7IHN0YXR1czogMjAwIH0pO1xufVxuIl0sIm5hbWVzIjpbImNvbm5lY3REQiIsIlByb2plY3QiLCJOZXh0UmVzcG9uc2UiLCJQVVQiLCJyZXEiLCJjb250ZXh0IiwiaWQiLCJwYXJhbXMiLCJiaWRJbmRleCIsInVzZXJFbWFpbCIsImpzb24iLCJwcm9qZWN0IiwiZmluZEJ5SWQiLCJtZXNzYWdlIiwic3RhdHVzIiwiZW1haWwiLCJiaWRzIiwibWFwIiwiYmlkIiwiaW5kZXgiLCJ0b09iamVjdCIsImlzQWNjZXB0ZWQiLCJzYXZlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/projects/[id]/acceptBid/route.js\n");

/***/ }),

/***/ "(rsc)/./src/models/Project.js":
/*!*******************************!*\
  !*** ./src/models/Project.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n// models/Project.js\n\nconst bidSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    freelancer: String,\n    amount: Number,\n    message: String,\n    time: String,\n    isAccepted: {\n        type: Boolean,\n        default: false\n    }\n});\nconst projectSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    title: String,\n    description: String,\n    postDate: String,\n    deadline: String,\n    budget: Number,\n    tags: [\n        String\n    ],\n    skills: [\n        String\n    ],\n    postedBy: String,\n    datePosted: String,\n    email: String,\n    bids: [\n        bidSchema\n    ],\n    status: {\n        type: String,\n        enum: [\n            \"open\",\n            \"in-progress\",\n            \"submitted\",\n            \"completed\"\n        ],\n        default: \"open\"\n    },\n    acceptedFreelancerEmail: String\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).Project || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"Project\", projectSchema));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbW9kZWxzL1Byb2plY3QuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0JBQW9CO0FBQ1k7QUFFaEMsTUFBTUMsWUFBWSxJQUFJRCx3REFBZSxDQUFDO0lBQ3BDRyxZQUFZQztJQUNaQyxRQUFRQztJQUNSQyxTQUFTSDtJQUNUSSxNQUFNSjtJQUNOSyxZQUFZO1FBQUVDLE1BQU1DO1FBQVNDLFNBQVM7SUFBTTtBQUM5QztBQUVBLE1BQU1DLGdCQUFnQixJQUFJYix3REFBZSxDQUFDO0lBQ3hDYyxPQUFPVjtJQUNQVyxhQUFhWDtJQUNiWSxVQUFVWjtJQUNWYSxVQUFVYjtJQUNWYyxRQUFRWjtJQUNSYSxNQUFNO1FBQUNmO0tBQU87SUFDZGdCLFFBQVE7UUFBQ2hCO0tBQU87SUFDaEJpQixVQUFVakI7SUFDVmtCLFlBQVlsQjtJQUNabUIsT0FBT25CO0lBQ1BvQixNQUFNO1FBQUN2QjtLQUFVO0lBQ2pCd0IsUUFBUTtRQUNOZixNQUFNTjtRQUNOc0IsTUFBTTtZQUFDO1lBQVE7WUFBZTtZQUFhO1NBQVk7UUFDdkRkLFNBQVM7SUFDWDtJQUNBZSx5QkFBeUJ2QjtBQUMzQjtBQUdBLGlFQUFlSix3REFBZSxDQUFDNkIsT0FBTyxJQUNwQzdCLHFEQUFjLENBQUMsV0FBV2EsY0FBY0EsRUFBQyIsInNvdXJjZXMiOlsiL1VzZXJzL2Rpc2hhbnRob29kYS9Qcm9qZWN0cy9URU5GTEVYL3RlbmZsZXhfbWFpbl9mcm9udC9URU5GbGV4L3NyYy9tb2RlbHMvUHJvamVjdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBtb2RlbHMvUHJvamVjdC5qc1xuaW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xuXG5jb25zdCBiaWRTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgZnJlZWxhbmNlcjogU3RyaW5nLFxuICBhbW91bnQ6IE51bWJlcixcbiAgbWVzc2FnZTogU3RyaW5nLFxuICB0aW1lOiBTdHJpbmcsXG4gIGlzQWNjZXB0ZWQ6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2UgfVxufSk7XG5cbmNvbnN0IHByb2plY3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcbiAgdGl0bGU6IFN0cmluZyxcbiAgZGVzY3JpcHRpb246IFN0cmluZyxcbiAgcG9zdERhdGU6IFN0cmluZyxcbiAgZGVhZGxpbmU6IFN0cmluZyxcbiAgYnVkZ2V0OiBOdW1iZXIsXG4gIHRhZ3M6IFtTdHJpbmddLFxuICBza2lsbHM6IFtTdHJpbmddLFxuICBwb3N0ZWRCeTogU3RyaW5nLFxuICBkYXRlUG9zdGVkOiBTdHJpbmcsXG4gIGVtYWlsOiBTdHJpbmcsXG4gIGJpZHM6IFtiaWRTY2hlbWFdLFxuICBzdGF0dXM6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZW51bTogW1wib3BlblwiLCBcImluLXByb2dyZXNzXCIsIFwic3VibWl0dGVkXCIsIFwiY29tcGxldGVkXCJdLFxuICAgIGRlZmF1bHQ6IFwib3BlblwiLFxuICB9LFxuICBhY2NlcHRlZEZyZWVsYW5jZXJFbWFpbDogU3RyaW5nLCAvLyBmb3IgcmVmZXJlbmNlXG59KTtcblxuXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuUHJvamVjdCB8fFxuICBtb25nb29zZS5tb2RlbChcIlByb2plY3RcIiwgcHJvamVjdFNjaGVtYSk7XG4iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJiaWRTY2hlbWEiLCJTY2hlbWEiLCJmcmVlbGFuY2VyIiwiU3RyaW5nIiwiYW1vdW50IiwiTnVtYmVyIiwibWVzc2FnZSIsInRpbWUiLCJpc0FjY2VwdGVkIiwidHlwZSIsIkJvb2xlYW4iLCJkZWZhdWx0IiwicHJvamVjdFNjaGVtYSIsInRpdGxlIiwiZGVzY3JpcHRpb24iLCJwb3N0RGF0ZSIsImRlYWRsaW5lIiwiYnVkZ2V0IiwidGFncyIsInNraWxscyIsInBvc3RlZEJ5IiwiZGF0ZVBvc3RlZCIsImVtYWlsIiwiYmlkcyIsInN0YXR1cyIsImVudW0iLCJhY2NlcHRlZEZyZWVsYW5jZXJFbWFpbCIsIm1vZGVscyIsIlByb2plY3QiLCJtb2RlbCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/models/Project.js\n");

/***/ }),

/***/ "(rsc)/./src/utils/db.js":
/*!*************************!*\
  !*** ./src/utils/db.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst connectDB = async ()=>{\n    if ((mongoose__WEBPACK_IMPORTED_MODULE_0___default().connections)[0].readyState) return;\n    await mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(process.env.MONGODB_URI);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvdXRpbHMvZGIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWdDO0FBRWhDLE1BQU1DLFlBQVk7SUFDaEIsSUFBSUQsNkRBQW9CLENBQUMsRUFBRSxDQUFDRyxVQUFVLEVBQUU7SUFDeEMsTUFBTUgsdURBQWdCLENBQUNLLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVztBQUNoRDtBQUVBLGlFQUFlTixTQUFTQSxFQUFDIiwic291cmNlcyI6WyIvVXNlcnMvZGlzaGFudGhvb2RhL1Byb2plY3RzL1RFTkZMRVgvdGVuZmxleF9tYWluX2Zyb250L1RFTkZsZXgvc3JjL3V0aWxzL2RiLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IGNvbm5lY3REQiA9IGFzeW5jICgpID0+IHtcbiAgaWYgKG1vbmdvb3NlLmNvbm5lY3Rpb25zWzBdLnJlYWR5U3RhdGUpIHJldHVybjtcbiAgYXdhaXQgbW9uZ29vc2UuY29ubmVjdChwcm9jZXNzLmVudi5NT05HT0RCX1VSSSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0REI7XG4iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJjb25uZWN0REIiLCJjb25uZWN0aW9ucyIsInJlYWR5U3RhdGUiLCJjb25uZWN0IiwicHJvY2VzcyIsImVudiIsIk1PTkdPREJfVVJJIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/utils/db.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&page=%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2F%5Bid%5D%2FacceptBid%2Froute.js&appDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fdishanthooda%2FProjects%2FTENFLEX%2Ftenflex_main_front%2FTENFlex&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
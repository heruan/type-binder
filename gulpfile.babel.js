import gulp from "gulp";
import path from "path";
import exists from "path-exists";
import paths from "vinyl-paths";
import del from "del";
import run from "run-sequence";
import jasmine from "gulp-jasmine";
import reporters from "jasmine-reporters";
import typescript from "typescript";
import gts from "gulp-typescript";
import sass from "gulp-sass";
import merge from "merge2";
import tsconfig from "./tsconfig.json";
import pkconfig from "./package.json";

const dependencies = Object.keys(pkconfig.dependencies).filter(dep => exists.sync("../" + dep));
const sassOptions = {
    importer: url => ({ file: url.startsWith("~") ? path.resolve("node_modules", url.substr(1)) : url })
};
const tsc = gts(Object.assign({ typescript: typescript }, tsconfig.compilerOptions));
const typescriptSources = [ tsconfig.compilerOptions.rootDir + "/**/*.ts" ];
const htmlSources = [ tsconfig.compilerOptions.rootDir + "/**/*.html" ];
const scssSources = [ tsconfig.compilerOptions.rootDir + "/**/*.scss" ];
const output = tsconfig.compilerOptions.outDir;
const testOutput = "test/dist";
const testSuites = [ "test/**/*.ts" ];
const testSuitesDist = [ "test/dist/test/**/*.js" ];
const clean = [ output ];

gulp.task("clean", done => gulp.src(clean).pipe(paths(del)));
gulp.task("build-typescript", done => {
    let stream = gulp.src(typescriptSources).pipe(tsc);
    return merge([
        stream.js.pipe(gulp.dest(output)),
        stream.dts.pipe(gulp.dest(output))
    ]);
});
gulp.task("build-scss", done => gulp.src(scssSources).pipe(sass(sassOptions)).pipe(gulp.dest(output)));
gulp.task("build-html", done => gulp.src(htmlSources).pipe(gulp.dest(output)));
gulp.task("build", done => run("clean", [ "build-typescript", "build-scss", "build-html" ], done));

gulp.task("clean-test", () => gulp.src(testOutput).pipe(paths(del)));
gulp.task("build-test", [ "clean-test" ], () => gulp.src(typescriptSources.concat(testSuites)).pipe(tsc).pipe(gulp.dest(testOutput)));
gulp.task("test", [ "build-test" ], done => gulp.src(testSuitesDist).pipe(jasmine()));

gulp.task("default", () => run("build", "test"));

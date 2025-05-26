import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    input: "src/avguesser.ts",
    output: [
        {
            file: "dist/avguesser.js",
            format: "umd",
            name: "AVGuesser"
        }, {
            file: "dist/avguesser.min.js",
            format: "umd",
            name: "AVGuesser",
            plugins: [terser()]
        }, {
            file: "dist/avguesser.mjs",
            format: "es"
        }, {
            file: "dist/avguesser.min.mjs",
            format: "es",
            plugins: [terser()]
        }
    ],
    plugins: [typescript({
        compilerOptions: {
            module: "esnext"
        }
    })]
};

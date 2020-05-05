//import multi from "@rollup/plugin-multi-entry";
//import auto from "@rollup/plugin-auto-install";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import visualizer from "rollup-plugin-visualizer";
import json from "@rollup/plugin-json";
import sucrase from "@rollup/plugin-sucrase";
import typescript from "@rollup/plugin-typescript";
import ts from "@wessberg/rollup-plugin-ts";

export default {
  input: ["./entry.ts"],

  output: [
    {
      sourcemap: true,
      dir: "dist",
      format: "esm",
    },
  ],

  plugins: [
    //auto(),
    commonjs(),
    resolve({
      // extensions: [".js", ".ts"],
    }),
    // multi(),
    json(),
    ts({ noImplicitAny: false }),
    visualizer(),
    // typescript({
    //   noImplicitAny: false,
    //   noEmitOnError: true,
    // }),
    // sucrase({
    //   exclude: ["node_modules/**"],
    //   transforms: ["typescript"],
    // }),
    sourcemaps(),
  ],
};

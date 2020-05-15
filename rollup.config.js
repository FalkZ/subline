import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import visualizer from "rollup-plugin-visualizer";
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";

export default [
  {
    input: ["./src/subline.ts"],
    output: [
      {
        sourcemap: true,
        dir: "dist",
        format: "esm",
      },
    ],

    plugins: [
      commonjs(),
      resolve(),
      json(),
      ts({ noImplicitAny: false }),
      visualizer(),
      sourcemaps(),
    ],
  },
  {
    input: ["./src/service-worker.ts"],
    output: [
      {
        sourcemap: true,
        dir: "dist",
        format: "esm",
      },
    ],
    plugins: [
      commonjs(),
      resolve(),
      json(),
      ts({ noImplicitAny: false }),
      sourcemaps(),
    ],
  },
];

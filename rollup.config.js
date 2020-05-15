import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import visualizer from "rollup-plugin-visualizer";
import json from "@rollup/plugin-json";
import ts from "@wessberg/rollup-plugin-ts";
import cleanup from "rollup-plugin-cleanup";

const output = [
  {
    sourcemap: true,
    dir: "dist",
    format: "esm",
  },
];

const plugins = [
  commonjs(),
  resolve(),
  json(),
  ts(),
  sourcemaps(),
  cleanup({ comments: "none", extensions: ["js", "ts"] }),
];

export default [
  {
    input: ["./src/subline.ts"],
    output,
    onwarn: (warning, warn) => {
      if (warning.code !== "THIS_IS_UNDEFINED") warn(warning);
    },
    plugins: [...plugins, visualizer()],
  },
  {
    input: ["./src/service-worker.ts"],
    output,
    plugins,
  },
];

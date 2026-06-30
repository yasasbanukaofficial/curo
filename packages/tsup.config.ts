import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/cli.tsx"],
  format: ["esm"],
  dts: false,
  shims: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
});

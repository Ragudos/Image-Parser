import * as esbuild from "esbuild";

/**
 * @type {import("esbuild").BuildOptions}
 */
const config = {
	entryPoints: ["src/index.js"],
	bundle: true,
	minify: true,
	outdir: "./public/dist",
	format: "esm",
	platform: "browser",
	sourcemap: false,
};

await esbuild.build(config);

import * as esbuild from "esbuild";

/**
 * @type {import("esbuild").BuildOptions}
 */
const config = {
	entryPoints: ["src/index.js", "src/styles/index.css"],
	bundle: true,
	minify: true,
	outdir: "./public/dist",
	format: "esm",
	platform: "browser",
	legalComments: "inline",
	outExtension: {
		".js": ".min.js",
		".css": ".min.css",
	},
	pure: ["console", "throw"],
};

await esbuild.build(config);

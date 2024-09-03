import * as esbuild from "esbuild";

/**
 * @type {import("esbuild").BuildOptions}
 */
const config = {
	entryPoints: ["src/index.js"],
	bundle: true,
	outdir: "dist",
	sourcemap: true,
};

/**
 * @type {import("esbuild").Format[]}
 */
const formats = ["cjs", "esm"];

for (const format of formats) {
	let outExtension = {
		".js": null,
	};
	/**
	 * @type {import("esbuild").Platform}
	 */
	let platform;

	switch (format) {
		case "cjs":

		case "iife":
			{
				outExtension[".js"] = ".js";

				if (format === "iife") {
					platform = "neutral";
				} else {
					platform = "node";
				}
			}
			break;

		case "esm":
			{
				outExtension[".js"] = ".esm.js";
				platform = "browser";
			}
			break;
	}

	await esbuild.build({
		...config,
		format,
		outExtension,
		platform,
	});
}

/**
 * @license
 *
 * This code is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
 * See the LICENSE file for details.
 * Full license text: https://creativecommons.org/licenses/by/4.0/
 * Copyright (c) 2024 Aaron Ragudos
 */

const { processPNG } = require("@image-parser/core");

/**
 *
 */
function load() {
    fetch("./assets/HK.png").then((res) => {
        res.arrayBuffer().then((buf) => {
            console.log(buf);
            processPNG(new Uint8Array(buf));
        });
    });
}

load();

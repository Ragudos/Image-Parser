/**
 *
 * @fileoverview Some array operations are in this file
 *
 * @module utils/array
 */

/**
 *
 * @param {Uint8Array[]} chunks
 *
 * @returns {Uint8Array}
 *
 * @see {@link https://github.com/nodeca/pako/blob/master/lib/utils/common.js}
 */
function flattenChunks(chunks) {
    let len = 0;

    for (let i = 0; i < chunks.length; ++i) {
        len += chunks[i].length;
    }

    const flattenedChunk = new Uint8Array(len);

    for (let i = 0, pos = 0; i < chunks.length; ++i) {
        let chunk = chunks[i];

        flattenedChunk.set(chunk, pos);
        pos += chunk.length;
    }

    return flattenedChunk;
}

module.exports = { flattenChunks };

const { UnimplementedError } = require("@image-parser/utils");

/**
 *
 * @param {Uint8Array} chunks the concatenated stream of chunk data to decompress
 */
function decompressDEFLATE(chunks) {
    throw new UnimplementedError();
}

module.exports = { decompressDEFLATE };

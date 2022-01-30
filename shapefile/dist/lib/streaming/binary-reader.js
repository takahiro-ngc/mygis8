"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinaryReader {
    constructor(arrayBuffer) {
        /** current global (stream) offset */
        this.offset = 0;
        /** current buffer from iterator */
        this.arrayBuffer = arrayBuffer;
    }
    /**
     * Checks if there are available bytes in data
     *
     * @param bytes
     * @returns boolean
     */
    hasAvailableBytes(bytes) {
        return this.arrayBuffer.byteLength - this.offset >= bytes;
    }
    /**
     * Get the required number of bytes from the iterator
     *
     * @param bytes
     * @returns Dataview
     */
    getDataView(bytes) {
        if (bytes && !this.hasAvailableBytes(bytes)) {
            throw new Error('binary data exhausted');
        }
        const dataView = bytes
            ? new DataView(this.arrayBuffer, this.offset, bytes)
            : new DataView(this.arrayBuffer, this.offset);
        this.offset += bytes;
        return dataView;
    }
    /**
     * Skipping
     *
     * @param bytes
     */
    skip(bytes) {
        this.offset += bytes;
    }
    /**
     * Rewinding
     *
     * @param bytes
     */
    rewind(bytes) {
        this.offset -= bytes;
    }
}
exports.default = BinaryReader;

export default class BinaryChunkReader {
    offset: number;
    arrayBuffers: ArrayBuffer[];
    ended: boolean;
    maxRewindBytes: number;
    constructor(options?: {
        [key: string]: any;
    });
    /**
     * @param arrayBuffer
     */
    write(arrayBuffer: ArrayBuffer): void;
    end(): void;
    /**
     * Has enough bytes available in array buffers
     *
     * @param bytes Number of bytes
     * @return boolean
     */
    hasAvailableBytes(bytes: number): boolean;
    /**
     * Find offsets of byte ranges within this.arrayBuffers
     *
     * @param  bytes Byte length to read
     * @return Arrays with byte ranges pointing to this.arrayBuffers, Output type is nested array, e.g. [ [0, [1, 2]], ...]
     */
    findBufferOffsets(bytes: number): any[] | null;
    /**
     * Get the required number of bytes from the iterator
     *
     * @param bytes Number of bytes
     * @return DataView with data
     */
    getDataView(bytes: number): DataView | null;
    /**
     * Dispose of old array buffers
     */
    disposeBuffers(): void;
    /**
     * Copy multiple ArrayBuffers into one contiguous ArrayBuffer
     *
     * In contrast to concatenateArrayBuffers, this only copies the necessary
     * portions of the source arrays, rather than first copying the entire arrays
     * then taking a part of them.
     *
     * @param bufferOffsets List of internal array offsets
     * @return New contiguous ArrayBuffer
     */
    _combineArrayBuffers(bufferOffsets: any[]): ArrayBufferLike;
    /**
     * @param bytes
     */
    skip(bytes: number): void;
    /**
     * @param bytes
     */
    rewind(bytes: number): void;
}
//# sourceMappingURL=binary-chunk-reader.d.ts.map
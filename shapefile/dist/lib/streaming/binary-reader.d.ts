export default class BinaryReader {
    offset: number;
    arrayBuffer: ArrayBuffer;
    constructor(arrayBuffer: ArrayBuffer);
    /**
     * Checks if there are available bytes in data
     *
     * @param bytes
     * @returns boolean
     */
    hasAvailableBytes(bytes: number): boolean;
    /**
     * Get the required number of bytes from the iterator
     *
     * @param bytes
     * @returns Dataview
     */
    getDataView(bytes: number): DataView;
    /**
     * Skipping
     *
     * @param bytes
     */
    skip(bytes: number): void;
    /**
     * Rewinding
     *
     * @param bytes
     */
    rewind(bytes: number): void;
}
//# sourceMappingURL=binary-reader.d.ts.map
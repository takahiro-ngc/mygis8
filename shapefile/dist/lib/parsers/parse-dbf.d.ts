import { Schema } from '@loaders.gl/schema';
declare type DBFRowsOutput = object[];
interface DBFTableOutput {
    schema?: Schema;
    rows: DBFRowsOutput;
}
declare type DBFHeader = {
    year: number;
    month: number;
    day: number;
    nRecords: number;
    headerLength: number;
    recordLength: number;
    languageDriver: number;
};
/**
 * @param arrayBuffer
 * @param options
 * @returns DBFTable or rows
 */
export declare function parseDBF(arrayBuffer: ArrayBuffer, options?: any): DBFRowsOutput | DBFTableOutput;
/**
 * @param asyncIterator
 * @param options
 */
export declare function parseDBFInBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>, options?: any): AsyncIterable<DBFHeader | DBFRowsOutput | DBFTableOutput>;
export {};
//# sourceMappingURL=parse-dbf.d.ts.map
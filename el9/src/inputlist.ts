//from docker library https://github.com/docker/actions-toolkit/blob/main/src/util.ts considered experimental
import * as core from '@actions/core';
import { parse } from 'csv-parse/sync';

export interface InputListOpts {
    ignoreComma?: boolean;
    comment?: string;
    quote?: string | boolean | Buffer | null;
}
export class InputList {
    public static getInputList(name: string, opts?: InputListOpts): string[] {
        const res: Array<string> = [];

        const items = core.getInput(name);
        if (items == '') {
            return res;
        }

        const records = parse(items, {
            columns: false,
            relaxQuotes: true,
            comment: opts?.comment,
            relaxColumnCount: true,
            skipEmptyLines: true,
            quote: opts?.quote
        });

        for (const record of records as Array<string[]>) {
            if (record.length == 1) {
                if (opts?.ignoreComma) {
                    res.push(record[0]);
                } else {
                    res.push(...record[0].split(','));
                }
            } else if (!opts?.ignoreComma) {
                res.push(...record);
            } else {
                res.push(record.join(','));
            }
        }

        return res.filter(item => item).map(pat => pat.trim());
    }
}

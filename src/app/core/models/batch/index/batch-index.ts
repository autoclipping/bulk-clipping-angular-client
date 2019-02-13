import { BaseBatch } from '../base-batch';

export interface BatchIndex {
    next: {
        curr_offset_key: number
    };
    previous: {
        curr_offset_key: number
    };
    results: Array<BaseBatch>;
}

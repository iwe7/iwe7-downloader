import { Subject } from 'rxjs';
export interface Iwe7WgetOptions {
    gunzip?: boolean;
}
export declare class Iwe7Wget extends Subject<any> {
    constructor();
    download(src: string, output: string, options?: Iwe7WgetOptions): any;
    private calculateProgress;
}
export declare const iwe7Downloader: Iwe7Wget;

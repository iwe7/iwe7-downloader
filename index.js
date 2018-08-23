"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const http_1 = require("http");
const url_1 = require("url");
const zlib_1 = require("zlib");
const fs_1 = require("fs");
class Iwe7Wget extends rxjs_1.Subject {
    constructor() {
        super();
    }
    download(src, output, options) {
        const newUrl = url_1.parse(src);
        const searchParams = new url_1.URLSearchParams(options);
        newUrl.search = searchParams.toString();
        console.log(newUrl);
        return rxjs_1.Observable.create((obser) => {
            const clientRequest = http_1.request(newUrl, (res) => {
                if (res.statusCode === 200) {
                    const gunzip = zlib_1.createGunzip();
                    // 文件大小
                    const fileSize = Number(res.headers['content-length']);
                    let downloadedSize = 0;
                    // 下载
                    const writeStream = fs_1.createWriteStream(output, {
                        flags: 'w+',
                        encoding: 'binary'
                    });
                    // 编码
                    let encoding = '';
                    if (typeof res.headers['content-encoding'] === 'string') {
                        encoding = res.headers['content-encoding'];
                    }
                    // 压缩gzip
                    if (encoding === 'gzip') {
                        res.pipe(gunzip);
                    }
                    else {
                        res.pipe(writeStream);
                    }
                    // data
                    gunzip.on('data', (chunk) => {
                        downloadedSize += chunk.length;
                        obser.next(this.calculateProgress(fileSize, downloadedSize));
                        writeStream.write(chunk);
                    });
                    res.on('data', (chunk) => {
                        downloadedSize += chunk.length;
                        obser.next(this.calculateProgress(fileSize, downloadedSize));
                    });
                    res.on('error', (err) => {
                        writeStream.end();
                        obser.error(err);
                    });
                    writeStream.on('finish', () => {
                        obser.complete();
                    });
                }
                else {
                    obser.error({
                        type: 'error',
                        data: res.statusCode
                    });
                }
            });
            clientRequest.flushHeaders();
            clientRequest.on('close', () => {
                obser.complete();
            });
            clientRequest.on('error', (err) => {
                obser.error(err);
            });
            clientRequest.on('finish', () => {
                obser.complete();
            });
        });
    }
    calculateProgress(fileSize, totalDownloaded) {
        if (fileSize === null) {
            var length = String(totalDownloaded).length;
            fileSize = Math.pow(10, length) + 1;
        }
        return totalDownloaded / fileSize * 100;
    }
}
exports.Iwe7Wget = Iwe7Wget;
exports.iwe7Downloader = new Iwe7Wget();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXFEO0FBQ3JELCtCQUErRDtBQUMvRCw2QkFBNkM7QUFDN0MsK0JBQW9DO0FBQ3BDLDJCQUF1QztBQUl2QyxNQUFhLFFBQVMsU0FBUSxjQUFZO0lBQ3RDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsUUFBUSxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsT0FBeUI7UUFDM0QsTUFBTSxNQUFNLEdBQUcsV0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sWUFBWSxHQUFHLElBQUkscUJBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLE9BQU8saUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFvQixFQUFFLEVBQUU7WUFDOUMsTUFBTSxhQUFhLEdBQWtCLGNBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFvQixFQUFFLEVBQUU7Z0JBQzFFLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUU7b0JBQ3hCLE1BQU0sTUFBTSxHQUFHLG1CQUFZLEVBQUUsQ0FBQztvQkFDOUIsT0FBTztvQkFDUCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsS0FBSztvQkFDTCxNQUFNLFdBQVcsR0FBRyxzQkFBaUIsQ0FBQyxNQUFNLEVBQUU7d0JBQzFDLEtBQUssRUFBRSxJQUFJO3dCQUNYLFFBQVEsRUFBRSxRQUFRO3FCQUNyQixDQUFDLENBQUM7b0JBQ0gsS0FBSztvQkFDTCxJ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
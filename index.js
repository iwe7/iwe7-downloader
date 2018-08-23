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
        options = options || {
            gunzip: true
        };
        const newUrl = url_1.parse(src);
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
                    if (options.gunzip === true && encoding === 'gzip') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQXFEO0FBQ3JELCtCQUErRDtBQUMvRCw2QkFBNEI7QUFDNUIsK0JBQW9DO0FBQ3BDLDJCQUF1QztBQUl2QyxNQUFhLFFBQVMsU0FBUSxjQUFZO0lBQ3RDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsUUFBUSxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsT0FBeUI7UUFDM0QsT0FBTyxHQUFHLE9BQU8sSUFBSTtZQUNqQixNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUE7UUFDRCxNQUFNLE1BQU0sR0FBRyxXQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsT0FBTyxpQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQW9CLEVBQUUsRUFBRTtZQUM5QyxNQUFNLGFBQWEsR0FBa0IsY0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQW9CLEVBQUUsRUFBRTtnQkFDMUUsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTtvQkFDeEIsTUFBTSxNQUFNLEdBQUcsbUJBQVksRUFBRSxDQUFDO29CQUM5QixPQUFPO29CQUNQLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDdkQsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixLQUFLO29CQUNMLE1BQU0sV0FBVyxHQUFHLHNCQUFpQixDQUFDLE1BQU0sRUFBRTt3QkFDMUMsS0FBSyxFQUFFLElBQUk7d0JBQ1gsUUFBUSxFQUFFLFFBQVE7cUJBQ3JCLENBQUMsQ0FBQztvQkFDSCxLQUFLO29CQUNMLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztvQkFDbEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxRQUFRLEVBQUU7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
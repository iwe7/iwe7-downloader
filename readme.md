```ts
import { iwe7Downloader } from 'iwe7-downloader';
iwe7Downloader.download(src, output).subscribe(res => {
    // 下载进度 100标示完成
    console.log(res)
});
```

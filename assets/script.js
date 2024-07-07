const btn = document.getElementById('btn');
const urlInput = document.querySelector('.URL-input');
const select = document.querySelector('.opt');
const serverURL = 'http://yt.armanddesne.fr:4000';
const progress = document.getElementById('progress');

btn.addEventListener('click', () => {
    if (!urlInput.value) {
        alert('Enter YouTube URL');
    } else {
        switch (select.value) {
            case 'mp3':
                download('mp3', urlInput.value);
                break;
            case 'mp4':
                download('mp4', urlInput.value);
                break;
            case 'wav':
                download('wav', urlInput.value);
                break;
        }
    }
});

async function download(format, query) {
    const res = await fetch(`${serverURL}/download/${format}?url=${query}`);
    const filenameRes = await fetch(`${serverURL}/filename/${format}?url=${query}`);
    if (res.status === 200 && filenameRes.status === 200) {
        const { filename } = await filenameRes.json();
        const reader = res.body.getReader();
        const contentLength = +res.headers.get('Content-Length');
        let receivedLength = 0;
        const chunks = [];
        while(true) {
            const {done, value} = await reader.read();
            if (done) {
                break;
            }
            chunks.push(value);
            receivedLength += value.length;
            let progressValue = (receivedLength / contentLength) * 100;
            if (Number.isFinite(progressValue)) {
                progress.value = progressValue;
            } else {
                progress.removeAttribute('value'); // Indeterminate state
            }
        }
        const blob = new Blob(chunks);
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.click();
    } else if (res.status === 400 || filenameRes.status === 400) {
        alert('Invalid url');
    }
}

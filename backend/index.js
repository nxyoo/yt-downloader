const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const PORT = 80;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server Works !!! At port ${PORT}`);
});

app.get('/api/download/:format', async (req, res, next) => {
    try {
        const url = req.query.url;
        const format = req.params.format;

        if(!ytdl.validateURL(url)) {
            return res.sendStatus(400);
        }

        let title = 'audio';

        const info = await ytdl.getBasicInfo(url);
        if (info.videoDetails.title) {
            title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
        } else {
            console.error('Could not retrieve video title');
        }

        const filename = `${title}.${format}`;

        if (format === 'mp3') {
            res.header('Content-Type', 'audio/mpeg');
            ytdl(url, {
                format: 'mp4',
                filter: 'audioonly',
            }).pipe(res);
        } else if (format === 'wav') {
            res.header('Content-Type', 'audio/wav');
            ytdl(url, {
                format: 'mp4',
                filter: 'audioonly',
            }).pipe(res);
        } else if (format === 'mp4') {
            res.header('Content-Type', 'video/mp4');
            ytdl(url, {
                format: 'mp4',
            }).pipe(res);
        } else {
            res.sendStatus(400);
        }

    } catch (err) {
        console.error(err);
    }
});

app.get('/api/filename/:format', async (req, res, next) => {
    try {
        const url = req.query.url;
        const format = req.params.format;

        if(!ytdl.validateURL(url)) {
            return res.sendStatus(400);
        }

        let title = 'audio';

        const info = await ytdl.getBasicInfo(url);
        if (info.videoDetails.title) {
            title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
        } else {
            console.error('Could not retrieve video title');
        }

        const filename = `${title}.${format}`;

        res.json({ filename });

    } catch (err) {
        console.error(err);
    }
});
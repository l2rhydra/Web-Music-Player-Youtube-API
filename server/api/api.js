const express = require("express");
const router = express.Router();
const youtubedl = require('youtube-dl-exec');

async function getAudioUrl(videoId) {
    try {
        // Full YouTube URL
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Get audio URL using yt-dlp
        const result = await youtubedl(videoUrl, {
            getUrl: true,
            format: 'bestaudio/best',  // Get best audio quality
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });
        
        // The result will contain the direct audio URL
        return result.trim();
    } catch (error) {
        console.error('Error getting audio URL:', error);
        return null;
    }
}

router.post('/stream', async (req, res) => {
    try {
        const videoId = req.body.url;

        if (!videoId) {
            return res.status(400).json({
                error: 'No video ID provided'
            });
        }

        const audioUrl = await getAudioUrl(videoId);
        
        if (!audioUrl) {
            return res.status(500).json({
                error: 'Failed to extract audio URL'
            });
        }

        // Send the audio URL as response
        res.json({
            success: true,
            audioUrl: audioUrl
        });

    } catch (error) {
        console.error('Stream endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router;
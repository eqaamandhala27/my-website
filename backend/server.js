const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        service: "AI Video Creator Backend",
        status: "online"
    });
});

// ========================================
// GENERATE VIDEO
// ========================================

app.post("/api/generate-video", async (req, res) => {
    try {
        const data = req.body;

        console.log("================================");
        console.log("NEW VIDEO REQUEST");
        console.log("================================");
        console.log(JSON.stringify(data, null, 2));

        // --------------------------------
        // Validation
        // --------------------------------

        if (!data.language) {
            return res.status(400).json({
                success: false,
                error: "Language is required"
            });
        }

        if (!data.duration) {
            return res.status(400).json({
                success: false,
                error: "Duration is required"
            });
        }

        // --------------------------------
        // Create Job ID
        // --------------------------------

        const jobId =
            "job_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8);

        // --------------------------------
        // Store all video settings
        // --------------------------------

        const videoSettings = {
            script: data.script || "",

            language: data.language,
            duration: data.duration,

            aspectRatio: data.aspectRatio || "9:16",
            quality: data.quality || "1080p",

            videoStyle: data.videoStyle || "educational",
            editingStyle: data.editingStyle || "fast",
            sceneStyle: data.sceneStyle || "realistic",

            voice: data.voice || "male",
            voiceSpeed: data.voiceSpeed || "1x",

            music: {
                enabled:
                    data.music?.enabled === true,
                volume:
                    data.music?.volume ?? 50
            },

            shorts: {
                enabled:
                    data.shorts?.enabled === true,
                count:
                    data.shorts?.count || "auto",
                duration:
                    data.shorts?.duration || "auto"
            }
        };

        // --------------------------------
        // Job response
        // --------------------------------

        res.json({
            success: true,

            jobId: jobId,

            status: "queued",

            message:
                "Video generation request received successfully",

            settings: videoSettings
        });

    } catch (error) {

        console.error(
            "Generation Error:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `AI Video Creator Backend running on port ${PORT}`
    );

});

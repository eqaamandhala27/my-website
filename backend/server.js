const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));


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
// GENERATE VIDEO REQUEST
// ========================================

app.post("/api/generate-video", async (req, res) => {

    try {

        const data = req.body;

        console.log("New video request:");
        console.log(JSON.stringify(data, null, 2));


        // --------------------------------
        // Basic validation
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
        // Create Job
        // --------------------------------

        const jobId =
            "job_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8);


        // --------------------------------
        // Temporary response
        // --------------------------------

        res.json({

            success: true,

            jobId: jobId,

            status: "queued",

            message: "Video generation job created",

            received: {

                language: data.language,

                duration: data.duration,

                aspectRatio: data.aspectRatio,

                quality: data.quality,

                videoStyle: data.videoStyle,

                editingStyle: data.editingStyle,

                sceneStyle: data.sceneStyle,

                voice: data.voice,

                voiceSpeed: data.voiceSpeed,

                music: data.music,

                shorts: data.shorts

            }

        });

    } catch (error) {

        console.error(error);

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

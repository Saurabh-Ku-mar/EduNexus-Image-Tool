const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const pdfkit = require("pdfkit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Resize Image API
app.post("/resize", upload.single("image"), async (req, res) => {
    const { width, height, category } = req.body;
    const outputPath = `uploads/resized_${Date.now()}.jpg`;

    try {
        await sharp(req.file.path)
            .resize(parseInt(width), parseInt(height))
            .toFile(outputPath);

        res.download(outputPath, `${category}_Resized.jpg`, () => {
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        res.status(500).send("Error resizing image.");
    }
});

// JPG to PDF Converter API
app.post("/convert-to-pdf", upload.array("images", 5), (req, res) => {
    const pdfPath = `uploads/converted_${Date.now()}.pdf`;
    const doc = new pdfkit();
    const outputStream = fs.createWriteStream(pdfPath);

    doc.pipe(outputStream);
    req.files.forEach((file) => {
        doc.image(file.path, { fit: [500, 500] });
        fs.unlinkSync(file.path);
    });
    doc.end();

    outputStream.on("finish", () => res.download(pdfPath, "converted.pdf", () => fs.unlinkSync(pdfPath)));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

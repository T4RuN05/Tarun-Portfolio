const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "temp_images");
const outputDir = path.join(__dirname, "public", "images", "projects", "ganesha");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    const inputPath = path.join(inputDir, file);
    const filenameWithoutExt = path.basename(file, path.extname(file));
    const outputPath = path.join(outputDir, `${filenameWithoutExt}.webp`);

    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => console.log(`Converted: ${file} -> ${filenameWithoutExt}.webp`))
      .catch(err => console.error(`Error converting ${file}:`, err));
  }
});

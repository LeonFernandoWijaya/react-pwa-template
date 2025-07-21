const fs = require("fs");
const path = require("path");

// Function to get all image files from public/images
const getImageFiles = (dir) => {
  const files = [];

  // Check if directory exists
  if (!fs.existsSync(dir)) {
    console.warn(`Directory ${dir} does not exist`);
    return files;
  }

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile()) {
      // Check if file is an image
      const ext = path.extname(item).toLowerCase();
      if (
        [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".svg",
          ".bmp",
          ".ico",
        ].includes(ext)
      ) {
        files.push(`/images/${item}`);
      }
    } else if (stat.isDirectory()) {
      // Recursively scan subdirectories
      const subFiles = getImageFiles(fullPath);
      subFiles.forEach((subFile) => {
        files.push(`/images/${item}${subFile.replace("/images", "")}`);
      });
    }
  });

  return files.sort(); // Sort alphabetically
};

// Generate manifest
const imagesDir = path.join(__dirname, "../public/images");
const images = getImageFiles(imagesDir);

const manifest = {
  images: images,
  totalImages: images.length,
  generated: new Date().toISOString(),
  generatedBy: "generate-images-manifest.js",
};

// Ensure public directory exists
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write manifest to public folder
const manifestPath = path.join(__dirname, "../public/images-manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Generated images manifest with ${images.length} images`);
console.log("📁 Images found:");
images.forEach((img) => console.log(`   - ${img}`));
console.log(`📄 Manifest saved to: ${manifestPath}`);

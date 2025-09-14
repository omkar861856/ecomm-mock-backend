const fs = require("fs");

// Read the current n8n-tools.json file
const data = fs.readFileSync("n8n-tools.json", "utf8");
let jsonData = JSON.parse(data);

// Function to update URLs in the file
function updateUrls(newBaseUrl) {
  let updatedCount = 0;

  jsonData.nodes.forEach((node) => {
    if (node.parameters && node.parameters.url) {
      // Replace localhost URLs with the new base URL
      if (node.parameters.url.includes("http://localhost:3000")) {
        node.parameters.url = node.parameters.url.replace(
          "http://localhost:3000",
          newBaseUrl
        );
        updatedCount++;
      }
    }
  });

  return updatedCount;
}

// Get the new URL from command line argument or use default
const newUrl = process.argv[2] || "https://your-app-name.vercel.app";

console.log(`🔄 Updating URLs from localhost:3000 to ${newUrl}...`);

const updatedCount = updateUrls(newUrl);

// Write the updated file
fs.writeFileSync("n8n-tools.json", JSON.stringify(jsonData, null, 2));

console.log(`✅ Successfully updated ${updatedCount} URLs!`);
console.log(`📝 Updated n8n-tools.json with new base URL: ${newUrl}`);
console.log(`🚀 Your n8n tools are now ready for Vercel deployment!`);

// Also create a backup with the old URLs
const backupData = fs.readFileSync("n8n-tools.json", "utf8");
fs.writeFileSync("n8n-tools-backup.json", backupData);
console.log(`💾 Backup saved as n8n-tools-backup.json`);

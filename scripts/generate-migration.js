const { execSync } = require("child_process");

const name = process.argv[2];
if (!name) {
  console.error("Usage: node scripts/generate-migration.js <MigrationName>");
  process.exit(1);
}

const cmd = `npm run typeorm migration:generate -- -d src/data-source.ts src/migration/${name}`;

try {
  execSync(cmd, { stdio: "inherit" });
} catch (err) {
  process.exit(1);
}

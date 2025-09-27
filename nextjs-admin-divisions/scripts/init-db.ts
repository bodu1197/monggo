import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync'; // Need to install csv-parse

// Database file path
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Function to execute SQL from a file
function runSqlFile(filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf8');
  db.exec(sql);
  console.log(`Executed SQL from ${filePath}`);
}

// Function to import CSV data
function importCsv(csvFilePath: string, tableName: string, columns: string[]) {
  const csvContent = fs.readFileSync(csvFilePath, 'utf8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  const placeholders = columns.map(() => '?').join(',');
  const insertStmt = db.prepare(`INSERT INTO ${tableName} (${columns.join(',')}) VALUES (${placeholders})`);

  db.transaction(() => {
    for (const record of records) {
      const values = columns.map(col => (record as any)[col]);
      insertStmt.run(...values);
    }
  })();
  console.log(`Imported ${records.length} records into ${tableName} from ${csvFilePath}`);
}

async function initDb() {
  console.log('Initializing database...');

  // 1. Execute create_tables.sql
  const createTablesSqlPath = path.resolve(__dirname, '../../create_tables.sql'); // Adjust path to original create_tables.sql
  runSqlFile(createTablesSqlPath);

  // 2. Import provinces data
  const provincesCsvPath = path.resolve(__dirname, '../data/wilayah/provinces.csv');
  importCsv(provincesCsvPath, 'provinces', ['province_id', 'province_name']);

  // 3. Import regencies data
  const regenciesCsvPath = path.resolve(__dirname, '../data/wilayah/regencies.csv');
  importCsv(regenciesCsvPath, 'regencies', ['regency_id', 'province_id', 'regency_name']);

  // 4. Import districts data
  const districtsCsvPath = path.resolve(__dirname, '../data/wilayah/districts.csv');
  importCsv(districtsCsvPath, 'districts', ['district_id', 'regency_id', 'district_name']);

  db.close();
  console.log('Database initialization complete.');
}

initDb().catch(console.error);
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const imageDirectory = path.join(
  __dirname,
  '..',
  'uploads',
  'properties'
);

const outputFile = path.join(
  require('os').homedir(),
  'Desktop',
  'ocean_pyramid_cloudinary_image_updates.sql'
);

const images = [
  { id: 1, filename: '1794826161721-c43af63930486a9f.png' },
  { id: 52, filename: '1795186134061-6ed73c5cb7a454a1.jpg' },
  { id: 53, filename: 'ologolo-detached-duplex-exterior-front.jpeg' },
  { id: 54, filename: 'ologolo-detached-duplex-exterior-side.jpeg' },
  { id: 55, filename: 'ologolo-detached-duplex-living-room.jpeg' },
  { id: 56, filename: 'guzape-exterior-1.jpeg' },
  { id: 57, filename: 'guzape-exterior-2.jpeg' },
  { id: 58, filename: 'centenary-city-enugu-exterior-1.jpeg' },
  { id: 59, filename: 'centenary-city-enugu-exterior-2.jpeg' },
  { id: 60, filename: 'ologolo-shortlet-bedroom-1.jpeg' },
  { id: 61, filename: 'ologolo-shortlet-bedroom-2.jpeg' },
  { id: 62, filename: 'ologolo-shortlet-dining-1.jpeg' },
  { id: 63, filename: 'ologolo-shortlet-dining-2.jpeg' },
  { id: 64, filename: 'fo1-dutse-abuja-land.jpeg' },
  { id: 65, filename: 'lugbe-house-exterior-1.jpeg' },
  { id: 66, filename: 'lugbe-house-exterior-2.jpeg' }
];

async function main() {
  const requiredVariables = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  const missing = requiredVariables.filter(
    (name) => !process.env[name]
  );

  if (missing.length) {
    throw new Error(
      `Missing Cloudinary environment variables: ${missing.join(', ')}`
    );
  }

  const missingFiles = images.filter(
    (image) =>
      !fs.existsSync(path.join(imageDirectory, image.filename))
  );

  if (missingFiles.length) {
    throw new Error(
      `Missing image files: ${missingFiles.map((image) => image.filename).join(', ')}`
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  const updates = [];

  console.log(`Starting upload of ${images.length} original photographs...\n`);

  for (const image of images) {
    const filePath = path.join(imageDirectory, image.filename);

    console.log(`Uploading ${image.filename}...`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'ocean-pyramid/properties',
      public_id: path.parse(image.filename).name,
      resource_type: 'image',
      overwrite: true,
      unique_filename: false
    });

    const secureUrl = result.secure_url.replace(/'/g, "''");

    updates.push(
      `UPDATE property_images SET image_url = '${secureUrl}' WHERE id = ${image.id};`
    );

    console.log(`Uploaded successfully (image record ${image.id}).`);
  }

  const sql = [
    'START TRANSACTION;',
    ...updates,
    'COMMIT;',
    '',
    'SELECT COUNT(*) AS total_cloudinary_images',
    'FROM property_images',
    "WHERE image_url LIKE 'https://res.cloudinary.com/%';"
  ].join('\n');

  fs.writeFileSync(outputFile, sql, 'utf8');

  console.log('\nAll 16 photographs uploaded successfully.');
  console.log(`SQL update file created: ${outputFile}`);
  console.log('\nThe Railway database has NOT been changed yet.');
}

main().catch((error) => {
  console.error('\nUpload failed:', error.message);
  process.exitCode = 1;
});

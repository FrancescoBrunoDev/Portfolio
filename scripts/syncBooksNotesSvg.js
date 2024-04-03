const fs = require("fs-extra");
const path = require("path");
const potrace = require("potrace");
const pdf2img = require("pdf-img-convert");

const OneDriveSource =
  "/Users/francescobruno/Library/CloudStorage/OneDrive-Personale/Personal Website/Books Notes/pdf";
const destination = "public/books/notes/pdf";
const svgDestination = "public/books/notes/svg";

async function syncFolders() {
  const exists = await fs.pathExists(OneDriveSource);
  if (!exists) {
    throw new Error(
      `Source folder does not exist in OneDrive: ${OneDriveSource}`
    );
  }
  await fs.ensureDir(destination);
  await fs.emptyDir(destination);
  await fs.copy(OneDriveSource, destination);
  console.log("Files copied successfully!");
}

async function convertPdfToPngs(filePath, destinationFolder, baseName) {
  await fs.ensureDir(`${destinationFolder}/${baseName}`);
  await fs.emptyDir(`${destinationFolder}/${baseName}`);

  const pdfArray = await pdf2img.convert(filePath);
  for (let i = 0; i < pdfArray.length; i++) {
    await fs.promises.writeFile(
      `${destinationFolder}/${baseName}/page_${i + 1}.png`,
      pdfArray[i]
    );
  }
}

async function convertPngToSvg(pngFilePath, svgFilePath) {
  var svgParams = {
    color: "hsl(210, 40%, 96.1%)",
    background: "transparent",
    threshold: 180,
    turdsize: 100,
    turnround: true,
    fillStrategy: potrace.Potrace.FILL_AUTO,
  };
  await new Promise((resolve, reject) => {
    potrace.trace(pngFilePath, svgParams, function (err, svg) {
      if (err) {
        reject(err);
      } else {
        fs.writeFileSync(svgFilePath, svg);
        resolve();
      }
    });
  });
}

async function convertPdfsToSvgs(sourceFolder, destinationFolder) {
  await fs.ensureDir(destinationFolder);
  await fs.emptyDir(destinationFolder);
  const files = await fs.readdir(sourceFolder);
  for (const file of files) {
    const filePath = path.join(sourceFolder, file);
    const ext = path.extname(file);

    if (ext === ".pdf") {
      const baseName = path.basename(file, ".pdf");

      // Convert PDF to PNGs
      await convertPdfToPngs(filePath, destinationFolder, baseName);

      // Convert PNGs to SVGs using potrace
      const pngFiles = await fs.readdir(destinationFolder);
      const isbnFolders = pngFiles.filter((f) => f.match(/^\d+$/));
      for (const isbnFolder of isbnFolders) {
        const pngFiles = await fs.readdir(`${destinationFolder}/${isbnFolder}`);
        for (const pngFile of pngFiles) {
          if (path.extname(pngFile) === ".png") {
            const pngFilePath = path.join(
              `${destinationFolder}/${isbnFolder}`,
              pngFile
            );
            const svgFilePath = path.join(
              `${destinationFolder}/${isbnFolder}`,
              path.basename(pngFile, ".png") + ".svg"
            );

            await convertPngToSvg(pngFilePath, svgFilePath);
            await fs.unlink(pngFilePath);
          }
        }
      }
    }
  }
}

async function updateBooksArray(svgDestination) {
  const jsonBooks = path.resolve(__dirname, "../app/section/record/books/");

  const audioBooks = require(jsonBooks + "/audioBooks.json");
  const paperBooks = require(jsonBooks + "/paperBooks.json");

  const isbnFolders = await fs.readdir(svgDestination);
  for (const isbnFolder of isbnFolders) {
    const svgFiles = await fs.readdir(`${svgDestination}/${isbnFolder}`);
    for (const file of svgFiles) {
      const isbn = Number(isbnFolder);
      const pageNumber = Number(path.basename(file, ".svg").split('_')[1]) || 1;
      console.log("Processing file: ", isbn);

      for (const year in audioBooks) {
        for (const book of audioBooks[year]) {
          if (book.ISBN13 === isbn) {
            book.notes = book.notes || {};
            book.notes[pageNumber] = `/books/notes/svg/${book.ISBN13}/${file}`;
            console.log("Updated audio book: ", book.title);
          }
        }
      }

      for (const year in paperBooks) {
        for (const book of paperBooks[year]) {
          if (book.ISBN13 === isbn) {
            book.notes = book.notes || {};
            book.notes[pageNumber] = `/books/notes/svg/${book.ISBN13}/${file}`;
            console.log("Updated paper book: ", book.title);
          }
        }
      }
    }
  }

  fs.writeFileSync(
    jsonBooks + "/audioBooksWithNotes.json",
    JSON.stringify(audioBooks, null, 2)
  );
  fs.writeFileSync(
    jsonBooks + "/paperBooksWithNotes.json",
    JSON.stringify(paperBooks, null, 2)
  );
}

syncFolders()
  .then(() => convertPdfsToSvgs(destination, svgDestination))
  .then(() => updateBooksArray(svgDestination))
  .catch((err) => console.error(err));

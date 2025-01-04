import potrace from "potrace";
import { fromPath } from "pdf2pic";
import { PdfCounter } from "page-count";
import * as fs from "fs-extra";
import fsPromises from "fs/promises";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import PocketBase from 'pocketbase';

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Record {
    id: string;
    pdf: string;
    svg?: string[];
}

async function convertPngToSvg({ pngFilePath, svgFilePath }: { pngFilePath: string, svgFilePath: string }): Promise<void> {
    const svgParams = {
        color: "hsl(var(--background))",
        background: "transparent",
        threshold: 180,
        turdsize: 100,
        turnround: true,
        fillStrategy: potrace.Potrace.COLOR_AUTO,
    };
    await new Promise<void>((resolve, reject) => {
        potrace.trace(pngFilePath, svgParams, async (err: Error | null, svg: string) => {
            if (err) {
                reject(err);
            } else {
                try {
                    // Rimuovi gli attributi width e height dal SVG
                    svg = svg.replace(/\s*width="[^"]*"/i, '');
                    svg = svg.replace(/\s*height="[^"]*"/i, '');
                    svg = svg.replace('<svg', `<svg id="svgNote"`);
                    await fsPromises.writeFile(svgFilePath, svg);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
}

async function convertPdfToPngs({ filePath, destinationFolder, baseName }: { filePath: string, destinationFolder: string, baseName: string }): Promise<void> {
    await fs.ensureDir(`${destinationFolder}/${baseName}`);
    await fs.emptyDir(`${destinationFolder}/${baseName}`);

    const fileBuffer = await fsPromises.readFile(filePath);
    const pages = await PdfCounter.count(fileBuffer);

    await fs.writeJSON(
        `${destinationFolder}/${baseName}/metadata.json`,
        { pages, baseName },
        { spaces: 2 }
    );

    for (let i = 1; i <= pages; i++) {
        const options = {
            density: 100,
            saveFilename: `page`,
            savePath: `${destinationFolder}/${baseName}`,
            format: "png",
            preserveAspectRatio: true,
            width: 800,
            height: 800,
        };
        const convert = fromPath(filePath, options);
        const pageToConvertAsImage = i;
        await convert(pageToConvertAsImage, { responseType: "image" }).then(
            (resolve) => {
                return resolve;
            }
        );
    }
}

async function convertPdfsToSvgs({ sourceFolder, destinationFolder }: { sourceFolder: string, destinationFolder: string }): Promise<void> {
    try {
        await fs.ensureDir(destinationFolder);
        await fs.emptyDir(destinationFolder);
        const files = await fsPromises.readdir(sourceFolder);
        for (const file of files) {
            const filePath = join(sourceFolder, file);
            const ext = extname(file);
            if (ext === ".pdf") {
                const baseName = basename(file, ".pdf");
                console.log(`Converto id ${baseName}`);
                // Convert PDF to PNGs
                await convertPdfToPngs({ filePath, destinationFolder, baseName });
                // Convert PNGs to SVGs using potrace
                const idFolders = await fsPromises.readdir(destinationFolder);
                for (const idFolder of idFolders) {
                    const pngFiles = await fsPromises.readdir(
                        `${destinationFolder}/${idFolder}`
                    );
                    for (const pngFile of pngFiles) {
                        if (extname(pngFile) === ".png") {
                            const pngFilePath = join(
                                `${destinationFolder}/${idFolder}`,
                                pngFile
                            );
                            const svgFilePath = join(
                                `${destinationFolder}/${idFolder}`,
                                basename(pngFile, ".png") + ".svg"
                            );

                            await convertPngToSvg({ pngFilePath, svgFilePath });
                            await fsPromises.unlink(pngFilePath);
                        }
                    }
                }
                console.log(`${baseName} convertito in SVG`);
            }
        }
    } catch (error) {
        console.error("convertPdfsToSvgs", error);
    }
}

async function getPdfFromPb(): Promise<void> {
    const records: Record[] = await pb.collection('books_note').getFullList();
    // make sure the pdf folder exists
    await fs.ensureDir(join(__dirname, "../public/books/temp/pdf"));
    // download pdfs
    for (const record of records) {
        if (record.svg && record.svg.length > 0) {
            console.log(`get) Record ${record.id} already contains svg files`);
            continue;
        }
        console.log(`get) Record ${record.id} does not contain svg files`);
        const { id, pdf } = record;
        const pdfPath = join(__dirname, `../public/books/temp/pdf/${id}.pdf`);
        const fileExists = await fs.pathExists(pdfPath);
        if (!fileExists) {
            console.log(`Il file ${pdfPath} non esiste.`);
            try {
                const url = pb.files.getURL(record, record.pdf);
                console.log(url);
                // download file and save it
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                // use the id as filename
                await fs.writeFile(pdfPath, Buffer.from(buffer));
                console.log(`File ${pdfPath} scaricato con successo.`);
            } catch (error) {
                console.error(`Errore durante il download del file ${pdfPath}: ${error}`);
            }
        }
    }
}

async function saveOnPb(): Promise<void> {
    const records: Record[] = await pb.collection('books_note').getFullList();

    for (const record of records) {
        // if already contains svg files, skip
        if (record.svg && record.svg.length > 0) {
            console.log(`update) Record ${record.id} already contains svg files`);
            continue;
        }
        const { id } = record;
        try {
            // Leggi metadata
            const metadata = await fs.readJSON(join(__dirname, `../public/books/temp/svg/${id}/metadata.json`));

            // Prepara i file SVG
            const svgFiles = await fs.readdir(join(__dirname, `../public/books/temp/svg/${id}`));
            const svgPaths = svgFiles.filter((file: string) => file.endsWith('.svg'));

            // Crea array di File objects
            const svgFilesObj = await Promise.all(svgPaths.map(async (filename: string) => {
                const content = await fs.readFile(join(__dirname, `../public/books/temp/svg/${id}/${filename}`));
                return new File([content], filename, { type: 'image/svg+xml' });
            }));

            // Prepara FormData
            const formData = new FormData();
            formData.append('metadata', JSON.stringify(metadata));
            svgFilesObj.forEach((file, i) => {
                formData.append('svg', file);
            });

            // Aggiorna il record
            await pb.collection('books_note').update(id, formData);
            console.log(`Record ${id} aggiornato con successo`);
        } catch (error) {
            console.error(`Errore nell'aggiornamento del record ${id}:`, error);
        }
    }
}

async function clean(): Promise<void> {
    try {
        await fs.remove(join(__dirname, "../public/books/temp"));
    } catch (error) {
        console.error("clean", error);
    }
}

async function sync(): Promise<void> {
    try {
        getPdfFromPb()
            .then(() =>
                convertPdfsToSvgs({
                    sourceFolder: join(__dirname, "../public/books/temp/pdf"),
                    destinationFolder: join(__dirname, "../public/books/temp/svg")
                })
            )
            .then(() => saveOnPb())
            .then(() => clean())
            .catch((error) => console.error(error));
    } catch (error) {
        console.error("sync", error);
    }
}

sync()

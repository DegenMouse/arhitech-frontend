// server/api/convert-docx.post.js
import libre from 'libreoffice-convert';
// import fs from 'fs';
import imageToPDF, { sizes } from 'image-to-pdf';
import { writeFileSync, unlinkSync } from 'fs'
import sizeOf from 'image-size'
import { tmpdir } from 'os'
import { join } from 'path'

import { promisify } from 'util';

// Bind the method so `this` inside convert still points at libre,
// then create a Promise‑returning version and attach it if you like:
libre.convertAsync = promisify(libre.convert.bind(libre));

// Promisify the convert function as shown in Nutrient guide
// const convertAsync = promisify(libre.convert);

export default eventHandler(async (event) => {
  
  console.log('doc2pdf');

  const parts = await readMultipartFormData(event);

  console.log(parts);
  
  const filePart = parts.find(p => p.name === 'file');
  if (!filePart) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'No file uploaded' }));
  }

  // `filePart.data` is a Node.js Buffer of the file’s bytes
  const docxBuffer = filePart.data;

  if(filePart.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
    console.log("docx")
    const pdfBuff = await libre.convertAsync(docxBuffer, 'pdf',undefined);

    return pdfBuff;
  }else if(filePart.type == 'image/jpeg' || filePart.type == 'image/png'){
    
    const tmpPath = join(tmpdir(), `${Date.now()}.img`);
    writeFileSync(tmpPath, docxBuffer);

    const { width, height } = sizeOf(docxBuffer)

    // 2. call imageToPDF with an array of file paths
    const pdfBuf = await imageToPDF([tmpPath], [ width, height ]);

    // 3. clean up temp file
    unlinkSync(tmpPath);

    return pdfBuf;
  }else{
    return sendError(event, createError({ 
      statusCode: 400, 
      statusMessage: `Unsupported file type: ${filePart.type}. Only DOCX, JPEG and PNG files are supported.`
    }));
  }

  
});

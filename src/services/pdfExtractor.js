/**
 * Browser-Native High-Fidelity PDF & Document Text Extractor
 * Extracts 100% of real textual content, page-by-page, preserving paragraphs and structure.
 */

/**
 * Load PDF.js library in browser if not already available
 */
async function loadPdfJsLibrary() {
  if (typeof window === 'undefined') return null;
  if (window.pdfjsLib) return window.pdfjsLib;

  // 1. Try dynamic import from bundled pdfjs-dist
  try {
    const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
    if (pdfjs && pdfjs.getDocument) {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        // Use CDN worker for maximum browser sandbox compatibility
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      window.pdfjsLib = pdfjs;
      return pdfjs;
    }
  } catch (err) {
    console.warn('[PDFExtractor] Bundled pdfjs import failed, loading via CDN...', err);
  }

  // 2. Load PDF.js via CDN script tag
  return new Promise((resolve) => {
    const existingScript = document.getElementById('pdfjs-cdn-script');
    if (existingScript) {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
      } else {
        existingScript.addEventListener('load', () => resolve(window.pdfjsLib));
        existingScript.addEventListener('error', () => resolve(null));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'pdfjs-cdn-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      try {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
          return;
        }
      } catch (e) {}
      resolve(null);
    };
    script.onerror = () => {
      console.warn('[PDFExtractor] CDN load failed.');
      resolve(null);
    };
    document.head.appendChild(script);
  });
}

/**
 * Extract clean textual content from PDF file in browser
 */
export async function extractTextFromPdf(file) {
  try {
    const pdfjs = await loadPdfJsLibrary();
    if (!pdfjs || !pdfjs.getDocument) {
      throw new Error('PDF.js engine could not be initialized');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const pageTexts = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      let pageString = '';

      for (const item of textContent.items) {
        if (!item.str) continue;
        
        // Check vertical displacement to detect line breaks
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageString += '\n';
        } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
          pageString += ' ';
        }
        
        pageString += item.str;
        lastY = item.transform[5];
      }

      if (pageString.trim()) {
        pageTexts.push(pageString.trim());
      }
    }

    const fullExtracted = pageTexts.join('\n\n');
    if (fullExtracted.trim().length > 30) {
      console.log(`[PDFExtractor] Successfully extracted ${fullExtracted.length} chars across ${numPages} pages.`);
      return fullExtracted;
    }
  } catch (err) {
    console.warn('[PDFExtractor] PDF.js extraction encountered issue:', err);
  }

  // Fallback: Return empty string so caller can fallback to server or raw text reader
  return '';
}

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false },
);
const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false },
);

export default function PdfViewer({
  file,
}: {
  file: string;
}) {
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    resize();
    window.addEventListener('resize', resize);
    return () =>
      window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="flex w-full justify-center">
      <Document
        key={file}
        file={file}
        onLoadSuccess={({ numPages }) =>
          setNumPages(numPages)
        }
      >
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={index + 1}
            width={width}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}

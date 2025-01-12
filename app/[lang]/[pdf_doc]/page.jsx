'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/hooks/useDictionary';
import dynamic from 'next/dynamic';
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false },
);
const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false },
);

function PdfComp() {
  const [numPages, setNumPages] = useState();
  const { pdf_doc, lang } = useParams();
  const dict = useDictionary(lang);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState(
    '/pdf/general_terms_english.pdf',
  );

  useEffect(() => {
    if (dict?.files[pdf_doc]) {
      setPdf(dict?.files[pdf_doc]);
    }
  }, [dict, pdf_doc]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex w-full justify-center">
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => {
            return (
              <Page
                key={page}
                width={
                  typeof window !== 'undefined' &&
                  window.innerWidth
                }
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            );
          })}
      </Document>
    </div>
  );
}
export default PdfComp;

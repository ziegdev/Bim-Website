import { notFound } from 'next/navigation';
import PdfViewer from '@/components/PdfViewer';
import { locales, type LocalesType } from '@/lib/constants';
import { getDictionary } from '@/lib/getDictionary';

// This dynamic segment serves only the existing, explicitly supported PDFs.
// Literal sibling routes such as /crowdfunding remain separate Next.js pages.
const documentSlugs = [
  'general_terms_and_conditions',
  'ethical_charter',
  'privacy_policy',
  'dating_safety_tips',
  'referral_policy',
] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return documentSlugs.map((pdf_doc) => ({ pdf_doc }));
}

export default async function PdfDocumentPage({
  params: { lang, pdf_doc },
}: {
  params: { lang: LocalesType; pdf_doc: string };
}) {
  if (
    !locales.includes(lang) ||
    !documentSlugs.some((slug) => slug === pdf_doc)
  ) {
    notFound();
  }

  const { files } = await getDictionary(lang);
  const file = Object.prototype.hasOwnProperty.call(
    files ?? {},
    pdf_doc,
  )
    ? files[pdf_doc]
    : undefined;

  if (
    typeof file !== 'string' ||
    !file.startsWith('/pdf/')
  ) {
    notFound();
  }

  return <PdfViewer file={file} />;
}

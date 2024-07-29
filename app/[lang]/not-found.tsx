import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <Image
        src="/images/404-illustration.jpg"
        alt="404 Illustration"
        width={600}
        height={600}
        className="mb-8"
      />
      <h1 className="mb-4 text-4xl font-bold text-gray-800">
        Oops! Page Not Found
      </h1>
      <p className="mb-8 text-xl text-gray-600">
        We can not seem to find the page you are looking
        for.
      </p>
      <Link
        href="/"
        className="rounded-full bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
      >
        Go back to homepage
      </Link>
    </div>
  );
}

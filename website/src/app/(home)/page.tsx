import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
      <p className="text-fd-muted-foreground">
        Click on{' '}
        <Link
          href="/info"
          className="text-fd-foreground font-semibold underline"
        >
          /info
        </Link>{' '}
        to open the documentation.
      </p> <br />
      <p className="text-fd-muted-foreground">
        Click on{' '}
        <Link
          href="/submissions"
          className="text-fd-foreground font-semibold underline"
        >
          /submissions
        </Link>{' '}
        to view the submissions.
      </p>
    </main>
  );
}



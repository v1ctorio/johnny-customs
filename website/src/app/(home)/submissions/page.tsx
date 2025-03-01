'use client'

import useSWR from 'swr';

// TODO: move to a separate file in case of other swc uses
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

interface Submission {
    id: string;
    user: string;
    item: string;
    country: string;
    currency: string;
    declared_value: number;
    declared_value_usd:	number;
    paid_customs: number;
    paid_customs_usd: number;
    additional_information: string;
    submission_date: number;
}

export default function SubmissionsPage() {
  const { data: submissions, error, isLoading } = useSWR<Submission[]>('http://localhost:3001/api/submissions', fetcher)

  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center p-4">An error has occurred</p>;
  }

  return (
    <main className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">User</th>
              <th className="p-3 text-left font-semibold">Item</th>
              <th className="p-3 text-left font-semibold">Country</th>
              <th className="p-3 text-right font-semibold">Declared Value</th>
              <th className="p-3 text-right font-semibold">Customs Paid</th>
              <th className="p-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions && submissions.length > 0 ? (
              submissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-fd-muted">
                  <td className="p-3 text-left">{submission.user}</td>
                  <td className="p-3 text-left">{submission.item}</td>
                  <td className="p-3 text-left">{submission.country}</td>
                  <td className="p-3 text-right">
                    {submission.declared_value} {submission.currency}
                    <div className="text-xs opacity-75">(${submission.declared_value_usd.toFixed(2)} USD)</div>
                  </td>
                  <td className="p-3 text-right">
                    {submission.paid_customs} {submission.currency}
                    <div className="text-xs opacity-75">(${submission.paid_customs_usd.toFixed(2)} USD)</div>
                  </td>
                  <td className="p-3 text-left">
                    {new Date(submission.submission_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No submissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
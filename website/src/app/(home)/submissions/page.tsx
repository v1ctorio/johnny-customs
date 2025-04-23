"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

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
  declared_value_usd: number;
  paid_customs: number;
  paid_customs_usd: number;
  additional_information: string;
  submission_date: number;
}



export default function SubmissionsPage() {
  const params = useParams();
  const {
    
    data: submissions,
    error,
    isLoading,
  } = useSWR<Submission[]>(
    `/api/submissions${params.countryCode ? `/${params.countryCode}` : ""}`,
    fetcher
  );
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [itemFilter, setItemFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortOrderDate, setsortOrderDate] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (submissions) {
      const sortedSubmissions = [...submissions];
      if (sortOrderDate === "asc") {
        sortedSubmissions.sort((a, b) => a.submission_date - b.submission_date);
      } else {
        sortedSubmissions.sort((a, b) => b.submission_date - a.submission_date);
      }

      setFilteredSubmissions(
        sortedSubmissions.filter((submission) => {
          return (
            submission.item.toLowerCase().includes(itemFilter.toLowerCase()) &&
            submission.country
              .toLowerCase()
              .includes(countryFilter.toLowerCase())
          );
        })
      );
    }
  }, [submissions, itemFilter, countryFilter, sortOrderDate]);

  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-center p-4">An error has occurred</p>;
  }

  const handlesortOrderDateChange = () => {
    setsortOrderDate((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <main className={!params.countryCode ? "p-4 md:p-6" : ""}>
      {!params.countryCode && (
        <h1 className="text-2xl font-bold mb-6">Submissions</h1>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold">User</th>
              <th className="p-3 text-left font-semibold">
                <input
                  type="text"
                  placeholder="Item"
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value)}
                  className="p-2 border rounded"
                />
              </th>
              {!params.countryCode && (
                <th className="p-3 text-left font-semibold">
                  {" "}
                  <input
                    type="text"
                    placeholder="Country"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="p-2 border rounded"
                  />
                </th>
              )}
              <th className="p-3 text-right font-semibold">Declared Value</th>
              <th className="p-3 text-right font-semibold">Customs Paid</th>
              <th className="p-3 text-left font-semibold">
                <button
                  type="button"
                  onClick={handlesortOrderDateChange}
                  className="p-2 border rounded"
                >
                  Date {sortOrderDate === "asc" ? "↑" : "↓"}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions && filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-fd-muted">
                  <td className="p-3 text-left">{submission.user}</td>
                  <td className="p-3 text-left">{submission.item}</td>
                  {!params.countryCode && <td className="p-3 text-left">{submission.country}</td>}
                  <td className="p-3 text-right">
                    {(submission.declared_value).toFixed(2)}{" "}
                    {submission.currency}
                    <div className="text-xs opacity-75">
                      (${(submission.declared_value_usd).toFixed(2)} USD)
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {(submission.paid_customs).toFixed(2)}{" "}
                    {submission.currency}
                    <div className="text-xs opacity-75">
                      (${(submission.paid_customs_usd).toFixed(2)} USD)
                    </div>
                  </td>
                  <td className="p-3 text-left">
                    {new Date(
                      submission.submission_date * 1000
                    ).toLocaleDateString()}
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

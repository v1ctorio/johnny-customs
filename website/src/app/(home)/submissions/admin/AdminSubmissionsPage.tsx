"use client";

import { useState, useEffect } from "react";
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
  approved: number;
}

export default function SubmissionsPage() {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  const {
    data: submissions,
    error,
    isLoading,
    mutate,
  } = useSWR<Submission[]>(
    `/api/submissions?all=true&page=${currentPage}&limit=${limit}`,
    fetcher
  );
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [itemFilter, setItemFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sortOrderDate, setsortOrderDate] = useState<"asc" | "desc">("desc");
  const [sortOrderStatus, setsortOrderStatus] = useState<0 | 1 | 2 | "no">(
    "no"
  );
  useEffect(() => {
    if (submissions) {
      let sortedSubmissions = [...submissions];
      if (sortOrderDate === "asc") {
        sortedSubmissions.sort((a, b) => a.submission_date - b.submission_date);
      } else {
        sortedSubmissions.sort((a, b) => b.submission_date - a.submission_date);
      }

      if (sortOrderStatus !== "no") {
        sortedSubmissions = sortedSubmissions.filter(
          (submission) => submission.approved === sortOrderStatus
        );
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
  }, [submissions, itemFilter, countryFilter, sortOrderDate, sortOrderStatus]);

  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  const handlesortOrderDateChange = () => {
    setsortOrderDate((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handlesortOrderStatusChange = () => {
    setsortOrderStatus((prevOrder) =>
      prevOrder === "no" ? 0 : prevOrder === 0 ? 1 : prevOrder === 1 ? 2 : "no"
    );
  };

  const handleStatusChange = async (id: string, status: number) => {
    if (!API_KEY) {
      throw new Error("API_KEY is not defined");
    }

    const res = await fetch(`/api/submissions/${id}/status/${status}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });
    if (res.ok) {
      mutate(
        submissions?.map((submission) =>
          submission.id === id
            ? { ...submission, approved: status }
            : submission
        ),
        false
      );
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1) return;
  
    const response = await fetch(`/api/submissions?all=true&page=${page}&limit=${limit}`);
    const data = await response.json();
  
    if (data.length > 0) {
      setCurrentPage(page);
    } else {
      setCurrentPage(page-1);
    }
  };

  return (
    <main className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded bg-blue-500 text-white mr-2"
          >
            Prev
          </button>
          <span className="mx-2">Page {currentPage}</span >
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 border rounded bg-blue-500 text-white mx-2"
          >
            Next
          </button>
        </div>
        <div>
          <label htmlFor="limit" className="mr-2">Items per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left font-semibold w-12">User</th>
              <th className="p-3 text-left font-semibold">
                <input
                  type="text"
                  placeholder="Item"
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value)}
                  className="p-2 border rounded"
                />
              </th>
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
              <th className="p-3 text-right font-semibold">Declared Value</th>
              <th className="p-3 text-right font-semibold">Customs Paid</th>
              <th className="p-3 text-left font-semibold">
                <button
                  onClick={handlesortOrderDateChange}
                  className="p-2 border rounded"
                >
                  Date {sortOrderDate === "asc" ? "↑" : "↓"}
                </button>
              </th>
              <th className="p-3 text-right font-semibold w-32">
                <button
                  onClick={handlesortOrderStatusChange}
                  className="p-2 border rounded w-full"
                >
                  {sortOrderStatus === "no"
                    ? "All"
                    : sortOrderStatus === 0
                    ? "Pending"
                    : sortOrderStatus === 1
                    ? "Approved"
                    : "Rejected"}
                </button>
              </th>
              <th className="p-3 text-center font-semibold w-20">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions && filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b hover:bg-fd-muted">
                  <td className="p-3 text-left">{submission.user}</td>
                  <td className="p-3 text-left">{submission.item}</td>
                  <td className="p-3 text-left">{submission.country}</td>
                  <td className="p-3 text-right">
                    {(submission.declared_value / 100).toFixed(2)}{" "}
                    {submission.currency}
                    <div className="text-xs opacity-75">
                      (${(submission.declared_value_usd / 100).toFixed(2)} USD)
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {(submission.paid_customs / 100).toFixed(2)}{" "}
                    {submission.currency}
                    <div className="text-xs opacity-75">
                      (${(submission.paid_customs_usd / 100).toFixed(2)} USD)
                    </div>
                  </td>
                  <td className="p-3 text-left">
                    {new Date(
                      submission.submission_date * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-left">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          submission.id,
                          submission.approved === 0
                            ? 1
                            : submission.approved === 1
                            ? 2
                            : 1
                        )
                      }
                      className="p-2 border rounded w-full"
                    >
                      {submission.approved === 0
                        ? "Pending"
                        : submission.approved === 1
                        ? "Approved"
                        : "Rejected"}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        fetch(`/api/submissions/${submission.id}`, {
                          method: "DELETE",
                          headers: {
                            "x-api-key": API_KEY || "",
                          },
                        }).then(() => {
                          mutate(
                            submissions?.filter((s) => s.id !== submission.id),
                            false
                          );
                        });
                      }}
                      className="p-2 border rounded bg-red-500 text-white"
                    >
                      Delete
                    </button>
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

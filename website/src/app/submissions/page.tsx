'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
	
	
	useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch('http://localhost:3001/api/submissions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Submissions</h1>
      <ul>
        {submissions.map((submission) => (
						<li key={submission.id}>
						{submission.user} submitted {submission.item} on{' '}
						{new Date(submission.submission_date).toLocaleDateString()}
						</li>
        ))}
      </ul>
    </main>
  );
}



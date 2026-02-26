'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResults(data.message ? JSON.parse(data.message).data || [] : []);
    } catch (err) {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50">





      <form onSubmit={handleSearch} className="w-full flex justify-between items-center bg-zinc-100 px-4 md:px-16 py-6 gap-2  absolute bottom-0">
        <Input
          type="text"
          placeholder="Describe your ideal trip..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          required
        />
        <Button
          type="submit"

          disabled={loading}
        >
          <ArrowRight />
        </Button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div>
        {/* {results.length > 0 && (
            <ul className="space-y-4">
              {results.map((result: any) => (
                <li key={result.id} className="p-4 border rounded dark:bg-zinc-800">
                  <div className="font-semibold">Destination ID: {result.id}</div>
                  <div className="text-sm">{result.reason}</div>
                </li>
              ))}
            </ul>
          )} */}
      </div>

    </div>
  );
}
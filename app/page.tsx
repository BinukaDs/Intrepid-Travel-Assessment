'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import FadeInUp from "./components/animations/FadeInUp";
import { ResultItem } from "./types";

export default function Home() {
  const [query, setQuery] = useState("");
  

  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validateInput(input: string): string | null {
    if (!input.trim()) return "Please enter a query.";
    if (input.length < 5) return "Query is too short.";
    if (input.length > 200) return "Query is too long.";
    return null;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInput(query);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
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
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
      } else {
        setResults(data.message ? JSON.parse(data.message) || [] : []);
        console.log(data);
      }
    } catch (err) {
      setError("Something went wrong.");
      toast.error("Something went wrong. ");
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



      <div className="px-4 md:px-16 py-6">
        {results.length > 0 && (
          <ul className="space-y-4">
            {results.map((item, key) => (
              <FadeInUp key={item.id} delay={0.15 * key}>
                <li key={item.id} className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <div className="font-bold text-lg">{item.title}</div>
                  <div className="text-sm text-gray-500 ">
                    <span className="mr-2">Location: {item.location}</span>
                    <span className="mr-2">Price: ${item.price}</span>
                    <span>Tags: {item.tags.join(", ")}</span>
                  </div>
                  <div className="mt-2 italic text-sm text-red-500">
                    Why matched: {item.reason}
                  </div>
                </li>
              </FadeInUp >
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
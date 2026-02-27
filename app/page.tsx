'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ResultItem } from "./types";
import ResultCard from "./components/ResultCard";
import fetchBackend from "./services/fetchBackend";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);


  // Input validation 
  function validateInput(input: string): string | null {
    if (!input.trim()) return "Please enter a query.";
    if (input.length < 5) return "Query is too short.";
    if (input.length > 200) return "Query is too long.";
    return null;
  }

  // Handle form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInput(query);
    if (validationError) {

      toast.error(validationError);
      return;
    }
    setLoading(true);
    setResults([]);
    await fetchBackend({ query, setResults });

    setLoading(false);
  };

  return (
    <div className=" bg-zinc-50">

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
              <ResultCard key={key} item={item} />
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
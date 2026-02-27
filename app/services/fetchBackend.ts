import React from "react";
import { toast } from "sonner";
import { ResultItem } from "../types";

// handle backend communication
const fetchBackend = async ({
  query,
  setResults,
}: {
  query: string;
  setResults: React.Dispatch<React.SetStateAction<ResultItem[]>>;
}) => {
  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      setResults(data.message ? JSON.parse(data.message) || [] : []);
      console.log(data);
    }
  } catch (err) {
    toast.error("Something went wrong. ");
  }
};

export default fetchBackend;

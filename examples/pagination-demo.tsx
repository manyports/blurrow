"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";

export default function PaginationDemo() {
  const [page, setPage] = useState(3);
  return <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />;
}

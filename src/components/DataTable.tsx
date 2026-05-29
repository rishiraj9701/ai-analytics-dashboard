import { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, Search, RefreshCw } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  emptyState?: ReactNode;
  actions?: ReactNode;
  pageSize?: number;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchKey,
  emptyState,
  actions,
  pageSize = 5
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting handlers
  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
  };

  // Filter records
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    if (searchKey) {
      const val = item[searchKey];
      return String(val || "").toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // Fallback: search all textual properties
    return Object.values(item).some(val => 
      String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort records
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    // Access with optional deep matching or falls back
    const valA = (a as any)[sortField];
    const valB = (b as any)[sortField];

    if (valA === undefined || valB === undefined) return 0;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }

    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();

    if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
    if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Safe page changes
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page to 1
            }}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-sans rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
        {actions && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="w-full overflow-x-auto border border-gray-100 dark:border-gray-900 rounded-lg">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30">
              {columns.map((col) => (
                <th
                  key={col.header}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    col.sortable ? "cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortField === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-900/80 bg-white dark:bg-gray-950">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors"
                >
                  {columns.map((col) => (
                    <td 
                      key={col.header} 
                      className="px-5 py-3.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {col.render ? col.render(row) : String((row as any)[col.key] || "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center">
                  {emptyState ? (
                    emptyState
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600">
                      <RefreshCw className="w-8 h-8 animate-spin-slow opacity-60" />
                      <span className="text-xs font-semibold uppercase tracking-wider">No Records Found</span>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Try broadening your active search query.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 py-2 border-t border-gray-100 dark:border-gray-900/50">
          <div className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {Math.min(startIndex + pageSize, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-gray-700 dark:text-gray-300">{totalItems}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-xs border border-gray-200 dark:border-gray-800 rounded shadow-sm bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx + 1)}
                className={`w-7 h-7 flex items-center justify-center text-xs border rounded shadow-sm ${
                  currentPage === idx + 1
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 text-xs border border-gray-200 dark:border-gray-800 rounded shadow-sm bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

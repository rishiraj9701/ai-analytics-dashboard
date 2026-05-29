export function CardSkeleton() {
  return (
    <div className="border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-5 rounded-lg shadow-sm flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-5 rounded-lg shadow-sm flex flex-col gap-4 animate-pulse">
      <div className="h-4 w-44 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-48 w-full bg-gray-100 dark:bg-gray-900 rounded flex items-end gap-2 p-3">
        <div className="bg-gray-200 dark:bg-gray-800 w-full h-1/3 rounded-t" />
        <div className="bg-gray-200 dark:bg-gray-800 w-full h-1/2 rounded-t" />
        <div className="bg-gray-200 dark:bg-gray-800 w-full h-3/4 rounded-t" />
        <div className="bg-gray-200 dark:bg-gray-800 w-full h-2/3 rounded-t" />
        <div className="bg-gray-200 dark:bg-gray-800 w-full h-full rounded-t" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 rounded-lg shadow-sm p-5 flex flex-col gap-4 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="flex flex-col gap-3">
        <div className="h-8 w-full bg-gray-100 dark:bg-gray-900 rounded" />
        <div className="h-8 w-full bg-gray-100 dark:bg-gray-900 rounded" />
        <div className="h-8 w-full bg-gray-100 dark:bg-gray-900 rounded" />
        <div className="h-8 w-full bg-gray-100 dark:bg-gray-900 rounded" />
      </div>
    </div>
  );
}

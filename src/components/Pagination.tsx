import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  totalPages: number;
  simplified?: boolean;
}

const PaginationComponent = ({ page, setPage, totalPages, simplified }: PaginationProps) => {

  const getVisiblePages = (current: number, total: number) => {
    const pages: (number | "...")[] = [];

    if (current > 2) pages.push(1);
    if (current > 3) pages.push("...");

    const start = Math.max(1, current - 1);
    const end = Math.min(total, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push("...");
    if (current < total - 1) pages.push(total);

    return pages;
  }


  const visiblePages = getVisiblePages(page, totalPages);

  return totalPages > 1 && (
    <Pagination>
      <PaginationContent>
        
        {simplified ? (
          <div className="flex items-center space-x-4">
            <PaginationPrevious
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>
            <PaginationNext
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </div>
        ) : (
          <>
            <div className="flex md:hidden items-center space-x-4">
              <PaginationPrevious
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
              <span className="text-sm font-medium">
                {page} / {totalPages}
              </span>
              <PaginationNext
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </div>

            <div className="hidden md:flex">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {visiblePages.map((pg, idx) => (
                <PaginationItem key={idx}>
                  {pg === "..." ? (
                    <span className="px-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => setPage(pg)}
                      isActive={pg === page}
                      className="cursor-pointer"
                    >
                      {pg}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </div>
          </>
        )}

      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;

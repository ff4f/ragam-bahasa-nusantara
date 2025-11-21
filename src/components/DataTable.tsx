import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface DataTableProps {
  columns: any[];
  rows: any[];
  noRowsCaption?: string;
  totalPages: number;
  disablePagination?: boolean;
  onChangePage?: (n: number) => void;
}

const DataTable = ({
  columns,
  rows,
  noRowsCaption,
  totalPages,
  disablePagination,
  onChangePage,
}: DataTableProps) => {

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onChangePage?.(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(item => <TableHead key={`header_${item.id}`}>{item.name}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {noRowsCaption || "Tidak ada data"}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={`row_${row.id}`}>
                  {columns.map(item => <TableCell key={`cell_${item.id}`}>{item?.render?.({ value: row[item.id], row }) || row[item.id]}</TableCell>)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!disablePagination && totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default DataTable;
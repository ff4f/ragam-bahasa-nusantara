import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import PaginationComponent from './Pagination';

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

  const actions = columns?.find(item => item.id === "action")?.actions;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    onChangePage?.(currentPage);
  }, [currentPage]);

  return (
    <>
      <div className="border rounded-lg overflow-hidden hidden sm:block">
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

      <div className="flex flex-col gap-4 block sm:hidden">
        {rows.map(row => (
          <Card key={row.id}>
            <CardContent className="pt-6 flex">
              <div className="flex-1">
                {columns.map(col => col.id !== "action" && (
                  <div className="mb-2" key={col.id}>
                    <p className="text-xs text-muted-foreground">{col.name}</p>
                    <p className="text-sm font-medium">{col?.render?.({ value: row[col.id], row }) || row?.[col.id] || "-"}</p>
                  </div>
                ))}
              </div>
              {actions?.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-[50%] h-6 w-6 p-4"
                    >
                      <EllipsisVertical style={{ width: "1.2rem", height: "1.2rem" }}/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {actions.map(act => <DropdownMenuItem key={act.id} onClick={() => act?.action?.(row)}>{act.label}</DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!disablePagination && totalPages > 1 && (
        <div className="mt-4">
          <PaginationComponent
            page={currentPage}
            setPage={setCurrentPage}
            totalPages={100}
            simplified
          />
        </div>
      )}
    </>
  );
};

export default DataTable;
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, Filter, MoreVertical } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "./Button";
import { Input } from "./Input";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  searchPlaceholder?: string;
  actions?: (item: T) => React.ReactNode;
  isLoading?: boolean;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  searchPlaceholder = "Buscar...",
  actions,
  isLoading,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data
    .filter((item) =>
      Object.values(item).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            Exportar
          </Button>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  onClick={() => column.sortable && handleSort(column.key.toString())}
                  className={cn(
                    "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500",
                    column.sortable && "cursor-pointer hover:text-white transition-colors"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key.toString() && (
                      sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-zinc-800 rounded w-full" />
                    </td>
                  ))}
                  {actions && <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-8 ml-auto" /></td>}
                </tr>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    "group hover:bg-zinc-800/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key.toString()} className="px-6 py-4 text-sm text-zinc-300">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      <div onClick={(e) => e.stopPropagation()}>{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs"
                >
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter,
  Download,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { EmptyState } from "./empty-state"
import { Skeleton } from "./skeleton"

interface Column<T> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  width?: string
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  filterable?: boolean
  exportable?: boolean
  pagination?: boolean
  pageSize?: number
  emptyState?: {
    icon?: React.ComponentType<{ className?: string }>
    title: string
    description?: string
    action?: {
      label: string
      onClick: () => void
    }
  }
  className?: string
  stickyHeader?: boolean
  compact?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  filterable = false,
  exportable = false,
  pagination = true,
  pageSize = 10,
  emptyState,
  className,
  stickyHeader = true,
  compact = false
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set())

  // Filter and search data
  const filteredData = React.useMemo(() => {
    if (!search) return data

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [data, search])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const toggleRowSelection = (index: number) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedRows(newSelection)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)))
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {(searchable || filterable || exportable) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        )}
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!loading && sortedData.length === 0 && emptyState) {
    return (
      <div className="space-y-4">
        {(searchable || filterable || exportable) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <EmptyState {...emptyState} />
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {(searchable || filterable || exportable) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-80 bg-surface border-border"
                />
              </div>
            )}
            {filterable && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedRows.size} selected
              </span>
            )}
            {exportable && (
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border bg-surface overflow-hidden"
      >
        <div className={cn("overflow-auto", stickyHeader && "max-h-[600px]")}>
          <Table>
            <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-surface-elevated")}>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleAllRows}
                    className="rounded border-border"
                  />
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      "text-foreground font-medium",
                      column.width && `w-[${column.width}]`,
                      column.sortable && "cursor-pointer hover:text-primary",
                      column.className
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && sortColumn === column.key && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-primary"
                        >
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </motion.span>
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "border-border hover:bg-surface-hover transition-colors",
                      selectedRows.has(index) && "bg-primary/5",
                      compact ? "h-12" : "h-14"
                    )}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => toggleRowSelection(index)}
                        className="rounded border-border"
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={cn("text-foreground", column.className)}
                      >
                        {column.render
                          ? column.render(row[column.key], row, index)
                          : String(row[column.key])
                        }
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
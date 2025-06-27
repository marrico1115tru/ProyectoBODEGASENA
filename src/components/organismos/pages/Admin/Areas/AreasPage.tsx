// src/pages/AreasPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import { MoreVertical, Plus, Search, ChevronDown } from "lucide-react";
import { getAreas } from "@/Api/AreasService";
import { Area } from "@/types/types/typesArea";
import DefaultLayout from "@/layouts/default";

const INITIAL_VISIBLE_COLUMNS = ["nombreArea", "acciones"];
const columns = [
  { name: "Nombre del Área", uid: "nombreArea", sortable: true },
  { name: "Acciones", uid: "acciones" },
];

const AreasPage = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await getAreas();
        setAreas(response);
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  const filteredItems = useMemo(() => {
    return areas.filter((area) =>
      area.nombreArea?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [areas, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, rowsPerPage, filteredItems]);

  const renderCell = (area: Area, columnKey: string) => {
    const cellValue = area[columnKey as keyof Area];
    switch (columnKey) {
      case "nombreArea":
        return <span>{cellValue}</span>;
      case "acciones":
        return (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" isIconOnly>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Buscar por nombre..."
          startContent={<Search className="w-4 h-4" />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={(val) => setFilterValue(val)}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDown className="h-4 w-4" />} variant="flat">
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Columnas de tabla"
              closeOnSelect={false}
              disallowEmptySelection
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={(keys) => setVisibleColumns(new Set(keys as Set<string>))}
            >
              {columns.map((col) => (
                <DropdownItem key={col.uid}>{col.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button color="primary" endContent={<Plus className="h-4 w-4" />}>
            Crear Área
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total: {areas.length} áreas
        </span>
        <label className="flex items-center text-default-400 text-small">
          Filas por página:
          <select
            className="bg-transparent outline-none text-default-400 text-small ml-1"
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="text-small text-default-400">
        {selectedKeys.size} seleccionados
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  );

  const visibleCols = useMemo(() => {
    return columns.filter((col) => visibleColumns.has(col.uid));
  }, [visibleColumns]);

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Gestor de Áreas</h1>
        <Table
          aria-label="Tabla de áreas"
          isHeaderSticky
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(new Set(keys as Set<string>))}
          topContent={topContent}
          topContentPlacement="outside"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            thead: "bg-blue-100 text-blue-800",
            wrapper: "max-h-[380px]",
          }}
        >
          <TableHeader columns={visibleCols}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No hay áreas"} items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DefaultLayout>
  );
};

export default AreasPage;

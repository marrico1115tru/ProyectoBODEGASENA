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
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@heroui/react";
import { Eye, MoreVertical, Plus, Search } from "lucide-react";
import { getAreas } from "@/Api/AreasService";
import { Area } from "@/types/types/typesArea";
import DefaultLayout from "@/layouts/default";

const columns = [
  { name: "ID", uid: "id" },
  { name: "NOMBRE", uid: "nombreArea" },
  { name: "ACCIONES", uid: "actions" },
];

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(new Set(["nombreArea", "actions"]));
  const [selectedKeys] = useState(new Set<string>());
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAreas();
      setAreas(res);
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    if (!filterValue) return areas;
    return areas.filter((area) =>
      area.nombreArea?.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [areas, filterValue]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, page, rowsPerPage]);

  const renderCell = (area: Area, columnKey: string) => {
    switch (columnKey) {
      case "nombreArea":
        return <span className="capitalize">{area.nombreArea}</span>;
      case "actions":
        return (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="light">
              <Eye className="w-4 h-4" />
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical className="w-4 h-4 text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones">
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem key="delete" className="text-danger" color="danger">
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default: {
        const value = area[columnKey as keyof Area];
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          value === null ||
          value === undefined
        ) {
          return value ?? "";
        }
        // For objects or other types, convert to JSON string or display a placeholder
        return JSON.stringify(value);
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre..."
            startContent={<Search className="w-4 h-4" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />

          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat">Columnas</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(new Set(Array.from(keys) as string[]))}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<Plus className="w-4 h-4" />}>
              Crear Área
            </Button>
          </div>
        </div>

        <Table
          isHeaderSticky
          aria-label="Tabla de Áreas"
          classNames={{
            wrapper: "max-h-[500px]",
            th: "bg-blue-100",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
        >
          <TableHeader columns={columns.filter((col) => visibleColumns.has(col.uid))}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No hay áreas"} items={paginatedItems}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="py-2 flex justify-between items-center">
          <span className="text-sm text-default-400">
            Total {filteredItems.length} áreas
          </span>
          <Pagination
            isCompact
            showControls
            color="primary"
            page={page}
            total={Math.ceil(filteredItems.length / rowsPerPage)}
            onChange={setPage}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}

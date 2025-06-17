import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Resident {
  id: string
  name: string
  email: string
  building: string
  unit: string
  status: "active" | "inactive"
}

export default function Residents() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - replace with actual API call
  const residents: Resident[] = [
    {
      id: "1",
      name: "Alice Brown",
      email: "alice@example.com",
      building: "Building A",
      unit: "101",
      status: "active",
    },
    {
      id: "2",
      name: "Charlie Davis",
      email: "charlie@example.com",
      building: "Building B",
      unit: "202",
      status: "active",
    },
    {
      id: "3",
      name: "Eve Wilson",
      email: "eve@example.com",
      building: "Building A",
      unit: "303",
      status: "inactive",
    },
  ]

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.unit.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t("residents.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("residents.addResident")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("residents.name")}</TableHead>
              <TableHead>{t("residents.email")}</TableHead>
              <TableHead>{t("residents.building")}</TableHead>
              <TableHead>{t("residents.unit")}</TableHead>
              <TableHead>{t("residents.status")}</TableHead>
              <TableHead className="text-right">{t("residents.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {t("residents.noResidents")}
                </TableCell>
              </TableRow>
            ) : (
              filteredResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.name}</TableCell>
                  <TableCell>{resident.email}</TableCell>
                  <TableCell>{resident.building}</TableCell>
                  <TableCell>{resident.unit}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        resident.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {resident.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

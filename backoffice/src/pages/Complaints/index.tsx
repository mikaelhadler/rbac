import { useState, useEffect } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import api from "@/services/api"

interface Complaint {
  id: number
  text: string
  approved: boolean
  user: {
    id: number
    name: string
    email: string
  }
}

export default function Complaints() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [approveError, setApproveError] = useState("")
  const [rejectError, setRejectError] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const data = await api.request<Complaint[]>('/api/complaints')
        setComplaints(data)
      } catch (err) {
        setError(t('complaints.error.fetchFailed'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaints()
  }, [t])

  const handleApprove = async (id: number) => {
    setIsApproving(true)
    setApproveError("")
    try {
      const updated = await api.request<Complaint>(`/api/complaints/${id}`, {
        method: "PUT",
        body: JSON.stringify({ approved: true }),
      })
      setComplaints(complaints.map(c => c.id === id ? updated : c))
    } catch (err) {
      setApproveError(err instanceof Error ? err.message : "Failed to approve complaint")
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async (id: number) => {
    setIsRejecting(true)
    setRejectError("")
    try {
      const updated = await api.request<Complaint>(`/api/complaints/${id}`, {
        method: "PUT",
        body: JSON.stringify({ approved: false }),
      })
      setComplaints(complaints.map(c => c.id === id ? updated : c))
    } catch (err) {
      setRejectError(err instanceof Error ? err.message : "Failed to reject complaint")
    } finally {
      setIsRejecting(false)
    }
  }

  const filteredComplaints = complaints.filter(complaint =>
    complaint.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return <div>{t('common.loading')}</div>
  if (error) return <div className="text-destructive">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t("complaints.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("complaints.table.id")}</TableHead>
              <TableHead>{t("complaints.table.text")}</TableHead>
              <TableHead>{t("complaints.table.user")}</TableHead>
              <TableHead>{t("complaints.table.status")}</TableHead>
              <TableHead className="text-right">{t("complaints.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {t("complaints.noComplaints")}
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.id}</TableCell>
                  <TableCell>{complaint.text}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{complaint.user.name}</div>
                      <div className="text-sm text-muted-foreground">{complaint.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      complaint.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {complaint.approved ? t("complaints.status.approved") : t("complaints.status.pending")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {!complaint.approved && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleApprove(complaint.id)}
                          disabled={isApproving}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleReject(complaint.id)}
                          disabled={isRejecting}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                    {approveError && <div className="text-xs text-destructive">{approveError}</div>}
                    {rejectError && <div className="text-xs text-destructive">{rejectError}</div>}
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

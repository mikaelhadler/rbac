import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import api from "@/services/api"
import { Pencil, Trash2, Search } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"

interface Role {
  id: number
  name: string
}

export default function Roles() {
  const { t } = useTranslation()
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [newRoleName, setNewRoleName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editError, setEditError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await api.request<Role[]>("/api/roles")
        setRoles(data)
      } catch (err) {
        setError("Failed to fetch roles")
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setCreateError("")
    try {
      const role = await api.request<Role>("/api/roles", {
        method: "POST",
        body: JSON.stringify({ name: newRoleName }),
      })
      setRoles([...roles, role])
      setNewRoleName("")
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create role")
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditRole = async (id: number) => {
    setEditError("")
    try {
      const updated = await api.request<Role>(`/api/roles/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editingName }),
      })
      setRoles(roles.map(r => r.id === id ? updated : r))
      setEditingId(null)
      setEditingName("")
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update role")
    }
  }

  const handleDeleteRole = async (id: number) => {
    setDeleteError("")
    try {
      await api.request(`/api/roles/${id}`, { method: "DELETE" })
      setRoles(roles.filter(r => r.id !== id))
      setDeletingId(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete role")
    }
  }

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-destructive">{error}</div>

  return (
    <div className="space-y-8 mx-auto">
      <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={t('roles.searchPlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-[300px]"
        />
        <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              + {t('roles.actions.addRole')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('roles.create.title')}</DialogTitle>
              <DialogDescription>
                {t('roles.create.description')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { handleCreateRole(e); if (!createError) setIsCreateDialogOpen(false) }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  name="roleName"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  required
                  disabled={isCreating}
                />
              </div>
              {createError && <div className="text-sm text-destructive">{createError}</div>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={open => {
          setIsEditDialogOpen(open)
          if (!open) setEditingId(null)
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('roles.edit.title')}</DialogTitle>
              <DialogDescription>
                {t('roles.edit.description')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={e => { e.preventDefault(); if (editingId !== null) handleEditRole(editingId); if (!editError) setIsEditDialogOpen(false) }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editRoleName">{t('roles.edit.name')}</Label>
                <Input
                  id="editRoleName"
                  name="editRoleName"
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {editError && <div className="text-sm text-destructive">{editError}</div>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                  {t('common.actions.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {t('common.actions.save')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t('roles.table.name')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>
                  <span>{role.name}</span>
                </TableCell>
                <TableCell className="text-right">
                  {deletingId === role.id ? (
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteRole(role.id)}>{t('common.actions.delete')}</Button>
                      <Button size="sm" variant="outline" onClick={() => setDeletingId(null)}>{t('common.actions.cancel')}</Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingId(role.id); setEditingName(role.name); setIsEditDialogOpen(true) }}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeletingId(role.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  )}
                  {deleteError && deletingId === role.id && <div className="text-xs text-destructive">{deleteError}</div>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 
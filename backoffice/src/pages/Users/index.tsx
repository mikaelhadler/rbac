import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import api from "@/services/api"
import { useAuth } from "@/hooks/useAuth"

interface User {
  id: string
  name: string
  email: string
  role: {
    name: string
  }
}

interface Role {
  id: number
  name: string
}

interface UserFormProps {
  initialValues?: Partial<User & { roleId?: string }>
  roles: Role[]
  isSubmitting: boolean
  error: string
  onSubmit: (data: { name: string; email: string; password?: string; roleId: string }) => void
  onCancel: () => void
  isEdit?: boolean
}

function UserForm({ initialValues = {}, roles, isSubmitting, error, onSubmit, onCancel, isEdit }: UserFormProps) {
  const { t } = useTranslation()

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        onSubmit({
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          roleId: formData.get("roleId") as string,
        })
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">{t('users.name')}</Label>
        <Input id="name" name="name" required disabled={isSubmitting} defaultValue={initialValues.name || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t('users.email')}</Label>
        <Input id="email" name="email" type="email" required disabled={isSubmitting} defaultValue={initialValues.email || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{isEdit ? t('users.newPassword') : t('users.form.password')}</Label>
        <Input id="password" name="password" type="password" disabled={isSubmitting} required={!isEdit} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleId">{t('users.role')}</Label>
        <Select name="roleId" required disabled={isSubmitting} defaultValue={initialValues.roleId || undefined}>
          <SelectTrigger>
            <SelectValue placeholder={t('users.selectRole')} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.actions.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (isEdit ? t('users.actions.saving') : t('users.actions.creating'))
            : (isEdit ? t('users.actions.saveChanges') : t('users.actions.createUser'))
          }
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function Users() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [createError, setCreateError] = useState("")
  const [editError, setEditError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const { user: currentUser } = useAuth()

  const isAdmin = currentUser?.role?.name === "administrator"

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, rolesData] = await Promise.all([
          api.request<User[]>('/api/users'),
          api.request<Role[]>('/api/roles')
        ])
        setUsers(usersData)
        setRoles(rolesData)
      } catch (err) {
        setError(t('users.error.fetchFailed'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [t])

  const handleCreateUser = async (data: { name: string; email: string; password?: string; roleId: string }) => {
    setIsCreating(true)
    setCreateError("")
    try {
      const newUser = await api.request<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      setUsers([...users, newUser])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : t('users.error.createFailed'))
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditUser = async (data: { name: string; email: string; password?: string; roleId: string }) => {
    if (!editingUser) return
    setIsEditing(true)
    setEditError("")
    try {
      const updatedUser = await api.request<User>(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          password: data.password || undefined,
        }),
      })
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
      setIsEditDialogOpen(false)
      setEditingUser(null)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t('users.error.updateFailed'))
    } finally {
      setIsEditing(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!deletingUser) return
    setIsDeleting(true)
    setDeleteError("")
    try {
      await api.request(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      })
      setUsers(users.filter(u => u.id !== deletingUser.id))
      setIsDeleteDialogOpen(false)
      setDeletingUser(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t('users.error.deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div>{t('common.loading')}</div>
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t('users.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('users.actions.addUser')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('users.create.title')}</DialogTitle>
                <DialogDescription>
                  {t('users.create.description')}
                </DialogDescription>
              </DialogHeader>
              <UserForm
                roles={roles}
                isSubmitting={isCreating}
                error={createError}
                onSubmit={handleCreateUser}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('users.table.name')}</TableHead>
              <TableHead>{t('users.table.email')}</TableHead>
              <TableHead>{t('users.table.role')}</TableHead>
              <TableHead className="w-[100px]">{t('users.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog open={isEditDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open)
                      if (!open) setEditingUser(null)
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('users.edit.title')}</DialogTitle>
                          <DialogDescription>
                            {t('users.edit.description')}
                          </DialogDescription>
                        </DialogHeader>
                        <UserForm
                          initialValues={user}
                          roles={roles}
                          isSubmitting={isEditing}
                          error={editError}
                          onSubmit={handleEditUser}
                          onCancel={() => {
                            setIsEditDialogOpen(false)
                            setEditingUser(null)
                          }}
                          isEdit
                        />
                      </DialogContent>
                    </Dialog>

                    {isAdmin && (
                      <Dialog open={isDeleteDialogOpen && deletingUser?.id === user.id} onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open)
                        if (!open) setDeletingUser(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('users.delete.title')}</DialogTitle>
                            <DialogDescription>
                              {t('users.delete.description', { name: user.name })}
                            </DialogDescription>
                          </DialogHeader>
                          {deleteError && (
                            <div className="text-sm text-destructive">{deleteError}</div>
                          )}
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsDeleteDialogOpen(false)
                                setDeletingUser(null)
                              }}
                              disabled={isDeleting}
                            >
                              {t('common.actions.cancel')}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteUser}
                              disabled={isDeleting}
                            >
                              {isDeleting ? t('users.actions.deleting') : t('users.actions.delete')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

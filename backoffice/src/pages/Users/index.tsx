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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, Pencil } from "lucide-react"
import api from "@/services/api"

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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required disabled={isSubmitting} defaultValue={initialValues.name || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required disabled={isSubmitting} defaultValue={initialValues.email || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" disabled={isSubmitting} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleId">Role</Label>
        <Select name="roleId" required disabled={isSubmitting} defaultValue={initialValues.roleId || undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
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
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save Changes" : "Create User"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [createError, setCreateError] = useState("")
  const [editError, setEditError] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)

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
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
      setCreateError(err instanceof Error ? err.message : 'Failed to create user')
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
      setEditError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setIsEditing(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. Fill in the details below.
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
        <Dialog open={isEditDialogOpen} onOpenChange={open => {
          setIsEditDialogOpen(open)
          if (!open) setEditingUser(null)
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user details below.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              initialValues={editingUser ? {
                ...editingUser,
                roleId: roles.find(r => r.name === editingUser.role.name)?.id?.toString() || undefined
              } : {}}
              roles={roles}
              isSubmitting={isEditing}
              error={editError}
              onSubmit={handleEditUser}
              onCancel={() => setIsEditDialogOpen(false)}
              isEdit
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingUser(user)
                    setIsEditDialogOpen(true)
                  }}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

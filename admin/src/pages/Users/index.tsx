import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

interface User {
  id?: string
  name: string
  email: string
  password?: string
  role: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const { register, handleSubmit, reset } = useForm<User>()

  const fetchUsers = async () => {
    const data = await api.request<User[]>('/users')
    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const onSubmit = async (data: User) => {
    await api.request<User>('/users', { method: 'POST', body: JSON.stringify(data) })
    reset()
    fetchUsers()
  }

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name" {...register('name')} />
        <input placeholder="Email" {...register('email')} />
        <input placeholder="Password" {...register('password')} type="password" />
        <select {...register('role')}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="resident">Resident</option>
        </select>
        <button type="submit">Create</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} - {u.email} ({u.role})</li>
        ))}
      </ul>
    </div>
  )
}

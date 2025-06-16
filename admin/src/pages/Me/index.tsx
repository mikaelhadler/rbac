import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { uploadToCloudinary } from '../../lib/cloudinary'

interface Profile {
  name: string
  password?: string
  avatar?: string
  avatarFile?: FileList
}

export default function ProfilePage() {
  const { user, token, login } = useAuth()
  const { register, handleSubmit, reset } = useForm<Profile>({
    defaultValues: { name: user?.name },
  })

  useEffect(() => {
    reset({ name: user?.name })
  }, [user])

  const onSubmit = async (data: Profile) => {
    if (data.avatarFile && data.avatarFile.length > 0) {
      data.avatar = await uploadToCloudinary(data.avatarFile[0])
    }
    await api.request('/me', { method: 'PUT', body: JSON.stringify(data) })
    const updated = await api.request('/me')
    login(token!, updated)
    reset()
  }

  return (
    <div>
      <h1>My Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name" {...register('name')} />
        <input type="password" placeholder="Password" {...register('password')} />
        <input type="file" {...register('avatarFile')} />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

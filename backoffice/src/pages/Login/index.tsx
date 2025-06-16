import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

interface FormData {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>()
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (data: FormData) => {
    try {
      const result = await api.login(data.email, data.password)
      login(result.token, result.user)
      navigate('/dashboard')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" placeholder="Email" {...register('email')} />
      <input type="password" placeholder="Password" {...register('password')} />
      <button type="submit">Login</button>
    </form>
  )
}

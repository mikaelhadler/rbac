import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'
import { uploadToCloudinary } from '../../lib/cloudinary'

interface Resident {
  id?: string
  name: string
  apartment: string
  building: string
  pets?: string
  vehicles?: string
  image?: string
}

interface ResidentForm extends Resident {
  imageFile?: FileList
}

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const { register, handleSubmit, reset } = useForm<ResidentForm>()
  const [search, setSearch] = useState('')

  const fetchResidents = async () => {
    const data = await api.request<Resident[]>('/residents?search=' + search)
    setResidents(data)
  }

  useEffect(() => {
    fetchResidents()
  }, [search])

  const onSubmit = async (data: ResidentForm) => {
    if (data.imageFile && data.imageFile.length > 0) {
      data.image = await uploadToCloudinary(data.imageFile[0])
    }
    await api.request<Resident>('/residents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    reset()
    fetchResidents()
  }

  return (
    <div>
      <h1>Residents</h1>
      <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name" {...register('name')} />
        <input placeholder="Apartment" {...register('apartment')} />
        <input placeholder="Building" {...register('building')} />
        <input placeholder="Pets (comma separated)" {...register('pets')} />
        <input placeholder="Vehicles (comma separated)" {...register('vehicles')} />
        <input type="file" {...register('imageFile')} />
        <button type="submit">Create</button>
      </form>
      <ul>
        {residents.map(r => (
          <li key={r.id}>{r.name} - Apt {r.apartment}</li>
        ))}
      </ul>
    </div>
  )
}

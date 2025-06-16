import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Complaint {
  id: string
  description: string
  status: 'pending' | 'accepted' | 'rejected'
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [status, setStatus] = useState('')

  const fetchComplaints = async () => {
    const data = await api.request<Complaint[]>(`/complaints?status=${status}`)
    setComplaints(data)
  }

  useEffect(() => {
    fetchComplaints()
  }, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    await api.request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    })
    fetchComplaints()
  }

  return (
    <div>
      <h1>Complaints</h1>
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
      <ul>
        {complaints.map(c => (
          <li key={c.id}>
            {c.description} - {c.status}
            {c.status === 'pending' && (
              <>
                <button onClick={() => updateStatus(c.id, 'accepted')}>Accept</button>
                <button onClick={() => updateStatus(c.id, 'rejected')}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

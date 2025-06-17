import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useTranslation } from 'react-i18next'

interface Complaint {
  id: string
  description: string
  status: 'pending' | 'accepted' | 'rejected'
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [status, setStatus] = useState('')
  const { t } = useTranslation()
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
      <h1>{t("complaints.title")}</h1>
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">{t("complaints.all")}</option>
        <option value="pending">{t("complaints.pending")}</option>
        <option value="accepted">{t("complaints.accepted")}</option>
        <option value="rejected">{t("complaints.rejected")}</option>
      </select>
      <ul>
        {complaints.map(c => (
          <li key={c.id}>
            {c.description} - {c.status}
            {c.status === 'pending' && (
              <>
                <button onClick={() => updateStatus(c.id, 'accepted')}>{t("complaints.accept")}</button>
                <button onClick={() => updateStatus(c.id, 'rejected')}>{t("complaints.reject")}</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

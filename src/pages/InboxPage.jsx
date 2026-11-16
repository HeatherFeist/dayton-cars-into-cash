import AdminPanel from '../components/AdminPanel'
import site from '../lib/site'

export default function InboxPage() {
  return (
    <section className="inbox-page">
      <p className="inbox-page__kicker">{site.businessName}</p>
      <AdminPanel embedded />
    </section>
  )
}

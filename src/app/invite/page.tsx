"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function InviteAndRecovery() {
  const router = useRouter()
  const [organization, setOrganization] = useState<{ id: string; name: string } | null>(null)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  // Récupère l'organisation de l'utilisateur connecté
  useEffect(() => {
    const fetchOrganization = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth")
        return
      }

      const { data, error } = await supabase
        .from("organization_users")
        .select("organizations(id,name)")
        .eq("user_id", user.id)
        .single()

      if (error) return console.error("Erreur fetchOrganization:", error)

      if (!data?.organizations) {
        alert("Aucune organisation trouvée. Créez-en d'abord.")
        router.push("/settings")
        return
      }

      setOrganization(Array.isArray(data.organizations) ? data.organizations[0] : data.organizations)
    }

    fetchOrganization()
  }, [router])

  // Invite un utilisateur
  const inviteUser = async () => {
    if (!email) return alert("Veuillez entrer l'email de l'utilisateur")
    if (!organization) return alert("Organisation invalide")

    setLoading(true)
    setMsg("")

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, organization_id: organization.id }),
      })

      const result = await res.json()
      setMsg(result.error || result.message)
    } catch (err: any) {
      console.error(err)
      setMsg("Erreur inconnue lors de l'invitation.")
    }
    setLoading(false)
  }

  // Envoyer email de récupération
  const sendRecoveryEmail = async () => {
    if (!email) return alert("Veuillez entrer l'email")

    setLoading(true)
    setMsg("")

    try {
      const res = await fetch("/api/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const result = await res.json()
      setMsg(result.error || result.message)
    } catch (err: any) {
      console.error(err)
      setMsg("Erreur inconnue lors de l'envoi du mail de récupération.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button onClick={() => router.back()} className="mb-6 text-blue-600 hover:underline">
        ← Retour
      </button>

      <h1 className="text-2xl font-bold mb-4">Inviter ou récupérer</h1>

      {organization && (
        <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-100">
          <p className="text-gray-600 mb-2">Organisation :</p>
          <h2 className="text-lg font-semibold">{organization.name}</h2>
        </div>
      )}

      <div className="p-6 bg-white rounded-xl shadow border border-gray-100 max-w-md space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemple@domaine.com"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          onClick={inviteUser}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer invitation"}
        </button>

        <button
          onClick={sendRecoveryEmail}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer email de récupération"}
        </button>

        {msg && <p className="text-center mt-2 text-gray-700">{msg}</p>}
      </div>
    </div>
  )
}

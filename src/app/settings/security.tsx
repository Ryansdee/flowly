"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { AlertCircle, ArrowLeft, Settings, Shield } from "lucide-react"

function SecurityTab() {
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const handleChangePassword = async () => {
    const newPassword = prompt("Entrez votre nouveau mot de passe :")
    if (!newPassword) return

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setLoading(false)

    if (error) alert("Erreur : " + error.message)
    else alert("Mot de passe mis à jour avec succès !")
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")
    if (!confirmed) return

    setLoading(true)
    try {
      const response = await fetch("/api/delete", { method: "POST" })
      if (!response.ok) throw new Error("Erreur lors de la suppression du compte.")
      alert("Votre compte a été supprimé.")
    } catch (error: any) {
      alert("Erreur : " + error.message)
    }
    setLoading(false)
  }

  const handleEnable2FA = async () => {
    setLoading(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error("Utilisateur non connecté")

      const response = await fetch("/api/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'activation de la 2FA")

      setQrCode(data.qr)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
          <p className="text-gray-500">Gérez la sécurité de votre compte</p>
        </div>

        <div className="space-y-4">
          <button onClick={handleChangePassword} disabled={loading} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Changer le mot de passe</h3>
                <p className="text-sm text-gray-500">Dernière modification il y a 3 mois</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>

          <button onClick={handleEnable2FA} disabled={loading} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                <p className="text-sm text-gray-500">Scanner le QR code pour activer</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>

          {qrCode && (
            <div className="mt-4 flex justify-center">
              <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-900">Zone de danger</h3>
            <p className="text-sm text-red-700 mt-1 mb-4">Ces actions sont irréversibles. Veuillez procéder avec prudence.</p>
            <button onClick={handleDeleteAccount} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityTab

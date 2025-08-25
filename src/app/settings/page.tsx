"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Settings, 
  Save, 
  Bell,
  Shield,
  Users,
  Crown,
  Mail,
  Phone,
  Briefcase,
  Plus,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import SecurityTab from "./security"

interface UserProfile {
  id: string
  full_name: string
  phone: string
  job_title: string
  email?: string
}

interface Organization {
  id: string
  name: string
  owner_id: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [activeTab, setActiveTab] = useState<"profile" | "organization" | "notifications" | "security">("profile")
  const [newOrgName, setNewOrgName] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const addOrganization = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return alert("Vous devez être connecté")

    if (!newOrgName) return alert("Le nom de l'entreprise est obligatoire")

    setLoading(true)

    // Créer l'organisation
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert([{ name: newOrgName, owner_id: user.id }])
      .select()
      .single()

    if (orgError) {
      alert(orgError.message)
      setLoading(false)
      return
    }

    // Lier l'utilisateur à cette organisation
    const { error: linkError } = await supabase.from("organization_users").insert([
      { user_id: user.id, organization_id: orgData.id, role: "owner" },
    ])

    if (linkError) {
      alert(linkError.message)
      setLoading(false)
      return
    }

    setOrganization(orgData)
    setNewOrgName("")
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

const saveProfile = async () => {
  if (!profile) return
  setLoading(true)

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert([profile], { onConflict: "id" }) // Specify conflict target
      .select("id, full_name, phone, job_title, email") // Get updated row

    if (error) {
      alert(error.message)
    } else {
      setProfile(data[0]) // Update state with returned profile
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  } catch (err) {
    console.error("Error saving profile:", err)
    alert("Une erreur est survenue lors de la sauvegarde.")
  } finally {
    setLoading(false)
  }
}


  // Fetch user profile
  const fetchProfile = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (error) console.error(error)
    else setProfile(data || { 
      id: user.id, 
      full_name: "", 
      phone: "", 
      job_title: "",
      email: user.email || ""
    })
  }

  // Fetch organization
  const fetchOrganization = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data, error } = await supabase
      .from("organization_users")
      .select("organizations(*)")
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) console.error(error)
    else if (Array.isArray(data?.organizations)) {
      setOrganization(data.organizations[0] || null)
    } else {
      setOrganization(data?.organizations || null)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchOrganization()
  }, [])

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "organization", label: "Organisation", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                  <p className="text-sm text-gray-500">Gérez votre compte et vos préférences</p>
                </div>
              </div>
            </div>
            
            {saved && (
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Sauvegardé</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && profile && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                      <p className="text-gray-500">Gérez vos informations de profil</p>
                    </div>
                    <button
                      onClick={saveProfile}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? "Sauvegarde..." : "Sauvegarder"}</span>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email || ""}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                        placeholder="Votre nom complet"
                        className="w-full px-4 py-3 border text-gray-400 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-4 py-3  text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Poste
                      </label>
                      <input
                        type="text"
                        value={profile.job_title}
                        onChange={(e) =>
                          setProfile({ ...profile, job_title: e.target.value })
                        }
                        placeholder="Directeur, Chef de projet..."
                        className="w-full px-4 py-3  text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Crown className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Propriétaire</h3>
                    <p className="text-sm text-gray-500">Rôle dans l'organisation</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Vérifié</h3>
                    <p className="text-sm text-gray-500">Compte confirmé</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Équipe</h3>
                    <p className="text-sm text-gray-500">Membre actif</p>
                  </div>
                </div>
              </div>
            )}

            {/* Organization Tab */}
            {activeTab === "organization" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Organisation</h2>
                  <p className="text-gray-500">Gérez les informations de votre entreprise</p>
                </div>

                {organization ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building2 className="w-4 h-4 inline mr-2" />
                          Nom de l'entreprise
                        </label>
                        <input
                          type="text"
                          value={organization.name}
                          onChange={(e) =>
                            setOrganization({ ...organization, name: e.target.value })
                          }
                          className="w-full px-4 py-3 text-gray-400 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Crown className="w-4 h-4 inline mr-2" />
                          ID Propriétaire
                        </label>
                        <input
                          type="text"
                          value={organization.owner_id}
                          disabled
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-blue-900">Organisation configurée</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Votre organisation est active et prête à être utilisée avec vos workflows.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune organisation</h3>
                    <p className="text-gray-500 mb-6">Créez votre organisation pour commencer à collaborer</p>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <input
                        type="text"
                        placeholder="Nom de votre entreprise"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={addOrganization}
                        disabled={loading || !newOrgName}
                        className="flex items-center justify-center space-x-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{loading ? "Création..." : "Créer l'organisation"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                  <p className="text-gray-500">Configurez vos préférences de notification</p>
                </div>

                <div className="space-y-6">
                  {[
                    { title: "Notifications Email", description: "Recevez des emails pour les mises à jour importantes", enabled: true },
                    { title: "Notifications Push", description: "Notifications dans le navigateur", enabled: false },
                    { title: "Workflows terminés", description: "Être notifié quand un workflow est complété", enabled: true },
                    { title: "Nouvelles étapes assignées", description: "Notification lors de l'assignation d'étapes", enabled: true },
                    { title: "Rappels d'échéances", description: "Alertes avant les dates limites", enabled: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
          {activeTab === "security" && <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
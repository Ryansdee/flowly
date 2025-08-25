"use client"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { 
  FolderKanban, 
  Plus, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  Settings,
  Bell,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Users,
  ArrowRight,
  Activity
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Step {
  id: string
  workflow_id: string
  title: string
  status: string
}

interface Workflow {
  id: string
  title: string
  description: string
  created_by: string
  status: string
  steps?: Step[]
  created_at?: string
}

export default function Dashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [stepTitle, setStepTitle] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

const handleSearch = (query: string) => {
  setSearchQuery(query)
  if (!query) {
    fetchWorkflows() // reset la liste
    return
  }
  const filtered = workflows.filter(w => 
    w.title.toLowerCase().includes(query.toLowerCase()) ||
    w.description.toLowerCase().includes(query.toLowerCase())
  )
  setWorkflows(filtered)
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push("/auth") // redirection après déconnexion
}


  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    const { data, error } = await supabase
      .from("workflows")
      .select("*, workflow_steps(*)")
      .order("created_at", { ascending: false })

    if (error) console.error(error)
    else {
      setWorkflows(
        data.map((w: any) => ({
          ...w,
          steps: w.workflow_steps || [],
        }))
      )
    }
  }

  const addWorkflow = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      alert("Vous devez être connecté")
      return
    }

    const { error } = await supabase.from("workflows").insert([
      {
        title,
        description,
        created_by: user.id,
        status: "todo",
      },
    ])

    if (error) alert(error.message)
    else {
      setTitle("")
      setDescription("")
      setShowCreateForm(false)
      fetchWorkflows()
    }
  }

  const addStep = async (workflowId: string) => {
    if (!stepTitle) return alert("Titre obligatoire")
    const { error } = await supabase.from("workflow_steps").insert([
      {
        workflow_id: workflowId,
        title: stepTitle,
        status: "todo",
      },
    ])
    if (error) alert(error.message)
    else {
      setStepTitle("")
      fetchWorkflows()
    }
  }

  const toggleStatus = async (workflow: Workflow, stepId?: string) => {
    if (stepId) {
      const step = workflow.steps?.find((s) => s.id === stepId)
      if (!step) return
      const nextStatus =
        step.status === "todo"
          ? "in_progress"
          : step.status === "in_progress"
          ? "done"
          : "todo"

      await supabase
        .from("workflow_steps")
        .update({ status: nextStatus })
        .eq("id", step.id)
    } else {
      const nextStatus =
        workflow.status === "todo"
          ? "in_progress"
          : workflow.status === "in_progress"
          ? "done"
          : "todo"

      await supabase
        .from("workflows")
        .update({ status: nextStatus })
        .eq("id", workflow.id)
    }

    fetchWorkflows()
  }

  // Stats
  const totalWorkflows = workflows.length
  const inProgressWorkflows = workflows.filter(w => w.status === "in_progress").length
  const completedWorkflows = workflows.filter(w => w.status === "done").length
  const totalSteps = workflows.flatMap(w => w.steps || []).length
  const inProgressSteps = workflows
    .flatMap((w) => w.steps || [])
    .filter((s) => s.status === "in_progress").length
  const completedSteps = workflows
    .flatMap((w) => w.steps || [])
    .filter((s) => s.status === "done").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-700 border-gray-200"
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "done":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "todo":
        return "À faire"
      case "in_progress":
        return "En cours"
      case "done":
        return "Terminé"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">Temps réel</span>
                </div>
                </div>
            </div>
            </div>

            <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50" onClick={() => router.push("/invite")}>
                <Plus className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                onClick={() => router.push("/settings")}
            >
                <Settings className="w-5 h-5" />
            </button>

            {/* User / Logout */}
            <div
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleLogout}
            >
                <User className="w-5 h-5 text-gray-600" />
            </div>
            </div>
        </div>
        </header>
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{totalWorkflows}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">+{inProgressWorkflows}</span>
              <span className="text-gray-500 ml-1">en cours</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Étapes actives</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressSteps}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-blue-600 font-medium">Sur {totalSteps}</span>
              <span className="text-gray-500 ml-1">total</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Terminé</p>
                <p className="text-2xl font-bold text-gray-900">{completedSteps}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-600 font-medium">{Math.round((completedSteps / Math.max(totalSteps, 1)) * 100)}%</span>
              <span className="text-gray-500 ml-1">de taux de completion</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Équipes</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-600">Collaboratives</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Workflows récents</h2>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtrer</span>
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau workflow</span>
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer un nouveau workflow</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Onboarding nouveau client"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez brièvement ce workflow..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={addWorkflow}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Créer le workflow
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.title}</h3>
                      <p className="text-sm text-gray-500">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleStatus(workflow)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}
                    >
                      {getStatusText(workflow.status)}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progression</span>
                    <span>{workflow.steps?.filter(s => s.status === 'done').length || 0} sur {workflow.steps?.length || 0} étapes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{
                        width: workflow.steps?.length 
                          ? `${Math.round(((workflow.steps.filter(s => s.status === 'done').length) / workflow.steps.length) * 100)}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2 mb-4">
                  {workflow.steps?.slice(0, 3).map((step) => (
                    <div
                      key={step.id}
                      onClick={() => toggleStatus(workflow, step.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${getStatusColor(step.status)}`}
                    >
                      <div className="flex items-center space-x-3">
                        {step.status === 'done' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : step.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-blue-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        )}
                        <span className="text-sm font-medium">{step.title}</span>
                      </div>
                      <span className="text-xs">{getStatusText(step.status)}</span>
                    </div>
                  ))}
                  
                  {(workflow.steps?.length || 0) > 3 && (
                    <div className="text-sm text-gray-500 text-center py-2">
                      +{(workflow.steps?.length || 0) - 3} autres étapes
                    </div>
                  )}
                </div>

                {/* Add Step */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={stepTitle}
                    onChange={(e) => setStepTitle(e.target.value)}
                    placeholder="Ajouter une étape..."
                    className="flex-1 px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => addStep(workflow.id)}
                    className="flex items-center space-x-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {workflows.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun workflow</h3>
              <p className="text-gray-500 mb-4">Commencez par créer votre premier workflow pour organiser vos processus.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un workflow</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
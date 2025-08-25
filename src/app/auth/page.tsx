"use client"
import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Mail, Lock, User } from "lucide-react"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    let error
    if (isLogin) {
      ;({ error } = await supabase.auth.signInWithPassword({ email, password }))
    } else {
      ;({ error } = await supabase.auth.signUp({ email, password }))
    }

    if (error) {
      alert(error.message)
    } else {
      router.push("/dashboard") // redirection après succès
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>

        <div className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex items-center border rounded-lg bg-gray-50 px-3">
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Nom complet"
                className="w-full p-3 bg-transparent focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center border rounded-lg bg-gray-50 px-3">
            <Mail className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-transparent focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center border rounded-lg bg-gray-50 px-3">
            <Lock className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 bg-transparent focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S’inscrire"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  )
}

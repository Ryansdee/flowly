import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/supabaseClient"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" })
  }

  try {
    // Récupérer le token de l'utilisateur depuis le header Authorization
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: "Non autorisé" })

    const token = authHeader.split(" ")[1]

    if (!token) return res.status(401).json({ error: "Token manquant" })

    // Vérifier l'utilisateur avec Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return res.status(401).json({ error: "Utilisateur non trouvé" })

    // Supprimer l'utilisateur
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    if (deleteError) return res.status(500).json({ error: deleteError.message })

    res.status(200).json({ message: "Compte supprimé avec succès" })
  } catch (error: any) {
    console.error("Delete account error:", error)
    res.status(500).json({ error: error.message || "Erreur serveur" })
  }
}

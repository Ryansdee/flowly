// src/app/api/recovery/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY! // ⚡ Service Role Key
)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email manquant" }, { status: 400 })

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/reset-password" // tester local
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: "Email envoyé !" })
}

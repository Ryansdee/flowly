import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authenticator } from "otplib";
import qrcode from "qrcode";

// Crée le client Supabase avec la clé serveur
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY! // clé serveur
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, token } = body;

    if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });

    if (!token) {
      // Génère secret TOTP
      const secret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(userId, "Flowly", secret);
      const qr = await qrcode.toDataURL(otpauth);

      // Sauvegarde le secret dans user_profiles
      const { error } = await supabaseServer
        .from("user_profiles")
        .update({ totp_secret: secret })
        .eq("id", userId);

      if (error) throw error;

      return NextResponse.json({ secret, otpauth, qr });
    } else {
      // Vérifie le token fourni
      const { data, error } = await supabaseServer
        .from("user_profiles")
        .select("totp_secret")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (!data || !data.totp_secret) {
        return NextResponse.json({ error: "Aucun secret TOTP trouvé pour cet utilisateur" }, { status: 400 });
      }

      const isValid = authenticator.check(token, data.totp_secret);
      if (!isValid) {
        return NextResponse.json({ error: "Code TOTP invalide" }, { status: 401 });
      }

      return NextResponse.json({ success: true });
    }
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

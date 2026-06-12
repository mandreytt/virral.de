# virral Academy

E-Learning-Plattform für Social-Media-Videokurse. Mitglieder registrieren
sich selbst, Kurszugänge werden manuell vom virral-Team freigeschaltet.

**Stack:** Next.js (App Router) · Supabase (Auth + Datenbank) · Bunny Stream (Video) · Tailwind CSS

## Features

- 🔐 Nutzermanagement: Registrierung, Login, Passwort-Reset, Rollen (Admin/Mitglied)
- 🎓 Kurse → Module → Video-Lektionen
- 🎬 Video-Upload direkt aus dem Admin-Bereich zu Bunny Stream (resumable, TUS)
- 🔒 Geschützte Wiedergabe über signierte Embed-Tokens – Links sind nicht teilbar
- ✅ Lernfortschritt pro Nutzer (abhakbare Lektionen, Fortschrittsbalken)
- 🛠 Admin-Bereich: Kurse/Lektionen verwalten, Nutzern Kurse freischalten

## Setup (einmalig, ~20 Minuten)

### 1. Supabase (Datenbank + Login) – kostenlos

1. Auf [supabase.com](https://supabase.com) ein Projekt anlegen (Region: **EU Central / Frankfurt** für DSGVO).
2. Im **SQL Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) ausführen.
3. Unter **Project Settings → API** die `URL` und den `anon public` Key kopieren → in `.env` eintragen (siehe `.env.example`).
4. Unter **Authentication → URL Configuration** die Site-URL auf `https://academy.virral.de` setzen (lokal: `http://localhost:3000`).
5. Eigenen Account unter `/registrieren` anlegen, E-Mail bestätigen, dann im SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'andre@virral.de';
   ```

### 2. Bunny Stream (Video-Hosting) – ab ~1 €/Monat + Traffic

1. Auf [bunny.net](https://bunny.net) registrieren → **Stream** → neue **Video Library** anlegen (Region: Falkenstein/EU).
2. In der Library unter **Security**:
   - **Embed View Token Authentication** aktivieren (wichtig – sonst sind Videos ungeschützt!)
   - Bei **Allowed Referrers** `academy.virral.de` eintragen.
3. Library-ID, API-Key und Token-Auth-Key in `.env` eintragen (siehe `.env.example`).

### 3. Vercel (Hosting) – kostenlos im Hobby-Plan

1. Repo auf [vercel.com](https://vercel.com) importieren.
   - Liegt die App in einem Unterordner, **Root Directory** auf `academy` setzen.
2. Alle Variablen aus `.env.example` als Environment Variables hinterlegen.
3. Deployen, dann unter **Settings → Domains** `academy.virral.de` hinzufügen und
   den angezeigten CNAME-Eintrag beim Domain-Anbieter von virral.de setzen.

## Lokal entwickeln

```bash
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev                   # http://localhost:3000
```

## Täglicher Workflow (als Admin)

1. **Admin → Kurse**: Kurs anlegen → Module anlegen → Lektionen anlegen.
2. Pro Lektion **„Video hochladen“** klicken – die Datei geht direkt zu Bunny,
   die Video-ID wird automatisch gespeichert. (Bunny transkodiert nach dem
   Upload einige Minuten, danach ist das Video abspielbar.)
3. Kurs in den Einstellungen auf **Veröffentlicht** stellen.
4. **Admin → Nutzer**: registrierten Nutzern den Kurs **freischalten**.

## Sicherheit

- Alle Datenbankzugriffe laufen über Supabase **Row Level Security** –
  Nutzer sehen nur Kurse, für die sie freigeschaltet sind.
- Videos werden ausschließlich über **signierte, ablaufende Embed-URLs**
  ausgeliefert; Bunny-API-Keys existieren nur serverseitig.

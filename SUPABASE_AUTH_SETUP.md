# Supabase Authentifizierungs-Setup

## Features
✅ Login & Registrierung  
✅ Passwort vergessen / Reset  
✅ Zwei-Faktor-Authentifizierung (2FA mit TOTP)  
✅ Session-Management  

## Supabase-Konfiguration

### 1. E-Mail-Einstellungen (für Passwort-Reset)

Gehe zu deinem Supabase-Dashboard:
1. **Authentication** → **Email Templates**
2. Bearbeite die **"Reset Password"** Vorlage
3. Stelle sicher, dass die Redirect-URL korrekt ist

### 2. URL-Konfiguration

In deinem Supabase-Dashboard:
1. **Authentication** → **URL Configuration**
2. Füge deine Site-URL hinzu (z.B. `http://localhost:5173` für Development)
3. Füge unter **Redirect URLs** hinzu:
   - `http://localhost:5173/reset-password`
   - Deine Production-URL wenn deployed

### 3. Multi-Factor Authentication (MFA) aktivieren

1. **Authentication** → **Policies**
2. Aktiviere **"Multi-Factor Authentication"**
3. Wähle **TOTP** als Methode

### 4. Email-Provider konfigurieren (Optional aber empfohlen)

Standardmäßig nutzt Supabase einen eingebauten Email-Service. Für Production solltest du einen eigenen konfigurieren:

1. **Project Settings** → **Auth** → **SMTP Settings**
2. Konfiguriere deinen SMTP-Server (z.B. SendGrid, Mailgun, AWS SES)

## Verwendung

### Passwort vergessen
1. Klicke auf "Passwort vergessen?" beim Login
2. Gib deine E-Mail-Adresse ein
3. Du erhältst eine E-Mail mit einem Reset-Link
4. Klicke auf den Link und setze ein neues Passwort

### Zwei-Faktor-Authentifizierung
1. Melde dich an
2. Klicke im Dashboard auf den "🔒 2FA" Button
3. Scanne den QR-Code mit einer Authenticator-App:
   - Google Authenticator
   - Authy
   - Microsoft Authenticator
   - 1Password
4. Gib den 6-stelligen Code zur Verifizierung ein
5. 2FA ist jetzt aktiviert!

### 2FA deaktivieren
1. Klicke im Dashboard auf "🔒 2FA"
2. Klicke auf "Deaktivieren"
3. Bestätige die Aktion

## Environment Variables

Stelle sicher, dass du eine `.env` Datei hast mit:

```env
VITE_SUPABASE_URL=deine_supabase_url
VITE_SUPABASE_ANON_KEY=dein_supabase_anon_key
```

## Sicherheitshinweise

- **Passwort-Mindestlänge**: 6 Zeichen (in Supabase konfigurierbar)
- **2FA**: Verwende eine sichere Authenticator-App
- **E-Mail-Verifizierung**: Kann in Supabase erzwungen werden
- **Session-Timeout**: Konfigurierbar in Supabase (Standard: 1 Woche)

## Troubleshooting

### E-Mails werden nicht gesendet
- Überprüfe die SMTP-Einstellungen in Supabase
- Prüfe deinen Spam-Ordner
- Stelle sicher, dass die E-Mail-Templates aktiviert sind

### 2FA funktioniert nicht
- Stelle sicher, dass MFA in Supabase aktiviert ist
- Die Uhrzeit auf deinem Gerät muss korrekt sein
- Verwende die neueste Version deiner Authenticator-App

### Reset-Link funktioniert nicht
- Überprüfe die Redirect-URLs in Supabase
- Der Link ist zeitlich begrenzt (Standard: 1 Stunde)
- Stelle sicher, dass du den neuesten Link verwendest

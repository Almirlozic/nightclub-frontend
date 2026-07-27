# NightClub Frontend

Dette er vores eksamensprojekt: en moderne frontend-webapplikation til en natklub bygget med Next.js.

## 🔥 Projektoversigt

NightClub Frontend er et visuel og interaktivt klientsideprojekt med fokus på events, reservationer og kontaktform.

Sider og funktioner:
- **Forside** med hero-sektion, featured events, galleri, musikplayer, video-sektion og nyhedsbrev.
- **Events-side** med event-liste, pagination og link til detaljer.
- **Detaljevisning** for hvert event med lineup, tidsplan og event-information.
- **Book a Table**-side med bordkort og reservation.
- **Contact Us**-side med kontaktformular.

## 🧱 Teknologi

- `Next.js 16.2.4` (App Router)
- `React 19.2.4`
- `Tailwind CSS 4`
- `Framer Motion` til animationer
- `react-icons` til ikoner

## 📁 Projektstruktur

Vigtige mapper og filer:
- `src/app/page.js` - startsiden
- `src/app/layout.js` - global layout, font og footer
- `src/app/(pages)/events/page.js` - eventliste
- `src/app/(pages)/BookTable/page.js` - book table side
- `src/app/(pages)/contact/page.js` - kontakt-side
- `src/app/(pages)/detailview/[slug]/page.js` - dynamiske event-detaljer
- `src/components/` - genanvendelige UI-komponenter
- `src/lib/api.js` - API-kald til backend

## ⚙️ Installation og kørsel

1. Installer afhængigheder:

```bash
npm install
```

2. Opret en `.env.local` med følgende (hvis dit backend kræver API-nøgle):

```bash
NIGHT_CLUB_API=din_api_noegle
```

3. Start udviklingsserveren:

```bash
npm run dev
```

4. Åbn i browser:

```bash
http://localhost:3000
```

## 🚀 Produktion

Byg projektet til produktion:

```bash
npm run build
```

Start derefter:

```bash
npm start
```

## 🔌 API og data

Frontend henter data fra backend via `src/lib/api.js`. Backend-serveren er sat til:

- `https://nightclub-api-dhqe.onrender.com`

Støttede endpoints:
- `/events`
- `/events/:slug`
- `/testimonials`
- `/gallery`
- `/comments`
- `/contact_messages`
- `/reservations`
- `/newsletters`

> Bemærk: `NIGHT_CLUB_API` kan være nødvendig for at indlæse events på `events`-siden.

## 🎨 Funktioner i UI

- Responsive navigation og mobilmenu
- Animerede navigationselementer med Framer Motion
- Dynamisk eventfiltrering og featured events
- Interaktivt bordkort til reservationer
- Kontaktformular med validering og succesbekræftelse
- Dynamiske event-detaljesider via slug

## 📌 Bemærkninger

- Koden er skrevet med fokus på frontendoplevelsen og visuelle komponenter.
- `src/app/page.js` skaber forsiden med en række sektioner og bruges til at vise events og medieindhold.
- `src/app/layout.js` konfigurerer global typografi og footer.

## 🧪 Test og videreudvikling

- Rediger komponenter i `src/components/`
- Tilføj nye events i backend eller via API
- Tilpas designs og layout i `src/app/globals.css`


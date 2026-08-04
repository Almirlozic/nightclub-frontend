// Henter CommentForm — formularen brugeren skriver en kommentar i (nederst på siden).
import CommentForm from "./CommentForm";

// Henter DeleteButton — en knap til at slette beskeder (kun vist for brugerens egne).
import DeleteButton from "./DeleteButton";

// Henter to API-funktioner fra vores eget bibliotek:
//   getComments        — henter kommentarer fra backend
//   getContactMessages — henter kontaktbeskeder fra backend
import { getComments, getContactMessages } from "@/lib/api";

// formatDate er en hjælpefunktion der konverterer en ISO-dato til en læsbar dansk dato.
// iso er en datostreng i formatet "2024-03-15T10:30:00Z" (standard maskinformat).
const formatDate = (iso) =>
  // new Date(iso) laver et JavaScript Date-objekt ud fra ISO-strengen.
  // .toLocaleDateString("da-DK", {...}) formaterer det til dansk, f.eks. "15. marts 2024".
  new Date(iso).toLocaleDateString("da-DK", {
    // day: "numeric" → vis dagen som et tal (f.eks. 15)
    day: "numeric",
    // month: "long" → vis måneden som fuldt navn (f.eks. "marts")
    month: "long",
    // year: "numeric" → vis årstallet som et tal (f.eks. 2024)
    year: "numeric",
  });

// AI hjalp med at kombinere kommentarer og beskeder til ét samlet feed med Promise.all

// Comments er en async server-komponent — den henter data fra serveren FØR siden vises.
// async tillader os at bruge await inde i funktionen.
const Comments = async ({ eventId }) => {

  // Promise.all([...]) henter BEGGE datasæt SAMTIDIGT (parallelt) — hurtigere end én ad gangen.
  // await venter på at begge er færdige inden vi fortsætter.
  // Array destructuring [ , ] pakker resultatet ud: første svar → rawComments, andet → rawMessages.
  const [rawComments, rawMessages] = await Promise.all([getComments(), getContactMessages()]);

  // Bygger én kombineret og sorteret liste af alle kommentarer og beskeder.
  const comments = [
    // Spread-operatoren ... "hælder" alle elementer fra rawComments ind i den nye liste.
    // .map() løber igennem hvert element og laver en kopi med to ekstra egenskaber:
    //   ...c         — behold alle eksisterende data fra kommentaren
    //   _key         — et unikt ID vi bygger selv (bruges af React til at holde styr på elementer)
    //   deletable    — false = denne kommentar kan IKKE slettes (den tilhører ikke brugeren)
    ...rawComments.map((c) => ({ ...c, _key: `comment-${c.id}`, deletable: false })),

    // Samme for beskeder — men deletable: true, fordi kontaktbeskeder tilhører brugeren selv.
    ...rawMessages.map((m) => ({ ...m, _key: `message-${m.id}`, deletable: true })),

  // .sort() sorterer den samlede liste efter dato — ældste kommentarer øverst.
  // (a, b) => new Date(a.date) - new Date(b.date):
  //   Negativt tal → a er ældre → a kommer først
  //   Positivt tal → b er ældre → b kommer først
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    // <section> er et semantisk HTML-element der markerer en tematisk sektion af siden.
    <section>

      {/* Overskrift der viser det samlede antal kommentarer + beskeder */}
      <h2 className="mb-10 text-2xl">{comments.length} Comments</h2>

      {/* relative på denne div er nødvendigt for at fade-overlayets absolute-position virker */}
      <div className="relative">

        {/* Scrollbar liste over alle kommentarer.
            max-h-105 begrænser højden — overflow-y-scroll tilføjer en lodret scrollbar.
            flex flex-col gap-6 stiller elementerne lodret med mellemrum. */}
        <ul className="comments-scroll flex flex-col gap-6 list-none m-0 p-0 max-h-105 overflow-y-scroll pr-4">

          {/* .map() løber igennem hvert kommentar-objekt og laver et listeelement */}
          {comments.map((comment) => (

            // key giver hvert listeelement et unikt ID — React kræver dette i lister
            <li key={comment._key} className="pb-6">

              {/* Øverste række: navn, "posted" og dato ved siden af hinanden */}
              <div className="flex items-center gap-2 mb-2">

                {/* Afsenderens navn — uppercase og med bogstavmellemrum (tracking-widest) */}
                <span className="font-bold uppercase tracking-widest text-sm">{comment.name}</span>

                {/* Statisk tekst "posted" i brandfarven */}
                <span className="text-sm font-medium text-(--color-brand)">posted</span>

                {/* <time> er et semantisk HTML-element til datoer.
                    dateTime={comment.date} er den maskinlæsbare ISO-dato (til søgemaskiner og skærmlæsere).
                    Inde i tagget vises den menneskelæsbare version fra formatDate(). */}
                <time dateTime={comment.date} className="text-sm font-medium text-(--color-brand)">
                  {formatDate(comment.date)}
                </time>

                {/* Vis kun slette-knappen hvis comment.deletable er true.
                    && er "short-circuit": højre side vises kun hvis venstre side er sand.
                    ml-auto skubber knappen helt til højre. */}
                {comment.deletable && <div className="ml-auto"><DeleteButton id={comment.id} /></div>}

              </div>

              {/* Kommentarens tekst — hvid med 70% gennemsigtighed.
                  line-clamp-3 afskærer teksten efter 3 linjer og viser "..." */}
              <p className="text-white/70 text-sm leading-relaxed m-0 line-clamp-3">{comment.content}</p>

            </li>
          ))}
        </ul>

        {/* Fade-overlay i bunden af listen — et visuelt hint om at der er mere at scrolle.
            pointer-events-none betyder at man KAN klikke igennem den (den blokerer ikke interaktion).
            absolute bottom-0: placeret i bunden af forælderelementet.
            bg-linear-to-t from-black to-transparent: sort i bunden, gennemsigtig øverst → gradienteffekt. */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black to-transparent" />

        {/* Lille tekst under listen der opfordrer til at scrolle */}
        <p className="mt-2 text-xs text-white/30 uppercase tracking-widest text-center">scroll for more</p>

      </div>

      {/* Gengiver kommentarformularen nedenunder listen */}
      <CommentForm eventId={eventId} />

    </section>
  );
};

// Gør Comments tilgængeligt for andre filer.
export default Comments;

// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Vi har brug for localStorage og events — det kræver en browser.
"use client";

// Henter to React-værktøjer:
//   useEffect — kører kode på bestemte tidspunkter (her: når komponenten vises)
//   useState  — gemmer og ændrer information (her: om brugeren ejer denne kommentar)
import { useEffect, useState } from "react";

// Henter useRouter fra Next.js — bruges til at genindlæse siden efter sletning.
import { useRouter } from "next/navigation";

// Henter deleteContactMessage fra vores API-bibliotek.
// Denne funktion sender en DELETE-anmodning til backend for at fjerne en besked.
import { deleteContactMessage } from "@/lib/api";

// getMyComments er en hjælpefunktion der henter brugerens egne kommentar-IDs fra localStorage.
// localStorage.getItem("myComments") henter den gemte JSON-tekst — eller null hvis intet er gemt.
// || "[]" er en fallback: giv en tom liste-streng hvis intet er gemt.
// JSON.parse(...) konverterer JSON-teksten til et rigtigt JavaScript-array, f.eks. [3, 7, 12].
const getMyComments = () => JSON.parse(localStorage.getItem("myComments") || "[]");

// AI hjalp med at vise delete-knappen kun på kommentarer man selv har oprettet,
// ved at tjekke localStorage mod kommentarens id.

// DeleteButton modtager ét prop: id — det unikke ID på den kommentar knappen tilhører.
// Komponenten viser KUN knappen hvis den aktuelle bruger er den der oprettede kommentaren.
const DeleteButton = ({ id }) => {

  // isOwn er en tilstand der starter som false (vi ved endnu ikke om brugeren ejer kommentaren).
  // setIsOwn bruges til at opdatere den.
  const [isOwn, setIsOwn] = useState(false);

  // router bruges til at genindlæse siden efter sletning.
  const router = useRouter();

  // useEffect kører kode efter komponenten er vist i browseren.
  // Vi tjekker localStorage her og ikke direkte i komponenten,
  // fordi localStorage ikke findes på serveren — kun i browseren.
  useEffect(() => {
    // getMyComments() henter arrayet af brugerens egne IDs fra localStorage.
    // .includes(id) tjekker om det aktuelle kommentar-ID er i listen.
    // Resultatet (true/false) gemmes i isOwn-tilstanden.
    setIsOwn(getMyComments().includes(id));
  // [id] betyder: kør effekten igen hvis id-prop'en ændrer sig.
  }, [id]);

  // Tidlig retur: hvis brugeren IKKE ejer denne kommentar, vis ingenting (null = intet HTML).
  // Det er det der gør at DELETE-knappen er usynlig for alle andre end ejeren.
  if (!isOwn) return null;

  // handleDelete kører når brugeren klikker DELETE.
  // async fordi vi bruger await til at vente på API-kaldet.
  const handleDelete = async () => {

    // Sender en sletningsanmodning til backend med kommentarens ID.
    // await venter på at sletningen er bekræftet af serveren.
    await deleteContactMessage(id);

    // Opdaterer brugerens localStorage-liste: fjerner det slettede ID.
    // getMyComments() henter den nuværende liste.
    // .filter((i) => i !== id) laver en ny liste UDEN det slettede ID.
    //   filter() løber igennem hvert element i og beholder kun dem der IKKE er lig id.
    // JSON.stringify(...) konverterer listen tilbage til JSON-tekst.
    // localStorage.setItem(...) gemmer den opdaterede liste.
    localStorage.setItem("myComments", JSON.stringify(getMyComments().filter((i) => i !== id)));

    // Genindlæser server-data så den slettede kommentar forsvinder fra listen.
    router.refresh();
  };

  return (
    // En simpel knap — kun synlig for ejeren (se "if (!isOwn) return null" ovenfor).
    //   mt-2              — lille luft over knappen
    //   text-xs uppercase — lille tekst med store bogstaver
    //   tracking-widest   — bogstaverne er spredt ud
    //   text-white/70     — hvid tekst med 70% gennemsigtighed (dæmpet)
    //   hover:text-(--color-brand) — ved hover: skift til brandfarven
    //   transition-colors — farveændringen sker blødt (med CSS transition)
    //   cursor-pointer    — viser en hånd-cursor ved hover
    <button
      onClick={handleDelete}
      className="mt-2 text-xs uppercase tracking-widest text-white/70 hover:text-(--color-brand) transition-colors cursor-pointer"
    >
      DELETE
    </button>
  );
};

// Gør DeleteButton tilgængeligt for andre filer — bruges af Comments.jsx.
export default DeleteButton;

// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Vi bruger useState, events og localStorage — alt det kræver en browser.
"use client";

// Henter to React-værktøjer:
//   useRef   — giver direkte adgang til et HTML-element (her: <form>)
//   useState — lader os gemme og opdatere formulardata
import { useRef, useState } from "react";

// Henter useRouter fra Next.js — lader os styre navigation og genindlæse siden programmatisk.
import { useRouter } from "next/navigation";

// Henter vores custom knap-komponent BtnNormal.
import BtnNormal from "./BtnNormal";

// Henter postComment fra vores API-bibliotek.
// Denne funktion sender formulardata til backend og gemmer det som en ny kommentar.
import { postComment } from "@/lib/api";

// inputClass er en variabel der gemmer en lang CSS-klasse-streng.
// Vi bruger den på begge inputfelter for at undgå at gentage den lange streng to gange.
//   bg-transparent          — ingen baggrundfarve (gennemsigtig)
//   border border-white/30  — tynd hvid kant med 30% gennemsigtighed
//   px-4 py-3               — indre luft (padding) vandret og lodret
//   text-sm                 — lille skriftstørrelse
//   placeholder:text-white/40 — placeholder-teksten er hvid med 40% gennemsigtighed
//   focus:outline-none      — fjern browserens standard blå fokus-ring
//   focus:border-(--color-brand) — ved fokus: kant skifter til brandfarven
const inputClass = "flex-1 bg-transparent border border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-(--color-brand)";

// AI hjalp med at bruge router.refresh() til at genindlæse server-data efter submit og
// localStorage til at holde styr på hvilke kommentarer der tilhører brugeren.

// CommentForm er komponenten med hele formularen — navn, email, kommentar og send-knap.
const CommentForm = ({ eventId }) => {

  // form er et objekt der indeholder de tre formularfelters værdier.
  // useState starter dem alle som tomme strenge "".
  // setForm er funktionen vi kalder for at opdatere dem.
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  // formRef er en direkte reference til <form>-HTML-elementet.
  // Vi bruger den til at kalde .requestSubmit() på formularen (se BtnNormal-knappen).
  const formRef = useRef(null);

  // router giver os adgang til Next.js routeren.
  // Vi bruger router.refresh() til at hente friske data fra serveren efter submit.
  const router = useRouter();

  // handleChange kører hver gang brugeren skriver i et inputfelt.
  // e er input-eventet som browseren sender automatisk.
  const handleChange = (e) => setForm({
    // ...form beholder alle eksisterende feltværdier (spread-operator).
    ...form,
    // [e.target.name] er "computed property name":
    //   e.target.name er inputfeltets name-attribut, f.eks. "name", "email" eller "content".
    //   Vi bruger det som nøgle i objektet, så kun det ene felt opdateres.
    // e.target.value er den tekst brugeren har skrevet i feltet.
    [e.target.name]: e.target.value
  });

  // handleSubmit kører når formularen sendes.
  // async fordi vi bruger await til at vente på API-kaldet.
  const handleSubmit = async (e) => {

    // e.preventDefault() forhindrer browserens standard formular-adfærd,
    // som ellers ville genindlæse hele siden ved submit.
    e.preventDefault();

    // Sender formulardataen til backend via postComment.
    // ...form spreder alle tre felter (name, email, content) ind i objektet.
    // date: new Date().toISOString() tilføjer den aktuelle dato i ISO-format.
    // eventId knytter kommentaren til det aktuelle event.
    // await venter på at API-kaldet er færdigt og gemmer svaret i res.
    const res = await postComment({ ...form, date: new Date().toISOString(), eventId });

    // res er et HTTP-response-objekt. .json() læser kroppen og konverterer den
    // fra JSON-tekst til et JavaScript-objekt. await venter på det.
    const data = await res.json();

    // localStorage er browserens indbyggede nøgle-værdi-lager — gemmer data mellem sidebesøg.
    // localStorage.getItem("myComments") henter den gemte liste (som JSON-tekst) eller null.
    // || "[]" er en fallback: hvis intet er gemt, brug en tom liste-streng.
    // JSON.parse(...) konverterer JSON-teksten til et rigtigt JavaScript-array.
    const mine = JSON.parse(localStorage.getItem("myComments") || "[]");

    // Tilføjer den nye kommentars ID til brugerens liste og gemmer den opdaterede liste.
    // [...mine, data.id] laver et nyt array med alle tidligere IDs + det nye.
    // JSON.stringify(...) konverterer arrayet tilbage til JSON-tekst (localStorage gemmer kun tekst).
    localStorage.setItem("myComments", JSON.stringify([...mine, data.id]));

    // Nulstil formularen ved at sætte alle felter til tomme strenge igen.
    setForm({ name: "", email: "", content: "" });

    // router.refresh() beder Next.js om at genhente server-data og gengive siden.
    // Det gør at den nye kommentar dukker op i listen uden en fuld side-genindlæsning.
    router.refresh();
  };

  return (
    // <form> er HTML-formularelementet.
    // ref={formRef} tilknytter vores ref så vi kan tilgå elementet direkte.
    // onSubmit={handleSubmit} kører handleSubmit når formularen sendes.
    // mt-16 giver luft (margin-top) ovenfor formularen.
    <form ref={formRef} onSubmit={handleSubmit} className="mt-16">

      {/* Overskrift over formularen — uppercase og med bogstavmellemrum */}
      <h3 className="text-xl font-bold tracking-widest uppercase mb-6">Leave a Comment</h3>

      {/* Række med navn og email side om side.
          flex-col på mobil (lodret) → sm:flex-row på større skærme (vandret). */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">

        {/* Navnefelt */}
        <input
          // type="text" = almindeligt tekstfelt
          type="text"
          // name="name" bruges af handleChange til at vide hvilket felt der opdateres
          name="name"
          placeholder="Your Name"
          // value={form.name} gør feltet "kontrolleret" — React styrer hvad der vises
          value={form.name}
          // onChange={handleChange} kører ved hvert tastetryk
          onChange={handleChange}
          // required betyder at feltet SKAL udfyldes — browseren tjekker det ved submit
          required
          className={inputClass}
        />

        {/* Email-felt — type="email" giver browseren lov til at validere email-formatet */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Kommentarfelt — <textarea> er et stort fritekst-inputfelt (til modsætning fra <input>).
          rows={8} sætter starthøjden til 8 linjer.
          resize-y tillader kun lodret størrelsesjustering (brugeren kan trække det højere). */}
      <textarea
        name="content"
        placeholder="Your Comment"
        value={form.content}
        onChange={handleChange}
        required
        rows={8}
        className="w-full bg-transparent border border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-(--color-brand) resize-y mb-4"
      />

      {/* Højrestiller send-knappen med flex justify-end */}
      <div className="flex justify-end">
        {/* BtnNormal er vores custom knap-komponent.
            title="Submit" er teksten på knappen.
            onClick kalder formRef.current?.requestSubmit():
              formRef.current er <form>-elementet.
              requestSubmit() udløser formularens onSubmit-event (inkl. browser-validering).
              Det er bedre end at kalde handleSubmit direkte fordi det tjekker "required"-felterne. */}
        <BtnNormal title="Submit" onClick={() => formRef.current?.requestSubmit()} />
      </div>

    </form>
  );
};

// Gør CommentForm tilgængeligt for andre filer — bruges af Comments.jsx.
export default CommentForm;

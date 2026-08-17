import type { Language } from "@/types";

export type TermsSection = {
  title: Record<Language, string>;
  body: Record<Language, string[]>;
};

export const termsMeta = {
  title: {
    pl: "Regulamin sklepu internetowego",
    en: "Online shop terms",
  },
  updated: {
    pl: "Data opublikowania: 15.08.2024 · Ostatnia aktualizacja: 15.08.2024",
    en: "Published: 15 Aug 2024 · Last updated: 15 Aug 2024",
  },
  intro: {
    pl: "Regulamin określa zasady korzystania ze strony paliceramics.com oraz warunki sprzedaży ceramiki i uczestnictwa w warsztatach.",
    en: "These terms govern use of paliceramics.com and the conditions for buying ceramics and joining workshops.",
  },
};

export const termsSections: TermsSection[] = [
  {
    title: { pl: "1. Postanowienia ogólne", en: "1. General provisions" },
    body: {
      pl: [
        "Niniejszy regulamin określa zasady korzystania ze strony internetowej paliceramics.com oraz warunki sprzedaży ceramiki i uczestnictwa w warsztatach.",
        "Sprzedawca: Palina Fedarovich, Sękocińska 11A, 02-313 Warszawa, Polska, email: palipali.ceramic@gmail.com",
        "Klient — każda osoba fizyczna, która dokonuje zakupu produktów ceramicznych lub rejestracji na warsztat.",
        "Klient przyjmuje regulamin poprzez złożenie zamówienia lub zapisanie się na warsztat.",
      ],
      en: [
        "These terms define the rules for using paliceramics.com and the conditions for selling ceramics and workshop participation.",
        "Seller: Palina Fedarovich, Sękocińska 11A, 02-313 Warsaw, Poland, email: palipali.ceramic@gmail.com",
        "Customer — any natural person who purchases ceramic products or registers for a workshop.",
        "The customer accepts these terms by placing an order or signing up for a workshop.",
      ],
    },
  },
  {
    title: { pl: "2. Produkty ceramiczne", en: "2. Ceramic products" },
    body: {
      pl: [
        "Produkty są sprzedawane w stanie prezentowanym na zdjęciach. Ceramika jest produktem rękodzielniczym — możliwe są drobne różnice w kolorze, odcieniu i kształcie.",
        "Gwarancja obejmuje wady materiałowe (pęknięcia, znaczące wady gliny lub glazury). Zwykłe ślady użytkowania i naturalne różnice w barwie nie są uważane za wadę.",
        "Prawo do zwrotu: do 14 dni od dostarczenia produktu (jeśli produkt nie był używany). Klient pokrywa koszt zwrotu.",
        "Procedura zwrotu: powiadom nas emailem w ciągu 14 dni, wyślij produkt zwrotem; po otrzymaniu i sprawdzeniu zwrócimy pieniądze minus koszt wysyłki.",
        "Produkty zniszczone w wyniku użytkowania nie podlegają zwrotowi.",
      ],
      en: [
        "Products are sold as shown in photos. As handmade ceramics, slight differences in colour, shade, and shape are possible.",
        "The warranty covers material defects (cracks, significant clay or glaze flaws). Normal use marks and natural colour variation are not considered defects.",
        "Right of withdrawal: within 14 days of delivery if the product was not used. The customer covers return shipping.",
        "Return procedure: email us within 14 days, send the product back; after inspection we refund the purchase price minus outbound shipping.",
        "Products damaged through use are not eligible for return.",
      ],
    },
  },
  {
    title: { pl: "3. Warsztaty", en: "3. Workshops" },
    body: {
      pl: [
        "Zapis możliwy wyłącznie przez stronę internetową lub kontakt bezpośredni. Wymagane dane: imię, nazwisko, email, telefon, liczba uczestników. Uczestnik musi być pełnoletni lub mieć zgodę rodzica.",
        "Zaliczka: 50% ceny warsztatu wymagana przy zapisie; potwierdza miejsce. Pozostałe 50% płatne w dniu warsztatu lub wcześniej.",
        "Metody płatności zaliczki: przelew bankowy, PayPal / Revolut (jeśli dostępne na stronie).",
        "Po wpłaceniu zaliczki otrzymasz email z potwierdzeniem i szczegółami (godzina, adres, co przynieść).",
        "Anulowanie przez klienta: 7+ dni przed warsztatem — zwrot 100% zaliczki; 3–7 dni — zwrot 50%; mniej niż 3 dni — brak zwrotu. Zwroty w ciągu 7 dni roboczych na to samo konto.",
        "Anulowanie przez Sprzedawcę: w razie siły wyższej Sprzedawca może odwołać warsztat — pełny zwrot zaliczki bez opóźnień.",
        "Zmiany terminu lub godziny komunikowane co najmniej 3 dni wcześniej; jeśli zmiana ci nie odpowiada — pełny zwrot zaliczki.",
        "Uczestnicy biorą udział na własne ryzyko. Sprzedawca nie odpowiada za drobne urazy, zabrudzenie ubrań gliną ani uszkodzenie rzeczy osobistych — z wyjątkiem urazów wynikających z zaniedbania bezpieczeństwa przez Sprzedawcę.",
        "Sprzedawca może fotografować warsztat do celów promocji. Jeśli nie chcesz być na zdjęciach — powiedz to na początku zajęć.",
        "Liczba miejsc jest ograniczona — obowiązuje zasada „kto pierwszy, ten lepszy”.",
      ],
      en: [
        "Registration is only via the website or direct contact. Required details: first name, surname, email, phone, number of participants. Participants must be adults or have parental consent.",
        "Deposit: 50% of the workshop fee is required when booking and reserves a place. The remaining 50% is due on or before the workshop day.",
        "Deposit payment methods: bank transfer, PayPal / Revolut (where available on the site).",
        "After paying the deposit you will receive a confirmation email with details (time, address, what to bring).",
        "Cancellation by customer: 7+ days before — 100% deposit refund; 3–7 days — 50% refund; less than 3 days — no refund. Refunds within 7 business days to the same account.",
        "Cancellation by Seller: in case of force majeure the Seller may cancel — full deposit refund without delay.",
        "Schedule changes communicated at least 3 days in advance; if a change does not suit you — full deposit refund.",
        "Participants take part at their own risk. The Seller is not liable for minor injuries, clay stains, or damage to personal belongings — except injuries caused by the Seller’s failure to ensure safety.",
        "The Seller may photograph workshops for promotion. Tell us at the start if you do not wish to appear in photos.",
        "Places are limited — first come, first served.",
      ],
    },
  },
  {
    title: {
      pl: "4. Dane osobowe podczas zapisu na warsztat",
      en: "4. Personal data when registering for a workshop",
    },
    body: {
      pl: [
        "Dane zbierane przy zapisie (imię, nazwisko, email, telefon, liczba uczestników) służą wyłącznie do: potwierdzenia uczestnictwa, wysłania informacji o warsztacie, przypomnienia dzień wcześniej, kontaktu w razie zmian lub anulowania oraz wystawienia paragonu (jeśli wymagane).",
        "Dane nie będą sprzedawane osobom trzecim ani udostępniane w celach marketingowych bez twojej zgody.",
        "Więcej informacji o ochronie danych znajduje się w Polityce Prywatności (/privacy).",
      ],
      en: [
        "Data collected when registering (name, email, phone, number of participants) is used only to: confirm participation, send workshop information, send a reminder the day before, contact you about changes or cancellation, and issue a receipt if required.",
        "Data will not be sold to third parties or used for marketing without your consent.",
        "More information on data protection is in our Privacy Policy (/privacy).",
      ],
    },
  },
  {
    title: { pl: "5. Dostarczanie produktów", en: "5. Product delivery" },
    body: {
      pl: [
        "Produkty wysyłane w ciągu 5 dni roboczych od opłacenia pełnej kwoty (gdy produkt jest dostępny). Produkty na zamówienie mogą być wysyłane dłużej — termin podany przy zamówieniu.",
        "Koszt wysyłki paczkomatem InPost: 18,49 PLN.",
        "Od momentu wysłania ryzyko przechodzi na klienta. Paczkę należy sprawdzić w obecności kuriera i zgłosić uszkodzenia od razu.",
        "Reklamacja uszkodzenia: zgłoszenie do 14 dni od dostarczenia wraz ze zdjęciami. Sprzedawca wyśle zamianę lub zwróci pieniądze.",
        "W razie opóźnień skontaktujemy się emailem. Sprzedawca nie odpowiada za opóźnienia kuriera poza swoją kontrolą.",
      ],
      en: [
        "Products ship within 5 business days of full payment (when in stock). Made-to-order pieces may take longer — the deadline is stated when ordering.",
        "InPost parcel locker shipping: PLN 18.49.",
        "Risk passes to the customer once the parcel is dispatched. Check the parcel with the courier and report damage immediately.",
        "Damage claims: report within 14 days of delivery with photos. The Seller will send a replacement or refund.",
        "If shipping is delayed we will email you. The Seller is not liable for courier delays beyond its control.",
      ],
    },
  },
  {
    title: { pl: "6. Płatności", en: "6. Payments" },
    body: {
      pl: [
        "Dostępne sposoby płatności: przelew bankowy, PayPal / Revolut (jeśli dostępne), gotówka w dniu warsztatu (jeśli dotyczy).",
        "Po zaksięgowaniu wpłaty otrzymasz wiadomość email — może to potrwać do 2 godzin roboczych.",
      ],
      en: [
        "Available payment methods: bank transfer, PayPal / Revolut (where available), cash on the workshop day (where applicable).",
        "After we register your payment you will receive an email — this may take up to 2 business hours.",
      ],
    },
  },
  {
    title: { pl: "7. Odpowiedzialność", en: "7. Liability" },
    body: {
      pl: [
        "Sprzedawca nie odpowiada za pośrednie straty, opóźnienia spowodowane siłą wyższą, błędy w opisach gdy klient nie podał dokładnych informacji ani za uszkodzenia w transporcie poza przypadkami opisanymi wyżej.",
        "Maksymalna odpowiedzialność Sprzedawcy równa jest wartości danej transakcji.",
      ],
      en: [
        "The Seller is not liable for indirect losses, delays caused by force majeure, description errors where the customer did not provide accurate information, or transport damage except as described above.",
        "The Seller’s maximum liability equals the value of the given transaction.",
      ],
    },
  },
  {
    title: { pl: "8. Rozwiązywanie sporów", en: "8. Dispute resolution" },
    body: {
      pl: [
        "Sprawy rozpatrywane są zgodnie z prawem polskim.",
        "Klienci mają dostęp do platformy ODR: https://ec.europa.eu/consumers/odr",
        "Sąd właściwy: Sąd Powszechny właściwy dla siedziby Sprzedawcy w Warszawie.",
        "Przed postępowaniem sądowym staramy się rozwiązać spór polubownie drogą email.",
      ],
      en: [
        "Matters are governed by Polish law.",
        "Customers may use the EU ODR platform: https://ec.europa.eu/consumers/odr",
        "Competent court: the court of general jurisdiction for the Seller’s seat in Warsaw.",
        "Before court proceedings we aim to resolve disputes amicably by email.",
      ],
    },
  },
  {
    title: { pl: "9. Postanowienia końcowe", en: "9. Final provisions" },
    body: {
      pl: [
        "Sprzedawca może zmienić regulamin — zmiany obowiązują od dnia opublikowania na stronie. Klient powinien zapoznać się z aktualnymi warunkami.",
        "Jeśli część regulaminu jest nieważna, pozostałe postanowienia pozostają w mocy.",
        "Regulamin nie stanowi oferty handlowej w rozumieniu Kodeksu Cywilnego. Ofertą jest konkretne zamówienie lub zapis na warsztat.",
        "Regulamin wchodzi w życie z dniem publikacji na stronie.",
      ],
      en: [
        "The Seller may amend these terms — changes apply from the date of publication on the site. Customers should read the current version.",
        "If any part of these terms is invalid, the remaining provisions stay in force.",
        "These terms are not a commercial offer under the Civil Code. A specific order or workshop registration constitutes the offer.",
        "These terms take effect on the date of publication on the site.",
      ],
    },
  },
];

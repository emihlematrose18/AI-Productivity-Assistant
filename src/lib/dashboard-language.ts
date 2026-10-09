export const LANGUAGES = [
  { value: "English", label: "English", code: "en" },
  { value: "isiXhosa", label: "isiXhosa", code: "xh" },
  { value: "isiZulu", label: "isiZulu", code: "zu" },
  { value: "Afrikaans", label: "Afrikaans", code: "af" },
] as const;

const english = {
  language: "Language", morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening",
  welcome: "How can AutismCare AI support you today?", subtitle: "Parent & caregiver support",
  nav: ["Dashboard", "AI Chatbot", "Signs & Concerns", "My Child's Concerns", "AI Task Planner", "AI Research Assistant", "Saved Information", "Settings", "About & Founder"],
  descriptions: ["Ask questions and receive supportive, easy-to-understand information.", "Explore developmental and behavioural signs you may have noticed.", "Create routines, activities and tasks for your child's day.", "Research autism-related topics and receive simplified explanations."],
  actions: ["Open Chatbot", "Explore Signs", "Create a Plan", "Start Research"],
  tasks: "Today's Tasks", done: "done", emptyTasks: "No tasks yet. Generate a routine in the AI Task Planner and add it to today.", plan: "Plan the day",
  concerns: "Recent Concerns", emptyConcerns: "No concerns saved yet.", allConcerns: "View All Concerns", research: "Recent research",
  responsible: "Responsible AI", noticeTitle: "Responsible AI Notice",
  notice: "AutismCare AI provides general educational and supportive information. It does not diagnose autism and does not replace advice from qualified healthcare, developmental, educational or therapeutic professionals.",
  openMenu: "Open menu", closeMenu: "Close menu",
  founder: "Created by Mihle Matrose",
  samples: ["Morning routine", "School preparation", "Afternoon activity", "Evening routine", "Difficulty with changes in routine", "Sensitive to loud noises", "Communication difficulties", "Sensory processing and autism"],
};

type DashboardCopy = typeof english;

const translations: Record<string, DashboardCopy> = {
  English: english,
  isiXhosa: {
    language: "Ulwimi", morning: "Molo kusasa", afternoon: "Molo emini", evening: "Molo ngokuhlwa",
    welcome: "Ingakunceda njani i-AutismCare AI namhlanje?", subtitle: "Inkxaso kubazali nakubanakekeli",
    nav: ["Iphepha lasekhaya", "Incoko ne-AI", "Iimpawu neenkxalabo", "Iinkxalabo ngomntwana wam", "Isicwangcisi semisebenzi se-AI", "Umncedisi wophando we-AI", "Ulwazi olugciniweyo", "Iisetingi", "Malunga nomsunguli"],
    descriptions: ["Buza imibuzo uze ufumane ulwazi oluxhasayo nolulula ukuluqonda.", "Jonga iimpawu zophuhliso nezokuziphatha osenokuba uziqaphele.", "Cwangcisa iinkqubo zemihla ngemihla, izinto zokwenza nemisebenzi yomntwana wakho.", "Phanda ngezihloko ezinxulumene ne-autism uze ufumane iinkcazelo ezilula."],
    actions: ["Qala incoko", "Jonga iimpawu", "Yenza isicwangciso", "Qala uphando"],
    tasks: "Imisebenzi yanamhlanje", done: "igqityiwe", emptyTasks: "Akukho misebenzi okwangoku. Yenza inkqubo kwisicwangcisi semisebenzi se-AI uze uyifake kusuku lwanamhlanje.", plan: "Cwangcisa usuku",
    concerns: "Iinkxalabo zakutshanje", emptyConcerns: "Akukho nkxalabo zigciniweyo okwangoku.", allConcerns: "Jonga zonke iinkxalabo", research: "Uphando lwakutshanje",
    responsible: "I-AI enoxanduva", noticeTitle: "Isaziso nge-AI enoxanduva",
    notice: "I-AutismCare AI inika ulwazi ngokubanzi lokufundisa nokuxhasa. Ayixilongi i-autism kwaye ayithathi indawo yeengcebiso zeengcali eziqeqeshiweyo zezempilo, zophuhliso, zemfundo okanye zonyango.",
    openMenu: "Vula imenyu", closeMenu: "Vala imenyu",
    founder: "Yadalwa nguMihle Matrose",
    samples: ["Inkqubo yasekuseni", "Ukulungiselela isikolo", "Umsebenzi wasemva kwemini", "Inkqubo yangokuhlwa", "Ubunzima xa kutshintsha inkqubo yemihla ngemihla", "Uvakalelo kwizandi ezingxolayo", "Ubunzima bokunxibelelana", "Ukusetyenzwa kolwazi lwezivamvo ne-autism"],
  },
  isiZulu: {
    language: "Ulimi", morning: "Sawubona ekuseni", afternoon: "Sawubona emini", evening: "Sawubona kusihlwa",
    welcome: "I-AutismCare AI ingakusiza kanjani namuhla?", subtitle: "Ukusekela abazali nabanakekeli",
    nav: ["Ikhasi lasekhaya", "Ingxoxo ne-AI", "Izimpawu nokukhathazeka", "Ukukhathazeka ngengane yami", "Umhleli wemisebenzi we-AI", "Umsizi wocwaningo we-AI", "Ulwazi olugciniwe", "Izilungiselelo", "Mayelana nomsunguli"],
    descriptions: ["Buza imibuzo uthole ulwazi olusekelayo nolulula ukuluqonda.", "Hlola izimpawu zokukhula nezokuziphatha okungenzeka uziqaphelile.", "Hlela izinqubo zansuku zonke, izinto zokwenza nemisebenzi yosuku lwengane yakho.", "Cwaninga ngezihloko ezihlobene ne-autism uthole izincazelo ezilula."],
    actions: ["Qala ingxoxo", "Hlola izimpawu", "Yenza uhlelo", "Qala ucwaningo"],
    tasks: "Imisebenzi yanamuhla", done: "iqediwe", emptyTasks: "Ayikho imisebenzi okwamanje. Yenza uhlelo kumhleli wemisebenzi we-AI bese ulufaka osukwini lwanamuhla.", plan: "Hlela usuku",
    concerns: "Ukukhathazeka kwakamuva", emptyConcerns: "Akukho ukukhathazeka okugciniwe okwamanje.", allConcerns: "Buka konke ukukhathazeka", research: "Ucwaningo lwakamuva",
    responsible: "I-AI enomthwalo wemfanelo", noticeTitle: "Isaziso nge-AI enomthwalo wemfanelo",
    notice: "I-AutismCare AI inikeza ulwazi olujwayelekile lokufundisa nokusekela. Ayixilongi i-autism futhi ayithathi indawo yezeluleko zochwepheshe abaqeqeshiwe bezempilo, zokukhula, zemfundo noma zokwelapha.",
    openMenu: "Vula imenyu", closeMenu: "Vala imenyu",
    founder: "Idalwe uMihle Matrose",
    samples: ["Uhlelo lwasekuseni", "Ukulungiselela isikole", "Umsebenzi wantambama", "Uhlelo lwakusihlwa", "Ubunzima lapho kushintsha uhlelo lwansuku zonke", "Ukuzwela emisindweni ephezulu", "Ubunzima bokuxhumana", "Ukucubungula ulwazi lwezinzwa ne-autism"],
  },
  Afrikaans: {
    language: "Taal", morning: "Goeiemôre", afternoon: "Goeiemiddag", evening: "Goeienaand",
    welcome: "Hoe kan AutismCare AI jou vandag ondersteun?", subtitle: "Ondersteuning vir ouers en versorgers",
    nav: ["Tuisblad", "KI-kletsbot", "Tekens en bekommernisse", "Bekommernisse oor my kind", "KI-taakbeplanner", "KI-navorsingsassistent", "Gestoorde inligting", "Instellings", "Meer oor die stigter"],
    descriptions: ["Vra vrae en ontvang ondersteunende inligting wat maklik is om te verstaan.", "Verken ontwikkelings- en gedragstekens wat jy dalk opgemerk het.", "Skep roetines, aktiwiteite en take vir jou kind se dag.", "Doen navorsing oor outismeverwante onderwerpe en ontvang eenvoudige verduidelikings."],
    actions: ["Maak kletsbot oop", "Verken tekens", "Skep ’n plan", "Begin navorsing"],
    tasks: "Vandag se take", done: "voltooi", emptyTasks: "Nog geen take nie. Skep ’n roetine in die KI-taakbeplanner en voeg dit by vandag.", plan: "Beplan die dag",
    concerns: "Onlangse bekommernisse", emptyConcerns: "Nog geen bekommernisse gestoor nie.", allConcerns: "Bekyk alle bekommernisse", research: "Onlangse navorsing",
    responsible: "Verantwoordelike KI", noticeTitle: "Kennisgewing oor verantwoordelike KI",
    notice: "AutismCare AI verskaf algemene opvoedkundige en ondersteunende inligting. Dit diagnoseer nie outisme nie en vervang nie advies van gekwalifiseerde gesondheids-, ontwikkelings-, opvoedkundige of terapeutiese professionele persone nie.",
    openMenu: "Maak kieslys oop", closeMenu: "Maak kieslys toe",
    founder: "Geskep deur Mihle Matrose",
    samples: ["Oggendroetine", "Voorbereiding vir skool", "Middagaktiwiteit", "Aandroetine", "Sukkel met veranderinge in roetine", "Sensitief vir harde geluide", "Kommunikasieprobleme", "Sensoriese verwerking en outisme"],
  },
};

export function dashboardCopy(language: string): DashboardCopy {
  return translations[language] ?? english;
}

// Translate only known starter text; never rewrite a parent's own saved words.
export function dashboardSample(text: string, copy: DashboardCopy): string {
  const index = english.samples.indexOf(text);
  return index < 0 ? text : copy.samples[index] ?? text;
}

// Editorial candidate register. No commercial link is enabled before written approval.
export type Partner = { name:string; program:string; guides:string[]; de:string; sr:string; approved:boolean; trackingUrl:string|null };
export const partners: Partner[] = [
 {name:"carVertical",program:"https://www.carvertical.com/de/affiliate-program",guides:["gebrauchtwagen-anzahlung","fahrzeugpapiere"],de:"Ein Fahrzeughistorienbericht kann zusätzliche Hinweise liefern, ersetzt aber keine unabhängige Prüfung. Auch fehlende Einträge sind kein Nachweis für Unfallfreiheit.",sr:"Izveštaj o istoriji vozila može dopuniti podatke, ali ne zamenjuje nezavisni pregled. Izostanak zapisa ne dokazuje da vozilo nije oštećeno.",approved:false,trackingUrl:null},
 {name:"Brevo",program:"https://www.brevo.com/de/partners/affiliates/",guides:["kundenanfragen","email-formular-crm"],de:"CRM und transaktionale E-Mails können Anfragen nachvollziehbar organisieren. Vor Einsatz Datenumfang, Zugriffsrechte und Vertragsbedingungen prüfen.",sr:"CRM i transakcioni mejlovi pomažu evidenciji upita. Pre primene proveriti obim podataka, pristup i ugovorne uslove.",approved:false,trackingUrl:null},
 {name:"Make",program:"https://www.make.com/en/affiliate",guides:["email-formular-crm","ki-buero"],de:"Visuelle Automatisierung eignet sich für wiederkehrende, klar definierte Abläufe. Wichtige Antworten und Zahlungen brauchen weiterhin Freigabe.",sr:"Vizuelna automatizacija pomaže ponovljivim postupcima. Važne odgovore i plaćanja i dalje treba odobriti.",approved:true,trackingUrl:"https://www.make.com/en/register?pc=danini"},
 {name:"Hostinger",program:"https://www.hostinger.com/affiliates",guides:["ki-buero"],de:"Hosting für eigene Webprojekte: vor einer Entscheidung Laufzeit, Verlängerungspreis, Datenschutz und technische Anforderungen vergleichen.",sr:"Hosting za sopstvene web projekte: pre odluke uporediti trajanje ugovora, cenu obnove, privatnost i tehničke zahteve.",approved:false,trackingUrl:null}
];
export function approvedPartners(guide:string) {
 return partners.filter(p=>p.guides.includes(guide)&&p.approved&&p.trackingUrl!==null&&/^https:\/\//.test(p.trackingUrl));
}

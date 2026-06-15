import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'x74i3522',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const events = [
  { title: 'Pokémon Winds / Pokémon Waves', type: 'gra', quarter: 1, date: '2027', studio: 'Nintendo / The Pokémon Company', ip: 'Franchise growa', buzz: 10, risk: 6, recommendation: 'wysoka', layer: 1, target: '7–35; family gaming, kolekcjonerzy', certainty: 'wysoka' },
  { title: 'Ahsoka Season 2', type: 'serial', quarter: 1, date: 'early 2027', studio: 'Disney+ / Lucasfilm', ip: 'Franchise sci-fi (Star Wars)', buzz: 9, risk: 5, recommendation: 'wysoka', layer: 2, target: '12–45; Star Wars fandom, collectors', certainty: 'wysoka' },
  { title: 'Ice Age: Boiling Point', type: 'film', quarter: 1, date: '05.02.2027', studio: '20th Century / Disney', ip: 'Franchise animowana', buzz: 6, risk: 4, recommendation: 'srednia-niska', layer: 3, target: '4–12 + rodzice', certainty: 'wysoka' },
  { title: 'Star Wars Celebration LA 2027', type: 'wydarzenie', quarter: 2, date: '01–04.04.2027', studio: 'Lucasfilm', ip: 'Wydarzenie fanowskie / 50-lecie Star Wars', buzz: 9, risk: 3, recommendation: 'srednia', layer: 2, target: '14–49; superfans, kolekcjonerzy', certainty: 'wysoka' },
  { title: 'Sonic the Hedgehog 4', type: 'film', quarter: 2, date: '19.03.2027', studio: 'Paramount', ip: 'Adaptacja gry', buzz: 7, risk: 4, recommendation: 'srednia', layer: 3, target: '6–24; kids/teens/gamers', certainty: 'wysoka' },
  { title: 'Gatto', type: 'film', quarter: 2, date: '05.03.2027', studio: 'Pixar / Disney', ip: 'Oryginalne IP Pixar', buzz: 7, risk: 4, recommendation: 'srednia-niska', layer: 3, target: '8–34; family + animation', certainty: 'wysoka' },
  { title: 'Godzilla x Kong: Supernova', type: 'film', quarter: 2, date: '26.03.2027', studio: 'Legendary / Warner Bros.', ip: 'Monsterverse', buzz: 8, risk: 5, recommendation: 'srednia', layer: 3, target: '12–44; action/kaiju, kolekcjonerzy', certainty: 'wysoka' },
  { title: 'D23 Asia', type: 'wydarzenie', quarter: 2, date: 'marzec 2027', studio: 'Disney / D23', ip: 'Wydarzenie fanowskie Disney', buzz: 7, risk: 4, recommendation: 'srednia-niska', layer: 2, target: '14–49; Disney superfans', certainty: 'srednia' },
  { title: 'The Legend of Zelda', type: 'film', quarter: 2, date: '07.05.2027', studio: 'Nintendo / Sony Pictures', ip: 'Adaptacja gry Nintendo', buzz: 9, risk: 6, recommendation: 'wysoka', layer: 1, target: '10–39; fantasy-adventure, gracze, rodziny', certainty: 'wysoka' },
  { title: 'Star Wars: Starfighter', type: 'film', quarter: 2, date: '2027', studio: 'Lucasfilm / Disney', ip: 'Franchise sci-fi (Star Wars)', buzz: 9, risk: 6, recommendation: 'wysoka', layer: 1, target: '10–45; sci-fi/action, kolekcjonerzy', certainty: 'srednia' },
  { title: 'How to Train Your Dragon 2', type: 'film', quarter: 2, date: '11.06.2027', studio: 'Universal / DreamWorks', ip: 'Franchise / live-action', buzz: 8, risk: 4, recommendation: 'wysoka', layer: 3, target: '6–16 + rodziny', certainty: 'wysoka' },
  { title: 'Spider-Man: Beyond the Spider-Verse', type: 'film', quarter: 2, date: '18.06.2027', studio: 'Sony Pictures Animation', ip: 'Franchise komiksowa Marvel', buzz: 9, risk: 8, recommendation: 'wysoka', layer: 3, target: '8–39; animation, superhero, streetwear', certainty: 'wysoka' },
  { title: 'Shrek 5', type: 'film', quarter: 2, date: '30.06.2027', studio: 'DreamWorks / Universal', ip: 'Franchise animowana', buzz: 9, risk: 5, recommendation: 'wysoka', layer: 1, target: '8–40; family + nostalgia millennials/Gen Z', certainty: 'wysoka' },
  { title: 'FIFA Women\'s World Cup Brazil 2027', type: 'wydarzenie', quarter: 2, date: '24.06–25.07.2027', studio: 'FIFA / Brazylia', ip: 'Wydarzenie sportowe', buzz: 8, risk: 4, recommendation: 'srednia', layer: 2, target: '12–49; female sports fans', certainty: 'wysoka' },
  { title: 'ONE PIECE Season 3', type: 'serial', quarter: 2, date: '2027', studio: 'Netflix', ip: 'Adaptacja mangi', buzz: 8, risk: 4, recommendation: 'wysoka', layer: 2, target: '10–39; anime/manga, fantasy-adventure', certainty: 'wysoka' },
  { title: 'Expo 2027 Belgrade', type: 'wydarzenie', quarter: 2, date: '15.05–15.08.2027', studio: 'Expo 2027 Belgrade / BIE', ip: 'Wydarzenie międzynarodowe', buzz: 6, risk: 3, recommendation: 'srednia-niska', layer: 3, target: 'Szeroka, turystyka, family', certainty: 'wysoka' },
  { title: 'Bluey: The Movie', type: 'film', quarter: 3, date: '06.08.2027', studio: 'BBC Studios / Walt Disney Studios', ip: 'Franchise TV/film', buzz: 9, risk: 3, recommendation: 'wysoka', layer: 1, target: '3–8 + rodzice 25–44; preschool/family', certainty: 'wysoka' },
  { title: 'FIBA Basketball World Cup 2027', type: 'wydarzenie', quarter: 3, date: '27.08–12.09.2027', studio: 'FIBA / Katar', ip: 'Wydarzenie sportowe', buzz: 7, risk: 3, recommendation: 'srednia-niska', layer: 3, target: '12–39; basketball, street culture', certainty: 'wysoka' },
  { title: 'DRAGON BALL XENOVERSE 3', type: 'gra', quarter: 3, date: '2027', studio: 'Bandai Namco', ip: 'Franchise anime/growa', buzz: 8, risk: 4, recommendation: 'wysoka', layer: 2, target: '10–35; anime/fighting/action', certainty: 'wysoka' },
  { title: 'The Witcher IV', type: 'gra', quarter: 3, date: 'najwcześniej 2027', studio: 'CD PROJEKT RED', ip: 'Franchise growa / fantasy', buzz: 9, risk: 8, recommendation: 'srednia', layer: 3, target: '16–40; RPG/fantasy, core gamers', certainty: 'srednia' },
  { title: 'The Batman Part II', type: 'film', quarter: 4, date: '01.10.2027', studio: 'Warner Bros. / DC', ip: 'Franchise komiksowa DC', buzz: 9, risk: 8, recommendation: 'srednia', layer: 3, target: '15–45; superhero, thriller, premium action', certainty: 'srednia' },
  { title: 'Rugby World Cup 2027', type: 'wydarzenie', quarter: 4, date: 'od 01.10.2027', studio: 'World Rugby / Australia', ip: 'Wydarzenie sportowe', buzz: 7, risk: 3, recommendation: 'srednia-niska', layer: 3, target: '15–49; sport male/family', certainty: 'wysoka' },
  { title: 'Harry Potter', type: 'serial', quarter: 4, date: '2027', studio: 'HBO / Warner Bros. Discovery', ip: 'Adaptacja literacka', buzz: 10, risk: 6, recommendation: 'wysoka', layer: 1, target: '10–45; fantasy/family, nostalgia', certainty: 'wysoka' },
  { title: 'Frozen III', type: 'film', quarter: 4, date: '24.11.2027', studio: 'Walt Disney Animation / Disney', ip: 'Franchise animowana', buzz: 9, risk: 4, recommendation: 'wysoka', layer: 1, target: '4–12 + rodzice; girls/family', certainty: 'wysoka' },
  { title: 'Lord of the Rings: The Hunt for Gollum', type: 'film', quarter: 4, date: '17.12.2027', studio: 'New Line / Warner Bros.', ip: 'Franchise fantasy', buzz: 8, risk: 6, recommendation: 'srednia', layer: 3, target: '15–49; fantasy, kolekcjonerzy', certainty: 'srednia' },
  { title: 'Avengers: Secret Wars', type: 'film', quarter: 4, date: '17.12.2027', studio: 'Marvel Studios / Disney', ip: 'Franchise komiksowa MCU', buzz: 10, risk: 7, recommendation: 'wysoka', layer: 1, target: '13–45; mainstream blockbuster, fandom MCU', certainty: 'wysoka' },
]

async function seed() {
  console.log(`Seeding ${events.length} events…`)
  const transaction = client.transaction()
  for (const event of events) {
    const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    transaction.createOrReplace({ _id: `event-${slug}`, _type: 'event', ...event })
  }
  const result = await transaction.commit()
  console.log('Done:', result.results.length, 'documents')
}

seed().catch(console.error)

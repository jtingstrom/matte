// NO-uppgifter (populärvetenskap) för åk 4–7, i samma stil som olympiadens Science-häften.
// Faktafrågor har fasta svar; generatorerna längre ner slumpar tal och räknar fram svaret.
import { TOPICS, define, L, N } from './questions.js';

Object.assign(TOPICS, {
  forces: { sv: 'Krafter & rörelse', en: 'Forces & motion', icon: '🏃' },
  electricity: { sv: 'Elektricitet', en: 'Electricity', icon: '⚡' },
  light: { sv: 'Ljus & ljud', en: 'Light & sound', icon: '💡' },
  heat: { sv: 'Värme & materia', en: 'Heat & matter', icon: '🌡️' },
  space: { sv: 'Jorden & rymden', en: 'Earth & space', icon: '🪐' },
  life: { sv: 'Livet & kroppen', en: 'Life & the body', icon: '🌱' },
  ecology: { sv: 'Ekologi & miljö', en: 'Ecology & environment', icon: '🌍' },
  chemistry: { sv: 'Ämnen & kemi', en: 'Substances & chemistry', icon: '🧪' },
  method: { sv: 'Undersökningar', en: 'Investigations', icon: '🔬' },
  energy: { sv: 'Energi', en: 'Energy', icon: '🔋' },
});

const sci = (id, topic, grades, make) => define('sci_' + id, topic, grades, make, 'science');
const T = (pair) => L(pair[0], pair[1]);

// Fast faktafråga: q, rätt svar och felsvar som [sv, en]-par.
function fx(id, topic, grades, q, ans, wrong, ex, visual = '') {
  sci(id, topic, grades, () => ({ q: T(q), ans: T(ans), wrong: wrong.map(T), ex: T(ex), visual }));
}

// ======================= KRAFTER & RÖRELSE =======================
fx('noncontact', 'forces', [4, 5, 6],
  ['Vilken av de här krafterna kan verka utan att föremålen nuddar varandra?', 'Which of these forces can act without the objects touching each other?'],
  ['Magnetisk kraft', 'Magnetic force'],
  [['Friktion', 'Friction'], ['Fjäderkraft', 'Spring force'], ['Kraften när du skjuter en låda', 'The force when you push a box']],
  ['Magnetisk kraft (liksom tyngdkraft och elektrisk kraft) verkar på avstånd. Friktion, fjäderkraft och knuffar kräver kontakt.', 'Magnetic force (like gravity and electric force) acts at a distance. Friction, spring force and pushes need contact.']);
fx('ice', 'forces', [4, 5],
  ['Varför är det lättare att glida på is än på asfalt?', 'Why is it easier to slide on ice than on asphalt?'],
  ['Friktionen är mycket mindre på is', 'There is much less friction on ice'],
  [['Tyngdkraften är svagare på is', 'Gravity is weaker on ice'], ['Isen drar dig framåt', 'The ice pulls you forward'], ['Luften trycker hårdare över is', 'The air pushes harder above ice']],
  ['Isen är slät och ofta täckt av en tunn vattenhinna, så friktionen som bromsar dig blir liten.', 'Ice is smooth and often covered by a thin film of water, so the friction that slows you down is small.']);
fx('ballstop', 'forces', [4, 5, 6],
  ['En boll rullar på ett plant golv och stannar till slut. Varför?', 'A ball rolls across a flat floor and finally stops. Why?'],
  ['Friktion och luftmotstånd bromsar den', 'Friction and air resistance slow it down'],
  [['Tyngdkraften tar slut', 'Gravity runs out'], ['Bollen blir tröttare', 'The ball gets tired'], ['Golvet är magnetiskt', 'The floor is magnetic']],
  ['Ett föremål i rörelse fortsätter röra sig om inga krafter bromsar det. Friktion mot golvet och luftmotstånd gör att bollen stannar.', 'A moving object keeps moving unless forces slow it down. Friction with the floor and air resistance make the ball stop.']);
fx('parachute', 'forces', [4, 5, 6],
  ['Varför faller en fallskärmshoppare långsammare när fallskärmen har vecklats ut?', 'Why does a skydiver fall more slowly once the parachute has opened?'],
  ['Den stora ytan ger mycket luftmotstånd', 'The large area gives a lot of air resistance'],
  [['Fallskärmen tar bort tyngdkraften', 'The parachute removes gravity'], ['Fallskärmen är lättare än luft', 'The parachute is lighter than air'], ['Fallskärmen gör hopparen lättare', 'The parachute makes the skydiver lighter']],
  ['Ju större yta, desto fler luftpartiklar krockar med fallskärmen. Luftmotståndet blir stort och bromsar fallet.', 'The larger the area, the more air particles hit the parachute. Air resistance becomes large and slows the fall.']);
fx('rocket', 'forces', [6, 7],
  ['En raket kan accelerera även i rymden där det inte finns någon luft. Hur?', 'A rocket can speed up even in space, where there is no air. How?'],
  ['Den trycker ut gas bakåt, och gasen trycker raketen framåt', 'It pushes gas backwards, and the gas pushes the rocket forwards'],
  [['Den trycker mot luften bakom sig', 'It pushes against the air behind it'], ['Solen drar den framåt', 'The Sun pulls it forward'], ['Den saknar massa i rymden', 'It has no mass in space']],
  ['Kraft och motkraft: när raketen trycker gasen bakåt trycker gasen lika hårt tillbaka på raketen. Det behövs ingen luft att ta spjärn mot.', 'Action and reaction: when the rocket pushes gas backwards, the gas pushes back on the rocket just as hard. No air is needed to push against.']);
fx('samefall', 'forces', [6, 7],
  ['En hammare och en fjäder släpps samtidigt på månen, där det inte finns någon luft. Vad händer?', 'A hammer and a feather are dropped at the same time on the Moon, where there is no air. What happens?'],
  ['De landar samtidigt', 'They land at the same time'],
  [['Hammaren landar först', 'The hammer lands first'], ['Fjädern landar först', 'The feather lands first'], ['De svävar och faller inte', 'They float and do not fall']],
  ['Utan luftmotstånd faller alla föremål lika snabbt, oavsett vikt. Astronauten David Scott visade just detta på månen 1971.', 'Without air resistance all objects fall equally fast, whatever their weight. Astronaut David Scott showed exactly this on the Moon in 1971.']);
fx('routes', 'forces', [5, 6, 7],
  ['Två syskon cyklar hemifrån till skolan. De startar samtidigt och kommer fram samtidigt, men Ali tar en längre väg än Mia. Vad stämmer?', 'Two siblings cycle from home to school. They leave at the same time and arrive at the same time, but Ali takes a longer route than Mia. What is true?'],
  ['Ali cyklade fortare än Mia', 'Ali cycled faster than Mia'],
  [['Mia cyklade fortare än Ali', 'Mia cycled faster than Ali'], ['De cyklade exakt lika fort', 'They cycled at exactly the same speed'], ['Det går inte att säga något om farten', 'Nothing can be said about the speed']],
  ['Ali hann längre sträcka på samma tid, alltså var hans medelfart högre. (Förflyttningen, alltså avståndet hem–skola, är däremot lika för båda.)', 'Ali covered a longer distance in the same time, so his average speed was higher. (Their displacement, home to school, is the same for both.)']);

// ======================= ELEKTRICITET =======================
fx('conductor', 'electricity', [4, 5, 6],
  ['Vilket material leder elektricitet bäst?', 'Which material conducts electricity best?'],
  ['Koppar', 'Copper'],
  [['Plast', 'Plastic'], ['Gummi', 'Rubber'], ['Glas', 'Glass']],
  ['Metaller som koppar har elektroner som kan röra sig fritt. Därför görs elkablar av koppar. Plast, gummi och glas är isolatorer.', 'Metals like copper have electrons that can move freely. That is why wires are made of copper. Plastic, rubber and glass are insulators.']);
fx('opencircuit', 'electricity', [4, 5],
  ['En lampa är kopplad till ett batteri med sladdar, men strömbrytaren är öppen. Vad händer?', 'A bulb is connected to a battery with wires, but the switch is open. What happens?'],
  ['Lampan lyser inte, eftersom kretsen inte är sluten', 'The bulb does not light, because the circuit is not closed'],
  [['Lampan lyser svagt', 'The bulb glows weakly'], ['Lampan lyser starkare än vanligt', 'The bulb shines brighter than usual'], ['Batteriet laddas upp', 'The battery gets charged']],
  ['Ström kan bara gå runt i en sluten krets. En öppen strömbrytare gör ett avbrott, så ingen ström går genom lampan.', 'Current can only flow around a closed circuit. An open switch makes a gap, so no current flows through the bulb.']);
fx('series', 'electricity', [5, 6, 7],
  ['Tre lampor sitter i serie (efter varandra) med ett batteri. En av lamporna går sönder. Vad händer?', 'Three bulbs are connected in series (one after another) to a battery. One bulb breaks. What happens?'],
  ['Alla lampor slocknar', 'All the bulbs go out'],
  [['De andra två lyser starkare', 'The other two shine brighter'], ['Bara den trasiga lampan slocknar', 'Only the broken bulb goes out'], ['Batteriet tar slut direkt', 'The battery runs out at once']],
  ['I en seriekoppling finns bara en väg för strömmen. När en lampa går sönder bryts kretsen, och strömmen stannar i hela kretsen.', 'In a series circuit there is only one path for the current. When one bulb breaks the circuit is broken and current stops everywhere.']);
fx('parallel', 'electricity', [6, 7],
  ['Tre lampor är parallellkopplade till ett batteri. En lampa går sönder. Vad händer med de andra?', 'Three bulbs are connected in parallel to a battery. One bulb breaks. What happens to the others?'],
  ['De fortsätter lysa', 'They keep shining'],
  [['De slocknar också', 'They go out too'], ['De börjar blinka', 'They start to flash'], ['Bara den närmast batteriet lyser', 'Only the one closest to the battery shines']],
  ['I en parallellkoppling har varje lampa en egen väg till batteriet. Därför är lamporna hemma parallellkopplade.', 'In a parallel circuit each bulb has its own path to the battery. That is why the lights in a house are connected in parallel.']);
fx('twobulbs', 'electricity', [5, 6, 7],
  ['En lampa är kopplad till ett batteri. Sedan kopplas en likadan lampa till i serie med den första. Hur lyser lamporna nu?', 'A bulb is connected to a battery. Then an identical bulb is added in series with the first. How do the bulbs shine now?'],
  ['Båda lyser svagare än den ensamma lampan gjorde', 'Both shine more weakly than the single bulb did'],
  [['Båda lyser starkare', 'Both shine brighter'], ['Den första lyser som förut, den nya svagare', 'The first shines as before, the new one more weakly'], ['Ingen av dem lyser', 'Neither of them lights']],
  ['Två lampor i serie gör det svårare för strömmen att gå runt. Strömmen minskar, så båda lyser svagare.', 'Two bulbs in series make it harder for the current to flow. The current gets smaller, so both shine more weakly.']);
fx('insulation', 'electricity', [4, 5, 6],
  ['Varför är elsladdar klädda med plast?', 'Why are electric wires covered in plastic?'],
  ['Plast är en isolator som skyddar mot elstötar', 'Plastic is an insulator that protects against electric shocks'],
  [['Plast gör att strömmen går fortare', 'Plastic makes the current go faster'], ['Plast lagrar elektricitet', 'Plastic stores electricity'], ['Plast gör att metallen leder bättre', 'Plastic helps the metal conduct better']],
  ['Plasten leder inte ström. Den hindrar strömmen från att gå ut i oss eller i andra sladdar.', 'Plastic does not conduct electricity. It stops the current from going into us or into other wires.']);
fx('balloon', 'electricity', [5, 6, 7],
  ['Du gnider en ballong mot en tröja. Efteråt fastnar ballongen på väggen. Varför?', 'You rub a balloon on a sweater. Afterwards the balloon sticks to the wall. Why?'],
  ['Ballongen har blivit elektriskt laddad', 'The balloon has become electrically charged'],
  [['Ballongen har blivit magnetisk', 'The balloon has become magnetic'], ['Ballongen har blivit klibbig av värmen', 'The balloon has become sticky from the heat'], ['Ballongen har blivit lättare än luft', 'The balloon has become lighter than air']],
  ['När man gnider flyttas elektroner från tröjan till ballongen. Den laddade ballongen dras till väggen genom statisk elektricitet.', 'Rubbing moves electrons from the sweater to the balloon. The charged balloon is attracted to the wall by static electricity.']);
fx('electromagnet', 'electricity', [6, 7],
  ['Du har lindat en koppartråd runt en järnspik och kopplat den till ett batteri, så att spiken blir en elektromagnet. Hur gör du magneten starkare?', 'You have wound copper wire around an iron nail and connected it to a battery, making the nail an electromagnet. How do you make the magnet stronger?'],
  ['Linda fler varv tråd runt spiken', 'Wind more turns of wire around the nail'],
  [['Byt järnspiken mot en träpinne', 'Replace the iron nail with a wooden stick'], ['Linda färre varv', 'Use fewer turns'], ['Koppla bort batteriet', 'Disconnect the battery']],
  ['Fler varv (eller mer ström) ger ett starkare magnetfält. Järnkärnan förstärker det, men en träpinne gör det inte.', 'More turns (or more current) give a stronger magnetic field. The iron core strengthens it, but a wooden stick does not.']);

// ======================= LJUS & LJUD =======================
fx('seebook', 'light', [4, 5],
  ['Hur kommer det sig att du kan se en bok i ett upplyst rum?', 'How are you able to see a book in a lit room?'],
  ['Ljus studsar på boken och in i dina ögon', 'Light bounces off the book into your eyes'],
  [['Dina ögon skickar ut ljus mot boken', 'Your eyes send out light towards the book'], ['Boken lyser av sig själv', 'The book glows by itself'], ['Ljud från boken når dina öron', 'Sound from the book reaches your ears']],
  ['Vi ser föremål när ljus från en ljuskälla reflekteras mot dem och når våra ögon.', 'We see objects when light from a light source is reflected off them and reaches our eyes.']);
fx('lightsource', 'light', [4, 5],
  ['Vilket av de här är en ljuskälla, alltså något som sänder ut eget ljus?', 'Which of these is a light source, something that gives off its own light?'],
  ['Solen', 'The Sun'],
  [['Månen', 'The Moon'], ['En spegel', 'A mirror'], ['Ett vitt papper', 'A white sheet of paper']],
  ['Solen skapar sitt eget ljus. Månen, speglar och papper reflekterar bara ljus från något annat.', 'The Sun makes its own light. The Moon, mirrors and paper only reflect light from something else.']);
fx('shadow', 'light', [4, 5, 6],
  ['Varför bildas en skugga bakom dig när solen skiner?', 'Why does a shadow form behind you when the Sun is shining?'],
  ['Ljuset går rakt fram och din kropp stoppar det', 'Light travels in straight lines and your body blocks it'],
  [['Din kropp suger upp all luft', 'Your body absorbs all the air'], ['Ljuset böjer sig runt dig', 'Light bends around you'], ['Marken blir kallare bakom dig', 'The ground gets colder behind you']],
  ['Ljus färdas i raka linjer. Där din kropp stänger ute ljuset blir det mörkare, och det är skuggan.', 'Light travels in straight lines. Where your body blocks the light it becomes darker, and that is the shadow.']);
fx('vacuum', 'light', [5, 6, 7],
  ['Genom vilket av de här kan ljud INTE färdas?', 'Through which of these can sound NOT travel?'],
  ['Tomt rum (vakuum), som i rymden', 'Empty space (a vacuum), as in outer space'],
  [['Vatten', 'Water'], ['Stål', 'Steel'], ['Luft', 'Air']],
  ['Ljud är vibrationer som förs vidare av partiklar. I vakuum finns inga partiklar, så ljudet kan inte färdas.', 'Sound is vibrations passed on by particles. In a vacuum there are no particles, so sound cannot travel.']);
fx('lightning', 'light', [4, 5, 6],
  ['Vid åska ser man blixten före man hör mullret. Varför?', 'In a thunderstorm you see the lightning before you hear the thunder. Why?'],
  ['Ljus färdas mycket snabbare än ljud', 'Light travels much faster than sound'],
  [['Blixten kommer först och åskan långt senare', 'The lightning happens first and the thunder much later'], ['Ögonen är snabbare än öronen', 'Eyes are faster than ears'], ['Ljud färdas snabbare än ljus', 'Sound travels faster than light']],
  ['Blixt och åska uppstår samtidigt. Ljuset når oss nästan direkt, men ljudet går bara ungefär 340 meter per sekund.', 'Lightning and thunder happen at the same time. The light reaches us almost at once, but sound only travels about 340 metres per second.']);
fx('refraction', 'light', [6, 7],
  ['En penna i ett glas vatten ser ut att vara knäckt vid vattenytan. Vad kallas det?', 'A pencil in a glass of water looks broken at the water surface. What is this called?'],
  ['Brytning (refraktion)', 'Refraction'],
  [['Reflektion', 'Reflection'], ['Absorption', 'Absorption'], ['Skuggbildning', 'Shadow formation']],
  ['Ljus byter riktning när det går från vatten till luft, eftersom farten ändras. Det kallas brytning.', 'Light changes direction when it passes from water to air, because its speed changes. This is called refraction.']);
fx('pitch', 'light', [6, 7],
  ['En gitarrsträng ger en ljusare (högre) ton. Vad betyder det?', 'A guitar string gives a higher note. What does that mean?'],
  ['Strängen vibrerar snabbare', 'The string vibrates faster'],
  [['Strängen vibrerar långsammare', 'The string vibrates more slowly'], ['Ljudet färdas snabbare', 'The sound travels faster'], ['Strängen är längre', 'The string is longer']],
  ['Tonhöjden beror på frekvensen: fler svängningar per sekund ger högre ton. Kortare eller spändare strängar vibrerar snabbare.', 'Pitch depends on frequency: more vibrations per second give a higher note. Shorter or tighter strings vibrate faster.']);
fx('prism', 'light', [5, 6, 7],
  ['Vitt ljus skickas genom ett glasprisma. Vad kommer ut på andra sidan?', 'White light is sent through a glass prism. What comes out on the other side?'],
  ['Regnbågens färger', 'The colours of the rainbow'],
  [['Bara vitt ljus', 'Only white light'], ['Bara rött ljus', 'Only red light'], ['Inget ljus alls', 'No light at all']],
  ['Vitt ljus är en blandning av alla färger. Prismat bryter färgerna olika mycket så att de delas upp, precis som i en regnbåge.', 'White light is a mixture of all colours. The prism bends each colour by a different amount so they spread out, just like in a rainbow.']);
fx('mirrors', 'light', [5, 6, 7],
  ['Vilket ord beskriver bäst vad en plan spegel gör med ljus?', 'Which word best describes what a flat mirror does with light?'],
  ['Den reflekterar ljuset', 'It reflects the light'],
  [['Den skapar nytt ljus', 'It creates new light'], ['Den suger upp allt ljus', 'It absorbs all the light'], ['Den gör ljuset långsammare', 'It slows the light down']],
  ['En spegel är så slät att ljuset studsar tillbaka i ordnade riktningar. Därför ser vi en tydlig spegelbild.', 'A mirror is so smooth that light bounces back in an orderly way. That is why we see a clear reflection.']);

// ======================= VÄRME & MATERIA =======================
fx('igloo', 'heat', [4, 5, 6],
  ['Det kan vara −40 °C utanför en igloo men över 0 °C inuti. Snöblocken innehåller mycket instängd luft. Varför håller iglon värmen?', 'It can be −40 °C outside an igloo but above 0 °C inside. The snow blocks contain lots of trapped air. Why does the igloo keep the heat in?'],
  ['Stillastående luft leder värme dåligt', 'Still air is a poor conductor of heat'],
  [['Snö producerar värme', 'Snow produces heat'], ['Vit snö drar till sig solljus', 'White snow attracts sunlight'], ['Kyla kan inte ta sig genom väggar', 'Cold cannot get through walls']],
  ['Instängd, stillastående luft är en bra värmeisolator. Därför värmer också dunjackor och fleece, som också håller kvar luft.', 'Trapped, still air is a good heat insulator. That is also why down jackets and fleece, which trap air, keep us warm.']);
fx('spoon', 'heat', [4, 5],
  ['En metallsked och en träsked står i samma kopp varmt te. Vilken blir varm i handtaget först?', 'A metal spoon and a wooden spoon stand in the same cup of hot tea. Which handle gets hot first?'],
  ['Metallskeden', 'The metal spoon'],
  [['Träskeden', 'The wooden spoon'], ['Båda samtidigt', 'Both at the same time'], ['Ingen av dem', 'Neither of them']],
  ['Metall är en bra värmeledare, så värmen vandrar snabbt upp i handtaget. Trä leder värme dåligt.', 'Metal is a good conductor of heat, so the heat travels quickly up the handle. Wood conducts heat poorly.']);
fx('condense', 'heat', [4, 5, 6],
  ['Ett glas med iskallt vatten står på bordet. Efter en stund blir det vattendroppar på utsidan av glaset. Var kommer de ifrån?', 'A glass of ice-cold water stands on a table. After a while drops of water form on the outside of the glass. Where do they come from?'],
  ['Vattenånga i luften kyls ner och blir vatten', 'Water vapour in the air cools down and turns into water'],
  [['Vattnet läcker genom glaset', 'The water leaks through the glass'], ['Glaset smälter lite', 'The glass melts a little'], ['Isen svettas ut genom glaset', 'The ice sweats out through the glass']],
  ['Luften innehåller osynlig vattenånga. Mot det kalla glaset kondenserar ångan till små droppar.', 'Air contains invisible water vapour. On the cold glass the vapour condenses into small droplets.']);
fx('puddle', 'heat', [4, 5],
  ['En vattenpöl försvinner när solen skiner på den. Vad kallas det som händer?', 'A puddle disappears when the Sun shines on it. What is happening called?'],
  ['Avdunstning', 'Evaporation'],
  [['Kondensation', 'Condensation'], ['Smältning', 'Melting'], ['Frysning', 'Freezing']],
  ['Vattnet övergår till vattenånga och blandas med luften. Det kallas avdunstning.', 'The water turns into water vapour and mixes with the air. This is called evaporation.']);
fx('thermos', 'heat', [5, 6, 7],
  ['En termos håller varm dryck varm och kall dryck kall. Hur fungerar den?', 'A vacuum flask keeps hot drinks hot and cold drinks cold. How does it work?'],
  ['Den minskar värmeöverföringen mellan drycken och omgivningen', 'It reduces heat transfer between the drink and the surroundings'],
  [['Den tillverkar värme eller kyla', 'It produces heat or cold'], ['Den känner av vilken dryck det är', 'It senses which drink is inside'], ['Den är gjord av ett material som drar till sig värme', 'It is made of a material that attracts heat']],
  ['Mellan termosens väggar finns vakuum, som nästan inte släpper igenom värme. Värmen går därför långsamt in eller ut.', 'Between the walls of the flask there is a vacuum, which hardly lets heat through. So heat moves in or out very slowly.']);
fx('rails', 'heat', [6, 7],
  ['Förr lämnade man små glipor mellan järnvägsrälsens delar. Varför?', 'In the past, small gaps were left between sections of railway track. Why?'],
  ['Metall utvidgar sig när den blir varm', 'Metal expands when it gets warm'],
  [['För att spara metall', 'To save metal'], ['För att tåget ska låta mindre', 'To make the train quieter'], ['Metall krymper när den blir varm', 'Metal shrinks when it gets warm']],
  ['Varma sommardagar blir rälsen längre. Utan glipor kunde den bukta ut och få tåg att spåra ur.', 'On hot summer days the rails get longer. Without gaps they could buckle and derail trains.']);
fx('sweat', 'heat', [6, 7],
  ['Varför svalnar kroppen när svetten torkar på huden?', 'Why does your body cool down when sweat dries on your skin?'],
  ['Avdunstningen tar värme från huden', 'The evaporation takes heat from the skin'],
  [['Svett är kallt vatten', 'Sweat is cold water'], ['Svetten stänger porerna', 'The sweat closes the pores'], ['Svetten reflekterar solljuset', 'The sweat reflects sunlight']],
  ['För att vatten ska avdunsta behövs energi. Den energin tas från huden, som därför blir svalare.', 'Water needs energy to evaporate. That energy is taken from your skin, which therefore cools down.']);
fx('darkclothes', 'heat', [4, 5, 6],
  ['Varför blir det varmare i en svart tröja än i en vit en solig dag?', 'Why is a black T-shirt warmer than a white one on a sunny day?'],
  ['Mörka färger tar upp mer solljus', 'Dark colours absorb more sunlight'],
  [['Svart tyg är alltid tjockare', 'Black fabric is always thicker'], ['Vita färger tar upp mer solljus', 'White colours absorb more sunlight'], ['Svart färg skapar värme', 'Black dye produces heat']],
  ['Mörka ytor absorberar det mesta av ljuset och det blir värme. Ljusa ytor reflekterar mer av ljuset.', 'Dark surfaces absorb most of the light, which turns into heat. Light surfaces reflect more of it.']);
fx('melting', 'heat', [4, 5],
  ['Vad kallas det när ett fast ämne blir flytande, som när is blir vatten?', 'What is it called when a solid turns into a liquid, like ice turning into water?'],
  ['Smältning', 'Melting'],
  [['Avdunstning', 'Evaporation'], ['Kondensation', 'Condensation'], ['Stelning', 'Solidifying']],
  ['Fast → flytande heter smältning. Flytande → fast heter stelning (frysning), flytande → gas heter avdunstning eller kokning.', 'Solid → liquid is melting. Liquid → solid is freezing, and liquid → gas is evaporation or boiling.']);
fx('watertanks', 'heat', [6, 7],
  ['En bonde ställer stora kar med vatten i sitt kalla förråd. När vattnet fryser på vintern håller sig förrådet lite varmare. Varför?', 'A farmer puts large tanks of water in a cold storeroom. When the water freezes in winter the room stays a little warmer. Why?'],
  ['Vatten avger värme när det fryser till is', 'Water gives off heat when it freezes into ice'],
  [['Is är varmare än luft', 'Ice is warmer than air'], ['Vatten skapar värme hela tiden', 'Water produces heat all the time'], ['Is reflekterar kylan', 'Ice reflects the cold']],
  ['När vatten stelnar frigörs värme (samma mängd som behövdes för att smälta isen). Det hindrar temperaturen från att sjunka lika snabbt.', 'When water freezes it releases heat (the same amount needed to melt the ice). That stops the temperature falling as fast.']);

// ======================= JORDEN & RYMDEN =======================
fx('daynight', 'space', [4, 5, 6],
  ['Varför har vi dag och natt?', 'Why do we have day and night?'],
  ['Jorden snurrar runt sin egen axel', 'The Earth spins on its own axis'],
  [['Jorden går runt solen', 'The Earth orbits the Sun'], ['Solen går runt jorden', 'The Sun orbits the Earth'], ['Månen skymmer solen varje natt', 'The Moon blocks the Sun every night']],
  ['Jorden snurrar ett varv per dygn. Den sida som är vänd mot solen har dag, den andra har natt.', 'The Earth turns once every 24 hours. The side facing the Sun has day, the other side has night.']);
fx('seasons', 'space', [5, 6, 7],
  ['Vad är den viktigaste orsaken till att vi har årstider?', 'What is the main reason we have seasons?'],
  ['Jordaxeln lutar', 'The Earth\'s axis is tilted'],
  [['Avståndet till solen ändras mycket under året', 'The distance to the Sun changes a lot during the year'], ['Solen lyser starkare vissa månader', 'The Sun shines more strongly in some months'], ['Månen skymmer solen på vintern', 'The Moon blocks the Sun in winter']],
  ['Eftersom jordaxeln lutar får norra halvklotet solljuset mer rakt och längre dagar på sommaren, och tvärtom på vintern.', 'Because the axis is tilted, the northern half gets more direct sunlight and longer days in summer, and the opposite in winter.']);
fx('jupiter', 'space', [4, 5, 6],
  ['Vilken är den största planeten i vårt solsystem?', 'Which is the largest planet in our solar system?'],
  ['Jupiter', 'Jupiter'],
  [['Saturnus', 'Saturn'], ['Jorden', 'Earth'], ['Neptunus', 'Neptune']],
  ['Jupiter är en gasjätte. Dess diameter är ungefär 11 gånger jordens.', 'Jupiter is a gas giant. Its diameter is about 11 times that of the Earth.']);
fx('mercury', 'space', [4, 5, 6],
  ['Vilken planet ligger närmast solen?', 'Which planet is closest to the Sun?'],
  ['Merkurius', 'Mercury'],
  [['Venus', 'Venus'], ['Mars', 'Mars'], ['Jorden', 'Earth']],
  ['Ordningen från solen är Merkurius, Venus, Jorden, Mars, Jupiter, Saturnus, Uranus och Neptunus.', 'The order from the Sun is Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.']);
fx('mars', 'space', [4, 5],
  ['Vilken planet kallas "den röda planeten"?', 'Which planet is called "the red planet"?'],
  ['Mars', 'Mars'],
  [['Venus', 'Venus'], ['Jupiter', 'Jupiter'], ['Merkurius', 'Mercury']],
  ['Mars yta innehåller mycket järnoxid (rost), som ger den röda färgen.', 'The surface of Mars contains a lot of iron oxide (rust), which gives it its red colour.']);
fx('moonphases', 'space', [5, 6, 7],
  ['Varför ser månen olika ut under en månad (nymåne, halvmåne, fullmåne)?', 'Why does the Moon look different during a month (new moon, half moon, full moon)?'],
  ['Vi ser olika stor del av månens solbelysta sida', 'We see different amounts of the Moon\'s sunlit side'],
  [['Jordens skugga täcker olika mycket av månen', 'The Earth\'s shadow covers different amounts of the Moon'], ['Månen krymper och växer', 'The Moon shrinks and grows'], ['Moln skymmer delar av månen', 'Clouds hide parts of the Moon']],
  ['Solen lyser alltid upp halva månen. När månen går runt jorden ser vi olika mycket av den belysta halvan. Jordens skugga på månen är något annat: en månförmörkelse.', 'The Sun always lights up half of the Moon. As the Moon orbits the Earth we see different amounts of the lit half. Earth\'s shadow on the Moon is something else: a lunar eclipse.']);
fx('year', 'space', [4, 5],
  ['Hur lång tid tar det för jorden att gå ett varv runt solen?', 'How long does it take the Earth to go once around the Sun?'],
  ['Ungefär 365 dagar', 'About 365 days'],
  [['24 timmar', '24 hours'], ['Ungefär 28 dagar', 'About 28 days'], ['12 år', '12 years']],
  ['Ett varv runt solen är ett år, ungefär 365¼ dagar. Därför har vi skottår vart fjärde år.', 'One orbit of the Sun is a year, about 365¼ days. That is why we have a leap year every four years.']);
fx('iss', 'space', [6, 7],
  ['Astronauterna på rymdstationen ISS svävar runt inne i stationen. Vilken förklaring är riktig?', 'Astronauts on the ISS space station float around inside it. Which explanation is correct?'],
  ['De och stationen faller hela tiden runt jorden tillsammans', 'They and the station are constantly falling around the Earth together'],
  [['Det finns ingen tyngdkraft där uppe', 'There is no gravity up there'], ['Stationen har magneter som lyfter dem', 'The station has magnets that lift them'], ['Luften i stationen är tjockare', 'The air in the station is thicker']],
  ['På ISS höjd är tyngdkraften nästan 90 % av den på marken. Stationen faller hela tiden runt jorden i sin bana, och astronauterna faller med den. Därför känns de tyngdlösa.', 'At the ISS\'s height gravity is almost 90 % of that on the ground. The station is always falling around the Earth in its orbit, and the astronauts fall with it. That is why they feel weightless.']);
fx('sunstar', 'space', [4, 5],
  ['Vad är solen?', 'What is the Sun?'],
  ['En stjärna', 'A star'],
  [['En planet', 'A planet'], ['En måne', 'A moon'], ['En komet', 'A comet']],
  ['Solen är en stjärna, ett glödande klot av gas som skapar ljus och värme. Den är den närmaste stjärnan till jorden.', 'The Sun is a star, a glowing ball of gas that makes light and heat. It is the closest star to the Earth.']);

// ======================= LIVET & KROPPEN =======================
fx('photosynthesis', 'life', [4, 5, 6],
  ['Hur får gröna växter sin näring?', 'How do green plants get their food?'],
  ['De tillverkar socker av ljus, vatten och koldioxid', 'They make sugar from light, water and carbon dioxide'],
  [['De äter insekter', 'They eat insects'], ['De suger upp färdig mat ur jorden', 'They take ready-made food from the soil'], ['De får all näring från regnet', 'They get all their food from rain']],
  ['Det kallas fotosyntes. Med hjälp av solljus gör växten socker av vatten och koldioxid, och släpper ut syre.', 'This is called photosynthesis. Using sunlight, the plant makes sugar from water and carbon dioxide, and releases oxygen.']);
fx('oxygen', 'life', [4, 5],
  ['Vilken gas släpper växter ut vid fotosyntesen?', 'Which gas do plants give off during photosynthesis?'],
  ['Syre', 'Oxygen'],
  [['Koldioxid', 'Carbon dioxide'], ['Kväve', 'Nitrogen'], ['Helium', 'Helium']],
  ['Växterna tar upp koldioxid och släpper ut syre, som vi och andra djur andas in.', 'Plants take in carbon dioxide and give off oxygen, which we and other animals breathe in.']);
fx('heart', 'life', [4, 5],
  ['Vilket organ pumpar runt blodet i kroppen?', 'Which organ pumps blood around the body?'],
  ['Hjärtat', 'The heart'],
  [['Lungorna', 'The lungs'], ['Levern', 'The liver'], ['Magsäcken', 'The stomach']],
  ['Hjärtat är en muskel som slår ungefär 60–100 gånger i minuten när man vilar.', 'The heart is a muscle that beats about 60–100 times a minute at rest.']);
fx('smallintestine', 'life', [5, 6, 7],
  ['Var i kroppen tas det mesta av näringen från maten upp till blodet?', 'Where in the body is most of the food\'s nutrients absorbed into the blood?'],
  ['I tunntarmen', 'In the small intestine'],
  [['I magsäcken', 'In the stomach'], ['I tjocktarmen', 'In the large intestine'], ['I matstrupen', 'In the oesophagus']],
  ['Tunntarmen är flera meter lång och har en enorm yta med små tarmludd som tar upp näringen.', 'The small intestine is several metres long and has a huge surface with tiny villi that absorb the nutrients.']);
fx('mammal', 'life', [5, 6, 7],
  ['Vilket av de här djuren är INTE ett däggdjur?', 'Which of these animals is NOT a mammal?'],
  ['Haj', 'Shark'],
  [['Delfin', 'Dolphin'], ['Fladdermus', 'Bat'], ['Val', 'Whale']],
  ['Hajen är en fisk som andas med gälar. Delfiner, valar och fladdermöss är däggdjur: de andas luft och ger di åt sina ungar.', 'The shark is a fish that breathes with gills. Dolphins, whales and bats are mammals: they breathe air and feed their young with milk.']);
fx('frog', 'life', [4, 5],
  ['I vilken ordning utvecklas en groda?', 'In which order does a frog develop?'],
  ['Ägg → grodyngel → liten groda → vuxen groda', 'Egg → tadpole → froglet → adult frog'],
  [['Grodyngel → ägg → liten groda → vuxen groda', 'Tadpole → egg → froglet → adult frog'], ['Ägg → liten groda → grodyngel → vuxen groda', 'Egg → froglet → tadpole → adult frog'], ['Liten groda → ägg → grodyngel → vuxen groda', 'Froglet → egg → tadpole → adult frog']],
  ['Grodor lägger rom (ägg) i vatten. Ur äggen kläcks grodyngel med gälar, som sedan får ben och lungor.', 'Frogs lay spawn (eggs) in water. Tadpoles with gills hatch, then grow legs and lungs.']);
fx('cell', 'life', [6, 7],
  ['Vad är den minsta enheten som kan kallas levande?', 'What is the smallest unit that can be called alive?'],
  ['En cell', 'A cell'],
  [['En atom', 'An atom'], ['Ett organ', 'An organ'], ['En vävnad', 'A tissue']],
  ['Alla levande organismer består av en eller flera celler. Atomer finns i allt, men lever inte.', 'All living things are made of one or more cells. Atoms are in everything, but are not alive.']);
fx('redcells', 'life', [6, 7],
  ['Vad är de röda blodkropparnas viktigaste uppgift?', 'What is the main job of red blood cells?'],
  ['Att transportera syre', 'To carry oxygen'],
  [['Att bekämpa bakterier', 'To fight bacteria'], ['Att få blodet att levra sig', 'To make blood clot'], ['Att bryta ner maten', 'To break down food']],
  ['Röda blodkroppar hämtar syre i lungorna och lämnar det i kroppens celler. Vita blodkroppar bekämpar infektioner och blodplättar stoppar blödningar.', 'Red blood cells pick up oxygen in the lungs and deliver it to the body\'s cells. White blood cells fight infections and platelets stop bleeding.']);
fx('skull', 'life', [4, 5],
  ['Vilken del av skelettet skyddar hjärnan?', 'Which part of the skeleton protects the brain?'],
  ['Skallen', 'The skull'],
  [['Bröstkorgen', 'The rib cage'], ['Bäckenet', 'The pelvis'], ['Ryggraden', 'The spine']],
  ['Skallen är ett hårt skal av ben runt hjärnan. Bröstkorgen skyddar i stället hjärtat och lungorna.', 'The skull is a hard shell of bone around the brain. The rib cage protects the heart and lungs instead.']);
fx('antibiotics', 'life', [6, 7],
  ['Vad hjälper antibiotika mot?', 'What do antibiotics work against?'],
  ['Bakterier', 'Bacteria'],
  [['Virus, till exempel förkylning', 'Viruses, such as a cold'], ['Allergier', 'Allergies'], ['Benbrott', 'Broken bones']],
  ['Antibiotika dödar bakterier men biter inte på virus. Därför hjälper det inte mot förkylning.', 'Antibiotics kill bacteria but do not work on viruses. That is why they do not help against a cold.']);

// ======================= EKOLOGI & MILJÖ =======================
fx('foodchain', 'ecology', [4, 5, 6],
  ['I näringskedjan gräs → hare → räv, vilken roll har haren?', 'In the food chain grass → hare → fox, what role does the hare have?'],
  ['Växtätare (konsument)', 'Herbivore (consumer)'],
  [['Producent', 'Producer'], ['Nedbrytare', 'Decomposer'], ['Rovdjur som äter räven', 'Predator that eats the fox']],
  ['Gräset är producent eftersom det gör sin egen näring. Haren äter växter och är förstahandskonsument. Räven är rovdjur.', 'Grass is the producer because it makes its own food. The hare eats plants and is a primary consumer. The fox is the predator.']);
fx('decomposers', 'ecology', [4, 5, 6],
  ['Vad gör nedbrytare som svampar, maskar och bakterier i naturen?', 'What do decomposers such as fungi, worms and bacteria do in nature?'],
  ['Bryter ner döda växter och djur till näring i jorden', 'Break down dead plants and animals into nutrients in the soil'],
  [['Tillverkar syre av solljus', 'Make oxygen from sunlight'], ['Jagar levande djur', 'Hunt living animals'], ['Pollinerar blommor', 'Pollinate flowers']],
  ['Utan nedbrytare skulle döda löv och djur bli liggande. De gör om dem till näring som växterna kan använda igen.', 'Without decomposers dead leaves and animals would pile up. They turn them into nutrients that plants can use again.']);
fx('parkcool', 'ecology', [5, 6, 7],
  ['Varför är det ofta svalare i en park med många träd än mitt i staden en het sommardag?', 'Why is a park with many trees often cooler than the city centre on a hot summer day?'],
  ['Träden ger skugga och avdunstar vatten från bladen', 'The trees give shade and evaporate water from their leaves'],
  [['Träden tillverkar kall luft', 'The trees produce cold air'], ['Löven reflekterar allt solljus', 'The leaves reflect all sunlight'], ['Det regnar alltid mer i parker', 'It always rains more in parks']],
  ['Skuggan hindrar solen från att värma marken, och vattnet som avdunstar från bladen tar värme från luften. Asfalt och stenhus lagrar i stället värme.', 'Shade stops the Sun from heating the ground, and water evaporating from the leaves takes heat from the air. Asphalt and stone buildings store heat instead.']);
fx('greenhouse', 'ecology', [6, 7],
  ['Vilken gas från förbränning av olja, kol och bensin bidrar mest till att förstärka växthuseffekten?', 'Which gas from burning oil, coal and petrol contributes most to strengthening the greenhouse effect?'],
  ['Koldioxid', 'Carbon dioxide'],
  [['Syre', 'Oxygen'], ['Kväve', 'Nitrogen'], ['Helium', 'Helium']],
  ['Koldioxid släpper igenom solljus men håller kvar en del av den värme som jorden strålar ut. Mer koldioxid ger varmare klimat.', 'Carbon dioxide lets sunlight through but traps some of the heat the Earth gives off. More carbon dioxide means a warmer climate.']);
fx('renewable', 'ecology', [4, 5, 6],
  ['Vilken energikälla är förnybar?', 'Which energy source is renewable?'],
  ['Vind', 'Wind'],
  [['Kol', 'Coal'], ['Olja', 'Oil'], ['Naturgas', 'Natural gas']],
  ['Vind, sol och vatten tar inte slut. Kol, olja och naturgas bildades för miljontals år sedan och tar slut när vi använt dem.', 'Wind, sunlight and water do not run out. Coal, oil and natural gas formed millions of years ago and run out once used.']);
fx('foxes', 'ecology', [5, 6, 7],
  ['I en skog äter rävar harar och harar äter gräs. Om alla rävar försvinner, vad händer troligen först?', 'In a forest, foxes eat hares and hares eat grass. If all the foxes disappear, what is most likely to happen first?'],
  ['Antalet harar ökar', 'The number of hares increases'],
  [['Antalet harar minskar', 'The number of hares decreases'], ['Gräset växer mer', 'The grass grows more'], ['Ingenting förändras', 'Nothing changes']],
  ['Utan rovdjur dör färre harar, så de blir fler. Fler harar äter mer gräs, vilket så småningom kan bli brist på mat för dem.', 'Without predators fewer hares die, so their number rises. More hares eat more grass, which can eventually mean a food shortage for them.']);

// ======================= ÄMNEN & KEMI =======================
fx('chemchange', 'chemistry', [4, 5, 6],
  ['Vilket är ett exempel på en kemisk reaktion, där nya ämnen bildas?', 'Which is an example of a chemical change, where new substances form?'],
  ['Ved som brinner', 'Wood burning'],
  [['Is som smälter', 'Ice melting'], ['Socker som löses i vatten', 'Sugar dissolving in water'], ['Papper som klipps sönder', 'Paper being cut up']],
  ['När ved brinner bildas aska, koldioxid och vattenånga, alltså nya ämnen. Smältning, lösning och klippning ändrar bara form eller tillstånd.', 'When wood burns, ash, carbon dioxide and water vapour form, which are new substances. Melting, dissolving and cutting only change shape or state.']);
fx('saltback', 'chemistry', [5, 6, 7],
  ['Du har löst salt i vatten. Hur får du tillbaka saltet?', 'You have dissolved salt in water. How do you get the salt back?'],
  ['Låt vattnet avdunsta', 'Let the water evaporate'],
  [['Filtrera lösningen genom ett kaffefilter', 'Filter the solution through a coffee filter'], ['Använd en magnet', 'Use a magnet'], ['Frys lösningen', 'Freeze the solution']],
  ['Saltet är så finfördelat i vattnet att det går rakt igenom ett filter. När vattnet avdunstar blir saltkristallerna kvar.', 'The salt is spread so finely in the water that it passes straight through a filter. When the water evaporates the salt crystals are left behind.']);
fx('ironsand', 'chemistry', [4, 5, 6],
  ['Hur skiljer du enklast järnfilspån från sand?', 'What is the easiest way to separate iron filings from sand?'],
  ['Med en magnet', 'With a magnet'],
  [['Med ett filter', 'With a filter'], ['Genom att koka blandningen', 'By boiling the mixture'], ['Genom att lösa den i vatten', 'By dissolving it in water']],
  ['Järn dras till magneter, men sand gör det inte. Magneten plockar upp järnet och sanden blir kvar.', 'Iron is attracted to magnets but sand is not. The magnet picks up the iron and the sand is left.']);
fx('element', 'chemistry', [6, 7],
  ['Vilket av de här är ett grundämne?', 'Which of these is a chemical element?'],
  ['Guld', 'Gold'],
  [['Vatten', 'Water'], ['Koksalt', 'Table salt'], ['Luft', 'Air']],
  ['Ett grundämne består av bara en sorts atomer. Vatten och salt är kemiska föreningar, och luft är en blandning av flera gaser.', 'An element is made of only one kind of atom. Water and salt are compounds, and air is a mixture of several gases.']);
fx('rust', 'chemistry', [6, 7],
  ['Vad behövs för att järn ska rosta?', 'What does iron need in order to rust?'],
  ['Syre och vatten', 'Oxygen and water'],
  [['Bara solljus', 'Only sunlight'], ['Kväve och salt', 'Nitrogen and salt'], ['Bara kyla', 'Only cold']],
  ['Rost bildas när järn reagerar med syre, och det går mycket fortare när det finns vatten (och ännu fortare med salt i vattnet).', 'Rust forms when iron reacts with oxygen, and it happens much faster when there is water (and even faster with salt in the water).']);
fx('acid', 'chemistry', [6, 7],
  ['Vilket av de här är surt?', 'Which of these is acidic?'],
  ['Citronsaft', 'Lemon juice'],
  [['Tvållösning', 'Soapy water'], ['Rent vatten', 'Pure water'], ['Bikarbonat löst i vatten', 'Baking soda in water']],
  ['Citronsaft innehåller citronsyra och har lågt pH. Tvål och bikarbonat är basiska, och rent vatten är neutralt (pH 7).', 'Lemon juice contains citric acid and has a low pH. Soap and baking soda are basic, and pure water is neutral (pH 7).']);

// ======================= UNDERSÖKNINGAR =======================
fx('variable', 'method', [5, 6, 7],
  ['Petra låter en boll rulla ner för samma ramp, från samma höjd, men på olika underlag: matta, trä och plast. Hon mäter hur lång tid det tar. Vad är det hon ändrar med flit (den oberoende variabeln)?', 'Petra lets a ball roll down the same ramp, from the same height, onto different surfaces: carpet, wood and plastic. She measures how long it takes. What is she changing on purpose (the independent variable)?'],
  ['Underlaget', 'The surface'],
  [['Rampens höjd', 'The ramp height'], ['Tiden', 'The time'], ['Bollen', 'The ball']],
  ['Det man ändrar med flit är den oberoende variabeln (underlaget). Det man mäter, tiden, är den beroende variabeln. Allt annat hålls lika.', 'What you change on purpose is the independent variable (the surface). What you measure, the time, is the dependent variable. Everything else is kept the same.']);
fx('fairtest', 'method', [5, 6, 7],
  ['Du vill undersöka om växter växer bättre i mer ljus. Vad måste vara LIKA för alla växter?', 'You want to find out if plants grow better with more light. What must be the SAME for all the plants?'],
  ['Mängden vatten, jordsorten och växtsorten', 'The amount of water, the type of soil and the type of plant'],
  [['Mängden ljus', 'The amount of light'], ['Ingenting behöver vara lika', 'Nothing needs to be the same'], ['Bara krukans färg', 'Only the colour of the pot']],
  ['I ett rättvist test ändrar man bara en sak, här ljuset. Allt annat hålls lika, annars vet man inte vad som gjorde skillnaden.', 'In a fair test you change only one thing, here the light. Everything else stays the same, otherwise you cannot tell what made the difference.']);
fx('repeat', 'method', [5, 6, 7],
  ['Varför är det bra att göra samma försök flera gånger?', 'Why is it good to repeat the same experiment several times?'],
  ['Resultaten blir mer tillförlitliga', 'The results become more reliable'],
  [['Så att man får det svar man vill ha', 'So you get the answer you want'], ['Så att försöket går snabbare', 'So the experiment goes faster'], ['Det behövs aldrig', 'It is never needed']],
  ['Enstaka mätningar kan bli fel av slump. Flera upprepningar visar om resultatet håller och gör det möjligt att räkna medelvärde.', 'Single measurements can be wrong by chance. Several repeats show whether the result holds and let you calculate an average.']);
fx('mass', 'method', [4, 5],
  ['Vilket instrument använder man för att mäta massa (hur mycket något väger)?', 'Which instrument do you use to measure mass (how heavy something is)?'],
  ['En våg', 'A balance or scale'],
  [['En termometer', 'A thermometer'], ['Ett måttband', 'A tape measure'], ['Ett stoppur', 'A stopwatch']],
  ['Massa mäts med våg i gram eller kilogram. Termometern mäter temperatur, måttbandet längd och stoppuret tid.', 'Mass is measured with a balance in grams or kilograms. A thermometer measures temperature, a tape measure length and a stopwatch time.']);
fx('precision', 'method', [6, 7],
  ['En kopparbit väger egentligen 12,01 g. Fem mätningar på en våg ger 12,31 g, 12,30 g, 12,32 g, 12,31 g och 12,30 g. Hur kan mätningarna beskrivas?', 'A piece of copper really has a mass of 12.01 g. Five readings on a balance give 12.31 g, 12.30 g, 12.32 g, 12.31 g and 12.30 g. How can the readings be described?'],
  ['Hög precision men låg noggrannhet (fel nivå)', 'High precision but low accuracy'],
  [['Hög precision och hög noggrannhet', 'High precision and high accuracy'], ['Låg precision men hög noggrannhet', 'Low precision but high accuracy'], ['Låg precision och låg noggrannhet', 'Low precision and low accuracy']],
  ['Mätningarna ligger mycket nära varandra (hög precision) men ungefär 0,3 g från det rätta värdet (låg noggrannhet). Vågen är troligen felinställd.', 'The readings are very close to each other (high precision) but about 0.3 g from the true value (low accuracy). The balance is probably not set correctly.']);

// ======================= ENERGI =======================
fx('solarpanel', 'energy', [4, 5, 6],
  ['Vad gör en solcell?', 'What does a solar cell do?'],
  ['Omvandlar ljus till elektrisk energi', 'Turns light into electrical energy'],
  [['Omvandlar värme till ljus', 'Turns heat into light'], ['Lagrar solljus till natten', 'Stores sunlight for the night'], ['Omvandlar elektricitet till ljus', 'Turns electricity into light']],
  ['Solceller omvandlar ljusenergi direkt till elektricitet. En lampa gör tvärtom.', 'Solar cells turn light energy directly into electricity. A lamp does the opposite.']);
fx('powerplant', 'energy', [5, 6, 7],
  ['Vilket kraftverk passar alla tre beskrivningarna? 1) Det släpper inte ut koldioxid när det gör el. 2) Det använder inte vatten. 3) Det använder inte rörelseenergi för att driva en generator.', 'Which power plant fits all three descriptions? 1) It releases no carbon dioxide while making electricity. 2) It does not use water. 3) It does not use motion energy to drive a generator.'],
  ['Solkraftverk med solceller', 'Solar power plant with solar cells'],
  [['Kärnkraftverk', 'Nuclear power plant'], ['Vindkraftverk', 'Wind power plant'], ['Vattenkraftverk', 'Hydroelectric power plant']],
  ['Vindkraft och vattenkraft använder rörelseenergi. Kärnkraft värmer vatten till ånga som driver turbiner. Solceller gör el direkt av ljus.', 'Wind and hydro power use motion energy. Nuclear power heats water into steam that drives turbines. Solar cells make electricity directly from light.']);
fx('foodenergy', 'energy', [4, 5, 6],
  ['I vilken form är energin i maten lagrad?', 'In what form is the energy in food stored?'],
  ['Kemisk energi', 'Chemical energy'],
  [['Rörelseenergi', 'Motion energy'], ['Ljudenergi', 'Sound energy'], ['Elektrisk energi', 'Electrical energy']],
  ['Maten innehåller kemisk energi. Kroppen gör om den till rörelse, värme och allt annat vi behöver.', 'Food contains chemical energy. The body turns it into movement, heat and everything else we need.']);
fx('dropball', 'energy', [6, 7],
  ['En boll släpps från ett högt fönster. Vilken energiomvandling sker medan den faller?', 'A ball is dropped from a high window. Which energy change happens as it falls?'],
  ['Lägesenergi blir rörelseenergi', 'Potential energy turns into motion (kinetic) energy'],
  [['Rörelseenergi blir lägesenergi', 'Motion energy turns into potential energy'], ['Kemisk energi blir ljus', 'Chemical energy turns into light'], ['Elektrisk energi blir värme', 'Electrical energy turns into heat']],
  ['Högt upp har bollen lägesenergi. Ju längre den faller, desto snabbare går den: lägesenergin omvandlas till rörelseenergi.', 'High up the ball has potential energy. The further it falls the faster it goes: potential energy turns into kinetic energy.']);
fx('hydro', 'energy', [4, 5, 6],
  ['Vilket kraftverk använder strömmande vattens rörelse för att göra el?', 'Which power plant uses the movement of flowing water to make electricity?'],
  ['Vattenkraftverk', 'Hydroelectric power plant'],
  [['Solkraftverk', 'Solar power plant'], ['Vindkraftverk', 'Wind power plant'], ['Kolkraftverk', 'Coal power plant']],
  ['I ett vattenkraftverk får vatten som strömmar ner från en damm turbiner att snurra, och de driver en generator.', 'In a hydroelectric plant water flowing down from a dam spins turbines, which drive a generator.']);

// ======================= GENERATORER (slumpade tal) =======================

// Hävstång/gungbräda i jämvikt: m1 · d1 = m2 · d2
function leverSvg(m1, d1, m2) {
  const W = 360, cx = 180, y = 60, step = 36;
  let s = `<svg viewBox="0 0 ${W} 180" class="fig" role="img">`;
  s += `<polygon points="${cx - 18},118 ${cx + 18},118 ${cx},${y + 4}" fill="#94a3b8" stroke="#1f2a44" stroke-width="2"/>`;
  s += `<rect x="20" y="${y - 5}" width="${W - 40}" height="10" rx="4" fill="#f59e0b" stroke="#1f2a44" stroke-width="2"/>`;
  for (let i = 1; i <= 4; i++) {
    for (const side of [-1, 1]) {
      const x = cx + side * i * step;
      s += `<line x1="${x}" y1="${y + 5}" x2="${x}" y2="${y + 12}" stroke="#1f2a44" stroke-width="2"/>`;
      s += `<text x="${x}" y="${y - 12}" text-anchor="middle" font-size="13" fill="#5b6785">${i}</text>`;
    }
  }
  const hang = (x, label, color) => `<line x1="${x}" y1="${y + 5}" x2="${x}" y2="${y + 30}" stroke="#1f2a44" stroke-width="2"/><rect x="${x - 22}" y="${y + 30}" width="44" height="30" rx="5" fill="${color}" stroke="#1f2a44" stroke-width="2"/><text x="${x}" y="${y + 50}" text-anchor="middle" font-size="13" fill="#fff">${label}</text>`;
  s += hang(cx - d1 * step, `${m1} g`, '#ef4444');
  s += `<rect x="${W - 82}" y="${y + 70}" width="60" height="30" rx="5" fill="#3b82f6" stroke="#1f2a44" stroke-width="2"/><text x="${W - 52}" y="${y + 90}" text-anchor="middle" font-size="13" fill="#fff">${m2} g</text>`;
  return s + '</svg>';
}
sci('lever', 'forces', [4, 5, 6, 7], (r) => {
  for (;;) {
    const d1 = r.int(1, 4), d2 = r.int(1, 4);
    if (d1 === d2) continue;
    const k = r.pick([10, 15, 20, 25, 30]);
    const m1 = k * d2, m2 = k * d1; // m1·d1 = m2·d2
    if (m1 > 120 || m2 > 120) continue;
    return {
      q: L(`Gungbrädan har krokar på 1–4 steg från mitten på varje sida. Den röda vikten (${m1} g) hänger på steg ${d1} till vänster. På vilket steg till höger måste den blå vikten (${m2} g) hängas för att brädan ska väga jämnt?`,
        `The balance has hooks 1–4 steps from the middle on each side. The red weight (${m1} g) hangs at step ${d1} on the left. At which step on the right must the blue weight (${m2} g) hang to make it balance?`),
      visual: leverSvg(m1, d1, m2), ans: L(`Steg ${d2}`, `Step ${d2}`),
      wrong: [1, 2, 3, 4].filter((x) => x !== d2).map((x) => L(`Steg ${x}`, `Step ${x}`)),
      ex: L(`Jämvikt när vikt × avstånd är lika på båda sidor: ${m1} × ${d1} = ${m1 * d1}. ${m1 * d1} ÷ ${m2} = ${d2}, alltså steg ${d2}.`,
        `It balances when weight × distance is equal on both sides: ${m1} × ${d1} = ${m1 * d1}. ${m1 * d1} ÷ ${m2} = ${d2}, so step ${d2}.`),
    };
  }
});

sci('tugofwar', 'forces', [4, 5, 6], (r) => {
  const b = r.int(3, 8) * 10 + r.int(0, 9), mom = r.int(10, 15) * 10;
  const need = mom - b + 1;
  const n1 = r.pick(['Axel', 'Saga', 'Omar']), n2 = r.pick(['Ella', 'Leo', 'Maja']);
  return {
    q: L(`${n1} och ${n2} drar repet åt ena hållet, och deras pappa drar åt andra hållet med ${mom} N. ${n2} drar med ${b} N. Hur hård kraft (i hela newton) måste ${n1} minst dra med för att barnen ska vinna?`,
      `${n1} and ${n2} pull the rope one way, and their dad pulls the other way with ${mom} N. ${n2} pulls with ${b} N. What is the smallest force (in whole newtons) ${n1} must pull with for the children to win?`),
    visual: '<div class="emoji-row">🧒🧒 ➖➖🪢➖➖ 🧔</div>',
    ans: need, unit: L('N', 'N'), wrong: [mom - b, need + 1, mom + b, need - 2],
    ex: L(`Barnen vinner om deras sammanlagda kraft är större än pappans ${mom} N. ${mom} − ${b} = ${mom - b} N räcker bara till oavgjort, så ${n1} behöver minst ${need} N.`,
      `The children win if their total force is bigger than dad's ${mom} N. ${mom} − ${b} = ${mom - b} N only gives a draw, so ${n1} needs at least ${need} N.`),
  };
});

const MELT = [
  { sv: 'is', en: 'ice', t: 0 }, { sv: 'smör', en: 'butter', t: 35 }, { sv: 'paraffin (stearinljus)', en: 'paraffin wax', t: 60 },
  { sv: 'naftalen', en: 'naphthalene', t: 80 }, { sv: 'svavel', en: 'sulphur', t: 115 }, { sv: 'tenn', en: 'tin', t: 232 },
  { sv: 'bly', en: 'lead', t: 327 }, { sv: 'aluminium', en: 'aluminium', t: 660 }, { sv: 'silver', en: 'silver', t: 962 },
];
sci('melt', 'heat', [4, 5, 6], (r) => {
  for (;;) {
    const items = r.shuffle(MELT).slice(0, 4).sort((a, b) => a.t - b.t);
    const k = items.filter((x) => x.t < 100).length;
    if (k === 0 || k === 4) continue;
    const list = (arr, lang) => (arr.length ? arr.map((x) => x[lang]).join(', ') : (lang === 'sv' ? 'inga' : 'none'));
    const melts = items.slice(0, k);
    const opts = [1, 2, 3, 4].map((n) => items.slice(0, n));
    const table = (lang) => `<table class="magic wide"><tr><th>${lang === 'sv' ? 'Ämne' : 'Substance'}</th><th>${lang === 'sv' ? 'Smältpunkt' : 'Melting point'}</th></tr>${items.map((x) => `<tr><td style="font-size:1.1rem">${x[lang]}</td><td>${x.t} °C</td></tr>`).join('')}</table>`;
    return {
      q: L('Vatten kokar i en kastrull (100 °C). Du ställer en kopp med ett fast ämne i det kokande vattnet. Tabellen visar ämnenas smältpunkter. Vilka ämnen kan smälta i koppen?',
        'Water is boiling in a pan (100 °C). You put a cup holding a solid substance into the boiling water. The table shows the melting points. Which substances can melt in the cup?'),
      visual: L(table('sv'), table('en')),
      ans: L(list(melts, 'sv'), list(melts, 'en')),
      wrong: opts.filter((o) => o.length !== k).map((o) => L(list(o, 'sv'), list(o, 'en'))),
      ex: L(`Kokande vatten blir inte varmare än 100 °C. Bara ämnen med smältpunkt under 100 °C smälter: ${list(melts, 'sv')}.`,
        `Boiling water does not get hotter than 100 °C. Only substances that melt below 100 °C will melt: ${list(melts, 'en')}.`),
    };
  }
});

sci('thunder', 'light', [5, 6, 7], (r) => {
  const s = r.int(2, 9), d = s * 340;
  return {
    q: L(`Du ser en blixt och räknar till ${s} sekunder innan du hör åskan. Ljudet färdas ungefär 340 meter per sekund. Ungefär hur långt bort slog blixten ner?`,
      `You see a flash of lightning and count ${s} seconds before you hear the thunder. Sound travels about 340 metres per second. About how far away did the lightning strike?`),
    ans: d, unit: L('m', 'm'), wrong: [340 + s, Math.round(340 / s), d * 2, d - 340],
    ex: L(`Ljuset når dig nästan direkt, så tiden är ljudets restid: ${s} × 340 = ${d} meter (ungefär ${(d / 1000).toFixed(1).replace('.', ',')} km).`,
      `The light reaches you almost instantly, so the time is how long the sound took: ${s} × 340 = ${d} metres (about ${(d / 1000).toFixed(1)} km).`),
  };
});

sci('moonweight', 'space', [5, 6, 7], (r) => {
  const m = r.int(2, 9) * 6, wE = m * 10, wM = wE / 6;
  return {
    q: L(`En robot har massan ${m} kg och tyngden ungefär ${wE} N på jorden. Tyngdkraften på månen är ungefär en sjättedel av jordens. Vad gäller för roboten på månen?`,
      `A robot has a mass of ${m} kg and weighs about ${wE} N on Earth. Gravity on the Moon is about one sixth of Earth's. What is true for the robot on the Moon?`),
    ans: L(`Massan är ${m} kg och tyngden ungefär ${wM} N`, `Its mass is ${m} kg and its weight about ${wM} N`),
    wrong: [L(`Massan är ${m / 6} kg och tyngden ungefär ${wM} N`, `Its mass is ${m / 6} kg and its weight about ${wM} N`),
      L(`Massan är ${m} kg och tyngden ungefär ${wE} N`, `Its mass is ${m} kg and its weight about ${wE} N`),
      L(`Massan är ${m * 6} kg och tyngden ungefär ${wE * 6} N`, `Its mass is ${m * 6} kg and its weight about ${wE * 6} N`)],
    ex: L(`Massan (hur mycket materia) är densamma överallt. Tyngden är kraften från tyngdkraften, och på månen blir den ${wE} ÷ 6 = ${wM} N.`,
      `Mass (the amount of matter) is the same everywhere. Weight is the pull of gravity, and on the Moon it is ${wE} ÷ 6 = ${wM} N.`),
  };
});

sci('dissolve', 'chemistry', [4, 5, 6], (r) => {
  const w = r.int(10, 40) * 10, s = r.int(5, 40), sub = r.pick([L('salt', 'salt'), L('socker', 'sugar')]);
  return {
    q: L(`En bägare med ${w} g vatten står på en våg. Du häller i ${s} g ${sub.sv} och rör tills allt har löst sig och inte syns längre. Vad visar vågen nu (bägaren räknas inte med)?`,
      `A beaker with ${w} g of water stands on a scale. You pour in ${s} g of ${sub.en} and stir until it has all dissolved and can no longer be seen. What does the scale show now (not counting the beaker)?`),
    ans: w + s, unit: L('g', 'g'), wrong: [w, w - s, w + 2 * s, w + Math.round(s / 2)],
    ex: L(`Ämnet försvinner inte, det delas upp i så små delar att man inte ser dem. Massan bevaras: ${w} + ${s} = ${w + s} g.`,
      `The substance does not disappear, it splits into pieces too small to see. Mass is conserved: ${w} + ${s} = ${w + s} g.`),
  };
});

sci('density', 'chemistry', [6, 7], (r) => {
  for (;;) {
    const v = r.pick([10, 20, 25, 40, 50, 100]), d10 = r.pick([3, 5, 7, 8, 9, 11, 12, 15, 19, 27, 79]);
    const m = (v * d10) / 10;
    if (!Number.isInteger(m)) continue;
    const dens = d10 / 10, floats = d10 < 10;
    const dStr = (lang) => (lang === 'sv' ? String(dens).replace('.', ',') : String(dens));
    return {
      q: L(`En kloss har volymen ${v} cm³ och massan ${m} g. Vattnets densitet är 1 g/cm³. Vad gäller för klossen?`,
        `A block has a volume of ${v} cm³ and a mass of ${m} g. The density of water is 1 g/cm³. What is true of the block?`),
      ans: L(`Densiteten är ${dStr('sv')} g/cm³ och den ${floats ? 'flyter' : 'sjunker'}`, `Its density is ${dStr('en')} g/cm³ and it ${floats ? 'floats' : 'sinks'}`),
      wrong: [L(`Densiteten är ${dStr('sv')} g/cm³ och den ${floats ? 'sjunker' : 'flyter'}`, `Its density is ${dStr('en')} g/cm³ and it ${floats ? 'sinks' : 'floats'}`),
        L(`Densiteten är ${m * v} g/cm³ och den sjunker`, `Its density is ${m * v} g/cm³ and it sinks`),
        L(`Densiteten är ${String(Math.round((v / m) * 100) / 100).replace('.', ',')} g/cm³ och den ${floats ? 'sjunker' : 'flyter'}`, `Its density is ${Math.round((v / m) * 100) / 100} g/cm³ and it ${floats ? 'sinks' : 'floats'}`)],
      ex: L(`Densitet = massa ÷ volym = ${m} ÷ ${v} = ${dStr('sv')} g/cm³. Det är ${floats ? 'mindre' : 'mer'} än vattnets 1 g/cm³, så klossen ${floats ? 'flyter' : 'sjunker'}.`,
        `Density = mass ÷ volume = ${m} ÷ ${v} = ${dStr('en')} g/cm³. That is ${floats ? 'less' : 'more'} than water's 1 g/cm³, so the block ${floats ? 'floats' : 'sinks'}.`),
    };
  }
});

sci('temperature', 'heat', [4, 5], (r) => {
  const a = -r.int(2, 15), b = r.int(3, 20), diff = b - a;
  return {
    q: L(`På morgonen visade termometern ${N(a)} °C. På eftermiddagen visade den ${b} °C. Hur många grader steg temperaturen?`,
      `In the morning the thermometer showed ${N(a)} °C. In the afternoon it showed ${b} °C. By how many degrees did the temperature rise?`),
    ans: diff, unit: L('°C', '°C'), wrong: [b + a, b, diff + 1, diff - 2],
    ex: L(`Från ${N(a)} till 0 är ${-a} grader, och från 0 till ${b} är ${b} grader. Totalt ${-a} + ${b} = ${diff} grader.`,
      `From ${N(a)} to 0 is ${-a} degrees, and from 0 to ${b} is ${b} degrees. In total ${-a} + ${b} = ${diff} degrees.`),
  };
});

sci('energychain', 'ecology', [6, 7], (r) => {
  const E = r.pick([10000, 20000, 50000, 100000]);
  const fmt = (x, lang) => x.toLocaleString(lang === 'sv' ? 'sv-SE' : 'en-GB');
  return {
    q: L(`I en näringskedja går ungefär 10 % av energin vidare till nästa led. Växterna (gräs) innehåller ${fmt(E, 'sv')} kJ. Ungefär hur mycket energi når räven i kedjan gräs → hare → räv?`,
      `In a food chain about 10 % of the energy passes on to the next level. The plants (grass) contain ${fmt(E, 'en')} kJ. About how much energy reaches the fox in the chain grass → hare → fox?`),
    ans: L(`${fmt(E / 100, 'sv')} kJ`, `${fmt(E / 100, 'en')} kJ`),
    wrong: [L(`${fmt(E / 10, 'sv')} kJ`, `${fmt(E / 10, 'en')} kJ`), L(`${fmt(E / 1000, 'sv')} kJ`, `${fmt(E / 1000, 'en')} kJ`), L(`${fmt(E * 0.8, 'sv')} kJ`, `${fmt(E * 0.8, 'en')} kJ`)],
    ex: L(`Haren får 10 % av ${fmt(E, 'sv')} = ${fmt(E / 10, 'sv')} kJ. Räven får 10 % av det: ${fmt(E / 100, 'sv')} kJ. Resten används till liv och rörelse eller blir värme.`,
      `The hare gets 10 % of ${fmt(E, 'en')} = ${fmt(E / 10, 'en')} kJ. The fox gets 10 % of that: ${fmt(E / 100, 'en')} kJ. The rest is used for living and moving or lost as heat.`),
  };
});

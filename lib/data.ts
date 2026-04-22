import { createClient } from "@/lib/supabase/client"
import { runSupabaseQuery, DatabaseRequestError } from "@/lib/supabase/request"

const supabase = createClient()

const DB_REQUEST_TIMEOUT_MS = 7000

export { DatabaseRequestError as SupabaseDataUnavailableError }

export async function getStories() {
  try {
    const storiesQuery = supabase
        .from("content")
        .select("id, title, thumbnail_url, creator_name, rank")
        .eq("type", "story")
        .order("created_at", { ascending: false })

    const { data } = await runSupabaseQuery(
      Promise.resolve(storiesQuery) as Promise<{ data: any[] | null; error: { message?: string } | null }>,
      DB_REQUEST_TIMEOUT_MS
    )

    return data || []
  } catch (error: unknown) {
    if (error instanceof DatabaseRequestError) {
      throw error
    }
    throw new DatabaseRequestError("query")
  }
}

export async function getFilms() {
  try {
    const filmsQuery = supabase
        .from("content")
        .select("id, title, thumbnail_url, creator_name, views, rank")
        .eq("type", "film")
        .order("created_at", { ascending: false })

    const { data } = await runSupabaseQuery(
      Promise.resolve(filmsQuery) as Promise<{ data: any[] | null; error: { message?: string } | null }>,
      DB_REQUEST_TIMEOUT_MS
    )

    return data || []
  } catch (error: unknown) {
    if (error instanceof DatabaseRequestError) {
      throw error
    }
    throw new DatabaseRequestError("query")
  }
}


// // =======================
// // ALL STORIES
// // =======================

// export const Stories = [
//   {
//     id: 1,
//     title: "Freaky",
//     image: "https://i.pinimg.com/736x/7e/a3/8a/7ea38a97108bf77e19e913cd21a04b66.jpg",
//     likes: 2400,
//     author: "Aanya Sen",
//     language: "English",
//     type: "Horror Comedy",
//     releaseDate: "2025-01-18",
//     runtimeMin: 37,
//     chapters: 6,
//     content:
//       "A shy caretaker trades bodies with a thrill-seeking stranger and the town begins to unravel. Each chapter flips the power dynamic as secrets surface under neon nights.",
//   },
//   {
//     id: 2,
//     title: "The Old Guard",
//     image: "https://i.pinimg.com/736x/c5/2c/86/c52c863c4fb3a7688e90738aa6358650.jpg",
//     likes: 1980,
//     author: "Kabir Mehta",
//     language: "English",
//     type: "Action Fantasy",
//     releaseDate: "2025-03-08",
//     runtimeMin: 44,
//     chapters: 8,
//     content:
//       "An immortal squad hides in plain sight until a new recruit exposes their lineage. The series blends kinetic battles with quiet, centuries-long grief.",
//   },
//   {
//     id: 3,
//     title: "You Should Have Left",
//     image: "https://i.pinimg.com/1200x/5f/8f/4e/5f8f4e079243d252eae23d19081ce7a4.jpg",
//     likes: 1750,
//     author: "Riya Nair",
//     language: "English",
//     type: "Psychological Thriller",
//     releaseDate: "2024-10-22",
//     runtimeMin: 39,
//     chapters: 7,
//     content:
//       "A writer retreats to a modern house that bends space and memory. The deeper the story goes, the more the walls answer back.",
//   },
//   {
//     id: 4,
//     title: "In the Tall Grass",
//     image: "https://i.pinimg.com/1200x/ae/cf/66/aecf664bfcfc56be280f3424f3800905.jpg",
//     likes: 1600,
//     author: "Ishaan Varma",
//     language: "English",
//     type: "Survival Mystery",
//     releaseDate: "2024-09-12",
//     runtimeMin: 41,
//     chapters: 9,
//     content:
//       "Siblings step into a field that rearranges itself and splits time. The only way out is to understand who is calling for help.",
//   },
//   {
//     id: 5,
//     title: "Fragments",
//     image: "https://i.pinimg.com/1200x/ef/61/b1/ef61b1df0385cb7d62fb0b2ca8ead243.jpg",
//     likes: 1450,
//     author: "Leena Kapoor",
//     language: "English",
//     type: "Drama",
//     releaseDate: "2025-05-05",
//     runtimeMin: 36,
//     chapters: 5,
//     content:
//       "A city photographer finds a film reel that rewrites her past. Each chapter pieces together a family history she was never told.",
//   },
//   {
//     id: 6,
//     title: "Midnight Confession",
//     image: "https://i.pinimg.com/1200x/0f/52/a6/0f52a62df40a8aa3c43698f55abcd6bf.jpg",
//     likes: 1320,
//     author: "Arjun Rao",
//     language: "English",
//     type: "Noir Romance",
//     releaseDate: "2025-07-19",
//     runtimeMin: 43,
//     chapters: 8,
//     content:
//       "A late-night radio host receives a confession that mirrors his own. The story spirals through smoky alleys, old tapes, and second chances.",
//   },
//   {
//     id: 7,
//     title: "Silent Frame",
//     image: "https://i.pinimg.com/1200x/bb/57/19/bb57196d92d352f303c65f99dc52433f.jpg",
//     likes: 1200,
//     author: "Mira Bose",
//     language: "English",
//     type: "Mystery Drama",
//     releaseDate: "2025-08-30",
//     runtimeMin: 38,
//     chapters: 6,
//     content:
//       "A missing editor leaves behind a cut that was never released. The frames between scenes hide the truth everyone agreed to forget.",
//   },
//   {
//     id: 8,
//     title: "Last Scene",
//     image: "https://i.pinimg.com/1200x/bb/9d/18/bb9d18d6f787f9b71aa85d99fe3f4fa2.jpg",
//     likes: 1080,
//     author: "Dev Malhotra",
//     language: "English",
//     type: "Crime Thriller",
//     releaseDate: "2025-11-14",
//     runtimeMin: 42,
//     chapters: 7,
//     content:
//       "A fading actor becomes the last witness to a staged crime. Each chapter plays like a take that should not exist.",
//   },
//   {
//     id: 9,
//     title: "Lost Letters",
//     image: "https://i.pinimg.com/1200x/3a/c8/52/3ac852c487bad87fae6d0cd5b715fae7.jpg",
//     likes: 970,
//     author: "Sara Qureshi",
//     language: "English",
//     type: "Historical Drama",
//     releaseDate: "2024-12-03",
//     runtimeMin: 40,
//     chapters: 8,
//     content:
//       "Letters found in a railway station link three generations. The story moves across decades as love and duty compete.",
//   },
//   {
//     id: 10,
//     title: "Parallel Lines",
//     image: "https://i.pinimg.com/1200x/eb/a5/21/eba521ec6e112dda9ea871c1f2f7f466.jpg",
//     likes: 860,
//     author: "Neil Fernandes",
//     language: "English",
//     type: "Sci-Fi Drama",
//     releaseDate: "2025-02-02",
//     runtimeMin: 35,
//     chapters: 6,
//     content:
//       "Two commuters on parallel trains receive messages from each other across timelines. The series explores how small choices redraw a life.",
//   },
//   {
//     id: 11,
//     title: "The Monkey King",
//     image: "https://i.pinimg.com/1200x/a4/ff/ef/a4ffef3daaa7124fc801883983d05e54.jpg",
//     likes: 24000,
//     author: "Neil Fernandes",
//     language: "Mandarin",
//     type: "fantasy, adventure, and mythological fiction",
//     releaseDate: "September 23, 2013",
//     runtimeMin: 37,
//     chapters: 6,
//     content:
//       `The Story of Sun Wukong, the Monkey King
// September 23, 2013Jim R. McClanahan
// One of the most famous primate characters in world literature appears in the great Chinese classic Journey to the West (Xiyouji, 西遊記, 1592 CE). The story follows the adventures of Sun Wukong (孫悟空, a.k.a. “Monkey”) (fig. 1), an immortal rhesus macaque demon, who gains extraordinary power via spiritual cultivation and rebels against the primacy of heaven. Like Loki in Norse mythology and Lucifer in Judeo-Christian mythology, this trickster god falls from grace when a supreme deity, in this case the Buddha, banishes him to an earthly prison below. But unlike his western counterparts, the monkey repents, becoming a monk and agreeing to use his abilities to protect a Buddhist priest on his journey to collect sutras from India.

// What follows is an overview of Monkey’s story. It will primarily focus on the first seven of the novel’s 100 chapters, but chapters eight through 100 will be briefly touched upon, along with lesser-known literary sequels to Journey to the West. I will also discuss the novel’s impact on pop culture and religion.

// I. Story
// In the beginning, the mystical energies of heaven and earth and the light of the sun and moon come together to impregnate a boulder high atop the Mountain of Flowers and Fruit (Huaguo shan, 花果山), an island that lies to the east of the easternmost continent in the Buddhist disc world system. The stone gestates for countless ages until the Zhou Dynasty (1046-256 BCE), when it hatches a stone egg that is eroded by the elements into a simian shape. The Stone Monkey (Shihou, 石猴) awakens and bows to the four cardinal directions as light bursts forth from his eyes. The light is so bright that it reaches heaven, alarming the Jade Emperor (Yuhuang dadi, 玉皇大帝) and his celestial retinue. The light soon subsides, however, once he ingests food for the first time.

// The Stone Monkey happens upon other primates on the island and becomes their king when he proves himself in a test of bravery by blindly leaping through a waterfall, thereby discovering a long-forgotten immortal’s cave. He rules the mountain for over three centuries before the fear of death finally creeps in. One of his primate advisors suggests that the king finds a transcendent to teach him the secrets of eternal life, and so Monkey sets sail on a makeshift raft and explores the world for ten years. His quest eventually takes him to the western continent, where he is finally accepted as a student by the Buddho-Daoist sage Subodhi (Xuputi, 须菩提). He is given the religious name Sun Wukong, meaning “monkey awakened to emptiness” or “monkey who realizes sunyata.” The sage teaches him the 72 methods of earthly transformation, or endless ways of changing his shape and size; cloud somersaulting, or a type of flying that allows him to travel 108,000 li (33,554 mi / 54,000 km) in a single leap; all manner of magical spells to call forth gods and spirits, grow or shrink to any size, part fire and water, create impassable barriers, conjure wind storms, cast illusions, freeze people in place, make endless clones of himself, 
// unlock any lock, bestow superhuman strength, bring the dead back to life, etc.; traditional medicine; armed and unarmed martial arts; and, most importantly, an internal breathing method that results in his immortality. He is later disowned by the sage for selfishly showing off his new found magical skills to his less accomplished classmates.

// Sun eventually returns to his cave and faces a demon who had terrorized his people during his prolonged absence. After killing the monster, he realizes that he needs a weapon to match his celestial power, and so his advisor suggests that he go to the undersea palace of Ao Guang (敖廣), the Dragon King of the Eastern Sea. There, he tries out several weapons weighing thousands of pounds, but each one is too light. He finally settles on a massive nine-ton iron pillar that was originally used by Yu the Great (Dayu, 大禹) to set the depths of the fabled world flood, as well as to calm the seas. Named the “As-You-Will Gold-Banded Cudgel” (Ruyi jingu bang, 如意金箍棒), the iron responds to Sun’s touch and follows his command to shrink or grow to his whim, thus signifying that this weapon was fated to be his. In addition to the staff, Monkey bullies the Dragon King’s royal brothers into giving him a magical suit of armor.

// Shortly after returning home to the Mountain of Flowers and Fruit, he shows off his new weapon by turning into a frightful cosmic giant and commanding the staff to grow, with the top touching the highest heaven and the bottom the lowest hell. This display of power prompts demon kings of the 72 caves to submit to his rule and host a drunken party in his honor. Soon after falling asleep, Sun is visited by two psychopomps who drag his soul to the Chinese underworld of Diyu (地獄). There, he learns that he was fated to die at the allotted age of 342 years old. But this enrages Monkey since his immortality freed him from the cycle of rebirth, and so he bullies the kings of hell in to bringing him the ledger containing his info. He promptly crosses out his name with ink, as well as the names of all monkeys on earth, thus making them immortal, too. He wakes up in the mortal world when his soul returns to his body.

// n8mflz
// Fig. 1 – A modern depiction of Sun Wukong (by the author) (larger version).

// Both the Eastern Dragon King and the Hell King Qinguang (秦廣王) submit memorials to heaven concerning Sun’s misconduct. But the court advisor, an embodiment of the planet Venus, convinces the Jade Emperor to give Sun the menial task of watching over the Heavenly Horses in order to avoid further conflict. Monkey accepts and steadfastly performs his duties, that is until he learns that he’s just a glorified stable boy. He immediately returns to his earthly home in rebellion to proclaim himself the “Great Sage Equaling Heaven” (Qitian dasheng, 齊天大聖). The celestial realm mobilizes an army of powerful demon hunters, including the Heavenly King Li Jing (Li Jing tianwang, 李靖天王) and his son, the child god Third Prince Nezha (Nezha santaizi, 哪吒三太子), but they all fall to Monkey’s magical and martial might. The embodiment of the planet Venus once again steps in to convince the Jade Emperor to acquiesce to Monkey’s demand for higher rank, thereby granting him the empty title of Great Sage Equaling Heaven and even promoting him to watch over the immortal peach groves.

// Sun takes stock of the magical peaches that ripen every few thousand years, but he eventually succumbs to their heavenly aroma. He eats all but the youngest life-prolonging fruits, thus gaining another level of immortality. His theft is soon discovered, however, when fairy attendants of the Queen Mother of the West (Xiwangmu, 西王母) arrive to pick the choicest specimens for her long-awaited immortal peach banquet. Sun is alerted to there presence and, upon questioning, learns that he has not been invited. Naturally, Sun becomes enraged, freezing the maidens in place with fixing magic and then crashes the party before the hallowed guests arrive. He eats all of the celestial food and drinks all of the immortal wine, and then drunkenly stumbles into the laboratory of Laozi (老子), a high god of Daoism. There, he gobbles up the deity’s alchemically-derived elixir pills, thereby adding several more levels of immortality.

// Sun returns home once again to await the coming storm of heavenly forces. Tired of the demon’s antics, the Jade Emperor calls up 72 heavenly generals, comprising the most powerful Buddhist and Daoist gods, and 100,000 celestial soldiers. In response, Monkey mobilizes his own army comprising the demon kings of the 72 caves and all manner of animal spirits, including his own monkey soldiers. But soon after the battle commences, the demon kings fall to heavenly troops, forcing Sun to take on three heads and six arms and multiply his iron cudgel to meet the onslaught. Once again, the heavenly army is no match for him. However, he soon loses his nerve when his monkey children are captured in great heavenly nets. He flees with Erlang (Erlang shen, 二郎神), a master of magic and the nephew of the Jade Emperor, taking chase. The two battle through countless animal transformations, each trying to one-up the other. Monkey is finally captured when Laozi drops a magical steel bracelet on his head, incapacitating him long enough for Erlang’s celestial hound to bite hold of his leg.

// Sun is taken to heaven to be executed for his crimes, but fire, lightning, and edged weapons have no effect on his invincible body. Laozi then suggests that they put him inside of the deity’s alchemical furnace to reduce the demon to ashes. They check the furnace 49 days later expecting to see his rendered remains; however, Monkey jumps out unscathed, having found protection in the wind element (xun, 巽) of the eight trigrams. But intense smoke inside the furnace had greatly irritated his eyes, refining his pupils the color of gold and giving them the power to recognize the dark auras of demons in disguise. He overturns the furnace and begins to cause havoc in heaven with his iron cudgel. The Jade Emperor beseeches the Buddha (Rulai, 如来) in the Western Paradise to intervene.

// The Tathagata appears and declares that he will make Sun the new ruler of heaven if the macaque can simply jump out of his palm. Monkey agrees to the wager, and with one tremendous leap, speeds towards the reaches of heaven. He lands before five great pillars, thinking them to be the edge of the cosmos. He tags one with his name and urinates at the base of another in order to prove that he had been there. Upon returning, Sun demands the throne; however, the Buddha reveals that the five pillars were actually his fingers, meaning that the Great Sage had never left. But before Monkey can do anything, the Tathagata overturns his hand, pushing it out the gates of heaven, and transforming it into the Five Elements Mountain (Wuxing shan, 五行山). There, Sun is imprisoned for his crimes against heaven.

// Chapters thirteen to 100 tell how six hundred years later Sun is released during the Tang Dynasty (618-907) to help escort the Buddhist monk Tripitaka (Sanzang, 三藏) (whose early story is told in chapters eight to twelve), a disciple of the Buddha in a previous life, on a quest to retrieve salvation-bestowing scriptures from India. The Bodhisattva Guanyin (觀音) gives the monk a golden headband (jingu, 金箍; a.k.a. jingu, 緊箍, lit: “tight fillet”) as a means to rein in Monkey’s unruly nature. It tightens around Sun’s head whenever a magic formula is recited, causing him great pain. In addition, Guanyin gives Monkey three magic hairs on the back of his neck that can transform into anything he desires to aid in his protection of the monk. Along the way, the two meet other monsters-turned-disciples—Zhu Bajie (猪八戒), the lecherous pig demon, Sha Wujing (沙悟净), the complacent water demon, and the White Dragon Horse (Bailongma, 白龍馬), a royal serpent transformed into an equine—who agree to aid in the monk’s defense. Monkey battles all sorts of ghosts, monsters, demons, and gods along the way. In the end, he is granted Buddhahood and given the title of the “Victorious Fighting Buddha” (Dou zhanzheng fo, 鬥戰勝佛) for protecting Tripitaka over the long journey.

// A summary of all 100 chapters can be read on my friend’s blog (fig. 2).

// https://journeytothewestlibrary.weebly.com/novel-summary



// Fig. 2 – The summary header (larger version).

// II. Sequels
// There are a total of four unofficial sequels to the novel.

// The first is called A Supplement to the Journey to the West (Xiyoubu, 西游补, 1640), which takes place between chapters 61 and 62 of the original. In the story, the Monkey King wanders from one adventure to the next, using a magic tower of mirrors and a Jade doorway to travel to different points in time. In the Qin Dynasty (221–206 BCE), he disguises himself as Consort Yu in order to locate a magic weapon needed for his quest to India. During the Song Dynasty (960–1279), he serves in place of King Yama as the judge of Hell. After returning to the Tang Dynasty, he finds that his master Tripitaka has taken a wife and become a general charged with wiping out the physical manifestation of desire (desire being a major theme running through the novelette). Monkey goes on to take part in a great war between all the kingdoms of the world, during which time he faces one of his own children in battle. In the end, he discovers an unforeseen danger that threatens Tripitaka’s life.

// The second is the Later Journey to the West (Hou Xiyouji, 後西遊記, 17th-century). This novel focuses on the adventures of Monkey’s spiritual descendent Sun Luzhen (孫履真, “Monkey who Walks Reality”). I have a three-part article about it (first, second, and third). 

 

// And the third and fourth are the Continuation of the Journey to the West (Xu Xiyouji, 續西遊記, 17th-century) and the New Journey to the West (Xin Xiyouji, 新西遊記, 19th-century), respectively. As of 2023, I have not written any articles on these sequels. 

// III. Cultural Impact
// Stories about Sun Wukong have enthralled people the world over for centuries. His adventures first became popular via oral folktale performances during the Song Dynasty (960-1279). These eventually coalesced into the earliest known version of the novel, The Story of How Tripitaka of the Great Tang Procures the Scriptures (Da Tang Sanzang qujing shihua, 大唐三藏取經詩話; The Story hereafter), published during the late-13th-century.

// Since the anonymous publishing of the complete novel in the 16th-century, Monkey has appeared in numerous paintings, poems, books, operatic stage plays, video games, and films (both live action and animated).

// He was sometimes “channeled,” along with other martial spirits, by citizen soldiers of the anti-foreign Boxer Rebellion (1899-1901). There is also a monkey-based martial art named in his honor.

// It is interesting to note that there are people in southern China, Taiwan, Malaysia, Singapore, Thailand, and Vietnam who worship him as a patron deity. Thus, Sun became so popular that he jumped from oral and published literature to take his place on the family altar.

// Copies of The Story were discovered in Japan among a 17th-century catalog of books in the Kozanji Temple (高山寺, Ch: Gaoshan si). No copies are known to exist in China, which suggests this version came to the island many centuries ago. The complete Ming edition of the novel came to Japan in the late-18th-century, where it was translated in bits and pieces over the course of some seventy years. However, Monkey did not become immensely popular until the first complete translation of the novel was published in 1835. The last part was illustrated with woodblocks by Taito II (fl. 1810-1853), a noted student of famous artist Hokusai (1760-1849).

// Other Japanese artists, such as Kubo Shunman (1757-1820) and Yoshitoshi (1839-1892) (fig. 3), produced beautiful full color woodblock prints of Sun.



// Fig. 3 – (Left) Tsukioka Yoshitoshi, “Jade Rabbit – Sun Wukong”, October 10, 1889 (larger version). Fig 4. – (Right) Son Goku (孫悟空) from the Dragonball Franchise (larger version).

// Like in China, Monkey has been adapted in all kinds of Japanese media. By far, his most famous adaptation is the manga and anime character Son Goku (孫悟空) (fig. 4) from the Dragon Ball (Jp:ドラゴンボール; Ch: Qi longzhu, 七龍珠) franchise (1984-present). Like Sun, Goku has a monkey tail, knows martial arts, fights with a magic staff, and rides on a cloud. His early adventures in Dragon Ball (manga: 1984-1995; anime: 1986-1989) see him traveling the world in search of seven wish-granting “dragon balls,” while also perfecting his fighting abilities and participating in a world martial arts tournament. Several of the supporting characters, such as Oolong (ウーロン), a lecherous anthropomorphic pig who can change his shape, a nod to Zhu Bajie, were directly influenced by the novel. Dragon Ball Z (manga: 1988-1995; anime: 1989-1996), a continuation of the comic book and animated TV show, follows Goku as an adult and reveals that he is actually a humanoid alien sent as a child to destroy Earth. He arrived in a spherical spaceship that recalls the stone egg from which Sun Wukong was formed. But instead of destroying the planet, he becomes its stalwart protector and faces extraterrestrial menaces from beyond the stars. Goku’s adventures have continued in the sequels Dragon Ball GT (1996-1997), Dragon Ball Super (2015-2018), and Super Dragon Ball Heroes (2018-present).`,
//   },
//   {
//     id: 12,
//     title: "Momotaro (Peach Boy)",
//     image: "https://i.pinimg.com/736x/7f/6d/20/7f6d2067e671165f29efb2e0edae5959.jpg",
//     likes: 90345,
//     author: "Iwaya Sazanami",
//     language: "Japanese",
//     type: "fairytale or children's fantasy",
//     releaseDate: "1870–1933",
//     runtimeMin: 35,
//     chapters: 6,
//     content:
//       `Long, long ago there lived, in Japan a brave warrior known to all as Tawara Toda, or “My Lord Bag of Rice.” His true name was Fujiwara Hidesato, and there is a very interesting story of how he came to change his name.

// One day he sallied forth in search of adventures, for he had the nature of a warrior and could not bear to be idle. So he buckled on his two swords, took his huge bow, much taller than himself, in his hand, and slinging his quiver on his back started out. He had not gone far when he came to the bridge of Seta-no-Karashi spanning one end of the beautiful Lake Biwa. No sooner had he set foot on the bridge than he saw lying right across his path a huge serpent-dragon. Its body was so big that it looked like the trunk of a large pine tree and it took up the whole width of the bridge. One of its huge claws rested on the parapet of one side of the bridge, while its tail lay right against the other. The monster seemed to be asleep, and as it breathed, fire and smoke came out of its nostrils.

// At first Hidesato could not help feeling alarmed at the sight of this horrible reptile lying in his path, for he must either turn back or walk right over its body. He was a brave man, however, and putting aside all fear went forward dauntlessly. Crunch, crunch! he stepped now on the dragon’s body, now between its coils, and without even one glance backward he went on his way.

// He had only gone a few steps when he heard some one calling him from behind. On turning back he was much surprised to see that the monster dragon had entirely disappeared and in its place was a strange-looking man, who was bowing most ceremoniously to the ground. His red hair streamed over his shoulders and was surmounted by a crown in the shape of a dragon’s head, and his sea-green dress was patterned with shells. Hidesato knew at once that this was no ordinary mortal and he wondered much at the strange occurrence. Where had the dragon gone in such a short space of time? Or had it transformed itself into this man, and what did the whole thing mean? While these thoughts passed through his mind he had come up to the man on the bridge and now addressed him:

// “Was it you that called me just now?”

// “Yes, it was I,” answered the man: “I have an earnest request to make to you. Do you think you can grant it to me?”

// “If it is in my power to do so I will,” answered Hidesato, “but first tell me who you are?”

// “I am the Dragon King of the Lake, and my home is in these waters just under this bridge.”

// “And what is it you have to ask of me!” said Hidesato.

// “I want you to kill my mortal enemy the centipede, who lives on the mountain beyond,” and the Dragon King pointed to a high peak on the opposite shore of the lake.

// “I have lived now for many years in this lake and I have a large family of children and grand-children. For some time past we have lived in terror, for a monster centipede has discovered our home, and night after night it comes and carries off one of my family. I am powerless to save them. If it goes on much longer like this, not only shall I lose all my children, but I myself must fall a victim to the monster. I am, therefore, very unhappy, and in my extremity I determined to ask the help of a human being. For many days with this intention I have waited on the bridge in the shape of the horrible serpent-dragon that you saw, in the hope that some strong brave man would come along. But all who came this way, as soon as they saw me were terrified and ran away as fast as they could. You are the first man I have found able to look at me without fear, so I knew at once that you were a man of great courage. I beg you to have pity upon me. Will you not help me and kill my enemy the centipede?”

// Hidesato felt very sorry for the Dragon King on hearing his story, and readily promised to do what he could to help him. The warrior asked where the centipede lived, so that he might attack the creature at once. The Dragon King replied that its home was on the mountain Mikami, but that as it came every night at a certain hour to the palace of the lake, it would be better to wait till then. So Hidesato was conducted to the palace of the Dragon King, under the bridge. Strange to say, as he followed his host downwards the waters parted to let them pass, and his clothes did not even feel damp as he passed through the flood. Never had Hidesato seen anything so beautiful as this palace built of white marble beneath the lake. He had often heard of the Sea King’s palace at the bottom of the sea, where all the servants and retainers were salt-water fishes, but here was a magnificent building in the heart of Lake Biwa. The dainty goldfishes, red carp, and silvery trout, waited upon the Dragon King and his guest.

// Hidesato was astonished at the feast that was spread for him. The dishes were crystallized lotus leaves and flowers, and the chopsticks were of the rarest ebony. As soon as they sat down, the sliding doors opened and ten lovely goldfish dancers came out, and behind them followed ten red-carp musicians with the koto and the samisen. Thus the hours flew by till midnight, and the beautiful music and dancing had banished all thoughts of the centipede. The Dragon King was about to pledge the warrior in a fresh cup of wine when the palace was suddenly shaken by a tramp, tramp! as if a mighty army had begun to march not far away.

// Hidesato and his host both rose to their feet and rushed to the balcony, and the warrior saw on the opposite mountain two great balls of glowing fire coming nearer and nearer. The Dragon King stood by the warrior’s side trembling with fear.

// “The centipede! The centipede! Those two balls of fire are its eyes. It is coming for its prey! Now is the time to kill it.”

// Hidesato looked where his host pointed, and, in the dim light of the starlit evening, behind the two balls of fire he saw the long body of an enormous centipede winding round the mountains, and the light in its hundred feet glowed like so many distant lanterns moving slowly towards the shore.

// Hidesato showed not the least sign of fear. He tried to calm the Dragon King.

// “Don’t be afraid. I shall surely kill the centipede. Just bring me my bow and arrows.”

// The Dragon King did as he was bid, and the warrior noticed that he had only three arrows left in his quiver. He took the bow, and fitting an arrow to the notch, took careful aim and let fly.

// The arrow hit the centipede right in the middle of its head, but instead of penetrating, it glanced off harmless and fell to the ground.

// Nothing daunted, Hidesato took another arrow, fitted it to the notch of the bow and let fly. Again the arrow hit the mark, it struck the centipede right in the middle of its head, only to glance off and fall to the ground. The centipede was invulnerable to weapons! When the Dragon King saw that even this brave warrior’s arrows were powerless to kill the centipede, he lost heart and began to tremble with fear.

// The warrior saw that he had now only one arrow left in his quiver, and if this one failed he could not kill the centipede. He looked across the waters. The huge reptile had wound its horrid body seven times round the mountain and would soon come down to the lake. Nearer and nearer gleamed fireballs of eyes, and the light of its hundred feet began to throw reflections in the still waters of the lake.

// Then suddenly the warrior remembered that he had heard that human saliva was deadly to centipedes. But this was no ordinary centipede. This was so monstrous that even to think of such a creature made one creep with horror. Hidesato determined to try his last chance. So taking his last arrow and first putting the end of it in his mouth, he fitted the notch to his bow, took careful aim once more and let fly.

// This time the arrow again hit the centipede right in the middle of its head, but instead of glancing off harmlessly as before, it struck home to the creature’s brain. Then with a convulsive shudder the serpentine body stopped moving, and the fiery light of its great eyes and hundred feet darkened to a dull glare like the sunset of a stormy day, and then went out in blackness. A great darkness now overspread the heavens, the thunder rolled and the lightning flashed, and the wind roared in fury, and it seemed as if the world were coming to an end. The Dragon King and his children and retainers all crouched in different parts of the palace, frightened to death, for the building was shaken to its foundation. At last the dreadful night was over. Day dawned beautiful and clear. The centipede was gone from the mountain.

// Then Hidesato called to the Dragon King to come out with him on the balcony, for the centipede was dead and he had nothing more to fear.

// Then all the inhabitants of the palace came out with joy, and Hidesato pointed to the lake. There lay the body of the dead centipede floating on the water, which was dyed red with its blood.

// The gratitude of the Dragon King knew no bounds. The whole family came and bowed down before the warrior, calling him their preserver and the bravest warrior in all Japan.

// Another feast was prepared, more sumptuous than the first. All kinds of fish, prepared in every imaginable way, raw, stewed, boiled and roasted, served on coral trays and crystal dishes, were put before him, and the wine was the best that Hidesato had ever tasted in his life. To add to the beauty of everything the sun shone brightly, the lake glittered like a liquid diamond, and the palace was a thousand times more beautiful by day than by night.

// His host tried to persuade the warrior to stay a few days, but Hidesato insisted on going home, saying that he had now finished what he had come to do, and must return. The Dragon King and his family were all very sorry to have him leave so soon, but since he would go they begged him to accept a few small presents (so they said) in token of their gratitude to him for delivering them forever from their horrible enemy the centipede.

// As the warrior stood in the porch taking leave, a train of fish was suddenly transformed into a retinue of men, all wearing ceremonial robes and dragon’s crowns on their heads to show that they were servants of the great Dragon King. The presents that they carried were as follows:

// First, a large bronze bell.
// Second, a bag of rice.
// Third, a roll of silk.
// Fourth, a cooking pot.
// Fifth, a bell.
// Hidesato did not want to accept all these presents, but as the Dragon King insisted, he could not well refuse.

// The Dragon King himself accompanied the warrior as far as the bridge, and then took leave of him with many bows and good wishes, leaving the procession of servants to accompany Hidesato to his house with the presents.

// The warrior’s household and servants had been very much concerned when they found that he did not return the night before, but they finally concluded that he had been kept by the violent storm and had taken shelter somewhere. When the servants on the watch for his return caught sight of him they called to every one that he was approaching, and the whole household turned out to meet him, wondering much what the retinue of men, bearing presents and banners, that followed him, could mean.

// As soon as the Dragon King’s retainers had put down the presents they vanished, and Hidesato told all that had happened to him.

// The presents which he had received from the grateful Dragon King were found to be of magic power. The bell only was ordinary, and as Hidesato had no use for it he presented it to the temple near by, where it was hung up, to boom out the hour of day over the surrounding neighborhood.

// The single bag of rice, however much was taken from it day after day for the meals of the knight and his whole family, never grew less—the supply in the bag was inexhaustible.

// The roll of silk, too, never grew shorter, though time after time long pieces were cut off to make the warrior a new suit of clothes to go to Court in at the New Year.

// The cooking pot was wonderful, too. No matter what was put into it, it cooked deliciously whatever was wanted without any firing—truly a very economical saucepan.

// The fame of Hidesato’s fortune spread far and wide, and as there was no need for him to spend money on rice or silk or firing, he became very rich and prosperous, and was henceforth known as My Lord Bag of Rice.`,
//   }

// ]

// // =======================
// // ALL SHORT FILMS
// // =======================
// // imagi/lib/data.ts (shortFilms section)

// export const shortFilms = [
//   {
//     id: 1,
//     title: "Silent Horizon",
//     director: "Arjun Rao",
//     language: "English",
//     image: "https://i.pinimg.com/1200x/2f/b8/79/2fb8792822799e0958f003ae1eb69e6a.jpg",
//     link: "https://i.pinimg.com/1200x/2f/b8/79/2fb8792822799e0958f003ae1eb69e6a.jpg",
//     views: 12500,
//     teamScore: 8.7,
//   },
//   {
//     id: 2,
//     title: "Midnight Echo",
//     director: "Priya Mehta",
//     language: "English",
//     image: "https://i.pinimg.com/1200x/fc/77/82/fc7782f65aca768428f237c1a83eae8b.jpg",
//     link: "https://i.pinimg.com/1200x/fc/77/82/fc7782f65aca768428f237c1a83eae8b.jpg",
//     views: 9800,
//     teamScore: 8.4,
//   },
//   {
//     id: 3,
//     title: "Fragments of Time",
//     director: "Rohit Sharma",
//     language: "English",
//     image: "https://i.pinimg.com/736x/4a/6a/86/4a6a86907dd5aaf1ff8d9036c61886a9.jpg",
//     link: "https://i.pinimg.com/736x/4a/6a/86/4a6a86907dd5aaf1ff8d9036c61886a9.jpg",
//     views: 11200,
//     teamScore: 8.1,
//   },
//   {
//     id: 4,
//     title: "Lost Signals",
//     director: "Karan Das",
//     language: "English",
//     image: "https://i.pinimg.com/736x/33/1b/69/331b698e734f89592fc0697c78456fc0.jpg",
//     link: "https://i.pinimg.com/736x/33/1b/69/331b698e734f89592fc0697c78456fc0.jpg",
//     views: 8700,
//     teamScore: 7.9,
//   },
//   {
//     id: 5,
//     title: "Parallel Dreams",
//     director: "Neha Kapoor",
//     language: "English",
//     image: "https://i.pinimg.com/1200x/41/b2/ba/41b2baa9d12e3bf5e991d21edf93ec47.jpg",
//     link: "https://i.pinimg.com/1200x/41/b2/ba/41b2baa9d12e3bf5e991d21edf93ec47.jpg",
//     views: 10300,
//     teamScore: 8.0,
//   },
//   {
//     id: 6,
//     title: "The Final Scene",
//     director: "Amit Verma",
//     language: "English",
//     image: "https://i.pinimg.com/736x/68/6e/8c/686e8c24a177a21e9ed73ca6988aaa6a.jpg",
//     link: "https://i.pinimg.com/736x/68/6e/8c/686e8c24a177a21e9ed73ca6988aaa6a.jpg",
//     views: 9100,
//     teamScore: 7.8,
//   },
//   {
//     id: 7,
//     title: "Echoes of Silence",
//     director: "Sneha Iyer",
//     language: "English",
//     image: "https://i.pinimg.com/1200x/d8/41/6d/d8416dd2aeb19853d40dd0d9ae01b963.jpg",
//     link: "https://i.pinimg.com/1200x/d8/41/6d/d8416dd2aeb19853d40dd0d9ae01b963.jpg",
//     views: 13400,
//     teamScore: 8.9,
//   },
//   {
//     id: 8,
//     title: "Through the Lens",
//     director: "Vikram Singh",
//     language: "English",
//     image: "https://i.pinimg.com/736x/e0/2e/f6/e02ef6e6fe0afcbcd8d728ad9b5f54cc.jpg",
//     link: "https://i.pinimg.com/736x/e0/2e/f6/e02ef6e6fe0afcbcd8d728ad9b5f54cc.jpg",
//     views: 7600,
//     teamScore: 7.6,
//   },
//   {
//     id: 9,
//     title: "Last Letter Home",
//     director: "Riya Nair",
//     language: "English",
//     image: "https://i.pinimg.com/736x/4f/63/14/4f6314807d903e281e247968645d08e9.jpg",
//     link: "https://i.pinimg.com/736x/4f/63/14/4f6314807d903e281e247968645d08e9.jpg",
//     views: 11900,
//     teamScore: 8.3,
//   },
//   {
//     id: 10,
//     title: "Broken Frames",
//     director: "Manoj Kulkarni",
//     language: "English",
//     image: "https://i.pinimg.com/1200x/19/44/41/194441161f2b897eed1e6b0af4cc3b94.jpg",
//     link: "https://i.pinimg.com/1200x/19/44/41/194441161f2b897eed1e6b0af4cc3b94.jpg",
//     views: 8900,
//     teamScore: 7.7,
//   },
//   {
//     id: 11,
//     title: "A Dream To Pursue ",
//     director: "Joel RodrÃ­guez Orth",
//     language: "English",
//     image: "https://img.youtube.com/vi/HwOx-1VL6F0/maxresdefault.jpg",
//     link: "https://www.youtube.com/watch?v=HwOx-1VL6F0",
//     views: 60900,
//     teamScore: 7.7,
//   }

// ,
// {
//     id: 12,
//     title: "We Are All Artists",
//     director: "Julian Tsai",
//     language: "English",
//     image: "https://img.youtube.com/vi/_tbcsJHdFfs/maxresdefault.jpg",
//     link:"https://www.youtube.com/watch?v=_tbcsJHdFfs",
//     views: 50900,
//     teamScore: 9.7,
//     description: "It's easy to forget about the innate ability that we all share: creativity.Thank you for watching! First short film, and I still have a lot to learn. Let me know below which section was your favorite!Instagram:   / julian.tsai  Website: https://www.thenovelstance.comAI-generated video summary Quality and accuracy may vary. This short film explores the creative process, reminding viewers of their own artistic potential. It follows a journey from childhood memories to present-day filmmaking struggles, highlighting the synthesis of different art forms. The filmmaker's personal narrative reveals surprising insights into the origins of inspiration.",
//   },
//   {
//     id: 13,
//     title: "For those waiting for life to happen",
//     director: "Life Of Riza",
//     language: "English",
//     image: "https://img.youtube.com/vi/ij84DoCEmdI/maxresdefault.jpg",
//     link:"https://www.youtube.com/watch?v=ij84DoCEmdI",
//     views: 50900,
//     teamScore: 9.7,
//     description: `I decided to turn one of my journal entries from early-quarantine into a video. During that time I was thinking about all the times we hold ourselves back or wait around for something to happen instead of taking the lead.

// And I was also watching a lot of films.... A lot.

// ➫ The music I use in my videos! 30 DAY FREE TRIAL https://www.musicbed.com/invite/WSV9f

// ➫ Films featured: Dead Poets Society, Little Women, At Eternity’s Gate, Tree Of Life, Jojo Rabbit, Chaplin, Lost in Translation, Pursuit of Happiness, Into The Wild, Tigertail, 1917, The Darjeeling Limited, La La Land, Once Upon A Time in Hollywood, Pierrot Le Fou, Ad Astra, Her, Paris Texas, Blade Runner, Interstellar, Dunkirk, Demolition, Moana, Life of Pi, The Great Gatsby, Honey Boy, Perks of Being a Wallflower, The Master, The Secret Life of Walter Mitty

// Follow me:
// ➫ Instagram:   / lifeofriza  `,
//   }

// ]

// // =======================
// // AUTO GENERATED TOP LISTS
// // =======================

// export const topStories = [...Stories]
//   .sort((a, b) => b.likes - a.likes)
//   .slice(0, 10)

// export const topShortFilms = [...shortFilms]
//   .sort((a, b) => {
//     const scoreA = a.views * 0.6 + a.teamScore * 1000 * 0.4
//     const scoreB = b.views * 0.6 + b.teamScore * 1000 * 0.4
//     return scoreB - scoreA
//   })
//   .slice(0, 10)
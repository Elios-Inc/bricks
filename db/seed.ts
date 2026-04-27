import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env", override: true });

type Member = {
  name: string;
  email: string | null;
  personal: readonly string[];
  business: readonly string[];
};

const MEMBERS: readonly Member[] = [
  {
    name: "Derek Wolthoff",
    email: "derek@makesmodels.com",
    personal: ["dwolt226", "tinyweinerbutitworks"],
    business: ["makesandmodels"],
  },
  {
    name: "Dallas Offill",
    email: "dallas@happiroofing.com",
    personal: ["dallpall"],
    business: ["happi.roofing"],
  },
  {
    name: "James McGee",
    email: "jmcghie@gmail.com",
    personal: ["manic_mcgoo"],
    business: [],
  },
  {
    name: "Mark McCormack",
    email: "markm@adplemco.com",
    personal: ["presidentmccormack"],
    business: ["adplemco", "pfs_flooring", "artsmansports"],
  },
  {
    name: "Tanner Brunette",
    email: "tanner@toplocaldevelopment.com",
    personal: ["t_montana_est.1992"],
    business: ["toplocalroofing"],
  },
  {
    name: "Wills Nilsen",
    email: "willsznilsen@gmail.com",
    personal: ["willsznilsen"],
    business: ["hypercar_ranch", "raptor_ranch"],
  },
  {
    name: "Michael McHenry",
    email: "samantha@themchenrygroup.com",
    personal: ["michaelmchenry"],
    business: [
      "brunchmehard",
      "oakwoodfirekitchen",
      "sundayschool",
      "themchenrygroup",
      "slcprovisions",
      "riotdancefitneess",
    ],
  },
  {
    name: "Alec Daghlian",
    email: "alec@bricksslc.com",
    personal: ["dag_slc"],
    business: ["dagrealestate", "soarrugs"],
  },
  {
    name: "Brett Chell",
    email: null,
    personal: ["brett.chell"],
    business: [
      "bricks_slc",
      "bricksmotiondaily",
      "bricks.mindset",
      "bricksclipsdaily",
    ],
  },
  {
    name: "Mike Hardle",
    email: "mike@fruitstandstudios.com",
    personal: ["mikehardle"],
    business: ["fruitstandstudios", "agent_boost"],
  },
  {
    name: "Dino Maglic",
    email: "dino.maglic@gmail.com",
    personal: ["dinomaglicmd"],
    business: [],
  },
  {
    name: "Nick Howland",
    email: "nkhowland@gmail.com",
    personal: [],
    business: ["drnicholashowland"],
  },
  {
    name: "Ethan Offill",
    email: "ethan@happiroofing.com",
    personal: ["ethanshagmaster"],
    business: ["happi_acres", "happi.roofing"],
  },
  {
    name: "Nick Panos",
    email: "nick@legendmotorco.com",
    personal: ["nickpanos"],
    business: ["legendmotorco"],
  },
  {
    name: "Paul Vassou",
    email: "paul@dripzenergy.com",
    personal: [],
    business: ["dripzenergy"],
  },
  {
    name: "Dev Seui",
    email: "devseui.da@gmail.com",
    personal: ["devseui"],
    business: ["seuiconstruction"],
  },
  {
    name: "Sean Zahm",
    email: "zahm@fruitstandstudios.com",
    personal: ["justzahm"],
    business: ["fruitstandstudios"],
  },
];

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log(`Seeding ${MEMBERS.length} members…`);

  for (const member of MEMBERS) {
    const [person] = await sql`
      INSERT INTO tracked_people (name, type, email)
      VALUES (${member.name}, 'member', ${member.email})
      RETURNING id
    `;

    const accounts = [
      ...member.personal.map((handle) => ({ handle, category: "personal" })),
      ...member.business.map((handle) => ({ handle, category: "business" })),
    ];

    for (const account of accounts) {
      await sql`
        INSERT INTO social_accounts (tracked_person_id, platform, account_category, handle)
        VALUES (${person.id}, 'instagram', ${account.category}, ${account.handle})
      `;
    }

    console.log(`  ${member.name}: ${accounts.length} account(s)`);
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

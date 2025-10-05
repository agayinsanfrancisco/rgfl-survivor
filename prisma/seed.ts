import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a default league
  const league = await prisma.league.upsert({
    where: { code: 'RGFL2024' },
    update: {},
    create: {
      name: 'RGFL Survivor Fantasy League 2024',
      code: 'RGFL2024'
    }
  });

  console.log('✅ League created:', league.name);

  // Create castaways (Survivor 49 contestants)
  const castaways = [
    // Hina Tribe (Blue)
    {
      name: 'Jason Treul',
      tribe: 'Hina',
      occupation: 'Law clerk',
      age: 32,
      hometown: 'Anaheim, CA → Santa Ana, CA'
    },
    {
      name: 'Kristina Mills',
      tribe: 'Hina',
      occupation: 'MBA career coach',
      age: 36,
      hometown: 'Houston, TX → Edmond, OK'
    },
    {
      name: 'Matt Williams',
      tribe: 'Hina',
      occupation: 'Airport ramp agent',
      age: 52,
      hometown: 'Farmington, UT → St. George, UT'
    },
    {
      name: 'Michelle "MC" Chukwujekwu',
      tribe: 'Hina',
      occupation: 'Fitness trainer',
      age: 29,
      hometown: 'Sachse, TX → San Diego, CA'
    },
    {
      name: 'Sophie Segreti',
      tribe: 'Hina',
      occupation: 'Strategy associate',
      age: 31,
      hometown: 'Darnestown, MD → New York City, NY'
    },
    {
      name: 'Steven Ramm',
      tribe: 'Hina',
      occupation: 'Rocket scientist',
      age: 35,
      hometown: 'Littleton, CO → Denver, CO'
    },
    // Kele Tribe (Yellow)
    {
      name: 'Alex Moore',
      tribe: 'Kele',
      occupation: 'Political communications director',
      age: 27,
      hometown: 'Evanston, IL → Washington, DC'
    },
    {
      name: 'Kimberly "Annie" Davis',
      tribe: 'Kele',
      occupation: 'Musician',
      age: 49,
      hometown: 'Portland, OR → Austin, TX'
    },
    {
      name: 'Jake Latimer',
      tribe: 'Kele',
      occupation: 'Correctional officer',
      age: 36,
      hometown: 'Regina, SK → St. Albert, AB'
    },
    {
      name: 'Jeremiah Ing',
      tribe: 'Kele',
      occupation: 'Global events manager',
      age: 39,
      hometown: 'Windsor, ON → Toronto, ON'
    },
    {
      name: 'Nicole Mazullo',
      tribe: 'Kele',
      occupation: 'Financial crime consultant',
      age: 26,
      hometown: 'Long Island, NY → Philadelphia, PA'
    },
    {
      name: 'Sophi Balerdi',
      tribe: 'Kele',
      occupation: 'Entrepreneur',
      age: 27,
      hometown: 'Miami, FL → Miami, FL'
    },
    // Uli Tribe (Red)
    {
      name: 'Jawann Pitts',
      tribe: 'Uli',
      occupation: 'Video editor',
      age: 28,
      hometown: 'Salem, NJ → Los Angeles, CA'
    },
    {
      name: 'Nate Moore',
      tribe: 'Uli',
      occupation: 'Film producer',
      age: 47,
      hometown: 'Clovis, CA → Hermosa Beach, CA'
    },
    {
      name: 'Rizo Velovic',
      tribe: 'Uli',
      occupation: 'Tech sales',
      age: 25,
      hometown: 'Yonkers, NY → Yonkers, NY'
    },
    {
      name: 'Sage Ahrens-Nichols',
      tribe: 'Uli',
      occupation: 'Clinical social worker',
      age: 30,
      hometown: 'Roxboro, NC → Olympia, WA'
    },
    {
      name: 'Savannah Louie',
      tribe: 'Uli',
      occupation: 'Former reporter',
      age: 31,
      hometown: 'Walnut Creek, CA → Atlanta, GA'
    },
    {
      name: 'Shannon Fairweather',
      tribe: 'Uli',
      occupation: 'Wellness specialist',
      age: 28,
      hometown: 'Wakefield, MA → Boston, MA'
    }
  ];

  console.log('🏝️ Creating castaways...');
  for (const castaway of castaways) {
    const existing = await prisma.castaway.findFirst({ where: { name: castaway.name } });
    if (existing) {
      await prisma.castaway.update({
        where: { id: existing.id },
        data: castaway
      });
    } else {
      await prisma.castaway.create({ data: castaway });
    }
  }

  console.log(`✅ Created ${castaways.length} castaways`);

  // Create initial weeks
  const weeks = [
    { weekNumber: 1, isActive: false },
    { weekNumber: 2, isActive: false },
    { weekNumber: 3, isActive: true },
    { weekNumber: 4, isActive: false },
    { weekNumber: 5, isActive: false },
    { weekNumber: 6, isActive: false },
    { weekNumber: 7, isActive: false },
    { weekNumber: 8, isActive: false },
    { weekNumber: 9, isActive: false },
    { weekNumber: 10, isActive: false },
    { weekNumber: 11, isActive: false },
    { weekNumber: 12, isActive: false },
    { weekNumber: 13, isActive: false }
  ];

  console.log('📅 Creating weeks...');
  for (const week of weeks) {
    const existing = await prisma.week.findFirst({ where: { weekNumber: week.weekNumber } });
    if (existing) {
      await prisma.week.update({
        where: { id: existing.id },
        data: week
      });
    } else {
      await prisma.week.create({ data: week });
    }
  }

  console.log(`✅ Created ${weeks.length} weeks`);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@rgfl.com' },
    update: {},
    create: {
      email: 'admin@rgfl.com',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJvJtyJHD0lHu8a5n2a', // admin123
      name: 'RGFL Admin',
      isAdmin: true,
      leagueId: league.id
    }
  });

  console.log('✅ Admin user created:', adminUser.email);

  const userHash = '$2b$10$pCZvUPdtnyFrrdKGb83s.OboRWSFVpTIH704YG3saNN/7jJ1sBoEu'; // test123

  const playerNames = [
    'Arthur',
    'Brandon',
    'Blake',
    'Will',
    'Meg',
    'Kody',
    'Nelson',
    'Mike',
    'Kurtis'
  ];

  console.log('👥 Creating league players...');
  for (const name of playerNames) {
    const email = `${name.toLowerCase()}@rgfl.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: userHash,
        name,
        isAdmin: false,
        leagueId: league.id
      }
    });
  }

  console.log('✅ League players seeded');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

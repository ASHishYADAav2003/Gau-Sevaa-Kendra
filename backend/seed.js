const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const animalsData = [
  {
    name: "Lakshmi",
    image: "https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    age: "8 years",
    gender: "Female",
    status: "Recovering",
    rescueDate: new Date("2024-08-15"),
    story: "Rescued from road accident with severe leg injury",
    location: "Main Shelter - Block A",
    monthlyExpense: 4500,
    sponsored: true,
    healthStatus: "Good",
    category: "Recovering",
  },
  {
    name: "Nandi",
    image: "https://images.unsplash.com/photo-1756922892143-471d05711682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    age: "5 years",
    gender: "Male",
    status: "Healthy",
    rescueDate: new Date("2023-03-20"),
    story: "Abandoned calf found malnourished, now healthy",
    location: "Main Shelter - Block B",
    monthlyExpense: 3800,
    sponsored: false,
    healthStatus: "Excellent",
    category: "Healthy",
  },
  {
    name: "Ganga & Siblings",
    image: "https://images.unsplash.com/photo-1769466100846-86239ba740aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3clMjBzaGVsdGVyJTIwcmVzY3VlfGVufDF8fHx8MTc3ODkzODk2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    age: "3 years",
    gender: "Mixed",
    status: "Healthy",
    rescueDate: new Date("2023-11-10"),
    story: "Orphaned triplet calves rescued together",
    location: "Main Shelter - Block C",
    monthlyExpense: 8500,
    sponsored: true,
    healthStatus: "Excellent",
    category: "Healthy",
  },
  {
    name: "Radha",
    image: "https://images.unsplash.com/photo-1772948260139-d5a6418e143d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    age: "12 years",
    gender: "Female",
    status: "Critical Care",
    rescueDate: new Date("2024-04-05"),
    story: "Senior cow requiring ongoing medical treatment",
    location: "Medical Ward",
    monthlyExpense: 6200,
    sponsored: false,
    healthStatus: "Under Treatment",
    category: "Critical",
  },
  {
    name: "Krishna",
    image: "https://images.unsplash.com/photo-1722372088297-845cbc5e9197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjb3clMjBmYXJtJTIwaW5kaWF8ZW58MXx8fHwxNzc4OTM4OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    age: "4 years",
    gender: "Male",
    status: "Healthy",
    rescueDate: new Date("2022-12-01"),
    story: "Rescued from neglectful conditions",
    location: "Main Shelter - Block A",
    monthlyExpense: 3500,
    sponsored: false,
    healthStatus: "Excellent",
    category: "Healthy",
  },
  {
    name: "Gouri",
    image: "https://images.unsplash.com/photo-1717183389843-b09666ca7fcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb3clMjBzaGVsdGVyJTIwcmVzY3VlfGVufDF8fHx8MTc3ODkzODk2OHww&ixlib=rb-4.1.0&q=80&w=1080",
    age: "6 years",
    gender: "Female",
    status: "Recovering",
    rescueDate: new Date("2024-02-20"),
    story: "Rescued from slaughterhouse transport",
    location: "Main Shelter - Block B",
    monthlyExpense: 4100,
    sponsored: true,
    healthStatus: "Good",
    category: "Recovering",
  }
];

async function main() {
  console.log('Seeding database...');
  for (const animal of animalsData) {
    await prisma.animal.create({
      data: animal
    });
  }
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

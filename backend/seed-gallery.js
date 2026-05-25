const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const galleryData = [
  {
    title: 'Morning Feeding',
    imageUrl: 'https://images.unsplash.com/photo-1772948260139-d5a6418e143d?w=600&q=80',
    category: 'Daily Care',
    caption: 'Volunteers feeding cows at sunrise',
    isPublished: true,
  },
  {
    title: 'Shelter Life',
    imageUrl: 'https://images.unsplash.com/photo-1673229266917-89abfa3ebc58?w=600&q=80',
    category: 'Shelter',
    caption: 'Peaceful moments at the gaushala',
    isPublished: true,
  },
  {
    title: 'Rescue Day',
    imageUrl: 'https://images.unsplash.com/photo-1769466100846-86239ba740aa?w=600&q=80',
    category: 'Rescue',
    caption: 'New arrivals receiving care',
    isPublished: true,
  },
];

async function main() {
  const count = await prisma.galleryImage.count();
  if (count > 0) {
    console.log(`Gallery already has ${count} images.`);
    return;
  }
  for (const img of galleryData) {
    await prisma.galleryImage.create({ data: img });
  }
  console.log('Gallery seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

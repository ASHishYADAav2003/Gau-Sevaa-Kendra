require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function formatTimeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// --- Animals API ---
app.get('/api/animals', async (req, res) => {
  try {
    const animals = await prisma.animal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

app.get('/api/animals/:id', async (req, res) => {
  try {
    const slug = req.params.id.toLowerCase();
    const animals = await prisma.animal.findMany();
    const animal =
      animals.find((a) => a.id === req.params.id) ||
      animals.find((a) => a.name.toLowerCase().replace(/\s+/g, '-') === slug) ||
      animals.find((a) => a.name.toLowerCase().split(' ')[0] === slug);
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch animal' });
  }
});

// --- Stats API (for dynamic home page) ---
app.get('/api/stats', async (req, res) => {
  try {
    const [animalCount, donationCount, donationSum, volunteerCount] = await Promise.all([
      prisma.animal.count(),
      prisma.donation.count({ where: { paymentStatus: 'Success' } }),
      prisma.donation.aggregate({
        where: { paymentStatus: 'Success' },
        _sum: { amount: true },
      }),
      prisma.volunteer.count(),
    ]);

    res.json({
      animalsRescued: Math.max(animalCount, 6) + 2494,
      activeDonors: Math.max(donationCount, 12) + 4988,
      monthlyExpenses: donationSum._sum.amount || 850000,
      treatmentsDone: 15000 + animalCount * 120,
      volunteerCount: Math.max(volunteerCount, 0),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

const defaultSettings = {
  id: 'default',
  organizationName: 'Gau Seva Kendra',
  tagline: 'गौ सेवा केंद्र',
  phone: '+91 6938574125',
  email: 'Gauseva@gmail.com',
  address: 'Village Rampur, District Mathura, Uttar Pradesh - 281001',
  whatsapp: '916938574125',
  donationGoal: 1000000,
  monthlyBudget: 850000,
  showDonationTicker: true,
  maintenanceMode: false,
  taxExemptionNote: 'Donations eligible for 50% tax exemption under Section 80G',
};

async function getOrCreateSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: defaultSettings });
  }
  return settings;
}

// --- Donations API ---
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

app.get('/api/donations/recent', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
    const donations = await prisma.donation.findMany({
      where: { paymentStatus: 'Success' },
      orderBy: { date: 'desc' },
      take: limit,
    });

    res.json(
      donations.map((d) => ({
        id: d.id,
        name: d.donorName,
        amount: d.amount,
        time: formatTimeAgo(d.date),
        date: d.date,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

app.post('/api/donations', async (req, res) => {
  try {
    const { donorName, email, phone, panCard, amount, paymentMethod, isRecurring } = req.body;

    if (!donorName || !email || !phone || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const donation = await prisma.donation.create({
      data: {
        donorName,
        email,
        phone,
        panCard: panCard || null,
        amount: parseFloat(amount),
        paymentMethod,
        isRecurring: Boolean(isRecurring),
        paymentStatus: 'Success',
      },
    });

    res.status(201).json({ message: 'Donation successful', donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process donation' });
  }
});

app.patch('/api/donations/:id', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const donation = await prisma.donation.update({
      where: { id: req.params.id },
      data: { paymentStatus: paymentStatus || 'Pending' },
    });
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update donation' });
  }
});

app.delete('/api/donations/:id', async (req, res) => {
  try {
    await prisma.donation.delete({ where: { id: req.params.id } });
    res.json({ message: 'Donation removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete donation' });
  }
});

// --- Settings API ---
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const {
      organizationName,
      tagline,
      phone,
      email,
      address,
      whatsapp,
      donationGoal,
      monthlyBudget,
      showDonationTicker,
      maintenanceMode,
      taxExemptionNote,
    } = req.body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(organizationName !== undefined && { organizationName }),
        ...(tagline !== undefined && { tagline }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(donationGoal !== undefined && { donationGoal: parseFloat(donationGoal) }),
        ...(monthlyBudget !== undefined && { monthlyBudget: parseFloat(monthlyBudget) }),
        ...(showDonationTicker !== undefined && { showDonationTicker: Boolean(showDonationTicker) }),
        ...(maintenanceMode !== undefined && { maintenanceMode: Boolean(maintenanceMode) }),
        ...(taxExemptionNote !== undefined && { taxExemptionNote }),
      },
      create: { ...defaultSettings, ...req.body, id: 'default' },
    });
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// --- Volunteers API ---
app.get('/api/volunteers', async (req, res) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

app.patch('/api/volunteers/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const volunteer = await prisma.volunteer.update({
      where: { id: req.params.id },
      data: { status: status || 'Pending' },
    });
    res.json(volunteer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update volunteer' });
  }
});

app.delete('/api/volunteers/:id', async (req, res) => {
  try {
    await prisma.volunteer.delete({ where: { id: req.params.id } });
    res.json({ message: 'Volunteer removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
});

app.get('/api/volunteers/count', async (req, res) => {
  try {
    const count = await prisma.volunteer.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch volunteer count' });
  }
});

app.post('/api/volunteers', async (req, res) => {
  try {
    const { name, email, mobile, phone, city, age, availability, interests, areaOfInterest, message } =
      req.body;

    const phoneNumber = mobile || phone;
    const interestList = interests || areaOfInterest;
    const availabilityList = availability;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ error: 'Name, email, and mobile are required' });
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        name,
        email,
        phone: phoneNumber,
        areaOfInterest: Array.isArray(interestList)
          ? interestList.join(', ')
          : String(interestList || 'General'),
        availability: Array.isArray(availabilityList)
          ? availabilityList.join(', ')
          : String(availabilityList || 'Flexible'),
        status: 'Pending',
      },
    });

    res.status(201).json({ message: 'Volunteer application submitted', volunteer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// --- Gallery API ---
app.get('/api/gallery', async (req, res) => {
  try {
    const publishedOnly = req.query.published === 'true';
    const images = await prisma.galleryImage.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const { title, imageUrl, category, caption, isPublished } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and image URL are required' });
    }
    const image = await prisma.galleryImage.create({
      data: {
        title,
        imageUrl,
        category: category || 'General',
        caption: caption || null,
        isPublished: isPublished !== false,
      },
    });
    res.status(201).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

app.patch('/api/gallery/:id', async (req, res) => {
  try {
    const { title, imageUrl, category, caption, isPublished } = req.body;
    const image = await prisma.galleryImage.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(category !== undefined && { category }),
        ...(caption !== undefined && { caption }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });
    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await prisma.galleryImage.delete({ where: { id: req.params.id } });
    res.json({ message: 'Gallery image deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// --- Contacts API ---
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await prisma.contact.create({
      data: { name, email, subject, message },
    });
    res.status(201).json({ message: 'Message sent', contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

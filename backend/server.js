const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Animals API ---
app.get('/api/animals', async (req, res) => {
  try {
    const animals = await prisma.animal.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

app.get('/api/animals/:id', async (req, res) => {
  try {
    const animal = await prisma.animal.findUnique({
      where: { id: req.params.id }
    });
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ error: 'Animal not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch animal' });
  }
});

// --- Donations API ---
app.post('/api/donations', async (req, res) => {
  try {
    const { donorName, email, phone, panCard, amount, paymentMethod, isRecurring } = req.body;
    
    // In a real app, integrate Razorpay/Stripe here.
    // For now, we mock the success.
    const donation = await prisma.donation.create({
      data: {
        donorName,
        email,
        phone,
        panCard,
        amount: parseFloat(amount),
        paymentMethod,
        isRecurring: Boolean(isRecurring),
        paymentStatus: 'Success' // Mocked
      }
    });
    
    res.status(201).json({ message: 'Donation successful', donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process donation' });
  }
});

// --- Volunteers API ---
app.post('/api/volunteers', async (req, res) => {
  try {
    const { name, email, phone, areaOfInterest, availability } = req.body;
    const volunteer = await prisma.volunteer.create({
      data: { name, email, phone, areaOfInterest, availability }
    });
    res.status(201).json({ message: 'Volunteer application submitted', volunteer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// --- Contacts API ---
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await prisma.contact.create({
      data: { name, email, subject, message }
    });
    res.status(201).json({ message: 'Message sent', contact });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

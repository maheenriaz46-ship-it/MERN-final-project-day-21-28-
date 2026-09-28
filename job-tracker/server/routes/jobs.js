import { Router } from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth); // every job route is protected

// Dashboard numbers  (must stay above '/:id')
router.get('/stats', async (req, res) => {
  const jobs = await Job.find({ user: req.user }).sort('-createdAt');
  const s = { total: jobs.length, Applied: 0, Interview: 0, Rejected: 0, Offer: 0, recent: jobs.slice(0, 5) };
  jobs.forEach((j) => s[j.status]++);
  res.json(s);
});

// View + search + filter
router.get('/', async (req, res) => {
  const { search, status, type } = req.query;
  const q = { user: req.user };
  if (status && status !== 'All') q.status = status;
  if (type && type !== 'All') q.type = type;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    q.$or = [{ company: rx }, { position: rx }, { location: rx }];
  }
  res.json(await Job.find(q).sort('-createdAt'));
});

// Add
router.post('/', async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, user: req.user });
    res.status(201).json(job);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Edit
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate({ _id: req.params.id, user: req.user }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ message: 'Deleted' });
});

export default router;

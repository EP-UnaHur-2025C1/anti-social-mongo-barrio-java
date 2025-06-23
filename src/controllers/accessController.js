const Access = require('../models/Access');

exports.createAccess = async (req, res) => {
  try {
    const access = new Access(req.body);
    await access.save();
    res.status(201).json(access);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAccesses = async (req, res) => {
  const accesses = await Access.find().populate('user_id');
  res.json(accesses);
};

exports.getAccess = async (req, res) => {
  const access = await Access.findById(req.params.id).populate('user_id');
  if (!access) return res.status(404).json({ error: 'Access not found' });
  res.json(access);
};

exports.updateAccess = async (req, res) => {
  const access = await Access.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!access) return res.status(404).json({ error: 'Access not found' });
  res.json(access);
};

exports.deleteAccess = async (req, res) => {
  await Access.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getContacts = async (req, res) => {
  const contacts = await Contact.find().populate('user_id');
  res.json(contacts);
};

exports.getContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id).populate('user_id');
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
};

exports.updateContact = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json(contact);
};

exports.deleteContact = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

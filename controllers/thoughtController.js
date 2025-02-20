const { Thought, User } = require('../models');
const { Types } = require('mongoose');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single thought by ID
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new thought and push to user's thoughts array
  async createThought(req, res) {
    try {
      console.log("Request Body:", req.body); // Log incoming request data

      const thought = await Thought.create(req.body);

      // Push thought to the user's thoughts array
      await User.findOneAndUpdate(
        { _id: new Types.ObjectId(req.body.user) }, // Use `new` keyword here
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      res.json(thought);
    } catch (err) {
      console.error("Error creating thought:", err); // Log full error details
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  },

  // Update a thought by ID
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      // Remove thought from associated user's thoughts array
      await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } }
      );

      res.json({ message: 'Thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add Reaction to a Thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      console.error('Error adding reaction:', err);
      res.status(500).json(err);
    }
  },

  // Remove Reaction from a Thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      console.error('Error removing reaction:', err);
      res.status(500).json(err);
    }
  }
};

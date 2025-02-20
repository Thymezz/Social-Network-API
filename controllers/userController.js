const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json(err);
    }
  },

  // Get a single user by ID
  async getSingleUser(req, res) {
    try {
      const user = await User.findById(req.params.userId)
        .populate('thoughts')
        .populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json(err);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json(err);
    }
  },

  // Update a user by ID
  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json(err);
    }
  },

  // Delete a user and their thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // BONUS: Remove associated thoughts
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json(err);
    }
  },

  // Add a friend
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } }, // Prevents duplicates
        { new: true }
      ).populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Error adding friend:', err);
      res.status(500).json(err);
    }
  },

  // Remove a friend
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      ).populate('friends');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (err) {
      console.error('Error removing friend:', err);
      res.status(500).json(err);
    }
  }
};

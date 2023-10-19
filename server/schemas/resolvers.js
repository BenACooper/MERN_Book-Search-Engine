const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, { id, username }) => {
      try {
        const foundUser = await User.findOne({
          $or: [{ _id: id }, { username }],
        });

        if (!foundUser) {
          throw new Error("Cannot find a user with this id!");
        }

        return foundUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error("Something is wrong!");
      }

      const token = signToken(user);
      return { token, user };
    },
    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    // user can login with using eihter username or email, along with password.
    login: async (parent, { username, email, password }) => {
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (_, { userId, book }) => {
      try {
        // Find the user by userId and add the book to their savedBooks
        const updatedUser = await User.findOneAndUpdate(
          userId,
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        throw new Error("Failed to save book");
      }
    },
    deleteBook: async (_, { userId, bookId }) => {
      try {
        // Find the user by userId and remove the book with matching bookId
        const updatedUser = await User.findOneAndUpdate(
          userId,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (err) {
        throw new Error(`Failed to delete book: ${err.message}`);
      }
    },
  },
};

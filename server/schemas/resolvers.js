const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

// to fetche the currently logged-in user's data
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        ); //excludes __v and poassword from the data like bearer??

        return userData;
      } else {
        throw new AuthenticationError("Please Log In");
      }
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const newUser = await User.create(args);
      //   creates an authentication token passing newUser as argument
      const token = signToken(newUser);
      return { token, newUser };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect Credentials");
      }
      const correctPassWord = User.isCorrectPassword(password);
      if (!correctPassWord) {
        throw new AuthenticationError("Incorrect Credentials");
      }
      // if username and password both are correct, creates an authentication token passing user as argument
      const token = signToken(user);
      return token, user;
    },
    // input is defined in typeDefs.js
    saveBook: async (parent, { input }, context) => {
      console.log("input :>> ", input);
      // checks if there is a user object in the context
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: context.user._id,
          },
          // addToSet makes sure the book is only added if there is not already in the array
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate("books");
        return updatedUser;
      }
      throw new AuthenticationError("Please Log In to Save Books.");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please Log In to Remove Books.");
    },
  },
};

module.exports = resolvers;

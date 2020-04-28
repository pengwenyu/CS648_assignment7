const fs = require('fs');
require('dotenv').config();
const { ApolloServer} = require('apollo-server-express');
const about = require('./about.js');
const issue = require('./issue.js');
const resolvers = {
  Query: {
    about: about.getMessage,
    issueList: issue.list,
    issue: issue.get,
    issueCounts: issue.counts,
  },
  Mutation: {
    setAboutMessage:about.setMessage,
    issueAdd: issue.add,
	  issueUpdate: issue.update,  
    issueDelete: issue.delete,
  },
};
const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});
function installHandler(app) {
const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}
module.exports = { installHandler };

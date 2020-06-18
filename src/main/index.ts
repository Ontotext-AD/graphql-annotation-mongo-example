const { ApolloServer, gql } = require("apollo-server-express")
const { buildFederatedSchema } = require("@apollo/federation")
const express = require('express')

import chalk from 'chalk'

import { typeDefs } from './gql/schema'
import { resolvers, annotationService } from './gql/resolvers'

const path = '/graphql'
const app = express()
const port = 4008

const plugins = {
  serverWillStart() {
    console.log('Server starting up!');
  }
}

// @TODO --> MongoGTG
app.get('/__gtg', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ gtg: "OK", message: "Mock SOaaS operating as expected" }));
})

// @TODO --> Mongo Health
app.get('/__health', function (req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    status: "OK",
    id: `http://localhost:4007/graphql`,
    name: 'Organisation GraphQL HealthCheck',
    type: 'graphql',
    healthChecks: []
  }))
})

const main = async () => {
  try {

    await annotationService.init()

    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers,
          plugins
        }
      ]),
      context: params => () => {
        console.log(params.req.body.query);
        console.log(params.req.body.variables);
        console.log(params.req.headers);
      }
    })
    server.applyMiddleware({app: app, path: path})

    let listener = app.listen({ port: port }, async () => {
      console.log(`🚀 Server ready at http://localhost:${port}${path}`)
    })
  } catch (e) {
    console.error(chalk.red(e.name + ', ' + e.message))
  }

}

main()

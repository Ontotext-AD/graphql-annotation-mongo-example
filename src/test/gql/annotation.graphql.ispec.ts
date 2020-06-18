const { createTestClient } = require('apollo-server-testing');
const { ApolloServer } = require("apollo-server-express")
const { buildFederatedSchema } = require("@apollo/federation")
const { gql } = require("apollo-server-express")

import { typeDefs } from '../../main/gql/schema'
import { resolvers, annotationService } from '../../main/gql/resolvers'

var path = require('path')

describe('Integration - Annotation Query Tests', () => {

  jest.setTimeout(10000);

  beforeAll(async (done) => {
    done()
  })

  test('All Annotations', async (done) => {
    await annotationService.init()
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const ALL_ANNOTATIONS = gql`
      query {
        annotation {
          id
          __typename
          confidence
          relevanceScore
          tagType
          status
          issued
          motivation
          body {
            id
            __typename
            source {
              id
              __typename
            }
            purpose
          }
          target {
            id
            __typename
            selector {
              id
              __typename
              value
            }
            source
            state {
              id
              __typename
              sourceDate
            }
          }
          generator {
            id
            __typename
            name
          }
        }
      }
    `

    try {
      const res = await query({ query: ALL_ANNOTATIONS});
      expect(res.data.annotation.length).toEqual(14)
      expect(res.error).toBeUndefined()
      console.log(JSON.stringify(res.data, null, 2))
      done()
    } catch (error) {
      console.log(error)
    }
  })

  test('Annotations by Body Source type Human', async (done) => {
    await annotationService.init()
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const ANNOTATIONS_BY_BODY_SOURCE_TYPE = gql`
      query {
        annotation(where: {body: {source: {type: {EQ: "Human"}}}}) {
          id
          __typename
          confidence
          relevanceScore
          tagType
          status
          issued
          motivation
          body {
            id
            __typename
            source {
              id
              __typename
            }
            purpose
          }
          target {
            id
            __typename
            selector {
              id
              __typename
              value
            }
            source
            state {
              id
              __typename
              sourceDate
            }
          }
          generator {
            id
            __typename
            name
          }
        }
      }
    `

    try {
      const res = await query({ query: ANNOTATIONS_BY_BODY_SOURCE_TYPE});
      expect(res.data.annotation.length).toEqual(7)
      expect(res.error).toBeUndefined()
      console.log(JSON.stringify(res.data, null, 2))
      done()
    } catch (error) {
      console.log(error)
    }
  })

  test('Annotations by Body Source type Droid', async (done) => {
    await annotationService.init()
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const ANNOTATIONS_BY_BODY_SOURCE_TYPE = gql`
      query {
        annotation(where: {body: {source: {type: {EQ: "Droid"}}}}) {
          id
          __typename
          confidence
          relevanceScore
          tagType
          status
          issued
          motivation
          body {
            id
            __typename
            source {
              id
              __typename
            }
            purpose
          }
          target {
            id
            __typename
            selector {
              id
              __typename
              value
            }
            source
            state {
              id
              __typename
              sourceDate
            }
          }
          generator {
            id
            __typename
            name
          }
        }
      }
    `

    try {
      const res = await query({ query: ANNOTATIONS_BY_BODY_SOURCE_TYPE});
      expect(res.data.annotation.length).toEqual(6)
      expect(res.error).toBeUndefined()
      console.log(JSON.stringify(res.data, null, 2))
      done()
    } catch (error) {
      console.log(error)
    }
  })

  test('Annotations by Body Source type Unknown', async (done) => {
    await annotationService.init()
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const ANNOTATIONS_BY_BODY_SOURCE_TYPE = gql`
      query {
        annotation(where: {body: {source: {type: {EQ: "Unknown"}}}}) {
          id
          __typename
          confidence
          relevanceScore
          tagType
          status
          issued
          motivation
          body {
            id
            __typename
            source {
              id
              __typename
            }
            purpose
          }
          target {
            id
            __typename
            selector {
              id
              __typename
              value
            }
            source
            state {
              id
              __typename
              sourceDate
            }
          }
          generator {
            id
            __typename
            name
          }
        }
      }
    `

    try {
      const res = await query({ query: ANNOTATIONS_BY_BODY_SOURCE_TYPE});
      expect(res.data.annotation.length).toEqual(0)
      expect(res.error).toBeUndefined()
      done()
    } catch (error) {
      console.log(error)
    }
  })


  // Check Source __typename
  test('Annotations by Body Source type Droid', async (done) => {
    await annotationService.init()
    const server = new ApolloServer({
      schema: buildFederatedSchema([
        {
          typeDefs,
          resolvers
        }
      ])
    })

    const { query } = createTestClient(server);

    const HUMAN_ANNOTATION_BY_ID = gql`
      query test {
        annotation(id: "https://www.ontotext.com/blog/the-rise-of-the-knowledge-graph/annotation/14") {
          id
          confidence
          relevanceScore
          body {
            id
            source {
              id
              __typename

            }
          }
        }
      }
    `

    try {
      const res = await query({ query: HUMAN_ANNOTATION_BY_ID});
      expect(res.data.annotation.length).toEqual(1)
      expect(res.error).toBeUndefined()
      expect(res.data.annotation[0].body.source.__typename).toEqual("Human")
      done()
    } catch (error) {
      console.log(error)
    }
  })


})


import { AnnotationService } from '../service/annotation-service'
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const databaseName = "blog"

const mongodbUrl: string = process.env.MONGO_URL ? process.env.MONGO_URL : `mongodb://localhost:9997/blog`
console.log(`Using Mongo URL ${mongodbUrl}`)
const mongoServerSelectionTimeout: number = process.env.MONGO_SERVER_SELECTION_TIMEOUT ? +process.env.MONGO_SERVER_SELECTION_TIMEOUT: 10
const useUnifiedTopology: boolean = process.env.MONGO_UNIFIED_TOPOLOGY && process.env.MONGO_UNIFIED_TOPOLOGY.toLowerCase() == 'true' ? true : false
const connectWithNoPrimary: boolean = process.env.MONGO_CONNECT_WITH_NO_PRIMARY && process.env.MONGO_CONNECT_WITH_NO_PRIMARY.toLowerCase() == 'true' ? true : false

export let annotationService = new AnnotationService(mongodbUrl, databaseName, mongoServerSelectionTimeout, useUnifiedTopology, connectWithNoPrimary)

const RESERVED_TYPES: string[] = [
  `Character`, `Mammal`, `Sentient`,
  `Amphibian`, `Artificial`, `Gastropod`,
  `Insectoid`, `Reptile`, `Reptilian`,
  `Unknown`]

export const resolvers = {
  Annotation: {
    __resolveReference(annotation) {
      return annotationService.getAnnotation(annotation.id)
    },
  },
  Query: {
    annotation(_, args) {
      if (args.id && args.where) {
        throw "Annotation can only filtered by id or where clause, not both"
      } else  if (args.id) {
        let result = [annotationService.getAnnotation(args.id)]
        return result
      } else if (args.where) {
        if (args.where.body.source.type.EQ) {
          let type = args.where.body.source.type.EQ
          let result = annotationService.getAnnotationBySourceType(type)
          return result
        } else {
          throw "Annotation where clause must have body.source.type.EQ nothing else is supported"
        }
      } else {
        let result = annotationService.getAllAnnotations()
        return result
      }
    },
  },
  Body: {
    source(body, args, context, info) {
      // Just checking tree resolution
      return body.source
     }
  },
  Character: {
    __resolveType(character, ) {
      if (character.type) {
        let result = character.type
          .filter(typeToFilter => !RESERVED_TYPES.includes(typeToFilter))
          .toString()
        delete character.type
        return result
      } else {
        throw "Missing Character type"
      }
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      //return value.getTime(); // value sent to the client
      return value
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(+ast.value) // ast value is always in string format
      }
      return null;
    },
  }),
}

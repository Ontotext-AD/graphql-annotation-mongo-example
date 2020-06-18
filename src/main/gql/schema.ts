const { gql } = require("apollo-server-express")

export const typeDefs = gql`

  scalar Date

  # Support Annotation Body Source Type filtering
  # Such as ->
  #  (where: {body: {source: {type: {EQ: "Human"}}}})
  #  (where: {body: {source: {type: {EQ: "Droid"}}}})

  input Annotation_Where {
    body: Body_Where!
  }

  input Body_Where {
    source: Source_Where!
  }

  input Source_Where {
    type: EQ_Where!
  }

  input EQ_Where {
    EQ: String!
  }

  extend type Query {
    annotation(id: ID where: Annotation_Where): [Annotation]
  }

  type Generator @key(fields: "id") {
    id: ID!
    type: [String]
    name: String
  }

  type Annotation @key(fields: "id") {
    id: ID!
    type: [String]
    confidence: Float!
    relevanceScore: Float!
    status: String!
    tagType: String!
    body: Body!
    target: Target!
    motivation: String
    issued: Date
    generator: Generator
  }

  interface Character @key(fields: "id") {
    id: ID!
  }

  type Aleena implements Character @key(fields: "id") {
    id: ID!
  }

  type Besalisk implements Character @key(fields: "id") {
    id: ID!
  }

  type Cerean implements Character @key(fields: "id") {
    id: ID!
  }

  type Chagrian implements Character @key(fields: "id") {
    id: ID!
  }

  type Clawdite implements Character @key(fields: "id") {
    id: ID!
  }

  type Droid implements Character @key(fields: "id") {
    id: ID!
  }

  type Dug implements Character @key(fields: "id") {
    id: ID!
  }

  type Ewok implements Character @key(fields: "id") {
    id: ID!
  }

  type Geonosian implements Character @key(fields: "id") {
    id: ID!
  }

  type Gungan implements Character @key(fields: "id") {
    id: ID!
  }

  type Human implements Character @key(fields: "id") {
    id: ID!
  }

  type Hutt implements Character @key(fields: "id") {
    id: ID!
  }

  type Iktotchi implements Character @key(fields: "id") {
    id: ID!
  }

  type Kaleesh implements Character @key(fields: "id") {
    id: ID!
  }

  type Kaminoan implements Character @key(fields: "id") {
    id: ID!
  }

  type Keldor implements Character @key(fields: "id") {
    id: ID!
  }

  type Mirialan implements Character @key(fields: "id") {
    id: ID!
  }

  type Moncalamari implements Character @key(fields: "id") {
    id: ID!
  }

  type Muun implements Character @key(fields: "id") {
    id: ID!
  }

  type Nautolan implements Character @key(fields: "id") {
    id: ID!
  }

  type Neimodian implements Character @key(fields: "id") {
    id: ID!
  }

  type Pauan implements Character @key(fields: "id") {
    id: ID!
  }

  type Quermian implements Character @key(fields: "id") {
    id: ID!
  }

  type Rodian implements Character @key(fields: "id") {
    id: ID!
  }

  type Skakoan implements Character @key(fields: "id") {
    id: ID!
  }

  type Sullustan implements Character @key(fields: "id") {
    id: ID!
  }

  type Tholothian implements Character @key(fields: "id") {
    id: ID!
  }

  type Togruta implements Character @key(fields: "id") {
    id: ID!
  }

  type Toong implements Character @key(fields: "id") {
    id: ID!
  }

  type Toydarian implements Character @key(fields: "id") {
    id: ID!
  }

  type Trandoshan implements Character @key(fields: "id") {
    id: ID!
  }

  type Twilek implements Character @key(fields: "id") {
    id: ID!
  }

  type Umbaran implements Character @key(fields: "id") {
    id: ID!
  }

  type Vulptereen implements Character @key(fields: "id") {
    id: ID!
  }

  type Wookiee implements Character @key(fields: "id") {
    id: ID!
  }

  type Xexto implements Character @key(fields: "id") {
    id: ID!
  }

  type Yodasspecies implements Character @key(fields: "id") {
    id: ID!
  }

  type Zabrak implements Character @key(fields: "id") {
    id: ID!
  }

  type Body @key(fields: "id") {
    id: ID!
    type: [String]
    source: Character!
    purpose: String!
  }

  type State @key(fields: "id") {
    id: ID!
    type: [String]
    sourceDate: Date
  }

  type Selector @key(fields: "id") {
    id: ID!
    type: String
    value: String
  }

  type Target @key(fields: "id") {
    id: ID!
    source: ID!
    selector: Selector!
    state: State
  }
`;

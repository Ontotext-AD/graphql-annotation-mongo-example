const { MongoMemoryServer } = require('mongodb-memory-server');
import { Mongo } from '../../main/data/mongo'
import { databaseName } from '../../main/gql/resolvers'

// Extend the default timeout so MongoDB binaries can downloaded
// If they have not already
jest.setTimeout(6000);

export class MongoManager {

  server: { getConnectionString: () => any; getDbName: () => any; stop: () => any; }
  mongo!: Mongo

  constructor() {
    this.server = new MongoMemoryServer()
  }

  async start() {
    try {
      return await this.server.getConnectionString().then((url: string) => {
        this.mongo = new Mongo(url, databaseName, 3000, false, true)
        this.mongo.connect()
        return this.mongo
      })
    } catch (error) {
      console.log("Error [" + error + "]")
      throw error;
    }
  }

  async disconnectAndStop() {
    await this.mongo.disconnect().then(()=> {
      this.server.stop()
    })
  }

}

import { Annotation, AnnotationManager }  from '../../main/model/annotation'
import { Mongo, } from '../data/mongo'
export class AnnotationService {

  url: string
  databaseName: string
  serverSelectionTimeOut: number
  useUnifiedTopology: boolean
  connectWithNoPrimary: boolean
  mongo: Mongo

  constructor(url :string, databaseName: string, serverSelectionTimeOut :number,
              useUnifiedTopology: boolean, connectWithNoPrimary: boolean) {
    this.url = url
    this.databaseName = databaseName
    this.serverSelectionTimeOut = serverSelectionTimeOut
    this.useUnifiedTopology = useUnifiedTopology
    this.connectWithNoPrimary = connectWithNoPrimary
    this.mongo = new Mongo(this.url, this.databaseName, this.serverSelectionTimeOut, this.useUnifiedTopology, this.connectWithNoPrimary)
    console.log(`Annotation Service created`)
  }

  async init() {
    let db = await this.mongo.connect()
    await this.mongo.dropDb()
    await this.addAnnotations()
    return db
  }

  async addAnnotations() {
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    let $this = this
    return await $this.mongo.addAnnotations(annotations)
      .then(value => {
        console.log(`Annotations added to mongo`)
      })
      .catch(error => {
        console.log(`error ${error}`)
        throw error
      })
  }

  async getAnnotation(annotationId :string) {
    return await this.mongo.findAnnotationByIdProp(annotationId)
  }

  async getAnnotationBySourceType(__typename :string) {
    return await this.mongo.findAnnotationsBySourceType(__typename)
  }

  async getAllAnnotations() {
    let result = await this.mongo.getAllAnnotations()
    return result
  }

  async disconnect() {
    return await this.mongo.disconnect()
  }

}

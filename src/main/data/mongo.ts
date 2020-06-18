import mongoose from 'mongoose';
import { Annotation, AnnotationModel} from '../model/annotation'

export class Mongo {

  url: string
  databaseName: string
  serverSelectionTimeOut: number
  useUnifiedTopology: boolean
  connectWithNoPrimary: boolean

  constructor(url: string, databaseName: string, serverSelectionTimeOut: number, useUnifiedTopology: boolean, connectWithNoPrimary: boolean){
    this.url = url
    this.databaseName = databaseName
    this.serverSelectionTimeOut = serverSelectionTimeOut
    this.useUnifiedTopology = useUnifiedTopology
    this.connectWithNoPrimary = connectWithNoPrimary
  }

  async connect() {
    try {
      const config = {useNewUrlParser: true,
                      useCreateIndex: true,
                      auto_reconnect: true,
                      promiseLibrary: global.Promise,
                      useUnifiedTopology: this.useUnifiedTopology,
                      connectWithNoPrimary: this.connectWithNoPrimary,
                      socketTimeoutMS: 45000,
                      connectTimeoutMS: 2000,
                      serverSelectionTimeoutMS: this.serverSelectionTimeOut}
      console.log(`Connecting to ${this.url}`)
      const db = await mongoose.connect(this.url, config)
      console.info(`Successfully connected to ${this.url}`)
      db.connection.useDb(this.databaseName)
      return db
    } catch (error) {
      console.log("Connection Error [" + error + "]")
      throw error
    }
  }

  async addAnnotation(annotation: Annotation) {
    const { _id: id } = await AnnotationModel.create(annotation)
    let $this = this
    return await $this.findAnnotationById(id)
  }

  async addAnnotations(annotations: Annotation[]) {
    let annotationsFound: Annotation[] = []
    let $this = this
    for(let annotation of annotations) {
      const { _id: id } = await AnnotationModel.create(annotation);
      let annotationFound: Annotation | null = await $this.findAnnotationById(id)
      if (annotationFound) {
        annotationsFound.push(annotationFound)
      }
    }
    return annotationsFound
  }

  async findAnnotationById(id: string) {
    const annotationFound = await AnnotationModel.findById(id).exec();
    return annotationFound
  }

  async findAnnotationByIdProp(id: string) {
    const annotationFound = await AnnotationModel.findOne({id: id}).exec()
    return annotationFound
  }

  async findAnnotationsBySourceType(type: string) {
    // Mongo Query -> { "body.source.type": "Human" }
    const annotationsFound = await AnnotationModel.find( { "body.source.type": type })
    return annotationsFound
  }

  async getAllAnnotations() {
    return await AnnotationModel.find({}).exec();
  }

  async disconnect() {
    await mongoose.connection.close()
  }

  async dropDb() {
    await mongoose.connection.db.dropDatabase().then()
  }
}

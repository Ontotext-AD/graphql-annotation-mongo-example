import { jest } from '@jest/globals'

import { Annotation, AnnotationManager }  from '../../main/model/annotation'
import { Mongo, } from '../../main/data/mongo'
import { MongoManager } from './mongo-manager'
import { timeStamp } from 'console'

describe("Test Manage Annotations in Mongo", () => {

  test("Connection to bad mongo handled OK", async (done) => {
    const mongo = new Mongo("mongodb://127.0.0.1:666/bad?", "bad", 3000, false, true)
    mongo.connect().then((db) => {
      expect(true).toEqual(false)
      done()
    }).catch((error) => {
      expect(true).toEqual(true)
      done()
    })
  })

  test("Add Annotation to Mongo", async (done) => {
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotation({ id: "123", body: { id: "456"}} as Annotation).then(async (annotation: any) => {
        console.log(annotation)
        await mongoManager.disconnectAndStop().then(() => {
          done()
        })
      })
    })
  })

  test("Add Annotation object to Mongo", async (done) => {
    let annotation = {id: "123",
                      body: {id: "456"}} as Annotation

    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotation(annotation).then(async (annotation: any) => {
        console.log(annotation)
        await mongoManager.disconnectAndStop().then(() => {
          done()
        })
      })
    })
  })

  test("Add Annotation file to Mongo", async (done) => {
    const annotationManager = new AnnotationManager()
    const annotation = annotationManager.annotationFromResourcesFile('luke-skywalker-annotation-1.json')
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotation(annotation).then(async (annotation: any) => {
        console.log(annotation)
        await mongoManager.disconnectAndStop().then(() => {
          done()
        })
      })
    })
  })

  test("Add Annotations to Mongo", async (done) => {
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotations(annotations).then(async (annotations: any) => {
        await mongoManager.disconnectAndStop().then(() => {
          expect(annotations.length).toEqual(14)
          done()
        })
      })
    })
  })

  test("Get all annotations", async (done) => {
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotations(annotations).then(async (annotations: any) => {
        let foundAnnotations = await mongo.getAllAnnotations()
        await mongoManager.disconnectAndStop().then(() => {
          expect(foundAnnotations.length).toEqual(14)
          done()
        })
      })
    })
  })

  test("Find annotation by id property", async (done) => {
    const annotationOneId = `https://www.ontotext.com/blog/the-rise-of-the-knowledge-graph/annotation/1`
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotations(annotations).then(async (annotations: any) => {
        let foundAnnotation = await mongo.findAnnotationByIdProp(annotationOneId)
        await mongoManager.disconnectAndStop().then(() => {
          expect(foundAnnotation.id).toEqual(annotationOneId)
          done()
        })
      })
    })
  })

  test("Must not find annotation that does not exist", async (done) => {
    const annotationOneId = `https://www.ontotext.com/blog/the-rise-of-the-knowledge-graph/annotation/9999`
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotations(annotations).then(async (annotations: any) => {
        let foundAnnotation = await mongo.findAnnotationByIdProp(annotationOneId)
        if (foundAnnotation)
          throw `Should not find Annotation ${annotationOneId}`
        await mongoManager.disconnectAndStop().then(() => {
          done()
        })
      })
    })
  })

  test("Get Annotations by source type", async (done) => {
    const sourceType = 'Droid'
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    const mongoManager = new MongoManager()
    await mongoManager.start().then(async (mongo) => {
      await mongo.addAnnotations(annotations).then(async (annotations: any) => {
        let foundAnnotations = await mongo.findAnnotationsBySourceType(sourceType)
        expect(foundAnnotations.length).toEqual(6)
        await mongoManager.disconnectAndStop().then(() => {
          done()
        })
      })
    })
  })

})

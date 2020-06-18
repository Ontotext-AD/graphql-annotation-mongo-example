import { AnnotationService, } from '../../main/service/annotation-service'
import { Annotation } from '../../main/model/annotation';
import { triggerAsyncId } from 'async_hooks';

describe("Test Service and Mongo Integration", () => {

  jest.setTimeout(20000);

  const localMongoUrl = `mongodb://localhost:9997/test`
  const annotationOne = `https://www.ontotext.com/blog/the-rise-of-the-knowledge-graph/annotation/1`
  const annotationTwo = `https://www.ontotext.com/blog/the-rise-of-the-knowledge-graph/annotation/2`

  test("Add Annotations and find", async (done) => {
    let annotationService = new AnnotationService(localMongoUrl, 'blog', 3000, false, true)
    await annotationService.init()
    let annotation = await annotationService.getAnnotation(annotationOne)
    expect(annotation).toBeDefined()
    annotation = await annotationService.getAnnotation(annotationTwo)
    expect(annotation).toBeDefined()
    await annotationService.disconnect()
    done()
  })

  test("Add Annotations and find by source type", async (done) => {
    let annotationService = new AnnotationService(localMongoUrl, 'blog', 3000, false, true)
    await annotationService.init()
    let annotations: any[] = await annotationService.getAnnotationBySourceType('Droid')
    expect(annotations.length).toEqual(6)
    annotations = await annotationService.getAnnotationBySourceType('Human')
    expect(annotations.length).toEqual(7)
    annotations = await annotationService.getAnnotationBySourceType('X')
    expect(annotations.length).toEqual(0)
    annotations = await annotationService.getAnnotationBySourceType('Yodasspecies')
    expect(annotations.length).toEqual(1)
    await annotationService.disconnect()
    done()
  })

})

import { AnnotationManager, Annotation }  from '../../main/model/annotation'

describe("Annotation creation", () => {

  test("Create Annotation", async (done) => {
    let annotation = new Annotation()
    annotation.id = "http://testing/123"
    annotation.type = ["Annotation"]
    done()
  })

  test("Create Annotation from file", async (done) => {
    const annotationManager = new AnnotationManager()
    const annotation = annotationManager.annotationFromResourcesFile('luke-skywalker-annotation-1.json')
    done()
  })

  test("Create Annotations from directory", async (done) => {
    const annotationManager = new AnnotationManager()
    let annotations: Annotation[] = await annotationManager.annotationsFromResourcesDir()
    expect(annotations.length).toEqual(14)
    done()
  })

})

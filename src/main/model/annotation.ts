import { prop, arrayProp, getModelForClass } from '@typegoose/typegoose';
import { readFileSync, readdirSync } from 'fs'
var path = require('path')
var readdirPromise = require('glob')

export class Selector {
  @prop()
  id?: string
  @prop()
  type?: string
  @prop()
  value?: string
}

export class State {
  @prop()
  id?: string
  @prop()
  type?: string
  @prop()
  sourceDate?: Date
}

export class Target {
  @prop()
  id?: string
  @prop({ _id: false, type: Selector })
  selector?: Selector
  @prop()
  source?: string
  @prop({ _id: false, type: State })
  state?: State
}

export class AnnotationGenerator {
  @prop()
  id?: string
  @arrayProp({ items: String, default: [] })
  type?: string[]
  @prop()
  name?: string
}

export class Character {
  @prop()
  id?: string
  @arrayProp({ items: String, default: [] })
  type?: string[]
}


export class Body {
  @prop()
  id?: string
  @arrayProp({ items: String, default: [] })
  type?: string[]
  @prop({ _id: false, type: Character })
  source?: Character
  @prop()
  purpose?: string

}
export class Annotation {
  @prop()
  id?: string
  @arrayProp({ items: String, default: [] })
  type?: string[]
  @prop({ _id: false, type: Body })
  body?: Body
  @prop({ _id: false, type: Target })
  target?: Target
  @prop()
  motivation?: string
  @prop()
  issued?: Date
  @prop({ _id: false, type: AnnotationGenerator })
  generator?: AnnotationGenerator
  @prop()
  relevanceScore?: number
  @prop()
  confidence?: number
  @prop()
  status?: string
  @prop()
  tagType?: string
}

export const AnnotationModel = getModelForClass(Annotation)
export class AnnotationManager {

  annotationFromResourcesFile(fileName: string): Annotation {
    var filePath = path.join(__dirname, '..', 'resources', fileName)
    let annotationJSONString = readFileSync(filePath).toString()
    let annotationJson = JSON.parse(annotationJSONString)
    return annotationJson as Annotation
  }

  async annotationsFromResourcesDir(): Promise<Annotation[]> {
    var filePath = path.join(__dirname, '..', 'resources' )
    let dirPath = path.join(__dirname, '..', 'resources' )
    let files = readdirSync(dirPath).filter(fn => fn.endsWith('.json'))
    let annotations = new Array<Annotation>()
    for(let file of files) {
      const fileToRead = path.join(__dirname, '..', 'resources', file )
      let annotationJSONString = readFileSync(fileToRead).toString()
      let annotation: Annotation = JSON.parse(annotationJSONString) as Annotation
      annotations.push(annotation)
    }
    return annotations
  }

}

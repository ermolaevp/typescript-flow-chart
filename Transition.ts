import { drawConnection, createTargetArrow } from './connection'
import paper from 'paper'

interface TransitionProps {
  id: string
  source: paper.Item
  target: paper.Item
  sourceAngle: number
  targetAngle: number
}

export class Transition extends paper.Group {
  private source
  private target
  private sourceAngle
  private targetAngle
  private targetArrow
  public constructor({ id, source, target, sourceAngle, targetAngle }: TransitionProps) {
    super()
    this.name = Transition.getName(id)
    this.sourceAngle = sourceAngle || 90
    this.targetAngle = targetAngle || -90
    this.source = source
    this.target = target
    const sourcePoint = this.getSourcePoint()
    const targetPoint = this.getTargetPoint()
    const path = new paper.Path({
      segments: drawConnection(sourcePoint, targetPoint),
      strokeColor: 'black'
    })
    this.targetArrow = createTargetArrow()
    this.children = [path, this.targetArrow.place(targetPoint)]
  }
  public redraw() {
    const sourcePoint = this.getSourcePoint()
    const targetPoint = this.getTargetPoint()
    this.firstChild.segments = drawConnection(sourcePoint, targetPoint)
    this.lastChild.position = targetPoint
  }
  static getName(id: string) {
    return 'transition_' + id
  }
  public hasConnectionWith(status: paper.Item) {
    return [this.source, this.target].includes(status)
  }
  private getSourcePoint() {
    const sourcePoint = this.source.getPointByAngle(this.sourceAngle)
    if (!sourcePoint) throw new Error(`No source point found for ${this.sourceAngle}`)
    return sourcePoint
  }
  private getTargetPoint() {
    const targetPoint = this.target.getPointByAngle(this.targetAngle)
    if (!targetPoint) throw new Error(`No target point found for ${this.targetAngle}`)
    return targetPoint
  }
}
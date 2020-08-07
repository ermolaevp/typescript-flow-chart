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
  private targetArrow
  public sourceAngle
  public targetAngle
  public sourcePoint
  public targetPoint
  public constructor({ id, source, target, sourceAngle, targetAngle }: TransitionProps) {
    super()
    this.name = Transition.getName(id)
    this.sourceAngle = sourceAngle || 90
    this.targetAngle = targetAngle || -90
    this.source = source
    this.target = target
    this.sourcePoint = this.getSourcePoint()
    this.targetPoint = this.getTargetPoint()
    const path = new paper.Path({
      segments: drawConnection(this.sourcePoint, this.targetPoint),
      strokeColor: 'black'
    })
    this.targetArrow = createTargetArrow()
    this.children = [path, this.targetArrow.place(this.targetPoint)]
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
    const sourcePoint = this.source.lastChild.getPointByAngle(this.sourceAngle)
    if (!sourcePoint) throw new Error(`No source point found for ${this.sourceAngle}`)
    return sourcePoint
  }
  private getTargetPoint() {
    const targetPoint = this.target.lastChild.getPointByAngle(this.targetAngle)
    if (!targetPoint) throw new Error(`No target point found for ${this.targetAngle}`)
    return targetPoint
  }
}

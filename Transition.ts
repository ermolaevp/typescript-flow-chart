import { drawConnection } from './connection'
import { TargetArrow } from './TargetArrow'
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
    this.targetArrow = new TargetArrow().place(this.targetPoint)
    this.children = [path, this.targetArrow]
  }
  public redraw() {
    this.sourcePoint = this.getSourcePoint()
    this.targetPoint = this.getTargetPoint()
    this.firstChild.segments = drawConnection(this.sourcePoint, this.targetPoint)
    this.targetArrow.position = this.targetPoint
    this.targetArrow.position.y -= 5
  }
  static getName(id: string) {
    return 'transition_' + id
  }
  public hasConnectionWith(status: paper.Item) {
    return [this.source, this.target].includes(status)
  }
  public getSourcePoint() {
    const sourcePoint = this.source.lastChild.getPointByAngle(this.sourceAngle)
    if (!sourcePoint) throw new Error(`No source point found for ${this.sourceAngle}`)
    return sourcePoint
  }
  public getTargetPoint() {
    const targetPoint = this.target.lastChild.getPointByAngle(this.targetAngle)
    if (!targetPoint) throw new Error(`No target point found for ${this.targetAngle}`)
    return targetPoint
  }
  public reconnectSourcePoint(to: paper.Point) {
    this.sourceAngle = this.source.lastChild.getAngleByPoint(to)
    this.redraw()
  }
  public reconnectTargetPoint(to: paper.Point) {
    this.targetAngle = this.target.lastChild.getAngleByPoint(to)
    this.redraw()
  }
}

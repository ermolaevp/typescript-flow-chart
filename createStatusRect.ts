import paper from 'paper'
import { connectionPoint } from './connectionPoint'

interface Props {
  id: string
  x: number
  y: number
  name: string
  type: number
}

function* circleGenerator(start: paper.Point, v: paper.Point, limit: number){
  let i = 0
  let position = start
  while(i++ < limit) {
    position = position.add(v)
    yield connectionPoint(position)
  }
}

export class StatusRectangle extends paper.Group {
  private circles
  public constructor({ id, x, y, name }: Props) {
    super()
    this.name = 'status_' + id
    this.position = new paper.Point(x || paper.view.center.x, y || paper.view.center.y)
    const size = new paper.Size({ width: 110, height: 28 })
    const statusRect = new paper.Path.Rectangle({
      size,
      radius: 3,
      position: this.position,
      fillColor: '#00875a',
      blendMode: 'overlay',
    })
    const { topLeft, topRight, bottomLeft, bottomRight, leftCenter, rightCenter } = statusRect.bounds
    const topVector = topRight.subtract(topLeft).normalize(size.width / 4)
    const bottomVector = bottomRight.subtract(bottomLeft).normalize(size.width / 4)
    this.circles = new paper.Group({
      children: [
        ...Array.from(circleGenerator(topLeft, topVector, 3)),
        connectionPoint(rightCenter),
        ...Array.from(circleGenerator(bottomLeft, bottomVector, 3)),
        connectionPoint(leftCenter)
      ],
      name: 'circles',
      visible: false
    })
    // this.data = new Map<number, paper.Point>()
    // this.circles.children.forEach(c => {
    //   const angle = Math.ceil(c.position.subtract(this.position).angle)
    //   this.data.set(angle, c.position)
    // })
    const statusText = new paper.PointText({
      content: (name || id).toUpperCase(),
      fillColor: 'white',
      position: this.position,
    })
    this.onMouseEnter = function() {
    this.circles.visible = true
  }
  this.onMouseLeave = function () {
      this.circles.visible = false
  }
  this.children = [statusRect, statusText, this.circles]
  }
  public getPointByAngle(angle: number) {
    let a
    this.circles.children.forEach(c => { // TODO: use .find
      if (angle === Math.ceil(c.position.subtract(this.position).angle)) {
        a = c.position
      }
    })
    return a
  }
}

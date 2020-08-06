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
  private initalProps
  public constructor(props: Props) {
    super()
    const { id, x, y, name, ...rest } = props
    this.initalProps = props
    this.name = StatusRectangle.getName(id)
    this.position = new paper.Point(x || paper.view.center.x, y || paper.view.center.y)
    const statusText = new paper.PointText({
      content: (name || id).toUpperCase(),
      fillColor: 'white',
      position: this.position,
    })
    const width = statusText.bounds.width > 110 ? statusText.bounds.width + 25 : 110
    const size = new paper.Size({ width, height: 28 })
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

    // if (statusText.bounds.width > statusRect.bounds.width) {
    //   console.log('eee')
    //   statusRect.fitBounds(new paper.Rectangle())
    // }
    this.onMouseEnter = function() {
      this.circles.visible = true
    }
    this.onMouseLeave = function () {
      this.circles.visible = false
    }
    this.onMouseUp = function() {
      this.selected = false
    }
    this.onMouseDown = function() {
      this.selected = true
    }
    this.children = [statusRect, statusText, this.circles]
  }
  static getName(id: string) {
    return 'status_' + id
  }
  public getPointByAngle(angle: number) {
    const circle = this.circles.children.find(circle => angle === Math.ceil(circle.position.subtract(this.position).angle))
    if (!circle) throw new Error(`No connection point found for angle ${angle}`)
    return circle.position
  }
  public toJSON() {
    return {
      ...this.initalProps,
      x: this.position.x,
      y: this.position.y,
    }
  }
}

import paper from 'paper'
import { connectionPoint } from './connectionPoint'

interface Props {
  id: string,
  x: number,
  y: number,
  title?: string
}

function* circleGenerator(start: paper.Point, v: paper.Point, limit: number){
  let i = 0
  let position = start
  while(i++ < limit) {
    position = position.add(v)
    yield connectionPoint(position)
  }
}

export function createStatusRect({
  id,
  x, y,
  title
}: Props) {
    const size = new paper.Size({ width: 110, height: 28 })
    const position = new paper.Point(x, y)
    const statusRect = new paper.Path.Rectangle({
      size,
      radius: 3,
      position,
      fillColor: '#00875a',
      blendMode: 'overlay',
    })
    const { topLeft, topRight, bottomLeft, bottomRight, leftCenter, rightCenter } = statusRect.bounds
    const topVector = topRight.subtract(topLeft).normalize(size.width / 4)
    const bottomVector = bottomRight.subtract(bottomLeft).normalize(size.width / 4)
    const circles = new paper.Group({
      children: [
        ...Array.from(circleGenerator(topLeft, topVector, 3)),
        connectionPoint(rightCenter),
        ...Array.from(circleGenerator(bottomLeft, bottomVector, 3)),
        connectionPoint(leftCenter)
      ],
      name: 'circles',
      visible: false
    })
    const data = new Map<number, paper.Point>()
    circles.children.forEach(c => {
      const angle = Math.ceil(c.position.subtract(position).angle)
      data.set(angle, c.position)
    })
    // circles.visible = false
    // circles.push()
    // circles.push(, )
     // [c1, c2, c3]
    // console.log(circles)
    function onMouseEnter(this: paper.Path.Rectangle) {
      // this.fillColor = new paper.Color(0, 0, 1)
      circles.visible = true
    }
    function onMouseLeave(this: paper.Path.Rectangle) {
      // this.fillColor = new paper.Color(0, 1, 0)
      circles.visible = false
    }
    const statusText = new paper.PointText({
      content: (title || id).toUpperCase(),
      fillColor: 'white',
      position,
    })
    return new paper.Group({ children: [statusRect, statusText, circles], name: id, onMouseEnter, onMouseLeave, data })
}
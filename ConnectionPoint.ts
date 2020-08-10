import paper from 'paper'

function* middlePointGenerator(start: paper.Point, stop: paper.Point, limit: number) {
  const v = stop.subtract(start).divide(limit)
  let i = 0
  let position = start
  while(i++ < limit - 1) {
    position = position.add(v)
    yield position
  }
}

export class ConnectionPoint extends paper.Path.Circle {
  constructor(center: paper.Point) {
    super({
      center,
      radius: 4,
      strokeWidth: 1,
      strokeColor: 'lightgrey',
      fillColor: 'transparent',
    })
  }
}

export class ConnectionPointGroup extends paper.Group {
  constructor(rect: paper.Item) {
    super()
    const { topLeft, topRight, bottomLeft, bottomRight, leftCenter, rightCenter, width } = rect.bounds
    const middlePoints = Array.from(middlePointGenerator(topLeft, topRight, 4))
      .concat(Array.from(middlePointGenerator(bottomLeft, bottomRight, 4)))
      .concat([rightCenter, leftCenter])
    this.children = middlePoints.map(position => {
      return new ConnectionPoint(position)
    })
    this.name = 'circles'
    this.visible = false
  }
  public getPointByAngle(angle: number) {
    const circle = this.children.find(child => angle === Math.ceil(child.position.subtract(this.position).angle))
    if (!circle) throw new Error(`No connection point found for angle ${angle}`)
    return circle.position
  }
  public getAngleByPoint(point: paper.Point) {
    const circle = this.getItem({ position: point })
    if (!circle) throw new Error(`No point found`)
    return Math.ceil(circle.position.subtract(this.position).angle)
  }
}

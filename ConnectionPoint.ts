import paper from 'paper'

export class ConnectionPoint extends paper.Path.Circle {
  constructor(center: paper.Point) {
    super({
      center,
      radius: 5,
      strokeWidth: 2,
      strokeColor: 'lightgrey',
      fillColor: 'transparent',
    })
    // this.onMouseEnter = function(e: paper.MouseEvent) {
    //   this.fillColor.set('red')
    // }
    // this.onMouseLeave = function(e: paper.MouseEvent) {
    //   this.fillColor.set('transparent')
    // }
    // this.onMouseDown = function(e: paper.MouseEvent) {
    //   e.stopPropagation()
    //   this.selected = !this.selected
    // }
    // this.onMouseUp = function(e: paper.MouseEvent) {
    //   e.stopPropagation()
    // }
  }
}

function* middlePointGenerator(start: paper.Point, stop: paper.Point, limit: number) {
  const v = stop.subtract(start).divide(limit)
  let i = 0
  let position = start
  while(i++ < limit - 1) {
    position = position.add(v)
    yield position
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
    this.data = new Map<number, paper.Point>()
    this.children.forEach(circle => {
      const angle = Math.ceil(this.position.subtract(circle.position).angle)
      this.data.set(angle, this.position)
    })
    // console.log(Array.from(this.data.keys()))
    // this.onMouseClick = onMouseClick
  }
  public getPointByAngle(angle: number) {
    const circle = this.children.find(circle => angle === Math.ceil(circle.position.subtract(this.position).angle))
    if (!circle) throw new Error(`No connection point found for angle ${angle}`)
    return circle.position
  }
}

import paper from 'paper'
import { ConnectionPointGroup } from './ConnectionPoint'

interface Props {
  id: string
  x: number
  y: number
  name: string
  type: number
}

export class StatusRectangle extends paper.Group {
  // private circles
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
    // this.circles = new ConnectionPointGroup(statusRect)
    this.onMouseEnter = function() {
      this.lastChild.visible = true
    }
    this.onMouseLeave = function () {
      this.lastChild.visible = false
    }
    this.onMouseUp = function() {
      this.firstChild.selected = false
    }
    this.onMouseDown = function() {
      this.firstChild.selected = true
    }
    this.children = [statusRect, statusText]
  }
  static getName(id: string) {
    return 'status_' + id
  }
  public toJSON() {
    return {
      ...this.initalProps,
      x: this.position.x,
      y: this.position.y,
    }
  }
}

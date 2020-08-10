import paper from 'paper'
import { ConnectionPointGroup } from './ConnectionPoint'

const colors = new Map()
colors.set(0, '#01579b')
colors.set(1, '#2e7d32')
colors.set(2, '#37474f')

interface Props {
  id: string
  x: number
  y: number
  name: string
  type: number
}

export class StatusRectangle extends paper.Group {
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
      fillColor: colors.get(rest.type),
      blendMode: 'overlay',
    })
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

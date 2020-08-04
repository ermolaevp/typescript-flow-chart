import paper from 'paper'
import './style.css';
import { data } from './data'
import { drawConnection } from './connection'
import { createStatusRect } from './createStatusRect'

const { statuses, transitions } = data.layout

paper.setup('root')

function point(x: number, y: number) {
  return new paper.Point(x, y)
}

// const s = point(10, 10)
// const testp = new paper.Path({
//   segments: [
//     s,
//     new paper.Segment({ point: s.add(point(0, 50)), handleOut: point(10, 100)}),
//     new paper.Segment({ point: point(100, 100), handleIn: point(10, 100)}),
//     point(200, 100),
//   ],
//   strokeColor: 'black',
//   selected: true
// })

let arrow: paper.Path, currect: paper.Item, arrow2: paper.Path

const statusesGroup = new paper.Group({
  children: statuses.map(createStatusRect),
  // position: paper.view.center
})

const transitionsGroup = new paper.Group({
  children: transitions.map(transition => {
    const { id, sourceId, targetId, sourceAngle, targetAngle } = transition
    const source = statusesGroup.children[sourceId]
    const sourcePoint = source.data.get(sourceAngle)
    if (!sourcePoint) throw new Error(`No source point found for ${sourceAngle}`)
    const target = statusesGroup.children[targetId]
    const targetPoint = target.data.get(targetAngle)
    if (!targetPoint) throw new Error(`No target point found for ${targetAngle}`)
    
    const connGroup = drawConnection(sourcePoint, targetPoint)
    connGroup.name = id
    connGroup.data = transition
    return connGroup
  })
})

const tool = new paper.Tool()

tool.onMouseDown = (e: paper.MouseEvent) => {
  if (currect) {
    currect.firstChild.selected = false
    currect = null
  }
  const rct = statusesGroup.children.find(r => r.contains(e.point))
  if (rct) {
    currect = rct
    currect.firstChild.selected = true
  }
}

tool.onMouseDrag = (e: paper.ToolEvent) => {
  if (currect) {
    currect.position = e.point
    // FIXME: what about multiple connections?
    const conn = transitionsGroup.getItem(i => {
      return i.name.includes(currect.name)
    })
    if (conn) {
      const { id, sourceId, targetId, sourceAngle, targetAngle } = conn.data
      // console.log(conn.data)
      const source = statusesGroup.children[sourceId].data.get(sourceAngle)
      if (!source) throw new Error(`No source point found for ${sourceAngle}`)
      const target = statusesGroup.children[targetId].data.get(targetAngle)
      if (!target) throw new Error(`No target point found for ${targetAngle}`)
      conn.remove()
      const newConn = drawConnection(
        source,
        target,
      )
      newConn.data = { id, sourceId, targetId, sourceAngle, targetAngle }
      newConn.name = id
      transitionsGroup.addChild(newConn)
    }
  } else {
    var delta = e.downPoint.subtract(e.point)
    paper.view.scrollBy(delta)
  }
}

// paper.view.onMouseDrag = function(this: any, e: any) {
//   this.scrollBy(e.downPoint.subtract(e.point))
// }
import paper from 'paper'
import './style.css';
import { data } from './data'
import { drawConnection } from './connection'
import { StatusRectangle } from './createStatusRect'
import { Transition } from './Transition'

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
let statusesGroup: paper.Group, transitionsGroup: paper.Group

function onMouseDrag(this: paper.Group, e) {
  this.position = e.point
  transitionsGroup.children.forEach(transition => {
    if (transition.hasConnectionWith(this)) {
      transition.redraw()
    }
  })
  // const trstns = transitions.filter(t => {
  //   return [t.sourceId, t.targetId].includes(this.name)
  // })
  // console.log(trstns.map(t => t.id))
  // trstns.forEach(t => {
  //   const tg = transitionsGroup.getItem({ name: t.name })
  //   tg.redraw()
    // console.log(tg)
    // recalculate transition points
    // paper.view.
  // })

}

statusesGroup = new paper.Group({
  children: statuses.map(s => {
    const statusRect = new StatusRectangle(s)
    statusRect.onMouseDrag = onMouseDrag
    return statusRect
  }),
  // position: paper.view.center
})

transitionsGroup = new paper.Group({
  children: transitions.map(transition => {
    const { id, sourceId, targetId, sourceAngle, targetAngle } = transition
    const source = statusesGroup.children['status_' + sourceId]
    if (!source) throw new Error(`No source with id ${sourceId} found`)
    const target = statusesGroup.children['status_' + targetId]
    if (!target) throw new Error(`No target with id ${targetId} found`)

    // const sourcePoint = source.data.get(sourceAngle)
    // if (!sourcePoint) throw new Error(`No source point found for ${sourceAngle}`)
    // const targetPoint = target.data.get(targetAngle)
    // if (!targetPoint) throw new Error(`No target point found for ${targetAngle}`)
    
    const connGroup = new Transition({ id, source, target, sourceAngle, targetAngle })
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
    // currect.position = e.point
    // FIXME: what about multiple connections?
    // const conn = transitionsGroup.getItem(i => {
    //   return [i.data.sourceId, i.data.targetId].includes(currect.name)
    // })
    // if (conn) {
    //   const { id, sourceId, targetId, sourceAngle, targetAngle } = conn.data
    //   const source = statusesGroup.children[sourceId].data.get(sourceAngle)
    //   if (!source) throw new Error(`No source point found for ${sourceAngle}`)
    //   const target = statusesGroup.children[targetId].data.get(targetAngle)
    //   if (!target) throw new Error(`No target point found for ${targetAngle}`)
    //   conn.remove()
    //   const newConn = drawConnection(
    //     source,
    //     target,
    //   )
    //   newConn.data = { id, sourceId, targetId, sourceAngle, targetAngle }
    //   newConn.name = id
    //   transitionsGroup.addChild(newConn)
    // }
  } else {
    var delta = e.downPoint.subtract(e.point)
    paper.view.scrollBy(delta)
  }
}

// paper.view.onMouseDrag = function(this: any, e: any) {
//   this.scrollBy(e.downPoint.subtract(e.point))
// }
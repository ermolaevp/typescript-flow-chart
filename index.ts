import paper from 'paper'
import './style.css';
import { data } from './data'
import { drawConnection } from './connection'
import { StatusRectangle } from './StatusRectangle'
import { Transition } from './Transition'
import { ConnectionPointGroup, ConnectionPoint } from './ConnectionPoint'

const { statuses, transitions } = data.layout

paper.setup('root')

// paper.view.onMouseDrag = function(this: paper.View, e: paper.MouseEvent) {
  // this.
  // console.log(e.point, e.delta, e.downPoint)
  // this.scrollBy(e.delta.subtract(e.point))
  // this.
  // this.position = e.point
  // this.scrollBy()
// }

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
let connectionPoints = new paper.Group

function onMouseDrag(this: StatusRectangle, e: paper.MouseEvent) {
  this.position = this.position.add(e.delta)
  // e.stopPropagation()
  // e.preventDefault()
  transitionsGroup.children.forEach(transition => {
    if (transition.hasConnectionWith(this)) {
      transition.redraw()
    }
  })
}

function handleTransitionChange(this: StatusRectangle) {
  transitionsGroup.children.forEach(transition => {
    if (transition.hasConnectionWith(this)) {
      // this.lastChild.children.forEach(circle => {
      //   const angle = circle.position.subtract(this.position).angle
      //   console.log(angle)
      // })
      console.log(this.lastChild.data, transition.sourceAngle)
    }
  })
}

function handleConnectionPointMouseUp(this: ConnectionPoint) {
  
  console.log(this)
}

function handleConnectionPointMouseEnter(this: ConnectionPoint) {
  this.fillColor.set('red')
}

function handleConnectionPointMouseLeave(this: ConnectionPoint) {
  this.fillColor.set('transparent')
}

statusesGroup = new paper.Group({
  children: statuses.map(s => {
    const statusRect = new StatusRectangle(s)
    const connectionGroup = new ConnectionPointGroup(statusRect)
    connectionGroup.children.forEach(connectionPoint => {
      connectionPoint.onMouseUp = handleConnectionPointMouseUp
      connectionPoint.onMouseEnter = handleConnectionPointMouseEnter
      connectionPoint.onMouseLeave = handleConnectionPointMouseLeave
    })
    connectionPoints.addChild(connectionGroup)
    statusRect.addChild(connectionGroup)
    statusRect.onMouseDrag = onMouseDrag
    // statusRect.lastChild.children.forEach()
    return statusRect
  }),
  // position: paper.view.center
})

transitionsGroup = new paper.Group({
  children: transitions.map(transition => {
    const { id, sourceId, targetId, sourceAngle, targetAngle } = transition
    const source = statusesGroup.children[StatusRectangle.getName(sourceId)]
    if (!source) throw new Error(`No source with id ${sourceId} found`)
    const target = statusesGroup.children[StatusRectangle.getName(targetId)]
    if (!target) throw new Error(`No target with id ${targetId} found`)
    return new Transition({ id, source, target, sourceAngle, targetAngle })
  })
})

const tool = new paper.Tool()

tool.onMouseDrag = (e: paper.ToolEvent) => {
  if (statusesGroup.getItems({ selected: true }).length > 0) {

  } else {
    var delta = e.downPoint.subtract(e.point)
    paper.view.scrollBy(delta)
  }
}

// paper.view.onMouseDrag = function(this: any, e: any) {
//   this.scrollBy(e.delta.rotate(180))
// }

window.document.body.querySelector('#jsonlog').addEventListener('click', () => {
  const res = statusesGroup.children.map(s => {
    return s.toJSON()
  })
  console.log(JSON.stringify(res))
})
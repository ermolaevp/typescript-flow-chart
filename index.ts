import paper from 'paper'
import './style.css';
import { data } from './data'
import { drawConnection } from './connection'
import { StatusRectangle } from './StatusRectangle'
import { Transition } from './Transition'
import { ConnectionPointGroup, ConnectionPoint } from './ConnectionPoint'

const { statuses, transitions } = data.layout

paper.setup('root')

let statusesGroup: paper.Group
let transitionsGroup: paper.Group
let connectionPoint: ConnectionPoint

function hanleStatusMouseDrag(this: StatusRectangle, e: paper.MouseEvent) {
  this.position = this.position.add(e.delta)
  transitionsGroup.children.forEach(transition => {
    if (transition.hasConnectionWith(this)) {
      transition.redraw()
    }
  })
}

function handleConnectionPointMouseEnter(this: ConnectionPoint) {
  this.fillColor.set('red')
  if (connectionPoint) {
    const t1 = transitionsGroup.getItem(t => t.sourcePoint.equals(connectionPoint.position))
    if (t1) t1.reconnectSourcePoint(this.position)
    const t2 = transitionsGroup.getItem(t => t.targetPoint.equals(connectionPoint.position))
    if (t2) t2.reconnectTargetPoint(this.position)
  }
}

function handleConnectionPointMouseLeave(this: ConnectionPoint) {
  this.fillColor.set('transparent')
}

function handleConnectionPointMouseDrag(this: ConnectionPoint, e: paper.MouseEvent) {
  e.stopPropagation()
  connectionPoint = this
  connectionPoint.selected = true
}

function handleConnectionPointMouseUp(this: ConnectionPoint) {
  if (connectionPoint) {
    connectionPoint.selected = false
    connectionPoint = null
  }
}

statusesGroup = new paper.Group({
  children: statuses.map(s => {
    const statusRect = new StatusRectangle(s)
    const connectionGroup = new ConnectionPointGroup(statusRect)
    connectionGroup.children.forEach(connectionPoint => {
      connectionPoint.onMouseEnter = handleConnectionPointMouseEnter
      connectionPoint.onMouseLeave = handleConnectionPointMouseLeave
      connectionPoint.onMouseDrag = handleConnectionPointMouseDrag
      connectionPoint.onMouseUp = handleConnectionPointMouseUp
    })
    statusRect.addChild(connectionGroup)
    statusRect.onMouseDrag = hanleStatusMouseDrag
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

window.document.body.querySelector('#jsonlog').addEventListener('click', () => {
  const res = statusesGroup.children.map(s => {
    return s.toJSON()
  })
  console.log(JSON.stringify(res))
})
import paper from 'paper'

function point(x: number, y: number) {
  return new paper.Point(x, y)
}

export function drawConnection(from: paper.Point, to: paper.Point) {
  let connection: paper.Path
  const d = 20
  if (from.y + d * 2 < to.y) {
    const middleY = from.y + (to.y - from.y) / 2
    const p1 = new paper.Point(from.x, middleY)
    const p2 = new paper.Point(to.x, middleY)
    connection = new paper.Path({
      segments: [
        from,
        p1,
        p2,
        to
      ],
      strokeColor: 'gray'
    })
  } else {
    const middleX = from.x + (to.x - from.x)/2
    connection = new paper.Path({
      segments: [
        from,
        new paper.Point(from.x, from.y + d),
        new paper.Point(middleX, from.y + d),
        new paper.Point(middleX, to.y - d),
        new paper.Point(to.x, to.y - d),
        to
      ],
      strokeColor: 'gray',
    })
  }
  const vector = new paper.Point(0, 10)
  const arrow = new paper.Path({
      segments: [
        to,
        to.subtract(vector.rotate(-30, undefined)),
        to.subtract(vector.rotate(30, undefined))
      ],
      fillColor: 'gray',
      closed: true,
    })
  return new paper.Group({ children: [connection, arrow] })
}
import paper from 'paper'

function point(x: number, y: number) {
  return new paper.Point(x, y)
}

export function drawConnection(from: paper.Point, to: paper.Point) {
  let segments: paper.Point[]
  const d = 20
  if (from.y + d * 2 < to.y) {
    const middleY = from.y + (to.y - from.y) / 2
    const p1 = new paper.Point(from.x, middleY)
    const p2 = new paper.Point(to.x, middleY)
      segments = [
        from,
        p1,
        p2,
        to
      ]
  } else {
    const middleX = from.x + (to.x - from.x)/2
      segments = [
        from,
        new paper.Point(from.x, from.y + d),
        new paper.Point(middleX, from.y + d),
        new paper.Point(middleX, to.y - d),
        new paper.Point(to.x, to.y - d),
        to
      ]
  }
  
  return segments
}

export function createTargetArrow() {
  const vector = new paper.Point(0, 10)
  return new paper.SymbolDefinition(new paper.Path({
      segments: [
        vector,
        vector.subtract(vector.rotate(-30, undefined)),
        vector.subtract(vector.rotate(30, undefined))
      ],
      fillColor: 'gray',
      closed: true,
    }))
}
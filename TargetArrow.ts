import paper from 'paper'

export class TargetArrow extends paper.SymbolDefinition {
  private vector: paper.Point
  constructor() {
    const vector = new paper.Point(0, 10)
    const path = new paper.Path({
      segments: [
        vector,
        vector.subtract(vector.rotate(-30, undefined)),
        vector.subtract(vector.rotate(30, undefined))
      ],
      fillColor: 'gray',
      closed: true,
      pivot: vector,
    })
    super(path)
    this.vector = vector
  }
}

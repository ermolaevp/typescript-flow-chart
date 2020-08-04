import paper from 'paper'

export function connectionPoint(center: paper.Point) {
  let p: paper.Path
  return new paper.Path.Circle({
    center,
    radius: 3,
    strokeWidth: 2,
    strokeColor: 'lightgrey',
    onMouseDrag: function(this: any, e: any) {
      // console.log(e.point)
      if (p) p.remove()
      p = new paper.Path({
        sements: [e.point, this.position],
        strokeColor: 'black'
      })
    }
  })
}
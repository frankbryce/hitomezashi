const numRows = 10
const numCols = 10
const stitchWeight = 2
const stitchLen = 40

d3.select('#glfield')
    .attr('width', stitchLen * (numCols + 1))
    .attr('height', stitchLen * (numRows + 1));

function updateCols(selection, data) {
    let cols = selection
        .selectAll(".stitch-col")
        .data(data);
    cols.exit().remove();
    group = cols.enter()
        .append('g')
        .attr("class", "stitch-col")
        .merge(cols);
    let stitches = group.selectAll("rect")
        .data((d, i) => d3.map(d3.range(numRows/2), r => [i+1, d + 2*r]))
    stitches.exit().remove();
    stitches.enter()
        .append('rect')
        .attr('width', stitchWeight)
        .attr('height', stitchLen)
    .merge(stitches)
        .attr('x', d => d[0] * stitchLen - stitchWeight/2)
        .attr('y', d => d[1] * stitchLen)
        .style("fill", "black");
}

function updateRows(selection, data) {
    let cols = selection
        .selectAll(".stitch-row")
        .data(data);
    cols.exit().remove();
    group = cols.enter()
        .append('g')
        .attr("class", "stitch-row")
        .merge(cols);
    let stitches = group.selectAll("rect")
        .data((d, i) => d3.map(d3.range(numCols/2), r => [d + 2*r, i+1]))
    stitches.exit().remove();
    stitches.enter()
        .append('rect')
        .attr('width', stitchLen)
        .attr('height', stitchWeight)
    .merge(stitches)
        .attr('x', d => d[0] * stitchLen)
        .attr('y', d => d[1] * stitchLen - stitchWeight/2)
        .style("fill", "black");
}

colStitches = [0,1,0,1,0,1,0,1,0,1]
rowStitches = [1,1,1,0,1,0,1,1,0,1]
el = d3.select('#glfield')
el.call(updateCols, colStitches);
el.call(updateRows, rowStitches);

for (let t=1;t<=10;t++) {
    (new Promise((p) => setTimeout(p, 1000*t))).then(() => {
        for (let i=0;i<colStitches.length;i++) {
            colStitches[i] = 1 - colStitches[i];
        }
        for (let i=0;i<colStitches.length;i++) {
            rowStitches[i] = 1 - rowStitches[i];
        }
        d3.select('#glfield').call(updateCols, colStitches);
        d3.select('#glfield').call(updateRows, rowStitches);
    });
}

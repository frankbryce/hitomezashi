var socket = io();

// for debugging
socket.on('connect', function() {
    console.log('socket is open');
});
socket.on('disconnect', function() {
    console.log('socket is closed');
});

const stitchWeight = 2
const stitchLen = 40

function updateCols(selection, offsets, numRows) {
    let cols = selection
        .selectAll(".stitch-col")
        .data(offsets);
    cols.exit().remove();
    group = cols.enter()
        .append('g')
        .attr("class", "stitch-col")
        .merge(cols);
    let stitches = group.selectAll("rect")
        .data((offset, i) => d3.map(d3.range(numRows/2), r => [i+1, offset + 2*r]))
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

function updateRows(selection, offsets, numCols) {
    let cols = selection
        .selectAll(".stitch-row")
        .data(offsets);
    cols.exit().remove();
    group = cols.enter()
        .append('g')
        .attr("class", "stitch-row")
        .merge(cols);
    let stitches = group.selectAll("rect")
        .data((offset, i) => d3.map(d3.range(numCols/2), r => [offset + 2*r, i+1]))
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

socket.on('json', function(data) {
    // read data from server
    var colOffsets = JSON.parse(data.colOffsets);
    var rowOffsets = JSON.parse(data.rowOffsets);

    // update field size
    let numCols = colOffsets.length;
    let numRows = rowOffsets.length;
    let el = d3.select('#glfield')
        .attr('width', stitchLen * (numCols + 1))
        .attr('height', stitchLen * (numRows + 1));

    // update UI
    el.call(updateCols, colOffsets, numRows);
    el.call(updateRows, rowOffsets, numCols);
});

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
const buttonSize = 0.6  // with respect to stitchLen

function updateCols(selection, offsets, numRows) {
    let cols = selection
        .selectAll('.stitch-col')
        .data(offsets);
    cols.exit().remove();
    group = cols.enter()
        .append('g')
        .attr('class', 'stitch-col')
        .merge(cols);
    group.append('circle')
        .attr('cx', (d,i) => (i+2) * stitchLen)
        .attr('cy', 0.5 * stitchLen)
        .attr('r', stitchLen * buttonSize * 0.5)
        .style('stroke', 'black')
        .style('fill', d => d ? 'black' : 'white');
    let stitches = group.selectAll('rect')
        .data((offset, i) => 
            d3.map(d3.range(numRows/2 - offset + 1),
                   r => [i+2, 1 + offset + 2*r]))
    stitches.exit().remove();
    stitches.enter()
        .append('rect')
        .attr('width', stitchWeight)
        .attr('height', stitchLen)
    .merge(stitches)
        .attr('x', d => d[0] * stitchLen - stitchWeight/2)
        .attr('y', d => d[1] * stitchLen)
        .style('fill', 'black');
}

function updateRows(selection, offsets, numCols) {
    let cols = selection
        .selectAll('.stitch-row')
        .data(offsets);
    cols.exit().remove();
    group = cols.enter()
        .append('g')
        .attr('class', 'stitch-row')
        .merge(cols);
    group.append('circle')
        .attr('cx', 0.5 * stitchLen)
        .attr('cy', (d,i) => (i+2) * stitchLen)
        .attr('r', stitchLen * buttonSize * 0.5)
        .style('stroke', 'black')
        .style('fill', d => d ? 'black' : 'white');
    let stitches = group.selectAll('rect')
        .data((offset, i) => 
            d3.map(d3.range(numCols/2 - offset + 1),
                   r => [1 + offset + 2*r, i+2]))
    stitches.exit().remove();
    stitches.enter()
        .append('rect')
        .attr('width', stitchLen)
        .attr('height', stitchWeight)
    .merge(stitches)
        .attr('x', d => d[0] * stitchLen)
        .attr('y', d => d[1] * stitchLen - stitchWeight/2)
        .style('fill', 'black');
}

socket.on('json', function(data) {
    // read data from server
    var colOffsets = JSON.parse(data.colOffsets);
    var rowOffsets = JSON.parse(data.rowOffsets);

    // update field size
    let numCols = colOffsets.length;
    let numRows = rowOffsets.length;
    let el = d3.select('#glfield')
        .attr('width', stitchLen * (numCols + 2) + stitchWeight)
        .attr('height', stitchLen * (numRows + 2) + stitchWeight)
    d3.select('#border')
        .attr('width', stitchLen * (numCols + 1))
        .attr('height', stitchLen * (numRows + 1))
        .attr('x', stitchLen)
        .attr('y', stitchLen)
        .style('stroke', 'black')
        .style('stroke-width', stitchWeight)
        .style('fill', 'None');

    // update UI
    el.call(updateCols, colOffsets, numRows);
    el.call(updateRows, rowOffsets, numCols);
});

for (let t=1;t<=10;t++) {
    (new Promise((p) => setTimeout(p, 1000*t))).then(() => {
	socket.emit('random');
    });
}

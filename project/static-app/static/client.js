const stitchWeight = 2
const stitchLen = 40
const buttonSize = 0.7  // with respect to stitchLen

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
        .attr('cx', (_,i) => (i+3) * stitchLen)
        .attr('cy', 1.5 * stitchLen)
        .attr('r', stitchLen * buttonSize * 0.5)
        .attr('onclick', (_,i) => `toggleCol(${i})`)
        .style('stroke', 'black')
        .style('fill', d => d ? 'black' : 'white');
    let stitches = group.selectAll('rect')
        .data((offset, i) => 
            d3.map(d3.range((numRows - offset + 1)/2),
                   r => [i+3, 2 + offset + 2*r]))
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
        .attr('cx', 1.5 * stitchLen)
        .attr('cy', (_,i) => (i+3) * stitchLen)
        .attr('r', stitchLen * buttonSize * 0.5)
        .attr('onclick', (_,i) => `toggleRow(${i})`)
        .style('stroke', 'black')
        .style('fill', d => d ? 'black' : 'white');
    let stitches = group.selectAll('rect')
        .data((offset, i) => 
            d3.map(d3.range((numCols - offset + 1)/2),
                   r => [2 + offset + 2*r, i+3]))
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

let numCols = 16;
let numRows = 16;
let colOffsets = [];
let rowOffsets = [];

function redraw() {
    let el = d3.select('#glfield')
        .attr('width', stitchLen * (numCols + 4) + stitchWeight)
        .attr('height', stitchLen * (numRows + 4) + stitchWeight)
    d3.select('#border')
        .attr('width', stitchLen * (numCols + 1))
        .attr('height', stitchLen * (numRows + 1))
        .attr('x', 2*stitchLen)
        .attr('y', 2*stitchLen)
        .style('stroke', 'black')
        .style('stroke-width', stitchWeight)
        .style('fill', '#f0f0f0');
    d3.select('#refresh')
        .attr('cx', stitchLen/2)
        .attr('cy', stitchLen/2)
        .attr('r', stitchLen * buttonSize * 0.5 * 1.1)
        .attr('onclick', (_,i) => `reset()`)
        .style('stroke', 'cyan')
        .style('fill', 'cyan');
    d3.select('#del-col')
        .attr('cx', 1.5*stitchLen)
        .attr('cy', stitchLen/2)
        .attr('r', stitchLen * buttonSize * 0.5 * 1.1)
        .attr('onclick', (_,i) => `remCol()`)
        .style('stroke', 'red')
        .style('fill', 'red');
    d3.select('#add-col')
        .attr('cx', 2.5*stitchLen)
        .attr('cy', stitchLen/2)
        .attr('r', stitchLen * buttonSize * 0.5 * 1.1)
        .attr('onclick', (_,i) => `addCol()`)
        .style('stroke', 'green')
        .style('fill', 'green');
    d3.select('#del-row')
        .attr('cx', stitchLen/2)
        .attr('cy', 1.5*stitchLen)
        .attr('r', stitchLen * buttonSize * 0.5 * 1.1)
        .attr('onclick', (_,i) => `remRow()`)
        .style('stroke', 'red')
        .style('fill', 'red');
    d3.select('#add-row')
        .attr('cx', stitchLen/2)
        .attr('cy', 2.5*stitchLen)
        .attr('r', stitchLen * buttonSize * 0.5 * 1.1)
        .attr('onclick', (_,i) => `addRow()`)
        .style('stroke', 'green')
        .style('fill', 'green');

    // update UI
    el.call(updateCols, colOffsets, numRows);
    el.call(updateRows, rowOffsets, numCols);
}

function reset() {
    // read data from server
    colOffsets = [1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1];
    rowOffsets = [1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1];

    // update field size
    numCols = colOffsets.length;
    numRows = rowOffsets.length;
    redraw();
}
reset();

function toggleCol(i) {
    colOffsets[i] = 1 - colOffsets[i];
    d3.select('#glfield').call(updateCols, colOffsets, numRows);
}
function toggleRow(i) {
    rowOffsets[i] = 1 - rowOffsets[i];
    d3.select('#glfield').call(updateRows, rowOffsets, numCols);
}
function addCol() {
    numCols += 1;
    colOffsets.push(0);
    redraw();
}
function remCol() {
    numCols -= 1;
    colOffsets.pop();
    redraw();
}
function addRow() {
    numRows += 1;
    rowOffsets.push(0);
    redraw();
}
function remRow() {
    numRows -= 1;
    rowOffsets.pop();
    redraw();
}

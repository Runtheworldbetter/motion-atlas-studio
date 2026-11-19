/*!
 * Original functions from Red Blob Games' A* introduction.
 * Copyright 2014, 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0. See LICENSE and THIRD-PARTY-NOTICES.txt.
 * Motion Atlas adaptation, 2026: extract the plain-grid initializers only,
 * use local imports, and register original Diagram instances for viewport resizing.
 * Search, grid, canvas layers, marker dragging, and slider playback are unchanged.
 */
import {SearchOptions} from './source/pathfinding/search.js';
import {SquareGrid, SquareGridLayout} from './source/pathfinding/grid.js';
import {Diagram as OriginalDiagram, Layers, Markers, Patterns, addSlider, addSliderSteps} from './source/pathfinding/diagram.js';
export const diagrams = [];
class Diagram extends OriginalDiagram {
  constructor(...args) { super(...args); diagrams.push(this); }
}
function manhattan_heuristic(graph, goal, current) {
    let xy0 = graph.from_id(goal);
    let xy1 = graph.from_id(current);
    return Math.abs(xy0[0] - xy1[0]) + Math.abs(xy0[1] - xy1[1]);
}


const currentTileStyleMap = { current: {fillStyle: "hsl(220, 60%, 60%)"}, };
const forestColoringStyleMap = { [5]: {fillStyle: Patterns.forest}, };

const reconstructedPathStyle = {
    lineWidth: 11,
    strokeStyle: "hsl(30, 5%, 90%)",
};


function mouseoverLayer(callback) {
    return {
        cursor(event) {
            if (event.id !== -1) {
                callback(event.id);
                this.redraw();
            }
        },
    };
}

function setCursorOnTile(getTileId, cursorStyle) {
    return {
        cursor(event) {
            return event.id === getTileId() ? cursorStyle : null;
        },
    };
}

function reconstructedPathLayer(getId, style) {
    style = Object.assign({
        lineWidth: 4,
        lineCap: "round",
        lineJoin: "round",
        strokeStyle: "hsl(280, 50%, 50%)",
    }, style);
    return {
        draw(ctx, ss, map) {
            let id = getId();
            if (id < 0) { return; }
            let xy = this.layout.tile_center(id);
            Object.assign(ctx, style);
            ctx.beginPath();
            ctx.moveTo(xy[0], xy[1]);
            while (map[id].parent !== undefined) {
                id = map[id].parent;
                xy = this.layout.tile_center(id);
                ctx.lineTo(xy[0], xy[1]);
            }
            ctx.stroke();
        },
    };
}


function heuristicLayer(getGoal, getMouseover) {
    return {
        draw(ctx, ss, map) {
            const layout = this.layout;
            let mouseover = getMouseover(), goal = getGoal();
            if (mouseover >= 0 && goal >= 0) {
                let xy0 = layout.tile_center(mouseover);
                let xy1 = layout.tile_center(goal);
                ctx.strokeStyle = "hsl(330, 50%, 50%)";
                ctx.lineWidth = 4;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(xy0[0], xy0[1]);
                ctx.lineTo(xy1[0], xy1[1]);
                ctx.stroke();
            }
        },
    };
}



let diagram_frontier_walls = [
    21,22,51,52,81,82,93,94,111,112,123,124,133, 134,141,142,153,154,
    163,164,171,172,173,174,175,183,184,193,194,201,202,203,204,205,213,
    214,223,224,243,244,253,254,273,274,283,284,303,304,313,314,333,334,
    343,344,373,374,403,404,433,434]; /* ids for a 30x15 grid */

function makeDiagramFrontier() {
    let graph = new SquareGrid(30, 15);
    // NOTE: to make this list, draw on the graph, then console log graph.tiles_with_given_weight(Infinity).toString()
    diagram_frontier_walls.forEach((id) => { graph.set_tile_weight(id, Infinity); });

    let layout = new SquareGridLayout(graph, 20);
    let options = new SearchOptions([graph.to_id(8, 7)]);
    let diagram = new Diagram(
        "#diagram-frontier", graph, options, layout,
        Layers.base(),
        Layers.frontierTiles(),
        Layers.editable(),
        Layers.draggableMarker(Markers.blob(11), options.starts, 0)
    );

    let distanceLimit = 0;
    options.exit_now = (ss, map) => (map[ss.current].cost_so_far >= distanceLimit);
    
    // NOTE: it would be nicer to calculate the max dynamically
    // but to do so would mean we need to run breadth first search
    // without early exit. Alternative 1: run it a second time and
    // record the maximum distance. Alternative 2: always run it
    // without early exit, and use tile coloring to indicate what
    // would've happened with early exit. Alternative 3: hard-code
    // it for now.
    addSlider("#diagram-frontier", {
        min: 0,
        max: 60,
        get value() { return distanceLimit; },
        set value(v) { distanceLimit = v; diagram.redraw(); },
        animationFrameMs: 1000/7,
    }).setSliderPosition(3);
}

function makeDiagramExpansion() {
    let graph = new SquareGrid(9, 4);
    let layout = new SquareGridLayout(graph, 600/9);
    let options = new SearchOptions([graph.to_id(3, 1)]);
    let diagram = new Diagram(
        "#diagram-expansion", graph, options, layout,
        Layers.base(currentTileStyleMap),
        Layers.frontierTiles(),
        Layers.editable(),
        Layers.numericLabels('visit_order', "hsl(0, 10%, 80%)"),
        Layers.neighborTiles(),
        Layers.draggableMarker(Markers.blob(20), options.starts, 0)
    );
    addSliderSteps("#diagram-expansion", [diagram]);
    document.querySelector("#diagram-expansion .step_back").textContent = "< Step backward";
    document.querySelector("#diagram-expansion .step_forward").textContent = "Step forward >";
}

function makeDiagramPathReconstruction() {
    let graph = new SquareGrid(30, 15);
    let layout = new SquareGridLayout(graph, 20);
    diagram_frontier_walls.forEach((id) => { graph.set_tile_weight(id, Infinity); });

    let exit = {id: graph.to_id(23, 4)};
    let options = new SearchOptions([graph.to_id(8, 7)]);
    let diagram = new Diagram(
        "#diagram-path-reconstruction", graph, options, layout,
        Layers.base({
            reached: {},
            [Infinity]: {fillStyle: "hsl(60, 5%, 50%)", strokeStyle: "hsl(60, 5%, 50%)", lineWidth: 1.5}
        }),
        Layers.editable(),
        Layers.parentPointers(false),
        reconstructedPathLayer(() => exit.id),
        Layers.draggableMarker(Markers.blob(14), options.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id'),
        setCursorOnTile(() => exit.id, "crosshair")
    );
}

function makeDiagramEarlyExit() {
    let graph = new SquareGrid(15, 15);
    let layout = new SquareGridLayout(graph, 19);
    let exit = {id: graph.to_id(8, 9)};

    let a_options = new SearchOptions([graph.to_id(2, 6)]);
    let a = new Diagram(
        "#diagram-early-exit-false", graph, a_options, layout,
        Layers.base(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('cost_so_far'),
        Layers.draggableMarker(Markers.blob(10), a_options.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id')
    );

    let b_options = new SearchOptions(a_options.starts, ss => exit.id === ss.current);
    let b = new Diagram(
        "#diagram-early-exit-true", graph, b_options, layout,
        Layers.base(),
        Layers.frontierTiles(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('cost_so_far'),
        Layers.draggableMarker(Markers.blob(10), b_options.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id')
    );

    a.linkTo(b);
}

function makeDiagramWeights() {
    let graph = new SquareGrid(10, 10);
    let layout = new SquareGridLayout(graph, 28);
    let options = new SearchOptions([graph.to_id(1, 4)]);
    let exit = {id: graph.to_id(8, 5)};
    [71,72,73,81,82,83].forEach((id) => graph.set_tile_weight(id, Infinity));
    [14,15,24,25,26,34,35,36,37,43,44,45,46,47,53,54,55,56,57,64,
     65,66,74,75,76,84,85].forEach((id) => graph.set_tile_weight(id, 5));

    let graph_proxy = graph.make_proxy();
    graph_proxy.edge_weight = (id1, id2) => 1;

    let a = new Diagram(
        "#diagram-weights-false", graph_proxy, options, layout,
        Layers.base(forestColoringStyleMap),
        Layers.editable(1, 5, Infinity),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('cost_so_far'),
        Layers.draggableMarker(Markers.blob(15), options.starts, 0),
        Layers.draggableMarker(Markers.cross(12), exit, 'id')
    );

    let b = new Diagram(
        "#diagram-weights-true", graph, options, layout,
        Layers.base(forestColoringStyleMap),
        Layers.editable(1, 5, Infinity),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('cost_so_far'),
        Layers.draggableMarker(Markers.blob(15), options.starts, 0),
        Layers.draggableMarker(Markers.cross(12), exit, 'id')
    );

    a.linkTo(b);
}

function makeDiagramAStar() {
    let graph = new SquareGrid(15, 15);
    let layout = new SquareGridLayout(graph, 19);
    let exit = {id: graph.to_id(11, 1)};
    let mouseover = -1;

    [35,36,37,38,39,40,41,42,57,72,87,102,117,132,147,162,177,182,183,184,
     185,186,187,188,189,190,191,192].forEach((id) => graph.set_tile_weight(id, Infinity));

    let starts = [graph.to_id(0, 12)];
    let options_a = new SearchOptions(starts, (ss) => ss.current == exit.id);
    let diagram_a = new Diagram(
        "#diagram-astar-1", graph, options_a, layout,
        Layers.base(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('cost_so_far'),
        mouseoverLayer(id => { mouseover = id; }),
        reconstructedPathLayer(() => mouseover),
        Layers.draggableMarker(Markers.blob(8), starts, 0),
        Layers.draggableMarker(Markers.cross(7), exit, 'id')
    );

    let options_b = new SearchOptions(starts, options_a.exit_now,
                                      (id, node) => {node.h = manhattan_heuristic(graph, exit.id, id); return node.h;});
    options_b.allow_reprioritize = false;
    let diagram_b = new Diagram(
        "#diagram-astar-2", graph, options_b, layout,
        Layers.base(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('h'),
        mouseoverLayer(id => { mouseover = id; }),
        heuristicLayer(() => mouseover, () => exit.id),
        Layers.draggableMarker(Markers.blob(8), starts, 0),
        Layers.draggableMarker(Markers.cross(7), exit, 'id')
    );

    let options_c = new SearchOptions(starts, options_a.exit_now,
                                      (id, node) => {node.h = manhattan_heuristic(graph, exit.id, id); return node.cost_so_far + 1.01*node.h;});
    let diagram_c = new Diagram(
        "#diagram-astar-3", graph, options_c, layout,
        Layers.base(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.numericLabels('sort_key'),
        mouseoverLayer(id => { mouseover = id; }),
        reconstructedPathLayer(() => mouseover),
        heuristicLayer(() => mouseover, () => exit.id),
        Layers.draggableMarker(Markers.blob(8), starts, 0),
        Layers.draggableMarker(Markers.cross(7), exit, 'id')
    );

    diagram_a.linkTo(diagram_b, diagram_c);
}

export {makeDiagramFrontier, makeDiagramExpansion, makeDiagramWeights, makeDiagramAStar};

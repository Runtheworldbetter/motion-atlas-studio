/*!
 * From https://www.redblobgames.com/pathfinding-canvas/a-star/
 * Copyright 2014, 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 * Please feel free to read the source code for graph search:
 * https://www.redblobgames.com/pathfinding-canvas/search.js
 * https://www.redblobgames.com/pathfinding-canvas/grid.js
 * and for the diagrams:
 * https://www.redblobgames.com/pathfinding-canvas/a-star/introduction.js
 * https://www.redblobgames.com/pathfinding-canvas/diagram.js
 */

import {SearchOptions} from '../search.js';
import {Graph, GraphLayout, SquareGrid, SquareGridLayout} from '../grid.js';
import {Diagram, Layers, Markers, Patterns, addSlider, addSliderSteps, drawPolygon, lerp} from '../diagram.js';

console.info("I'm happy to answer questions about a* pathfinding or how this page works. --redblobgames@gmail.com");
console.info("If you want to make your own interactive pages, I have a tutorial for that https://www.redblobgames.com/making-of/circle-drawing/");

/** like python range() */
function range(lo, hi) { return Array.from({length: hi-lo}, (_, i) => (lo + i)); }

function manhattan_heuristic(graph, goal, current) {
    let xy0 = graph.from_id(goal);
    let xy1 = graph.from_id(current);
    return Math.abs(xy0[0] - xy1[0]) + Math.abs(xy0[1] - xy1[1]);
}

/**
 * Point in polygon test based on https://stackoverflow.com/a/2922778
 * However: Mikola Lysenko in the comments warns it's not robust, see:
 * Schirra S. (2008) How Reliable Are Practical Point-in-Polygon Strategies?.
 * <https://doi.org/10.1007/978-3-540-87744-8_62>
 *
 * Mikola has a library <https://github.com/mikolalysenko/robust-point-in-polygon>
 * Also see <http://web.archive.org/web/20110314030147/http://paulbourke.net/geometry/insidepoly/>
 */
function isPointInPolygon(point, polygon) {
    let N = polygon.length;
    let inside = false;
    for (let i = 0, j = N-1; i < N; j = i, i++) {
        let dx = polygon[j].x - polygon[i].x,
            dy = polygon[j].y - polygon[i].y;
        if (
            ((polygon[i].y > point.y) !== (polygon[j].y > point.y))
                &&
                (point.x < (point.y - polygon[i].y) * dx/dy + polygon[i].x)
        ) {
            inside = !inside;
        }
    }

    return inside;
}


//////////////////////////////////////////////////////////////////////
// need to generate these images but don't do them all at once
function onLoad(fn) {
    if (onLoad.queue === undefined || onLoad.queue.length === 0) {
        onLoad.queue = [() => {}];
        processQueue();
    }

    function processQueue() {
        if (onLoad.queue.length > 0) {
            onLoad.queue.shift()();
            requestAnimationFrame(processQueue);
        }
    }

    onLoad.queue.push(fn);
}

//////////////////////////////////////////////////////////////////////
// some layers and styles

function transparentBackgroundLayer() {
    return {
        draw(ctx, _ss, _map) {
            ctx.clearRect(this.xy_range.min[0],
                          this.xy_range.min[1],
                          this.xy_range.max[0] - this.xy_range.min[0],
                          this.xy_range.max[1] - this.xy_range.min[1]);
        },
    };
}
    
function introDiagramBackgroundLayer() {
    return {
        draw(ctx, _ss, _map) {
            ctx.fillStyle = "hsl(110, 20%, 60%)";
            ctx.fillRect(0, 0, 390, 300);
            ctx.fillStyle = Patterns.river;
            ctx.fillRect(390, 0, 210, 300);
        },
    };
}


const currentTileStyleMap = { current: {fillStyle: "hsl(220, 60%, 60%)"}, };
const forestColoringStyleMap = { [5]: {fillStyle: Patterns.forest}, };
const introStyleMap = {
    tile: {fillStyle: "hsla(0, 0%, 100%, 0.9)", strokeStyle: "hsla(0, 0%, 60%, 0.5)", lineWidth: 0.5},
    reached: {},
    override(ctx, _ss, _map, id) {
        if (id === 5 || id === 10 || id === 11 || id === 12) {
            ctx.fillStyle = Patterns.grass;
        }
        if (id === 16 || id === 22 || id === 24) {
            ctx.fillStyle = Patterns.desert;
        }
    },
};

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


function nodeLayer(radius, maxWeight=Infinity, style={fillStyle: "hsl(230, 50%, 60%)", strokeStyle: "hsl(0, 0%, 100%)", lineWidth: 0.5}) {
    return {
        draw_tile(ctx, ss, map, id) {
            if (map[id].tile_weight < maxWeight) {
                Object.assign(ctx, style);
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, 2*Math.PI);
                if (style.fillStyle) ctx.fill();
                if (style.strokeStyle) ctx.stroke();
            }
        }
    };
}

function edgeLayer(maxWeightExclusive=Infinity) {
    return {
        draw(ctx, ss, map) {
            ctx.strokeStyle = "hsl(160, 30%, 50%)";
            ctx.lineWidth = 4.5;
            ctx.lineCap = "round";
            for (let edge of this.graph.all_edges(maxWeightExclusive)) {
                let xy0 = this.layout.tile_center(edge[0]);
                let xy1 = this.layout.tile_center(edge[1]);
                ctx.beginPath();
                ctx.moveTo(xy0[0], xy0[1]);
                ctx.lineTo(0.5*(xy0[0]+xy1[0]), 0.5*(xy0[1]+xy1[1]));
                ctx.stroke();
            }
        },
    };
}

// Contour lines for any numeric field, for square grids only
import * as conrec from  "../conrec.js/conrec.js";
function contourLayer(field='sort_key') {
    const sentinelValue = 1e3;
    return {
        draw(ctx, ss, map) {
            let c = new conrec.Conrec();
            const {graph, layout} = this;

            // Build a 2D array, which the contour library needs;
            // extend it beyond the border with a high value
            let matrix = [];
            let maxLevel = 0;
            for (let x = -1; x <= graph.W; x++) {
                matrix.push([]);
                for (let y = -1; y <= graph.H; y++) {
                    let v = sentinelValue;
                    if (graph.valid(x, y)) {
                        let id = graph.to_id(x, y);
                        v = map[id][field];
                        if (v > maxLevel) { maxLevel = v; }
                        if (v === undefined) { v = sentinelValue; }
                    }
                    matrix[x+1].push(v);
                }
            }

            // Contour lines at 1.5, 2.5, 3.5, etc. It doesn't work
            // well if we are on a integer boundary.
            let levels = [];
            for (let level = 1; level <= maxLevel; level++) {
                levels.push(level+0.5);
            }
            c.contour(matrix,
                      0, matrix.length-1, 0, matrix[0].length-1,
                      range(-1, matrix.length-1), range(-1, matrix[0].length-1),
                      levels.length, levels);

            // Draw the contour lines
            let contours = c.contourList();
            for (let i = 0; i < levels.length; i++) {
                let t = Math.sqrt(i / levels.length);
                ctx.strokeStyle = `hsl(${lerp(-30, 60, t)|0}, ${lerp(30, 10, t)|0}%, ${lerp(30, 60, t)}%)`;
                ctx.beginPath();
                drawPolygon(ctx, contours[i].map(p => layout.xy_scaled([p.x, p.y])));
                ctx.stroke();
            }
        },
    };
}


//////////////////////////////////////////////////////////////////////
// The diagrams


let introDiagramShapeList = [
{"points":[[1,1],[3,1],[4,2],[4,4],[1,4]],"center":[1.5,3]},
{"points":[[9,1],[9,6],[7,6],[7,4],[5,4],[5,2],[6,1]],"center":[7,2.5]},
{"points":[[10,1],[15,1],[15,7],[14,7],[14,8],[13,7],[12,7],[12,6],[10,6]],"center":[13.5,3.5]},
{"points":[[16,1],[20,1],[20,7],[19,7],[19,8],[18,7],[16,7]],"center":[18.5,3.5]},
{"points":[[21,1],[25,1],[25,5],[21,5]],"center":[23,3]},
{"points":[[30,0],[33,0],[34,2],[34,4]],"center":[32,1]},
{"points":[[7,6],[9,6],[9,7],[11,7],[11,8],[10,9],[7,9]],"center":[8.5,8]},
{"points":[[10,9],[11,8],[13,8],[13,7],[14,8],[15,8],[15,9],[16,10],[15,10],[15,11],[10,11]],"center":[13.5,9.5]},
{"points":[[16,8],[18,8],[18,7],[19,8],[21,8],[21,11],[16,11],[16,10],[15,9],[16,9]],"center":[18.5,9.5]},
{"points":[[21,6],[25,6],[25,9],[26,9],[26,10],[25,10],[25,11],[21,11]],"center":[23.5,9.5]},
{"points":[[26,5],[33,8],[33,9],[30,10],[27,13],[26,16],[26,10],[26,9]],"center":[27.5,9.5]},
{"points":[[26,0],[28,0],[33,5],[33,8],[26,5]],"center":[29.75,4.5]},
{"points":[[36,7],[36,2],[35,0],[40,0],[40,7],[37,8]],"center":[38,6]},
{"points":[[1,4],[2,4],[2,15],[1,15]],"center":[1.5,11.5]},
{"points":[[3,5],[6,5],[6,10],[3,10]],"center":[4.5,8.5]},
{"points":[[13,11],[15,11],[15,16],[13,16]],"center":[13.5,13.5]},
{"points":[[33.5,13],[34,11],[35,10],[35,8],[36,7],[37,8],[40,7],[40,15]],"center":[37,12]},
{"points":[[1,15],[6,15],[6,19],[1,19]],"center":[1.5,16]},
{"points":[[7,15],[10,15],[12,16],[12,19],[7,19]],"center":[10,16.5]},
{"points":[[13,16],[15,16],[15,19],[13,19]],"center":[14,17]},
{"points":[[16,12],[20,12],[20,19],[16,19]],"center":[18,17]},
{"points":[[21,12],[25,12],[25,19],[21,19]],"center":[23,15]},
{"points":[[26,16],[27,13],[30,10],[33,9],[32,11],[31,12],[30,16],[29,16],[29,17],[30,17],[30,19],[31,20],[26,20]],"center":[28,16]},
{"points":[[29,16],[33,16],[33,17],[29,17]],"center":[31,16.5]},
{"points":[[32,16],[33.5,13],[40,15],[40,20],[33,20],[32,18],[32,17],[33,17],[33,16]],"center":[34.5,16]},
{"points":[[2,11],[2,12],[3,12],[3,14],[9,14],[9,10],[3,10],[3,11]],"center":[4,11.5]},
{"points":[[3,1],[4,2],[5,2],[6,1]],"center":[4.5,1.5]},
{"points":[[9,2],[9,3],[10,3],[10,2]],"center":[9.5,2.5]},
{"points":[[15,3],[15,4],[16,4],[16,3]],"center":[15.5,3.5]},
{"points":[[20,2],[20,3],[21,3],[21,2]],"center":[20.5,2.5]},
{"points":[[23,5],[23,6],[24,6],[24,5]],"center":[23.5,5.5]},
{"points":[[6,17],[6,18],[7,18],[7,17]],"center":[6.5,17.5]},
{"points":[[10,12],[10,15],[12,16],[12,14],[13,14],[13,13],[12,13],[12,12]],"center":[11.5,13.5]},
{"points":[[15,17],[15,18],[16,18],[16,17]],"center":[15.5,17.5]},
{"points":[[20,16],[20,17],[21,17],[21,16]],"center":[20.5,16.5]},
    {"points":[[23,11],[23,12],[24,12],[24,11]],"center":[23.5,11.5]}
];

let introDiagramWaypoints = [
{"points":[[1,1],[3,1],[4,2],[4,4],[1,4]],"center":[1.5,3.5]},
{"points":[[9,1],[9,6],[7,6],[7,4],[5,4],[5,2],[6,1]],"center":[6,1.5]},
{"points":[[10,1],[15,1],[15,7],[14,7],[14,8],[13,7],[12,7],[12,6],[10,6]],"center":[10.5,2.5]},
{"points":[[16,1],[20,1],[20,7],[19,7],[19,8],[18,7],[16,7]],"center":[16.5,3.5]},
{"points":[[21,1],[25,1],[25,5],[21,5]],"center":[21.5,2.5]},
{"points":[[30,0],[33,0],[34,2],[34,4]],"center":[13.5,9.5]},
{"points":[[7,6],[9,6],[9,7],[11,7],[11,8],[10,9],[7,9]],"center":[8.5,7.5]},
{"points":[[10,9],[11,8],[13,8],[13,7],[14,8],[15,8],[15,9],[16,10],[15,10],[15,11],[10,11]],"center":[13.5,6.5]},
{"points":[[16,8],[18,8],[18,7],[19,8],[21,8],[21,11],[16,11],[16,10],[15,9],[16,9]],"center":[18.5,6.5]},
{"points":[[21,6],[25,6],[25,9],[26,9],[26,10],[25,10],[25,11],[21,11]],"center":[23.5,7]},
{"points":[[26,5],[33,8],[33,9],[30,10],[27,13],[26,16],[26,10],[26,9]],"center":[23.5,9.5]},
{"points":[[26,0],[28,0],[33,5],[33,8],[26,5]],"center":[18.5,9.5]},
{"points":[[36,7],[36,2],[35,0],[40,0],[40,7],[37,8]],"center":[16.5,9.5]},
{"points":[[1,4],[2,4],[2,15],[1,15]],"center":[1.5,11.5]},
{"points":[[3,5],[6,5],[6,10],[3,10]],"center":[11,9]},
{"points":[[13,11],[15,11],[15,16],[13,16]],"center":[14,13.5]},
{"points":[[33.5,13],[34,11],[35,10],[35,8],[36,7],[37,8],[40,7],[40,15]],"center":[26.5,9.5]},
{"points":[[1,15],[6,15],[6,19],[1,19]],"center":[1.5,15.5]},
{"points":[[7,15],[10,15],[12,16],[12,19],[7,19]],"center":[8.5,17.5]},
{"points":[[13,16],[15,16],[15,19],[13,19]],"center":[14.5,17.5]},
{"points":[[16,12],[20,12],[20,19],[16,19]],"center":[19.5,16.5]},
{"points":[[21,12],[25,12],[25,19],[21,19]],"center":[23.5,12.5]},
{"points":[[26,16],[27,13],[30,10],[33,9],[32,11],[31,12],[30,16],[29,16],[29,17],[30,17],[30,19],[31,20],[26,20]],"center":[30,4.5]},
{"points":[[29,16],[33,16],[33,17],[29,17]],"center":[29,16.5]},
{"points":[[32,16],[33.5,13],[40,15],[40,20],[33,20],[32,18],[32,17],[33,17],[33,16]],"center":[33,16.5]},
{"points":[[2,11],[2,12],[3,12],[3,14],[9,14],[9,10],[3,10],[3,11]],"center":[3.5,11.5]},
{"points":[[3,1],[4,2],[5,2],[6,1]],"center":[3.5,1.5]},
{"points":[[9,2],[9,3],[10,3],[10,2]],"center":[8.5,2.5]},
{"points":[[15,3],[15,4],[16,4],[16,3]],"center":[14.5,3.5]},
{"points":[[20,2],[20,3],[21,3],[21,2]],"center":[19.5,2.5]},
{"points":[[23,5],[23,6],[24,6],[24,5]],"center":[23.5,4.5]},
{"points":[[6,17],[6,18],[7,18],[7,17]],"center":[5,17.5]},
{"points":[[10,12],[10,15],[12,16],[12,14],[13,14],[13,13],[12,13],[12,12]],"center":[11.5,13.5]},
{"points":[[15,17],[15,18],[16,18],[16,17]],"center":[16.5,17.5]},
{"points":[[20,16],[20,17],[21,17],[21,16]],"center":[21.5,16.5]},
{"points":[[23,11],[23,12],[24,12],[24,11]],"center":[37,7.5]}
];

// hard-coded to match introDiagramShapeList above.
function makeIntroGraphConnections(graph) {
    // Bidirectional connection
    function C(id1, id2) {
        graph._edges[id1].push(id2);
        graph._edges[id2].push(id1);
    }
    C(0,26);C(26,1);C(1,27);C(27,2);C(2,28);C(28,3);C(3,29);C(29,4);C(4,30);
    C(0,13);C(13,25);C(25,14);C(1,6);C(6,7);C(2,7);
    C(7,8);C(3,8);C(8,9);C(30,9);C(9,10);C(9,35);C(10,11);C(12,16);C(16,24);
    C(13,17);C(17,31);C(31,18);C(18,32);C(32,15);C(7,15);C(15,19);C(19,33);
    C(33,20);C(20,34);C(34,21);C(35,21);C(10,22);C(22,23);C(23,24);
}

// This version matches introDiagramWaypoints -- which does NOT have
// shapes corresponding to the nodes!! That map only has the graph edges.
function makeIntroGraphWaypointConnections(graph) {
    function C(id1, id2) { graph._edges[id1].push(id2); graph._edges[id2].push(id1); }
    C(0, 26); C(26, 1); C(1, 27); C(1, 6); C(6, 27); C(2, 27); C(2, 28); C(2, 7);
    C(28, 3); C(3, 29); C(29, 4); C(4, 30); C(3, 8); C(6, 14); C(7, 5); C(7, 28);
    C(14, 5); C(5, 12); C(12, 11); C(8, 11); C(30, 9); C(9, 10); C(9, 11);
    C(0, 13); C(13, 25); C(13, 17); C(17, 31); C(10, 21); C(10, 11); C(8, 29);
    C(31, 18); C(18, 32); C(32, 15); C(15, 5); C(15, 19);
    C(19, 33); C(33, 20); C(20, 34); C(34, 21); C(10, 16);
    C(16, 22); C(16, 23); C(22, 23); C(23, 24); C(24, 35);
}

function makeIntroDiagram(el, shapeList, makeConnections, makeLayers) {
    let graph = new Graph(shapeList.length);
    graph._center = [];
    graph._paths = [];
    graph.edge_weight = function(id1, id2) {
        let xy1 = this._center[id1], xy2 = this._center[id2];
        let dx = xy1[0] - xy2[0], dy = xy1[1] - xy2[1];
        return Math.sqrt(dx*dx + dy*dy);
    };
    let layout = new GraphLayout(graph, 15);
    function S(xy) { return xy.map((z) => z * layout.SCALE); }
    layout.tile_center = (id) => S(graph._center[id]);
    layout.tile_shape = (id) => graph._paths[id].map(S);
    function toXY(coord) { return {x: coord[0], y: coord[1]}; }
    layout.pixel_to_tile = (coord) => {
        let point = {x: coord[0] / layout.SCALE,
                     y: coord[1] / layout.SCALE};
        for (let id = 0; id < shapeList.length; id++) {
            if (isPointInPolygon(point, shapeList[id].points.map(toXY))) {
                return id;
            }
        }
        return -1;
    };

    // Set shapes based on my shape editor,
    // http://www.redblobgames.com/x/1607-map-editor/
    for (let id = 0; id < shapeList.length; id++) {
        let c = shapeList[id].center;
        graph._center[id] = c;
        graph._paths[id] = shapeList[id].points.map(function(p) { return [p[0] - c[0], p[1] - c[1]]; });
        graph._edges[id] = [];
    }

    makeConnections(graph);

    let options = new SearchOptions([14]);
    let exit = {id: 12};
    return new Diagram(el, graph, options, layout, ...makeLayers(options, exit));
}

makeIntroDiagram(
    "#diagram-intro",
    introDiagramShapeList,
    makeIntroGraphConnections,
    (options, exit) => [
        introDiagramBackgroundLayer(),
        Layers.base(introStyleMap),
        nodeLayer(3, Infinity, {fillStyle: "hsla(60, 10%, 50%, 10%)"}),
        reconstructedPathLayer(() => exit.id, {lineWidth: 11, strokeStyle: "hsla(280, 20%, 70%, 0.7)"}),
        Layers.draggableMarker(Markers.blob(15), options.starts, 0),
        Layers.draggableMarker(Markers.cross(13), exit, 'id'),
    ]
);


/** make a button invoke two callbacks, one on down and one on up */
function makeHoverButton(buttonSelector, onDown, onUp) {
    const button = document.querySelector(buttonSelector);
    function on(type, handler) { button.addEventListener(type, handler); }

    on('mouseover', onDown);
    on('mouseout', onUp);
    on('mousedown', onDown);
    on('mouseup', onUp);
    on('touchstart', e => { onDown(); e.preventDefault(); });
    on('touchend', e => { onUp(); e.preventDefault(); });;
    on('touchmove', e => { e.preventDefault(); });
}


function makeMapRepresentation1Diagrams() {
    // show how the same graph could represent different maps
    function optional(enable, layer) {
        return {
            draw(ctx, ss, map) {
                enable() && layer.draw?.call(this, ctx, ss, map);
            },
            draw_tile(ctx, ss, map, id) {
                enable() && layer.draw_tile?.call(this, ctx, ss, map, id);
            },
        };
    }

    let showUnderlay = false,
        showOverlay = false;
    let diagram = makeIntroDiagram(
        "#diagram-graphs1-over", introDiagramShapeList, makeIntroGraphConnections,
        (options, exit) => [
            transparentBackgroundLayer(),
            optional(() => !showUnderlay, introDiagramBackgroundLayer()),
            optional(() => !showUnderlay, Layers.base(introStyleMap)),
            edgeLayer(),
            optional(() => showOverlay, reconstructedPathLayer(() => exit.id, {strokeStyle: "hsla(280, 20%, 70%, 0.7)", lineWidth: 11})),
            nodeLayer(7),
        ]
    );

    // connect the diagram to buttons
    function onDown1() { showUnderlay = true; diagram.redraw(); }
    function onUp1() { showUnderlay = false; diagram.redraw(); }
    function onDown2() { showOverlay = true; diagram.redraw(); }
    function onUp2() { showOverlay = false; diagram.redraw(); }
    makeHoverButton("#show-graphs1-different-map", onDown1, onUp1);
    makeHoverButton("#show-graphs1-path-trace", onDown2, onUp2);
}
onLoad(makeMapRepresentation1Diagrams);

function makeMapRepresentation2Diagrams() {
    // show how the same map could be represented with different graphs

    // the first two will reuse the same graph as the intro diagram
    makeIntroDiagram(
        "#diagram-graphs2-navmesh", introDiagramShapeList, makeIntroGraphConnections,
        (options, exit) => [
            introDiagramBackgroundLayer(),
            Layers.base(introStyleMap),
            edgeLayer(),
            nodeLayer(7),
        ]
    );

    makeIntroDiagram(
        "#diagram-graphs2-waypoints", introDiagramWaypoints, makeIntroGraphWaypointConnections,
        (options, exit) => [
            introDiagramBackgroundLayer(),
            Layers.base(introStyleMap),
            edgeLayer(),
            nodeLayer(7),
        ]
    );

    // but the third will use a grid
    let graph = new SquareGrid(40, 20);
    let layout = new SquareGridLayout(graph, 15);
    let exit = {id: graph.to_id(38, 10)};
    let options = new SearchOptions(
        [graph.to_id(7, 11)], _ => false,
        (id, node) => {
            node.h = manhattan_heuristic(graph, exit.id, id);
            return node.cost_so_far + 1.01*node.h;
        });

    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,
     25,40,49,55,60,65,80,84,95,105,120,124,129,140,145,160,162,163,164,
     165,166,169,175,180,185,200,202,206,209,215,220,221,222,224,225,240,
     242,246,249,250,251,255,260,265,280,282,286,291,292,294,295,296,297,
     299,300,305,320,322,326,335,345,360,362,366,367,368,369,400,402,409,
     415,425,440,449,450,451,452,455,456,457,458,459,460,461,462,464,465,
     480,482,489,492,495,500,505,520,522,529,535,540,545,560,562,563,564,
     565,566,567,568,569,572,575,580,585,600,606,612,615,620,625,640,646,
     652,655,665,680,692,700,705,720,726,732,735,740,745,760,761,762,763,
     764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,
     781,782,783,784,785,35,77,149,158,227,230,308,311,389,427,557,594,676
    ].forEach((id) => graph.set_tile_weight(id, Infinity));
    [26,27,29,30,31,32,36,37,38,39,66,67,70,71,72,75,76,78,79,106,107,
     108,109,112,113,116,117,118,119,146,147,148,150,153,156,157,159,186,
     187,188,189,190,191,196,197,198,199,226,228,229,231,232,235,236,237,
     238,239,266,267,268,269,270,271,272,276,277,278,279,306,307,309,310,
     312,316,317,318,319,346,347,348,349,350,351,352,356,357,388,390,391,
     426,428,429,466,467,468,506,507,546,586,626
    ].forEach((id) => graph.set_tile_weight(id, 2));
    [355,358,359,392,395,396,397,398,399,430,431,432,435,436,437,438,439,
     469,470,471,475,476,477,478,479,508,509,510,514,515,516,517,518,519,
     547,548,549,550,553,554,555,556,558,559,587,588,589,590,593,595,596,
     597,598,599,627,628,629,632,633,634,635,636,637,638,639,666,667,668,
     673,674,675,677,678,679,706,707,708,709,712,713,714,715,716,717,718,
     719,746,747,748,749,752,753,754,755,756,757,758,759,786,787,788,789,
     790,793,794,795,796,797,798,799
    ].forEach((id) => graph.set_tile_weight(id, 3));
    [28,33,34,68,69,73,74,110,111,114,115,151,152,154,155,192,193,194,195,
     233,234,273,274,275,313,314,315,353,354,393,394,433,434,472,473,474,
     511,512,513,551,552,591,592,630,631,710,711,750,751,791,792
    ].forEach((id) => graph.set_tile_weight(id, 20));

    new Diagram(
        "#diagram-graphs2-grid", graph, options, layout,
        Layers.base({
            reached: {fillStyle: "hsl(0, 10%, 95%)"},
            [2]: {fillStyle: "hsl(110, 40%, 80%)", strokeStyle: "hsl(110, 40%, 80%)", lineWidth: 0.5},
            [3]: {fillStyle: "hsl(60, 50%, 80%)", strokeStyle: "hsl(60, 50%, 80%)", lineWidth: 0.5},
            [Infinity]: {fillStyle: "hsl(110, 20%, 60%)", strokeStyle: "hsl(110, 20%, 60%)"},
            [20]: {fillStyle: "hsl(200, 50%, 70%)", strokeStyle: "hsl(200, 50%, 70%)", lineWidth: 0.5},
        }),
        reconstructedPathLayer(() => exit.id, {strokeStyle: "hsl(280, 30%, 70%)", lineWidth: 5}),
        edgeLayer(4),
        nodeLayer(3.5, 20)
    );

    // now connect the three diagrams
    const target1 = document.querySelector("#diagram-graphs2-waypoints");
    const target2 = document.querySelector("#diagram-graphs2-grid");
    function onDown1() { target1.classList.add("show"); }
    function onUp1() { target1.classList.remove("show"); }
    function onDown2() { target2.classList.add("show"); }
    function onUp2() { target2.classList.remove("show"); }
    makeHoverButton("#show-graphs2-waypoints", onDown1, onUp1);
    makeHoverButton("#show-graphs2-grid", onDown2, onUp2);
}
onLoad(makeMapRepresentation2Diagrams);




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
onLoad(makeDiagramFrontier);


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
onLoad(makeDiagramExpansion);


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
onLoad(makeDiagramPathReconstruction);


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
onLoad(makeDiagramEarlyExit);


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
onLoad(makeDiagramWeights);


function makeDiagramContour() {
    let graph = new SquareGrid(15, 15);
    let layout = new SquareGridLayout(graph, 19);
    let options = new SearchOptions([graph.to_id(2, 8)]);
    let exit = {id: graph.to_id(13, 6)};
    [0,1,2,15,16,17,30,31,36,37,38,39,45,46,51,52,53,54,60,61,65,66,67,
     68,69,70,75,80,81,82,83,84,85,95,96,97,98,100,110,111,113,114,115,
     125,126,127,128,130,140,141,143,144,145,155,156,157,158,159,160,171,
     172,173,174,180,186,187,188,189,195,196,197,210,211,212,213
    ].forEach((id) => graph.set_tile_weight(id, 5));

    let graph_proxy = graph.make_proxy();
    graph_proxy.edge_weight = (id1, id2) => 1;

    let a = new Diagram(
        "#diagram-contour-unweighted", graph_proxy, options, layout,
        Layers.base(forestColoringStyleMap),
        Layers.frontierTiles(),
        Layers.editable(1, 5, Infinity),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        contourLayer(),
        Layers.draggableMarker(Markers.blob(10), options.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id')
    );

    let b = new Diagram(
        "#diagram-contour-weighted", graph, options, layout,
        Layers.base(forestColoringStyleMap),
        Layers.frontierTiles(),
        Layers.editable(1, 5, Infinity),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        contourLayer(),
        Layers.draggableMarker(Markers.blob(10), options.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id')
    );

    a.linkTo(b);

    addSliderSteps("#diagram-contour", [a, b]).setSliderPosition(67);
}
onLoad(makeDiagramContour);


function makeDiagramGreedyBest(parent_selector, walls) {
    let graph = new SquareGrid(15, 15);
    let layout = new SquareGridLayout(graph, 19);
    let exit = {id: graph.to_id(14, 2)};

    walls.forEach((id) => graph.set_tile_weight(id, Infinity));

    let options_a = new SearchOptions([graph.to_id(0, 12)], (ss) => ss.current == exit.id);
    let diagram_a = new Diagram(
        parent_selector+" .left", graph, options_a, layout,
        Layers.base(),
        Layers.frontierTiles(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.draggableMarker(Markers.blob(10), options_a.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id')
    );

    let options_b = new SearchOptions(options_a.starts, options_a.exit_now,
                                      (id, node) => {node.h = manhattan_heuristic(graph, exit.id, id); return node.h;});
    options_b.allow_reprioritize = false;
    let diagram_b = new Diagram(
        parent_selector+" .right", graph, options_b, layout,
        Layers.base(),
        Layers.frontierTiles(),
        Layers.editable(),
        reconstructedPathLayer(() => exit.id, reconstructedPathStyle),
        Layers.draggableMarker(Markers.blob(10), options_a.starts, 0),
        Layers.draggableMarker(Markers.cross(9), exit, 'id')
    );

    diagram_a.linkTo(diagram_b);

    addSliderSteps(parent_selector, [diagram_a, diagram_b]).setSliderPosition(10);
}

onLoad(() => {
    makeDiagramGreedyBest("#diagram-greedybestfirst", []);
    makeDiagramGreedyBest("#diagram-greedybestfirst-complex",
                          [32,33,34,35,36,37,38,39,40,41,42,57,72,87,102,117,132,
                           147,162,177,182,183,184,185,186,187,188,189,190,191,192]);
});

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
onLoad(makeDiagramAStar);


//////////////////////////////////////////////////////////////////////
// Other

/** These expanding-frontier diagrams are in the Overview section */
function make_overview_diagrams() {
    let angles = [];
    for (let deg = 0; deg < 360; deg += 5) {
        angles.push(deg / 180 * Math.PI);
    }

    function shape_bfs(r, a) {
        return r * 0.9;
    }
    
    function shape_dijkstra(r, a) {
        return r/10 * (8 - 1 * Math.cos(a*3) - 1.5 * Math.sin(a*5));
    }

    function shape_astar(r, a) {
        return shape_dijkstra(r, a) * 0.1 +
            r/10 * (3 + 8 * Math.exp(-2*Math.abs(a - Math.PI/3)));
    }

    function make_path(parent, shape) {
        let svg = ``;
        for (let radius = 10; radius <= 50; radius += 7) {
            let points = angles.map((angle) => {
                let r = shape(radius, angle);
                return (r * Math.cos(angle)).toFixed(2) + "," + (r * Math.sin(angle)).toFixed(2);
            });
            let color = `hsl(220 ${2*radius}% ${90-radius/2}%)`;
            svg += `<path d="M ${points.join(" L")} Z" fill="none" stroke-width="${0.7+radius/30}" stroke="${color}" stroke-linejoin="round"/>`;
        }
        parent.innerHTML = svg; // NOTE: idempotent, to support File->Save As
    }

    make_path(document.querySelector("#overview-bfs"), shape_bfs);
    make_path(document.querySelector("#overview-dijkstra"), shape_dijkstra);
    make_path(document.querySelector("#overview-astar"), shape_astar);
}

onLoad(make_overview_diagrams);




import {highlight_words} from '../code-highlighting.js';
onLoad(() => {
    for (let el of document.querySelectorAll("main pre")) {
        if (!el.classList.contains("src")) {
            el.classList.add("src"); // NOTE: idempotent
            el.innerHTML = highlight_words(el.innerHTML, ['frontier', 'start', 'current', 'reached', 'came_from', 'next', 'goal', 'path', 'cost_so_far', 'new_cost',
                                                          'def', 'return', 'while', 'for', 'if', 'break']);
        }
    }
});

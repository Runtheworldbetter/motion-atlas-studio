import {Code, Line, Rect, Txt} from '@motion-canvas/2d';
import {all, waitFor} from '@motion-canvas/core';
import {P, stage} from '../motion/shared';
import type {SceneFactory} from '../motion/types';
import type {RecipeDefinition} from './types';
import {parseCode} from './models/code';

export const codeRecipe:RecipeDefinition = {
  id:'code',
  title:'Show a refactor taking shape',
  subtitle:'Before and after, with the transformation in between.',
  description:'Paste two short snippets and watch Motion Canvas rearrange the text. The line-by-line data view preserves exactly what was added and removed.',
  inputLabel:'Before',
  secondaryLabel:'After',
  inputFormat:'Code as text',
  accept:'.txt,.py,.js,.ts,.jsx,.tsx,.json,text/plain',
  color:P.purple,
  examples:[
    {
      id:'python-guard',
      name:'Python: make the guard clause explicit',
      description:'Synthetic refactor: separate an empty-input check from the average calculation.',
      input:'def average(values):\n    if len(values) > 0:\n        total = sum(values)\n        count = len(values)\n        return total / count\n    else:\n        return None',
      secondary:'def average(values):\n    if not values:\n        return None\n\n    return sum(values) / len(values)',
    },
    {
      id:'js-async',
      name:'JavaScript: express the async flow',
      description:'Synthetic refactor: the same response validation is easier to follow with async/await.',
      input:'function loadVehicle(id) {\n  return fetch(`/vehicles/${id}`)\n    .then(response => {\n      if (!response.ok) throw new Error("Request failed");\n      return response.json();\n    })\n    .then(vehicle => vehicle.status);\n}',
      secondary:'async function loadVehicle(id) {\n  const response = await fetch(`/vehicles/${id}`);\n  if (!response.ok) throw new Error("Request failed");\n\n  const vehicle = await response.json();\n  return vehicle.status;\n}',
    },
    {
      id:'python-extract',
      name:'Python: give a repeated calculation a name',
      description:'Synthetic refactor: replace duplicate elapsed-time calculations with a small named function.',
      input:'pickup_hours = (pickup_end - pickup_start) / 3600\nservice_hours = (service_end - service_start) / 3600\n\nprint(pickup_hours, service_hours)',
      secondary:'def elapsed_hours(start, end):\n    return (end - start) / 3600\n\npickup_hours = elapsed_hours(pickup_start, pickup_end)\nservice_hours = elapsed_hours(service_start, service_end)\n\nprint(pickup_hours, service_hours)',
    },
  ],
  help:'Use two focused snippets, each at most 18 lines, 90 display columns per line, and 6,000 characters. Tabs display as four spaces. An empty before or after snippet is allowed for a pure addition or deletion. The animation compares text; it never evaluates code or checks whether the two programs behave the same. The data view includes the full line diff.',
  basis:'Motion Canvas Code performs the animated text transition. A deterministic longest-common-subsequence line diff supplies the inspectable added, removed, and unchanged rows.',
  compile(input,secondary) {
    const model = parseCode(input,secondary);
    const duration = 10;
    const factory:SceneFactory = function*(view) {
      stage(view);
      view.add(new Rect({position:[0,6],size:[866,404],radius:18,fill:P.panel,stroke:P.grid,lineWidth:2}));
      view.add(new Line({points:[[-432,-150],[432,-150]],stroke:P.grid,lineWidth:1.5}));
      [P.orange,P.yellow,P.teal].forEach((color,i) => view.add(new Rect({position:[-400 + i * 21,-173],size:10,radius:5,fill:color,opacity:0.9})));
      const phase = new Txt({text:'BEFORE',position:[0,-173],fontSize:18,fontFamily:'Arial',fill:P.orange});
      view.add(phase);
      const code = new Code({
        code:model.beforeDisplay,
        position:[-397,-130],offset:[-1,-1],
        fontFamily:'monospace',fontSize:model.fontSize,lineHeight:model.fontSize * 1.3,
        fill:P.ink,
      });
      view.add(code);
      view.add(new Txt({
        text:`+${model.added} added   −${model.removed} removed   ${model.unchanged} unchanged`,
        position:[0,-229],fontSize:23,fontFamily:'Arial',fill:P.purple,
      }));
      view.add(new Txt({text:'Text transforms here. Your code is never executed.',position:[0,239],fontSize:19,fontFamily:'Arial',fill:P.muted}));
      yield* waitFor(2);
      yield* all(phase.text('TRANSFORMING',0.25),phase.fill(P.purple,0.25));
      yield* code.code(model.afterDisplay,3.5);
      yield* all(phase.text('AFTER',0.25),phase.fill(P.teal,0.25));
      yield* waitFor(4);
    };
    return {
      factory,title:'A before-and-after code transition',duration,
      summary:`${model.added} added lines, ${model.removed} removed lines, and ${model.unchanged} unchanged lines. Compared as text; never executed.`,
      rows:model.changes.map(change => ({
        label:change.type === 'same' ? `Unchanged · ${change.beforeLine} → ${change.afterLine}` : change.type === 'added' ? `+ After line ${change.afterLine}` : `− Before line ${change.beforeLine}`,
        value:change.text || '(blank line)',
        detail:change.type === 'same' ? 'Present in both versions' : change.type === 'added' ? 'Added in the after version' : 'Removed from the before version',
      })),
    };
  },
};

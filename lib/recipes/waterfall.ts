import {Line, Rect, Txt} from '@motion-canvas/2d';
import {createSignal, linear} from '@motion-canvas/core';
import {P, stage} from '../motion/shared';
import type {SceneFactory} from '../motion/types';
import type {RecipeDefinition} from './types';
import {formatWaterfallValue, parseWaterfall, waterfallFraction} from './models/waterfall';
import {wrapLabel} from './models/text';

export const waterfallRecipe:RecipeDefinition = {
  id:'waterfall',
  title:'Track changes in a total',
  subtitle:'Opening balance, changes, and closing total.',
  description:'Plot a CSV as a waterfall chart. Each bar shows an increase, a decrease, or a total.',
  inputLabel:'Waterfall data',
  inputFormat:'CSV',
  accept:'.csv,text/csv,text/plain',
  color:P.teal,
  examples:[
    {
      id:'monthly-cash',
      name:'Monthly cash flow',
      description:'Synthetic cash figures in thousands. The payroll label shows how to include a comma in a CSV field.',
      input:'label,value,type\nOpening cash,120,start\nCustomer receipts,84,change\n"Payroll, benefits",-61,change\nCloud services,-14,change\nOther costs,-19,change\nClosing cash,,total',
    },
    {
      id:'product-revenue',
      name:'Revenue changes',
      description:'Synthetic recurring revenue, with a subtotal to check and a closing total to calculate.',
      input:'label,value,type\nStarting revenue,100,start\nNew customers,28,change\nExpansion,17,change\nGross revenue,145,total\nContraction,-9,change\nChurn,-12,change\nEnding revenue,,total',
    },
    {
      id:'negative-balance',
      name:'A negative balance',
      description:'Synthetic project costs exceed the opening balance. A later payment covers part of the shortfall.',
      input:'label,value,type\nOpening balance,24,start\nEquipment,-31,change\nOvertime,-8,change\nClient payment,9,change\nAdjustment,-2,change\nClosing balance,-8,total',
    },
  ],
  help:'CSV header: label,value,type. Use 3–12 data rows. The first row is start with a numeric opening value; changes use signed numbers; the last row is total. Leave a total value blank to calculate it, or supply a value to check against the running balance. You can include total rows between changes to show subtotals. Quote labels containing commas and escape inner quotes as "". Values can be decimals or scientific notation, without currency symbols or thousands separators. Full labels and exact values appear in the data view.',
  basis:'Adds each change to the running balance and checks any totals you supply. Subtotal rows leave the balance unchanged.',
  compile(input) {
    const model = parseWaterfall(input);
    const duration = 9;
    const factory:SceneFactory = function*(view) {
      stage(view);
      const progress = createSignal(0);
      const yAt = (value:number) => 143 - waterfallFraction(model,value) * 315;
      const step = 790 / model.rows.length;
      const xAt = (i:number) => -395 + step * (i + 0.5);
      const width = Math.min(90,step * 0.63);
      const labelSize = model.rows.length > 9 ? 14 : model.rows.length > 6 ? 16 : 18;
      const color = (i:number) => model.rows[i].kind === 'start' ? P.blue : model.rows[i].kind === 'total' ? P.lime : model.rows[i].value >= 0 ? P.teal : P.orange;
      const amount = (i:number) => Math.min(1,Math.max(0,progress() * 1.5 - i / model.rows.length * 0.5));

      view.add(new Txt({text:`${formatWaterfallValue(model.opening)}  →  ${formatWaterfallValue(model.closing)}`,position:[0,-224],fontSize:31,fontFamily:'Arial',fill:P.ink}));
      view.add(new Txt({text:`NET CHANGE  ${model.netChange > 0 ? '+' : ''}${formatWaterfallValue(model.netChange)}`,position:[0,-191],fontSize:17,fontFamily:'Arial',fill:model.netChange >= 0 ? P.teal : P.orange}));
      const ticks = [...new Set([model.minimum,0,model.maximum])];
      ticks.forEach(value => {
        const y = yAt(value);
        view.add(new Line({points:[[-405,y],[405,y]],stroke:value === 0 ? P.muted : P.grid,lineWidth:value === 0 ? 1.5 : 1}));
        view.add(new Txt({text:formatWaterfallValue(value),position:[-441,y],fontSize:13,fontFamily:'Arial',fill:P.muted}));
      });
      model.rows.forEach((row,i) => {
        const base = yAt(row.start), end = yAt(row.end);
        if (i > 0) {
          const previousY = yAt(model.rows[i - 1].cumulative);
          view.add(new Line({points:[[xAt(i - 1) + width / 2,previousY],[xAt(i) - width / 2,previousY]],stroke:P.muted,lineDash:[3,5],lineWidth:1.5,opacity:() => amount(i) * 0.65}));
        }
        view.add(new Rect({
          position:() => [xAt(i),base + (end - base) * amount(i) / 2],
          size:() => [width,Math.max(2,Math.abs(end - base) * amount(i))],
          radius:4,fill:color(i),opacity:0.94,
        }));
        const displayed = row.kind === 'change' && row.value > 0 ? '+' + formatWaterfallValue(row.value) : formatWaterfallValue(row.value);
        view.add(new Txt({
          text:displayed,position:[xAt(i),end + (row.end >= row.start ? -17 : 18)],
          fontSize:Math.min(19,labelSize + 1,step / (displayed.length * 0.64)),fontFamily:'Arial',fill:color(i),opacity:() => 0.3 + 0.7 * amount(i),
        }));
        view.add(new Txt({text:wrapLabel(row.label,step * 0.9,labelSize),position:[xAt(i),191],fontSize:labelSize,lineHeight:labelSize * 1.3,fontFamily:'Arial',fill:P.ink,textAlign:'center'}));
      });
      view.add(new Txt({text:'OPENING + CHANGES = CLOSING',position:[0,242],fontSize:18,fontFamily:'Arial',fill:P.muted}));
      yield* progress(1,duration,linear);
    };
    return {
      factory,title:'Waterfall chart',duration,
      summary:`Opening ${formatWaterfallValue(model.opening)} + net changes ${formatWaterfallValue(model.netChange)} = closing ${formatWaterfallValue(model.closing)}.`,
      rows:model.rows.map(row => ({
        label:row.label,
        value:`${row.kind === 'change' && row.value > 0 ? '+' : ''}${row.value}`,
        detail:`${row.kind.toUpperCase()} · from ${row.start} to ${row.end} · running total ${row.cumulative}`,
      })),
    };
  },
};

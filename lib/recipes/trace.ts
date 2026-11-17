import {Circle, Line, Rect, Txt} from '@motion-canvas/2d';
import {createSignal, linear} from '@motion-canvas/core';
import {P, stage} from '../motion/shared';
import type {SceneFactory} from '../motion/types';
import type {RecipeDefinition, RecipeExample} from './types';
import {formatTraceTime, parseTrace, tracePosition, type TraceStatus} from './models/trace';
import {fitText} from './models/text';

const palette:Record<TraceStatus,string> = {
  info:P.blue, working:P.purple, success:P.teal, warning:P.yellow, error:P.orange,
};
const shorten = (text:string, limit:number) => text.length <= limit ? text : text.slice(0,limit - 1).trimEnd() + '…';
const asJson = (value:unknown) => JSON.stringify(value,null,2);

const examples:RecipeExample[] = [
  {
    id:'human-correction',
    name:'A human corrects the plan',
    description:'Synthetic work trail: an agent proposes an action, a human changes a constraint, and the team verifies the revision.',
    input:asJson({title:'A correction changes the plan',events:[
      {time:0,actor:'Human',label:'Find a vehicle for Friday',status:'info',detail:'Need a van with room for six people.'},
      {time:4,actor:'Planner',label:'Split the request into checks',status:'working',detail:'Availability, passenger capacity, and pickup time.'},
      {time:9,actor:'Fleet agent',label:'Suggest the first available van',status:'success',detail:'Vehicle V-204 is available Friday morning.'},
      {time:13,actor:'Human',label:'Correction: wheelchair access is required',status:'warning',detail:'This changes the eligibility criteria.'},
      {time:16,actor:'Planner',label:'Revise the plan with the new constraint',status:'working',detail:'Keep six seats and add an accessibility check.'},
      {time:22,actor:'Fleet agent',label:'Find an accessible alternative',status:'success',detail:'Vehicle V-318 satisfies the revised requirements.'},
      {time:27,actor:'Reviewer',label:'Verify all three requirements',status:'working',detail:'Six seats, wheelchair access, and Friday availability.'},
      {time:31,actor:'Human',label:'Approve the revised choice',status:'success',detail:'The decision includes the correction and its evidence.'},
    ]}),
  },
  {
    id:'incident-response',
    name:'An incident, from alert to recovery',
    description:'Synthetic incident trace: a deploy raises errors, the responder rolls back, and monitoring confirms recovery.',
    input:asJson({title:'An incident reaches a verified recovery',events:[
      {time:0,actor:'Monitor',label:'Error rate crosses the alert threshold',status:'error',detail:'The example checkout endpoint is returning 5xx responses.'},
      {time:20,actor:'Responder',label:'Acknowledge and open the incident',status:'working',detail:'Assign an owner and record the first customer impact.'},
      {time:45,actor:'Deploy bot',label:'Identify the latest release',status:'info',detail:'Release r42 went live shortly before the errors began.'},
      {time:75,actor:'Responder',label:'Choose a rollback',status:'warning',detail:'Contain the impact while the team investigates.'},
      {time:105,actor:'Deploy bot',label:'Restore the previous version',status:'success',detail:'Release r41 is serving the affected endpoint.'},
      {time:150,actor:'Monitor',label:'Error rate returns to baseline',status:'success',detail:'Observe a complete recovery window before closing.'},
      {time:210,actor:'Reviewer',label:'Close with a follow-up action',status:'success',detail:'Add a regression check for the failed request pattern.'},
    ]}),
  },
  {
    id:'ci-pipeline',
    name:'A failing build gets a focused fix',
    description:'Synthetic CI trace: tests expose a boundary case, a developer fixes it, and review unblocks the build.',
    input:asJson({title:'A boundary case becomes a regression test',events:[
      {time:0,actor:'Developer',label:'Push a parser change',status:'info',detail:'The change adds support for quoted CSV fields.'},
      {time:8,actor:'CI',label:'Typecheck and unit tests start',status:'working',detail:'Run the deterministic validation suite.'},
      {time:21,actor:'CI',label:'Empty trailing field test fails',status:'error',detail:'A trailing comma incorrectly drops the final field.'},
      {time:35,actor:'Developer',label:'Add a minimal reproduction',status:'working',detail:'The failing input is reduced to one short CSV row.'},
      {time:58,actor:'Developer',label:'Patch the end-of-row handling',status:'success',detail:'The parser now preserves the empty field.'},
      {time:69,actor:'CI',label:'Regression and existing tests pass',status:'success',detail:'The focused fix preserves the existing behavior.'},
      {time:85,actor:'Reviewer',label:'Approve the change and its test',status:'success',detail:'The explanation links the failure to the corrected case.'},
    ]}),
  },
];

export const traceRecipe:RecipeDefinition = {
  id:'trace',
  title:'Turn a work trail into a moving story',
  subtitle:'Actors, decisions, corrections, and outcomes.',
  description:'Paste a small event log and follow it across actor lanes. Each event becomes a readable step, with its timestamp and status intact.',
  inputLabel:'Event trace',
  inputFormat:'JSON',
  accept:'.json,application/json,text/plain',
  color:P.blue,
  examples,
  help:'Use {"title":"Optional title","events":[{"time":0,"actor":"Human","label":"Describe the event","status":"info","detail":"Optional context"},…]}. time is elapsed seconds (0–86,400). Use 2–18 events and at most 4 actors. Status: info, working, success, warning, or error. Events sort by time; equal timestamps retain input order. Timeline spacing reflects time, while playback gives each event equal reading time. Full labels and details remain in the data view.',
  basis:'Your supplied timestamps and event descriptions. The renderer does not infer causes or invent missing events.',
  compile(input) {
    const model = parseTrace(input);
    const duration = Math.min(18,Math.max(8,model.events.length * 1.45));
    const factory:SceneFactory = function*(view) {
      stage(view);
      const progress = createSignal(0);
      const index = () => Math.min(model.events.length - 1,Math.floor(progress() * model.events.length));
      const event = () => model.events[index()];
      const laneY = (actor:string) => {
        const offset = model.actors.length === 1 ? 75 : model.actors.length === 2 ? 30 : -15;
        return offset + model.actors.indexOf(actor) * 61;
      };
      const xAt = (i:number) => -210 + tracePosition(model,model.events[i]) * 610;

      view.add(new Rect({position:[0,-151],size:[854,133],radius:18,fill:P.panel,stroke:P.grid,lineWidth:2}));
      view.add(new Txt({
        text:() => `${String(index() + 1).padStart(2,'0')} / ${String(model.events.length).padStart(2,'0')}  ·  ${shorten(event().actor,24)}  ·  ${formatTraceTime(event().time)}`,
        position:[-29,-193],fontSize:19,fontFamily:'Arial',fill:P.muted,
      }));
      view.add(new Txt({text:() => fitText(event().label,790,27),position:[0,-151],fontSize:27,fontFamily:'Arial',fill:P.ink}));
      view.add(new Txt({text:() => fitText(event().detail || event().status.toUpperCase(),790,18),position:[0,-113],fontSize:18,fontFamily:'Arial',fill:() => palette[event().status]}));

      model.actors.forEach(actor => {
        const y = laneY(actor);
        view.add(new Rect({position:[96,y],size:[650,43],radius:9,fill:P.panel,opacity:() => event().actor === actor ? 0.9 : 0.35}));
        view.add(new Line({points:[[-230,y],[420,y]],stroke:P.grid,lineWidth:2}));
        view.add(new Txt({text:fitText(actor,175,20),position:[-335,y],fontSize:20,fontFamily:'Arial',fill:() => event().actor === actor ? P.ink : P.muted}));
      });
      const path = model.events.map((item,i):[number,number] => [xAt(i),laneY(item.actor)]);
      view.add(new Line({points:path,stroke:P.blue,lineWidth:2,lineDash:[5,7],opacity:0.28}));
      model.events.forEach((item,i) => {
        view.add(new Circle({
          position:[xAt(i),laneY(item.actor)],
          size:() => i === index() ? 27 : 13,
          fill:palette[item.status],stroke:P.bg,lineWidth:3,
          opacity:() => i <= index() ? 1 : 0.25,
        }));
        view.add(new Circle({position:[xAt(i),laneY(item.actor)],size:38,stroke:palette[item.status],lineWidth:2,opacity:() => i === index() ? 0.7 : 0}));
      });
      view.add(new Txt({text:formatTraceTime(model.start),position:[-210,219],fontSize:17,fontFamily:'Arial',fill:P.muted}));
      view.add(new Txt({text:formatTraceTime(model.end),position:[400,219],fontSize:17,fontFamily:'Arial',fill:P.muted}));
      view.add(new Txt({text:'ELAPSED TIME',position:[95,219],fontSize:15,fontFamily:'Arial',fill:P.muted}));
      yield* progress(1,duration,linear);
    };
    return {
      factory,
      title:model.title,
      summary:`${model.events.length} events across ${model.actors.length} actor lanes, spanning ${formatTraceTime(model.span)}.`,
      duration,
      rows:model.events.map((event,i) => ({
        label:`${i + 1}. ${formatTraceTime(event.time)} · ${event.actor}`,
        value:event.label,
        detail:`${event.status.toUpperCase()}${event.detail ? ' — ' + event.detail : ''}`,
      })),
    };
  },
};

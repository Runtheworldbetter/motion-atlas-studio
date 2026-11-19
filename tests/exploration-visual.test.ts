import test from 'node:test';
import assert from 'node:assert/strict';
import {gears, gearPath, projectile, springPosition, springVelocity, springSettled, materialPixels} from '../lib/explorations/visual.ts';

test('projectile flight respects launch, apex, range and landing conditions', () => {
  for (const gravity of [6, 9.81, 15]) for (const angle of [10, 45, 80]) {
    const flight = projectile(30, angle, gravity);
    assert.equal(flight.at(0).y, 0);
    assert.ok(Math.abs(flight.at(flight.duration).y) < 1e-10);
    assert.ok(Math.abs(flight.at(flight.duration / 2).y - flight.height) < 1e-10);
    assert.ok(Math.abs(flight.at(flight.duration / 2).vy) < 1e-10);
    assert.ok(Math.abs(flight.range - 900 * Math.sin(angle * Math.PI / 90) / gravity) < 1e-10);
    assert.equal(flight.at(flight.duration + 10).x, flight.range);
  }
  assert.throws(() => projectile(0, 45));
  assert.throws(() => projectile(10, 90));
});

test('spring solutions preserve initial rest and settle to the target in all three damping regimes', () => {
  for (const damping of [6, 20, 35]) {
    assert.ok(Math.abs(springPosition(0, 100, damping, 10, 45) - 10) < 1e-10);
    assert.ok(Math.abs((springPosition(1e-7, 100, damping, 10, 45) - 10) / 1e-7) < .001);
    assert.ok(Math.abs(springPosition(20, 100, damping, 10, 45) - 45) < 1e-8);
  }
  assert.ok(springPosition(.35, 100, 2) > 1, 'light damping overshoots');
  assert.ok(springPosition(.35, 100, 20) < 1, 'critical damping does not overshoot');
  assert.ok(Math.abs(springPosition(.2, 100, 19.999) - springPosition(.2, 100, 20.001)) < .0001);
});

test('meshing gears have equal opposite pitch-line travel and finite closed profiles', () => {
  for (let i = 1; i < gears.length; i++) {
    assert.equal(gears[i - 1].teeth * gears[i - 1].turns, -gears[i].teeth * gears[i].turns);
  }
  for (const gear of gears) {
    const path = gearPath(gear.teeth, 7);
    assert.ok(path.startsWith('M') && path.endsWith(' Z'));
    assert.ok(!/NaN|Infinity/.test(path));
  }
});

test('slow springs are not stopped at four seconds, and crossing the target does not mean settled', () => {
  assert.ok(216-springPosition(4,20,40,0,216)>28);
  assert.equal(springSettled(4,20,40,0,216),false);
  assert.equal(springSettled(20,20,40,0,216),true);
  const w=Math.sqrt(80),a=1,wd=Math.sqrt(w*w-a*a),crossing=(Math.PI/2+Math.atan(a/wd))/wd;
  assert.ok(Math.abs(springPosition(crossing,80,2,0,216)-216)<1e-8);
  assert.ok(Math.abs(springVelocity(crossing,80,2,0,216))>100);
  assert.equal(springSettled(crossing,80,2,0,216),false);
});

test('spring velocity matches the position derivative in all damping regimes', () => {
  for(const damping of [2,20,40])for(const t of [.1,.7,4]){
    const epsilon=1e-5;
    const numerical=(springPosition(t+epsilon,100,damping,10,216)-springPosition(t-epsilon,100,damping,10,216))/(2*epsilon);
    assert.ok(Math.abs(numerical-springVelocity(t,100,damping,10,216))<1e-4);
  }
});

test('CPU materials produce reproducible opaque frames and respond to every control',()=>{
  const frames=[0,1,2].map(mode=>materialPixels(24,18,0,mode,1,.15));
  for(let mode=0;mode<3;mode++){
    const frame=frames[mode];
    assert.deepEqual(frame,materialPixels(24,18,0,mode,1,.15));
    assert.ok(frame.every((value,index)=>index%4!==3||value===255));
    assert.ok(new Set(frame.filter((_,index)=>index%4===0)).size>8,'field must have visible variation');
    assert.notDeepEqual(frame,materialPixels(24,18,3,mode,1,.15),'time changes the material');
    assert.notDeepEqual(frame,materialPixels(24,18,0,mode,2,.15),'shape changes the material');
    assert.notDeepEqual(frame,materialPixels(24,18,0,mode,1,0),'grain changes the material');
  }
  assert.notDeepEqual(frames[0],frames[1]);assert.notDeepEqual(frames[1],frames[2]);
  const reuse=new Uint8ClampedArray(24*18*4);
  assert.equal(materialPixels(24,18,0,0,1,.15,reuse),reuse);
  assert.deepEqual(reuse,frames[0]);
});

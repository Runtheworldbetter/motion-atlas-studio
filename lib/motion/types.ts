import type {View2D} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';
export type Category = 'Math & nature' | 'Systems & AI' | 'Data stories' | 'Motion craft';
export interface SceneSpec { id:string; title:string; category:Category; description:string; technique:string; tags:string[]; color:string; }
export type SceneFactory = (view:View2D) => ThreadGenerator;

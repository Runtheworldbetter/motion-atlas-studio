import {mathSpecs,mathScenes} from './math';
import {systemsSpecs,systemsScenes} from './systems';
import {dataSpecs,dataScenes} from './data';
import {craftSpecs,craftScenes} from './craft';
export const specs=Array.from({length:12},(_,i)=>[mathSpecs[i],systemsSpecs[i],craftSpecs[i],dataSpecs[i]]).flat();
export const scenes={...mathScenes,...systemsScenes,...dataScenes,...craftScenes};

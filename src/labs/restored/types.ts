export interface RestoredStudyMeta {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
}

export interface RestoredStudyHandle {
  destroy(): void;
  getState(): Record<string, unknown>;
  getSvg(): SVGSVGElement;
}

export interface RestoredStudyModule {
  meta: RestoredStudyMeta;
  mount(container: HTMLElement): RestoredStudyHandle;
}

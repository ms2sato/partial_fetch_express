declare type PartialRenderer = import('../../partial_renderer').PartialRenderer;

namespace Express {
  export interface Response {
    partials: () => PartialRenderer
  }
}

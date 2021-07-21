import { PartialRenderer } from "../../partial_renderer"

declare global {
  namespace Express {
    interface Response {
      partials: () => PartialRenderer
    }
  }
}

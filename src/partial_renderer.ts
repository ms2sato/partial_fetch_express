import express from "express"

import path from 'path'
import { Protocol } from './protocols'
import renderPug from './template_engins/pug'

export const contentType = 'application/partial+json'

interface TemplateRenderer {
  (templatePath: string, options: unknown): string
}

class PartialRenderer {
  private req: express.Request
  private res: express.Response
  private ret: Protocol
  private renderFunc: TemplateRenderer

  constructor(req: express.Request, res: express.Response, renderFunc: TemplateRenderer) {
    this.req = req
    this.res = res
    this.ret = { effects: [] }
    this.renderFunc = renderFunc
  }

  add(selector: string, action: string, view: string, options = {}): PartialRenderer {
    const viewPath = (this.req.app.settings as Record<string, string>).views

    const templatePath = path.join(viewPath, view)
    const html = this.renderFunc(templatePath, options)
    this.ret.effects.push({ selector, html, action })
    return this
  }

  inner(selector: string, view: string, options = {}): PartialRenderer {
    return this.add(selector, 'inner', view, options);
  }

  appendChild(selector: string, view: string, options = {}): PartialRenderer {
    return this.add(selector, 'appendChild', view, options);
  }

  prependChild(selector: string, view: string, _options = {}): PartialRenderer {
    throw new Error('Unimplemented')
  }

  insertBefore(selector: string, view: string, _options = {}): PartialRenderer {
    throw new Error('Unimplemented')
  }

  remove(selector: string, view: string, _options = {}): PartialRenderer {
    throw new Error('Unimplemented')
  }

  replace(selector: string, view: string, options = {}): PartialRenderer {
    return this.add(selector, 'replace', view, options);
  }

  send(): void {
    this.res.set('Content-Type', contentType)
    this.res.json(this.ret)
  }
}

function partialRenderer(renderFunc = renderPug): express.RequestHandler {
  // TODO: app.get('view engine') and choice renderFunc

  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.partials = () => {
      return new PartialRenderer(req, res, renderFunc)
    }
    next()
  }
}

export { partialRenderer, PartialRenderer }
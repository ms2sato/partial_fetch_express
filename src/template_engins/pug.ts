import pug from 'pug'

export default function render(templatePath: string, options:unknown = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pug.renderFile(templatePath, options as any)
}


export function getParamsFromPath(path: string, desc?: string[]) {
  const params = path.split('/').filter(p => p.trim().startsWith(':'))
  return params.map((p, index) => {
    const optional = /\?$/.test(p)
    return {
      name: optional ? p.slice(1, -1) : p.slice(1),
      optional,
      desc: desc?.[index]
    }
  })
}
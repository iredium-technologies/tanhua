function diffHrtime (start, end){
  const endS = end[0]
  const endNs = end[1]
  const startS = start[0]
  const startNs = start[1]

  let ns = endNs - startNs
  let s = endS - startS

  if (ns < 0) {
    s -= 1
    ns += 1e9
  }
  return [s, ns]
}

export function getHrTimeDuration (a, b = undefined) {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6

  let diff = null

  if (a && b) {
    diff = diffHrtime(a, b)
  } else {
    diff = process.hrtime(a)
  }

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

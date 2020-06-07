import morgan = require('morgan')
import os = require('os')
import { getHrTimeDuration } from '~/src/api_gateway/helpers/date'

function calculateTiming (timingMark) {
  const result = {}

  Object.keys(timingMark).forEach((key) => {
    const splittedKey = key.split(':')
    const keyEnd = splittedKey.pop()

    if (keyEnd === 'start') {
      const end = timingMark[`${splittedKey.join(':')}:end`]
      if (end) {
        const start = timingMark[key]
        const duration = getHrTimeDuration(start, end)
        result[splittedKey.join(':')] = duration
      }
    }
  })

  return result
}

morgan.token('request-id', function getRequestId (req): string {
  return req['locals'].requestId
})
morgan.token('conversation-id', function getConversationId (req): string {
  return req.conversationId
})
morgan.token('session-id', function getSessionId (req): string {
  return req.sessionId
})
morgan.token('instance-id', function getInstanceId (req): string {
  return req.instanceId
})
morgan.token('hostname', function getHostname (): string {
  return os.hostname()
})
morgan.token('pid', function getPid (): number {
  return process.pid
})
morgan.token('duration', function getDuration (req): number {
  const startTime = req['locals']['startTime']
  return getHrTimeDuration(startTime)
})
morgan.token('timing', function getDuration (req): object {
  return calculateTiming(req['locals']['timingMark'])
})

export function jsonFormat (tokens, req, res): string {
  return JSON.stringify({
    'request-id': tokens['request-id'](req, res),
    'remote-address': tokens['remote-addr'](req, res),
    'time': tokens['date'](req, res, 'iso'),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'conversation-id': tokens['conversation-id'](req, res),
    'session-id': tokens['session-id'](req, res),
    'hostname': tokens['hostname'](req, res),
    'instance': tokens['instance-id'](req, res),
    'pid': tokens['pid'](req, res),
    'duration': tokens['duration'](req, res),
    'timing': tokens['timing'](req, res)
  })
}

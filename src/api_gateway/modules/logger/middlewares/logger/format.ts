import morgan = require('morgan')
import os = require('os')

morgan.token('request-id', function getRequestId (req): string {
  return req.get('x-request-id')
})
morgan.token('pid', function getPid (): number {
  return process.pid
})
morgan.token('hostname', function getHostname (): string {
  return os.hostname()
})

export function jsonFormat (tokens, req, res): string {
  return JSON.stringify({
    'time': tokens['date'](req, res, 'iso'),
    'hostname': tokens['hostname'](req, res),
    'request-id': tokens['request-id'](req, res),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'referrer': tokens['referrer'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'remote-address': tokens['remote-addr'](req, res),
    'pid': tokens['pid'](req, res),
    'response-time': `${tokens['response-time'](req, res)} ms`,
  })
}

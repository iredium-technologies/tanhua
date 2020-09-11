import jwt = require('jsonwebtoken');

export default function requestId ({ hook }): void {
  hook('tanhua:proxy:userResHeaderDecorator', function (headers, userReq, userRes, proxyReq, proxyRes): void {
    headers['x-request-id'] = userReq['locals'].requestId
  })

  hook('tanhua:proxy:proxyReqOptDecorator', function (proxyReqOpts, srcReq): void {
    proxyReqOpts.headers['x-request-id'] = srcReq.headers['requestId']
  })

  hook('tanhua:proxy:proxyReqOptDecorator', function (proxyReqOpts, srcReq): void {
    if (srcReq['authenticatedUserId']) {
      proxyReqOpts.headers['X-Authenticated-User'] = jwt.sign(srcReq['locals']['user'].toJSON(), process.env.JWT_SECRET);      
    }
  })
}

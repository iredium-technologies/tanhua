export default function userId ({ hook }): void {
  hook('tanhua:proxy:proxyReqOptDecorator', function (proxyReqOpts, srcReq): void {
    if (srcReq['authenticatedUserId']) {
      proxyReqOpts.headers['x-authenticated-user-id'] = srcReq['authenticatedUserId']
    }
  })
}

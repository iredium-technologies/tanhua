export default function userId ({ hook }): void {
  hook('tanhua:proxy:proxyReqOptDecorator', function (proxyReqOpts, srcReq): void {
    if (srcReq['locals']['user']) {
      proxyReqOpts.headers['X-Authenticated-User'] = srcReq['authenticatedUserId']
    }
  })
}

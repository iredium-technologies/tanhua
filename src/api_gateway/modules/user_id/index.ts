export default function userId ({ hook }): void {
  hook('tanhua:proxy:proxyReqOptDecorator', function (proxyReqOpts, srcReq): void {
    proxyReqOpts.headers['x-authenticated-user-id'] = srcReq['authenticatedUserId']
  })
}

export default function oauth2 ({ hook }): void {
  hook('butterfly:onError', function onError (error): void {
    console.log(error)
  })
}

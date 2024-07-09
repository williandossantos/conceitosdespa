export class GithubUsuario{
   static search(username){
      // locap onde vai chegar xo. aplicacao
      const endpoint = `https://api.github.com/users/${username}`
      return fetch(endpoint)
      .then(data => data.json())
      .then((data) => ({
         login:data.login, 
         nome:data.name, 
         public_repos: data.public_repos,
         seguidores: data.followers
      }))
   }
}

import {GithubUsuario} from "./githubusers.js"

// claase que vainconter a logica dos dados
// comonos dados serao estruturados
export class Favoritos{
   constructor(root){
      this.root = document.querySelector(root)
      this.load()
   }
   load(){
     this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
   }
   save(){
      localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
   }
   
   async add(username){
      try{
         const userExists = this.entries.find(entry => entry.login === username)
         if(userExists){
            throw new error("Usuario ja cadastrado")
         }
         
         const user = await GithubUsuario.search(username)
         if(user.login === undefined){
            throw new Error("Usuário não encontrado!")
         }
         
         this.entries = [user, ...this.entries]
         this.update()
         this.save()
         
      }catch(error){
         console.log(error.message)
      }
   }
   delete(usuario){
      
      const filteredEntries = this.entries
      .filter(entry => entry.login !== usuario.login)
      this.entries = filteredEntries
      this.update()
      this.save()
   }
}

// classe que cria a vizualizacao e eventos html 
export class FavoritosView extends Favoritos{
   constructor(root){
      super(root)
      this.tbody = this.root.querySelector("table tbody")
      this.update()
      this.onadd()
   }
   onadd(){
      const addButton = this.root.querySelector(".button")
      addButton.addEventListener("click", () => {
         const { value } = this.root.querySelector(".search input")
         this.add(value)
      })
   }
   update(){
      
      this.removeAllTr()
      
      this.entries.forEach(usuario =>{
         const row = this.createRow()
         row.querySelector(".usuario img").src = `https://github.com/${usuario.login}.png`
         row.querySelector(".usuario img").alt = `Imagem de ${usuario.name}`
         row.querySelector(".usuario p").textContent = usuario.name
         row.querySelector("a").href = `https://github.com/${usuario.login}`
         row.querySelector(".usuario span").textContent = usuario.login
         row.querySelector(".repositorio").textContent = usuario.public_repos
         row.querySelector(".seguidores").textContent = usuario.followers
         // row.querySelector(".remover").onclick = () => {
         //    const isOk = confirm("Tem certeza que deseja deletar essa linha")
         //    if(isOk){
         //       this.delete(usuario)
         //    }
         // } 
         this.tbody.append(row)
         
      })
   }
   createRow(){
      const tr = document.createElement("tr")
      tr.innerHTML = `
      <td class="usuario">
         <img src="" alt=""/>
         <a href="" target="_blank">
            <p></p>
            <span></span>
         </a>
      </td>
      <td class="repositorio"></td>
      <td class="seguidores"></td>
      <td>
         <button class"remover">&times;</button>
      </td>
      `
      return tr
   }
   removeAllTr(){
      this.tbody.querySelectorAll("tr").forEach((tr) => {
         tr.remove()
      })
   }
}

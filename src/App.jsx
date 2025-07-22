import { useState,useEffect } from 'react'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"
function App() {
const[arr,setArr]=useState([])
const[text,setText]=useState('')
const[url,setUrl]=useState('')

  useEffect(()=>{
    axios.get("https://www.googleapis.com/youtube/v3/search" ,{
      params:{
        part:"snippet",
        q:text,
        type:"video",
        maxResults:10,
        key:"AIzaSyB57onoH0a8_bNokooUxK98aPil8brbuhI"
      }
    })
    .then(response=>{
      setArr(response.data.items)
      console.log("MyArray",arr);
      console.log("Direct",response.data.items);
  })
    .catch(error=>{console.log("error")})
  },[text])

  return (
    <>
      
      <input type="text" className='form-control' onKeyUp={e=>setText(e.target.value)}/>
      <iframe src={url} width="400" height="400" frameBorder="0" 
       allow=" autoplay;encrypted-media;" allowFullScreen>
      </iframe>  
      <div className='container'>
      {
        arr.map(a=>

          <div className='row p-3 bg-dark'>
            <div className='col-md-4 p-3'>
              <img src={a.snippet.thumbnails.default.url} height="50px"></img>
            </div>
            <div className='col-md-8 p-3'>
             <a href="#" onClick={e=>setUrl("https://www.youtube.com/embed/"+a.id.videoId+"?autoplay=1")}> {a.snippet.title} </a>
           </div>
          </div>   
        )
      }
      </div>
    </>
  )
}
export default App

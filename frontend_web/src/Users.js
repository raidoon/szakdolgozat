import { useState,useEffect } from "react"
import Navbar from './Navbar';
import Ipcim from "./Ipcim";

const Users=()=>{
    const [adatok,setAdatok] =useState([])

    const letoltes=async ()=>{
        let x=await fetch(Ipcim.Ipcim +'/felhasznalok')
        let y=await x.json()
        setAdatok(y)            
    }

    

    useEffect(()=>{
        letoltes()
    },[])

    return (
        <div>
            <Navbar/>
                <div style={styles.content}>
            
          {adatok.map((item, key)=>(
        <div key={key}>{item.felhasznalo_email}</div>
    )
    )}  
            

        </div>

             
        </div>



);
};

const styles = {
    content: {
      padding: '20px',
      textAlign: 'center',
      margin:'20px'
    },
  };
export default Users
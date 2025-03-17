import { useState,useEffect } from "react"
import Navbar from './Navbar';
import Ipcim from './Ipcim';
const Oktatok=()=>{
    const [adatok,setAdatok] =useState([])

    const letoltes=async ()=>{
        let x=await fetch(Ipcim.Ipcim +'/oktatok')
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
        <div key={key}>{item.oktato_neve} {item.oktato_felhasznaloID}</div>
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
export default Oktatok
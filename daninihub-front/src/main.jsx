import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function EmergencyFallback(){
  return <div style={{minHeight:'100vh',background:'#080b0e',color:'#eef3f7',fontFamily:'Inter,system-ui,sans-serif'}}>
    <header style={{position:'sticky',top:0,background:'#0b1015',borderBottom:'1px solid #28333d',padding:'14px 18px',zIndex:20}}>
      <strong style={{letterSpacing:'.18em'}}>DANINI</strong>
      <span style={{marginLeft:10,color:'#ff6d2d',fontSize:12}}>AUTOMOTIVE IMPORT INTELLIGENCE</span>
      <nav style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
        {['Passport','Inspection','Parts','Transport','Payment Safe','Import Base','Knowledge','Service Desk'].map((x,i)=><a key={x} href={['#passport','#inspection','#parts','#transport','#payment-protection','#base','#wissen','#service-request'][i]} style={{color:'#fff',textDecoration:'none',border:'1px solid #34414b',padding:'7px 9px',fontSize:12}}>{x}</a>)}
      </nav>
    </header>
    <main style={{maxWidth:1100,margin:'0 auto',padding:'70px 20px'}}>
      <p style={{color:'#ff6d2d',fontWeight:800,letterSpacing:'.15em'}}>DECIDE · VERIFY · EXECUTE</p>
      <h1 style={{fontSize:'clamp(44px,8vw,88px)',lineHeight:.95,margin:'12px 0'}}>Od oglasa do sigurne odluke o uvozu.</h1>
      <p style={{fontSize:19,lineHeight:1.7,color:'#aab5be'}}>Import Passport · SafeBuy · Model DNA · pregled vozila · originalni delovi · zaštićena autorizacija plaćanja · dovoz · Import Base Čalije.</p>
      <p style={{marginTop:30,color:'#8fa0ad'}}>Ako vidiš ovu sigurnosnu verziju, aplikacioni sloj se nije učitao. Osnovni sadržaj ostaje dostupan dok se frontend automatski ponovo učita.</p>
      <button onClick={()=>location.reload()} style={{marginTop:18,background:'#ff6d2d',border:0,padding:'13px 18px',fontWeight:900,cursor:'pointer'}}>Ponovo učitaj / Neu laden</button>
    </main>
  </div>
}

class ErrorBoundary extends Component{
  constructor(props){super(props);this.state={failed:false}}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(error,info){console.error('DANINI frontend error',error,info)}
  render(){return this.state.failed?<EmergencyFallback/>:this.props.children}
}

const root=document.getElementById('root')
if(root){
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary><App/></ErrorBoundary>
    </StrictMode>
  )
}

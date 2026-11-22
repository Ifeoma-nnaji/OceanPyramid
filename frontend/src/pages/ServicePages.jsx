import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Globe2, Building2 } from 'lucide-react'
import './ServicePages.css'

const pages = {
 mortgage:['PROPERTY FINANCE','Make your next property move with a clearer plan.','Explore mortgage guidance for buying property in Nigeria. Share your goals and our advisory team can help you understand the next steps.',['Understand your buying budget','Explore suitable financing routes','Get guidance on documentation']],
 management:['PROPERTY MANAGEMENT','Professional care for your property investment.','Tell us what support you need, from tenant coordination to ongoing property oversight.',['Tenant coordination','Property inspections and maintenance support','Clear communication and reporting']],
 request:['PROPERTY SOURCING','Tell us what you are looking for.','Share your preferred location, property type and budget so our team can understand your property brief.',['Residential and commercial requirements','Preferred locations and budget','Buying, renting and investment enquiries']],
 advisory:['REAL ESTATE ADVISORY','Make informed decisions at every stage.','Get a clearer view of property options, location considerations and transaction steps.',['Property search strategy','Location and investment considerations','Transaction guidance']],
 commercial:['COMMERCIAL PROPERTY','Find a space that works for your business.','Explore offices, retail spaces, warehouses and other commercial opportunities.',['Office and retail requirements','Warehouse and industrial spaces','Commercial acquisition and leasing']],
 abroad:['DIASPORA PROPERTY SERVICES','Explore property opportunities in Nigeria, wherever you are.','A point of contact for property discovery, documentation questions and transaction guidance.',['Remote property discovery','Documentation and verification enquiries','Dedicated communication']]
}
export default function ServicePages({page}) {
 const [price,setPrice]=useState('50000000'),[deposit,setDeposit]=useState('10000000'),[rate,setRate]=useState('15'),[years,setYears]=useState('15')
 const [sent,setSent]=useState(false)
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[message,setMessage]=useState('')
 const [eyebrow,title,intro,points]=pages[page]||pages.advisory
 const monthly=useMemo(()=>{const loan=Math.max(0,+price-(+deposit));const r=(+rate)/1200,n=(+years)*12;return !loan||!n?0:r?loan*r/(1-Math.pow(1+r,-n)):loan/n},[price,deposit,rate,years])
 return <main className="service-page">
  <section className="service-hero"><div className="service-wrap"><span>{eyebrow}</span><h1>{title}</h1><p>{intro}</p><Link className="service-primary" to="/contact">Speak to an Advisor <ArrowRight size={16}/></Link></div></section>
  <section className="service-wrap service-body"><div className="service-intro"><span>OCEAN PYRAMIDS</span><h2>Guidance built around your property goals.</h2><p>Local market understanding and a considered, personal approach to property decisions.</p></div>
   <div className="service-feature-grid">{points.map((p,i)=><article key={p}><div className="service-icon">{[<ShieldCheck/>,<Globe2/>,<Building2/>][i]}</div><h3>{p}</h3><p>Speak with our team to understand the options and next steps for your requirements.</p></article>)}</div>
   {page==='mortgage'&&<section className="mortgage-tool"><div><span>ILLUSTRATIVE CALCULATOR</span><h2>Estimate a monthly repayment</h2><p>Illustrative only, not a mortgage offer or financial advice. Actual rates and eligibility depend on the lender and your circumstances.</p></div><div className="mortgage-fields">
    <label>Property price (₦)<input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)}/></label><label>Deposit (₦)<input type="number" min="0" value={deposit} onChange={e=>setDeposit(e.target.value)}/></label><label>Annual interest rate (%)<input type="number" min="0" step=".1" value={rate} onChange={e=>setRate(e.target.value)}/></label><label>Term (years)<input type="number" min="1" max="40" value={years} onChange={e=>setYears(e.target.value)}/></label><div className="mortgage-result"><span>Estimated monthly repayment</span><strong>₦{Math.round(monthly).toLocaleString('en-NG')}</strong></div>
   </div></section>}
   <section className="service-enquiry"><div><span>LET'S TALK PROPERTY</span><h2>Tell us how we can help.</h2><p>Prepare an enquiry for our team. Delivery will be connected when the backend enquiry endpoint is available.</p></div>
   {sent?<p className="service-confirm">Your enquiry details have been prepared. This preview does not send or store messages yet.</p>:<form onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Full name<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>How can we help?<textarea required value={message} onChange={e=>setMessage(e.target.value)}/></label><button>Prepare enquiry <ArrowRight size={15}/></button><small>Preview only: this form does not send or store enquiries yet.</small></form>}</section>
  </section></main>
}

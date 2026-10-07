import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

function ideas(profile:any,brain:any){
  const interests=brain?.interests?.join(", ")||"your interests";
  const skills=brain?.skills||"your skills";
  const customer=profile?.targetCustomer||"a focused customer group";
  if(profile?.stage==="BUSINESS"||profile?.stage==="GROWTH") return [["Acquisition","Find an underused acquisition channel","Test one channel that can reach "+customer+" with less friction.",72],["Conversion","Improve the path from interest to purchase","Identify one point where "+customer+" may hesitate and run a focused conversion test.",68],["Retention","Create a reason to come back","Look for a repeat-use or retention loop around the value your business already provides.",61]];
  return [["Opportunity","Turn your interests into a focused problem","Explore problems at the intersection of "+interests+" and what you know about "+skills+".",76],["Customer","Find a specific group with a painful problem","Interview "+customer+" before choosing a market.",70],["Validation","Test demand before building","Put a simple offer in front of real people and measure response.",64]];
}
export default async function Scout(){
  const s=await auth.api.getSession({headers:await headers()}); if(!s)return null;
  const o=await db.organization.findFirst({where:{ownerId:s.user.id},include:{profile:true,brain:true,opportunities:{orderBy:{createdAt:"desc"},take:8}}}); if(!o)return null;
  const list=ideas(o.profile,o.brain);
  async function saveOpportunity(formData:FormData){
    "use server";
    const title=String(formData.get("title")||""); const type=String(formData.get("type")||""); const description=String(formData.get("description")||""); const score=Number(formData.get("score")||0);
    const ss=await auth.api.getSession({headers:await headers()}); if(!ss)return;
    const org=await db.organization.findFirst({where:{ownerId:ss.user.id}}); if(!org)return;
    const existing=await db.opportunity.findFirst({where:{organizationId:org.id,title}});
    if(!existing) await db.opportunity.create({data:{organizationId:org.id,type,title,description,confidence:score,impact:Math.min(100,score+5)}});
  }
  async function turnIntoIdea(formData:FormData){
    "use server";
    const title=String(formData.get("title")||""); const description=String(formData.get("description")||""); const score=Number(formData.get("score")||0);
    const ss=await auth.api.getSession({headers:await headers()}); if(!ss)return;
    const org=await db.organization.findFirst({where:{ownerId:ss.user.id}}); if(!org)return;
    const existing=await db.idea.findFirst({where:{organizationId:org.id,title}});
    if(!existing) await db.idea.create({data:{organizationId:org.id,title,description,score:score||null}});
  }
  return <main className="page"><div className="scoutTop"><div><div className="eyebrow">SCOUT</div><h1>See what deserves your attention.</h1><p>Scout turns your Business Brain into opportunities to investigate. These are hypotheses, not guarantees.</p></div><span className="stagePill">{o.profile?.stage||"EXPLORER"}</span></div>
  <div className="scoutGrid">{list.map(([type,title,desc,score])=><article className="scoutCard" key={String(title)}><div className="cardMeta"><span>{String(type)}</span><b>{String(score)}% fit</b></div><h2>{String(title)}</h2><p>{String(desc)}</p><div className="scoutBottom"><small>Next: validate the assumption</small><div className="buttonRow"><form action={saveOpportunity}><input type="hidden" name="type" value={String(type)}/><input type="hidden" name="title" value={String(title)}/><input type="hidden" name="description" value={String(desc)}/><input type="hidden" name="score" value={String(score)}/><button className="pillButton">Save</button></form><form action={turnIntoIdea}><input type="hidden" name="title" value={String(title)}/><input type="hidden" name="description" value={String(desc)}/><input type="hidden" name="score" value={String(score)}/><button className="pillButton">Explore</button></form></div></div></article>)}</div>
  {o.opportunities.length>0&&<section className="savedSection"><div className="sectionHead"><h2>Saved opportunities</h2><span>{o.opportunities.length}</span></div>{o.opportunities.map(x=><Link className="savedRow" href={"/app/opportunity/"+x.id} key={x.id}><span>{x.type}</span><div><b>{x.title}</b><small>{x.description}</small></div><strong>→</strong></Link>)}</section>}</main>;
}
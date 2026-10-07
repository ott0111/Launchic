import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

const tests = [
  ["Customer interviews","Talk to 5 people in the target customer group and ask about the problem."],
  ["Demand test","Put a simple offer in front of real people and measure meaningful responses."],
  ["Landing page","Explain the problem, outcome, and offer on one focused page and track interest."],
  ["Pricing test","Test whether your target customer will accept a concrete price for the outcome."],
  ["Competitor analysis","Study how existing alternatives solve the problem and where customers still struggle."],
  ["Prototype","Create the smallest useful version of the experience and put it in front of potential users."]
];

export default async function IdeaWorkspace({params}:{params:Promise<{id:string}>}) {
  const session=await auth.api.getSession({headers:await headers()});
  if(!session) redirect("/login");
  const {id}=await params;
  const idea=await db.idea.findFirst({where:{id,organization:{ownerId:session.user.id}},include:{validations:true,actions:true}});
  if(!idea) notFound();

  async function addValidation(formData:FormData){
    "use server";
    const objective=String(formData.get("objective")||"");
    const s=await auth.api.getSession({headers:await headers()});
    if(!s)return;
    const current=await db.idea.findFirst({where:{id,organization:{ownerId:s.user.id}}});
    if(current&&objective) await db.validation.create({data:{ideaId:current.id,objective}});
  }

  async function updateStatus(){
    "use server";
    const s=await auth.api.getSession({headers:await headers()});
    if(!s)return;
    const current=await db.idea.findFirst({where:{id,organization:{ownerId:s.user.id}}});
    if(current) await db.idea.update({where:{id:current.id},data:{status:current.status==="VALIDATING"?"EXPLORING":"VALIDATING",stage:"VALIDATION"}});
  }

  return <main className="page narrow">
    <Link href="/app/ideas" className="backLink">← Idea Workspace</Link>
    <div className="opportunityHero">
      <div className="eyebrow">{idea.status.replace("_"," ")}</div>
      <h1>{idea.title}</h1><p>{idea.description}</p>
      <div className="metricPills"><span>Stage <b>{idea.stage}</b></span>{idea.score&&<span>Fit <b>{idea.score}%</b></span>}<span>Evidence first</span></div>
    </div>

    <section className="detailCard"><div className="eyebrow">VALIDATION</div><h2>What needs to be true?</h2><p>Choose one small test instead of building the whole thing. Validation creates evidence you can use to decide what happens next.</p>
      <div className="validationGrid">{tests.map(([name,desc])=><form action={addValidation} key={name}><input type="hidden" name="objective" value={name}/><button className="validationOption" type="submit"><b>{name}</b><span>{desc}</span><small>Start test →</small></button></form>)}</div>
      <form action={updateStatus}><button className="button primary">{idea.status==="VALIDATING"?"Pause validation":"Start validation"}</button></form>
    </section>

    <section className="detailCard"><div className="eyebrow">WORKSPACE</div><h2>Keep the decision grounded.</h2>
      <div className="ideaGrid"><div><span>Problem</span><b>What painful problem does this solve?</b></div><div><span>Customer</span><b>Who has the problem often enough to care?</b></div><div><span>Competition</span><b>What alternatives already exist?</b></div><div><span>Differentiation</span><b>Why would someone choose this instead?</b></div><div><span>Monetization</span><b>What would the customer actually pay for?</b></div><div><span>Risks</span><b>What assumption could make this fail?</b></div></div>
    </section>

    {idea.validations.length>0&&<section className="detailCard"><div className="eyebrow">TESTS</div>{idea.validations.map(v=><div className="task" key={v.id}><span>{v.status}</span><div><b>{v.objective}</b><small>{v.result||"No result recorded yet."}</small></div></div>)}</section>}
  </main>;
}
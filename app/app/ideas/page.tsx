import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function IdeasPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const organization = await db.organization.findFirst({
    where: { ownerId: session.user.id },
    include: { ideas: { orderBy: { updatedAt: "desc" } } },
  });
  if (!organization) redirect("/onboarding");

  return <main className="page">
    <div className="scoutTop">
      <div><div className="eyebrow">IDEA WORKSPACE</div><h1>Keep the ideas worth exploring.</h1><p>Move from a promising opportunity to a concrete idea, then validate the assumptions before you build.</p></div>
      <Link href="/app/scout" className="button primary">Find an opportunity</Link>
    </div>
    {organization.ideas.length ? <div className="scoutGrid">{organization.ideas.map((idea) => (
      <Link href={"/app/ideas/"+idea.id} className="scoutCard" key={idea.id}>
        <div className="cardMeta"><span>{idea.status.replace("_"," ")}</span><b>{idea.score ? idea.score+"% fit" : "Unscored"}</b></div>
        <h2>{idea.title}</h2><p>{idea.description}</p>
        <div className="scoutBottom"><small>Open workspace</small><strong>→</strong></div>
      </Link>
    ))}</div> : <div className="emptyCard"><div className="emptyIcon">+</div><h2>No ideas yet.</h2><p>Save a Scout opportunity, then turn the strongest hypothesis into an idea.</p><Link href="/app/scout" className="button primary">Open Scout</Link></div>}
  </main>;
}
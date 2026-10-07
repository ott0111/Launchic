import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppHome() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const organization = await db.organization.findFirst({
    where: { ownerId: session.user.id },
    include: {
      profile: true,
      brain: true,
      actions: { orderBy: { createdAt: "desc" }, take: 4 },
    },
  });

  if (!organization) redirect("/onboarding");

  const isBusiness =
    organization.profile?.stage === "BUSINESS" ||
    organization.profile?.stage === "GROWTH";
  const title = isBusiness
    ? `Grow ${organization.profile?.name || "your business"}.`
    : "Find what to build.";

  return (
    <main className="page">
      <div className="scoutTop">
        <div>
          <div className="eyebrow">{organization.profile?.stage || "EXPLORER"}</div>
          <h1>{title}</h1>
          <p>
            {isBusiness
              ? "Launchic is organizing your business context around the opportunities and actions that deserve attention."
              : "Launchic is turning your interests, skills, and goals into opportunities worth exploring."}
          </p>
        </div>
        <Link href="/app/scout" className="button primary">Open Scout</Link>
      </div>

      <section className="opportunityHero">
        <div className="eyebrow">NEXT BEST ACTION</div>
        <h1>{isBusiness
          ? "Identify your highest-leverage growth opportunity."
          : "Explore your first Scout opportunity."}</h1>
        <p>
          {isBusiness
            ? "Start with the area most likely to move the business forward, then turn the decision into a Launchpad action."
            : "Scout uses your Business Brain to surface ideas that fit what you are trying to build."}
        </p>
        <Link href="/app/scout" className="button primary">Take the next step</Link>
      </section>

      <div className="dashboardGrid">
        <section className="detailCard">
          <div className="sectionHead">
            <h2>Business Brain</h2>
            <Link href="/app/brain">Open</Link>
          </div>
          <p><b>Goals:</b> {organization.brain?.goals.join(", ") || "Not set"}</p>
          <p><b>Interests:</b> {organization.brain?.interests.join(", ") || "Not set"}</p>
          <p><b>Skills:</b> {organization.brain?.skills || "Not set"}</p>
        </section>

        <section className="detailCard">
          <div className="sectionHead">
            <h2>Launchpad</h2>
            <Link href="/app/launchpad">Open</Link>
          </div>
          {organization.actions.length ? organization.actions.map((a) => (
            <div className="savedRow" key={a.id}>
              <span>{a.status.replace("_", " ")}</span>
              <div><b>{a.title}</b></div>
            </div>
          )) : <p>No actions yet. Scout will help create them.</p>}
        </section>
      </div>
    </main>
  );
}
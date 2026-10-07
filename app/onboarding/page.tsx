import Link from "next/link";

export default function Onboarding() {
  return <main className="onboarding"><div className="onboardHeader"><Link href="/" className="brand"><span className="brandMark">L</span>Launchic</Link><span>Step 1 of 2</span></div><div className="onboardCard"><div className="eyebrow">LET'S START WITH CONTEXT</div><h1>Do you already have a business in mind?</h1><p>Tell Launchic where you are starting. We will adapt the workspace around it.</p><div className="choiceGrid"><Link href="/onboarding/existing"><b>Yes, I already have a business</b><span>Connect what you're already building and find growth opportunities.</span></Link><Link href="/onboarding/start"><b>No, I'm still figuring it out</b><span>Explore ideas, problems, and opportunities that fit you.</span></Link></div></div></main>;
}

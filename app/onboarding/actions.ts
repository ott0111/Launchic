"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const list = (v: FormDataEntryValue | null) => String(v || "").split(",").map(x => x.trim()).filter(Boolean);

export async function completeOnboarding(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  let organization = await db.organization.findFirst({ where: { ownerId: session.user.id } });
  if (!organization) organization = await db.organization.create({ data: {
    name: String(formData.get("businessName") || ((session.user.name || "My") + " Workspace")),
    ownerId: session.user.id,
    members: { create: { userId: session.user.id, role: "OWNER" } },
    profile: { create: { stage: formData.get("mode") === "existing" ? "BUSINESS" : "EXPLORER" } },
    brain: { create: {} }, subscription: { create: {} }
  }});
  const mode = String(formData.get("mode"));
  await db.businessProfile.update({ where: { organizationId: organization.id }, data: mode === "existing" ? {
    stage:"BUSINESS", name:String(formData.get("businessName")||""), website:String(formData.get("website")||"")||null,
    description:String(formData.get("description")||""), targetCustomer:String(formData.get("targetCustomer")||""),
    industry:String(formData.get("industry")||"")||null, businessModel:String(formData.get("businessModel")||"")||null
  } : { stage:"EXPLORER" }});
  const goal=String(formData.get("goal")||"");
  await db.businessBrain.update({ where:{organizationId:organization.id}, data:{
    interests:list(formData.get("interests")), skills:String(formData.get("skills")||"")||null,
    goals:goal?[goal]:[], challenges:String(formData.get("challenge")||"")||null,
    acquisitionChannels:list(formData.get("acquisitionChannels")),
    context:{mode,ideas:String(formData.get("ideas")||""),completedOnboardingAt:new Date().toISOString()}
  }});
  await db.activity.create({data:{organizationId:organization.id,type:"ONBOARDING_COMPLETED",description:"Business Brain context updated."}});
  redirect("/app");
}
import { Site } from "@/types/site";
import { SiteList } from "../components/site-list";
import { sites } from "@/helpers/siteApi" 
import Link from "next/link";

export default async function Sites() {
  let allSites:Site[] = []
  try {
    allSites = await sites.getAll() as Site[];
  } catch (error) {
    
  }
  if(!allSites.length) return (
    <div className="">
      <Link
      href="dashboard"
      className=""
      >
        Generate a new site
      </Link>
      
    </div>
  );
  
  return (
        <SiteList sites={allSites} />
  )
}

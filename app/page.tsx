import { SiteProvider } from "@/components/site/providers"
import { Nav } from "@/components/site/nav"
import { Hero } from "@/components/site/hero"
import { Contact, Footer, RevealObserver, Services, Work } from "@/components/site/sections"

export default function Home() {
  return (
    <SiteProvider>
      <RevealObserver />
      <Nav />
      <main className="grain relative">
        <Hero />
        <Work />
        <Services />
        <Contact />
      </main>
      <Footer />
    </SiteProvider>
  )
}

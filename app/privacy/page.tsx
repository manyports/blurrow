import type { Metadata } from "next";
import { H2, P, PageTitle, TextLink } from "@/components/docs/Prose";
import { pageMetadata } from "@/lib/seo";
import { repo } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "What blurrow.org collects when you visit: anonymous page views through Vercel Analytics, and nothing else. No cookies, no accounts, no ads.",
  path: "/privacy",
  imageAlt: "The blurrow banner.",
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-16 pb-24 flex flex-col gap-10">
      <PageTitle
        title="privacy"
        description="the short version: this site counts page views, anonymously, and that's it. no cookies, no accounts, no ads, nothing sold."
      />

      <section className="flex flex-col gap-4">
        <H2 id="analytics">page views</H2>
        <P>
          the site uses vercel analytics to see which pages people read. it records the page, the site that sent you,
          your country, and your browser, operating system and device type. it sets no cookies and doesn&apos;t keep
          your ip address. visits are grouped with a hash that resets every day, so nobody can follow you from one day
          to the next or across other sites.
        </P>
      </section>

      <section className="flex flex-col gap-4">
        <H2 id="hosting">hosting</H2>
        <P>
          the site runs on vercel. like any web host, vercel briefly handles your ip address to deliver the page and
          keep the service secure, under its own privacy policy.
        </P>
      </section>

      <section className="flex flex-col gap-4">
        <H2 id="your-browser">what stays in your browser</H2>
        <P>
          if you pick light or dark mode, that choice is saved in your browser&apos;s local storage so the site
          remembers it. it never leaves your device, and clearing your site data removes it.
        </P>
      </section>

      <section className="flex flex-col gap-4">
        <H2 id="elsewhere">links to other sites</H2>
        <P>
          the star count next to the github link is fetched by the server, not your browser, so github doesn&apos;t
          see you visit. the feedback box and the github and npm links take you to those sites, and from there their
          own privacy policies apply. fonts are served from this site, not from google.
        </P>
      </section>

      <section className="flex flex-col gap-4">
        <H2 id="contact">questions</H2>
        <P>
          if you have a question about any of this, or want something looked into,{" "}
          <TextLink href={`${repo.url}/issues/new`}>open an issue</TextLink> on github.
        </P>
      </section>
    </main>
  );
}

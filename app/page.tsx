import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { PixelStudio } from "@/components/pixel-studio";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import { tools } from "@/config/tools";

const faqs = [
  ["Is PixProMax free?", "Yes. The current browser-based image tools are free, require no account, and add no watermark."],
  ["Are my images uploaded?", "For active compression, resizing, conversion, batch, target-size, and passport tools, processing happens locally in your browser."],
  ["Can I use it on mobile?", "Yes. The interface supports touch devices and includes a regular file picker for phones and tablets."],
  ["Which formats are supported?", "Core tools support JPG, JPEG, PNG, and WebP. The converter also accepts AVIF, HEIC, and HEIF, with JPG, PNG, or WebP output."],
  ["Can I resize an image to 20 KB or 50 KB?", "Yes. The target-size tool iteratively adjusts quality and dimensions to get reasonably close to your chosen size."],
  ["Does PixProMax add watermarks?", "No. Downloads from the active tools do not include a PixProMax watermark."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": `${SITE_URL}/#application`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any modern web browser",
      featureList: tools.filter((tool) => tool.status === "active").map((tool) => tool.name),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <div className="home-live-background">
        <PixelStudio />

        <AdSlot placement="home-bottom" />
        <section className="faq-section shell" id="faq"><div className="section-heading"><div><span className="kicker">GOOD TO KNOW</span><h2>Questions, answered plainly.</h2></div></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
      </div>
    </>
  );
}

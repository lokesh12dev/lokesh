import { Container } from '@/components/ui/container';
import Section from '@/components/ui/section';
import { Caption, Heading, Paragraph } from '@/components/ui/typography';

export default function ImprintSection() {
  return (
    <Section id="info" aria-labelledby="imprint-heading">
      <Container>
        <div className="max-w-prose md:mx-auto">
          <div className="text-center mb-12">
            <Caption>Legal Information</Caption>
            <h1
              id="imprint-heading"
              className="mb-4 text-5xl/tight font-bold text-balance md:text-7xl/tight"
            >
              Imprint
            </h1>
            <p className="text-neutrals-300 text-lg">
              Contact details and legal information for LOKESH
            </p>
          </div>
          <address className="grid gap-y-16 not-italic">
            <div>
              <Heading>Details</Heading>
              <Paragraph>
                <span className="text-neutrals-100">LOKESH</span><br />
                Chennai<br />
                Tamil Nadu, India<br /><br />
                CEO: M. Lokesh
              </Paragraph>
            </div>
            <div>
              <Heading>Contact</Heading>
              <Paragraph>
                E-Mail:
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=mr.lokesh7@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Hit us up"
                  className="text-neutrals-100 hover:text-primary border-b border-current transition-colors"
                >
                  mr.lokesh7@gmail.com</a
                ><br />Phone number: <a
                  href="tel:+917603883879"
                  className="text-neutrals-100 hover:text-primary border-b border-current transition-colors"
                >7603883879</a>
              </Paragraph>
            </div>
          </address>
        </div>
      </Container>
    </Section>
  );
}

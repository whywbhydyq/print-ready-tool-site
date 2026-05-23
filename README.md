# Print Ready Tool Site

Free print-ready calculators for pixels, DPI, bleed, safe zones, KDP paperback covers, KDP interior bleed, and Etsy printable size packs.

Production domain: https://print.ymirtool.com

## Included tools

- Print Size Calculator
- DPI Calculator
- Image Print Quality Checker
- Bleed & Safe Zone Calculator
- KDP Cover Size Calculator
- KDP Interior Bleed Calculator
- Etsy Printable Size Pack Calculator
- Common Print Sizes Library

## Development

```bash
npm install
npm run dev
npm run build
```

## Deployment

This project is configured for Vercel and uses Next.js App Router.

Set `NEXT_PUBLIC_SITE_URL` to `https://print.ymirtool.com` in Vercel Production before indexing. The source fallback in `src/lib/site.ts` also points to this domain so sitemap, robots, Open Graph URLs, and metadata do not default to a Vercel preview URL.

### DNS for the subdomain

Add the subdomain `print.ymirtool.com` to the Vercel project, then create the DNS record requested by Vercel at the domain registrar or DNS provider for `ymirtool.com`.

Typical Vercel DNS for a subdomain is:

```text
Type: CNAME
Name: print
Value: cname.vercel-dns.com
```

After DNS propagation, verify these URLs:

- https://print.ymirtool.com/
- https://print.ymirtool.com/robots.txt
- https://print.ymirtool.com/sitemap.xml
- https://print.ymirtool.com/print-size-calculator/

The sitemap and robots output must use `https://print.ymirtool.com`, not a `vercel.app` URL.

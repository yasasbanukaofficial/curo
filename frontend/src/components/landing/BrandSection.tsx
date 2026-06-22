import SectionShell from "./SectionShell";

const logos = [
  { name: "Logo 01", url: "https://framerusercontent.com/images/WWMCBTyiJptmzGSZcH82wUzJdk.svg?width=133&height=36" },
  { name: "Logo 02", url: "https://framerusercontent.com/images/dDxw8IGpaGwYdREDXbEjVNp9OPY.svg?width=123&height=30" },
  { name: "Logo 03", url: "https://framerusercontent.com/images/dMltwHCGTaFuvvDeauBbNw4VhiE.svg?width=114&height=26" },
  { name: "Logo 04", url: "https://framerusercontent.com/images/ib7QEOHnNoY5ZmEBYTIPQQuuY.svg?width=168&height=36" },
  { name: "Logo 05", url: "https://framerusercontent.com/images/CEP27u2CV5mni8P2MYdJREE8JiY.svg?width=121&height=28" },
  { name: "Logo 06", url: "https://framerusercontent.com/images/1la3JOHvXJ7sFkm0oA4c5kVwZ80.svg?width=159&height=32" },
  { name: "Logo 07", url: "https://framerusercontent.com/images/a4ImMXl9VpSeOL8aL5DT3KPWqU.svg?width=120&height=26" },
];

export default function BrandSection() {
  return (
    <SectionShell padding="py-12 lg:py-16">
      <p className="text-center text-sm font-medium text-[#737373] mb-8">
        Trusted by Leading Teams
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
        {logos.map((logo, idx) => (
          <div key={idx} className="opacity-40 hover:opacity-70 transition-opacity">
            <img
              src={logo.url}
              alt={logo.name}
              className="h-8 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

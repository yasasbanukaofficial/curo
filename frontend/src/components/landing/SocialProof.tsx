export default function SocialProof() {
  const logos = [
    { name: "Brand 1", url: "https://framerusercontent.com/images/WWMCBTyiJptmzGSZcH82wUzJdk.svg" },
    { name: "Brand 2", url: "https://framerusercontent.com/images/dDxw8IGpaGwYdREDXbEjVNp9OPY.svg" },
    { name: "Brand 3", url: "https://framerusercontent.com/images/dMltwHCGTaFuvvDeauBbNw4VhiE.svg" },
    { name: "Brand 4", url: "https://framerusercontent.com/images/ib7QEOHnNoY5ZmEBYTIPQQuuY.svg" },
    { name: "Brand 5", url: "https://framerusercontent.com/images/CEP27u2CV5mni8P2MYdJREE8JiY.svg" },
    { name: "Brand 6", url: "https://framerusercontent.com/images/1la3JOHvXJ7sFkm0oA4c5kVwZ80.svg" },
    { name: "Brand 7", url: "https://framerusercontent.com/images/a4ImMXl9VpSeOL8aL5DT3KPWqU.svg" }
  ];

  return (
    <section className="bg-[#fcfcfc] border-y border-[#efefef] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#737373] mb-8">
          Trusted by Leading Teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.url}
              alt={logo.name}
              className="h-7 w-auto object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

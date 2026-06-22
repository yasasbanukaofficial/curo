export default function Integrations() {
  const integrations = [
    {
      name: "Notion",
      url: "https://framerusercontent.com/images/ZgXxR3CKKF25VVsat1eA3nXGjY.svg"
    },
    {
      name: "Slack",
      url: "https://framerusercontent.com/images/0Q0IGLZzXaXrHDbPTRJ4NM5rLc.svg"
    },
    {
      name: "Google Docs",
      url: "https://framerusercontent.com/images/2Y48bMNupJYF8v9ptfE6ldZ65KM.svg"
    },
    {
      name: "Confluence",
      url: "https://framerusercontent.com/images/1qT9Bfv2ldMNX0zFqO86xAFKjI.svg"
    },
    {
      name: "GitHub",
      url: "https://framerusercontent.com/images/ydNs0RPa4Qh4CHsHJSvjSWNri2c.svg"
    },
    {
      name: "Linear",
      url: "https://framerusercontent.com/images/GMCfpS0J5BMBHqJLpC8G88nWKKk.svg"
    }
  ];

  return (
    <section id="integrations" className="bg-[#fcfcfc] py-20 lg:py-28 border-b border-[#efefef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            Works with your existing tools
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Curo integrates with your existing tools, repos, and CI/CD pipeline — no migration required.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
          {integrations.map((tool, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-3 group cursor-default"
            >
              <div className="h-16 w-16 rounded-2xl border border-[#ededed] bg-white p-3.5 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-[#191919]/20 transition-all duration-300">
                <img
                  src={tool.url}
                  alt={tool.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-[#737373] group-hover:text-[#191919] transition-colors">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LearningHub() {
  const articles = [
    {
      title: "What is AQI?",
      description: "AQI (Air Quality Index) translates complex air quality data into numbers and colors to show health risks.",
      icon: "📚"
    },
    {
      title: "Health Effects of PM2.5",
      description: "Fine particles can enter deep into lungs and bloodstreams, causing respiratory and cardiovascular issues.",
      icon: "🫁"
    },
    {
      title: "Where Does Pollution Come From?",
      description: "Major sources include vehicular emissions, industrial smoke, construction dust, and burning biomass.",
      icon: "🏭"
    },
    {
      title: "The Role of Wind",
      description: "Wind helps disperse pollutants. Stagnant air (low wind) allows pollution to build up locally.",
      icon: "🌬️"
    }
  ];

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10">
      <h2 className="text-lg font-bold font-headline text-on-surface mb-2">📚 Awareness Hub</h2>
      <p className="text-xs text-on-surface-variant font-body mb-6">
        Learn about environmental factors and air quality science.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border border-outline-variant/10 bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
            <div className="text-3xl shrink-0 bg-surface-container-lowest w-12 h-12 flex flex-col items-center justify-center rounded-xl shadow-sm border border-outline-variant/5">
              {article.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface font-headline mb-1">{article.title}</h3>
              <p className="text-xs text-on-surface-variant font-body leading-relaxed">{article.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

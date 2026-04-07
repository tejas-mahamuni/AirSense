export default function SeasonalContext() {
  const month = new Date().getMonth() + 1;
  let emoji: string, title: string, description: string;

  if ([10, 11, 12, 1].includes(month)) {
    emoji = '❄️'; title = 'Winter Inversion Season';
    description = 'Historically worst months for air quality. Cold air trapping, crop burning, and low wind speeds combine to dramatically worsen pollution.';
  } else if ([2, 3].includes(month)) {
    emoji = '🌸'; title = 'Spring Transition';
    description = 'Air quality improving as temperatures rise and aid pollutant mixing. Spring rains help wash particulates from the atmosphere.';
  } else if ([6, 7, 8, 9].includes(month)) {
    emoji = '🌧️'; title = 'Monsoon Season';
    description = 'Rain scrubs the air clean — this is typically the best period for air quality. Expect consistently low AQI values.';
  } else {
    emoji = '☀️'; title = 'Pre-monsoon Heat';
    description = 'Rising temperatures and dry conditions lead to dust storms and ozone peaks. Watch PM10 and O3 levels closely.';
  }

  return (
    <div className="bg-surface-container-lowest rounded-[1.5rem] p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="font-semibold text-sm font-headline text-on-surface mb-1">{title}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed font-body">{description}</p>
        </div>
      </div>
    </div>
  );
}

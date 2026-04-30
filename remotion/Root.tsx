import { Composition } from "remotion";

import { WeeklyCampaignVideo } from "./WeeklyCampaignVideo";

export function RemotionRoot() {
  return (
    <Composition
      id="CampaignWeeklyVideo"
      component={WeeklyCampaignVideo}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        candidate: "Renato Araujo",
        headline: "Resumo semanal da campanha",
        metric: "8.7%",
      }}
    />
  );
}

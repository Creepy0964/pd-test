import { Context, Scenes } from "telegraf";

interface SessionData extends Scenes.WizardSession {
  question: number;
  anhedonia: number;
  anxiousness: number;
  attentionSeeking: number;
  callousness: number;
  deceitfulness: number;
  depressivity: number;
  distractibility: number;
  eccentricity: number;
  emotionalLability: number;
  grandiosity: number;
  hostility: number;
  impulsivity: number;
  intimacyAvoidance: number;
  irresponsibility: number;
  manipulativeness: number;
  perceptualDysregulation: number;
  perseveration: number;
  restrictedAffectivity: number;
  rigidPerfectionism: number;
  riskTaking: number;
  separationInsecurity: number;
  submissiveness: number;
  suspiciousness: number;
  unusualBeliefsExperiences: number;
  withdrawal: number;
}

export interface MyContext extends Context {
  scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<MyContext>;
  session: SessionData;
}

export type TrackDaw = "FL Studio" | "Cubase" | "Reason" | "Music Business";
export type GenreFocus = "Afro House" | "Amapiano" | "Electronic Dance Music" | "Music Rights & Business";
export type CourseDuration = 4 | 8 | 12 | 24;

export interface AssessmentRubricItem {
  criteria: string;
  weight: string;
  description: string;
}

export interface PracticalAssignment {
  title: string;
  instructions: string;
  deliverables: string[];
  estimatedHours: string;
}

export interface ToolStack {
  dawPlugins: string[];
  synthesizers: string[];
  samplesAndFx: string[];
}

export interface CurriculumModule {
  id: string;
  weekRange: string;
  title: string;
  objective: string;
  topics: string[];
  assignment: PracticalAssignment;
  tools: ToolStack;
  assessmentRubric: AssessmentRubricItem[];
}

export interface MusicBusinessModule {
  title: string;
  objective: string;
  topics: string[];
  practicalProject: string;
}

export interface WeeklyCommitment {
  lessons: string;
  workshops: string;
  practical: string;
  community: string;
  totalHours: string;
}

export interface Curriculum {
  id: string;
  title: string;
  subtitle: string;
  academyName: string;
  targetAudience: string;
  durationWeeks: CourseDuration;
  trackDaw: TrackDaw;
  genre: GenreFocus;
  deliveryFormat: string;
  weeklyCommitment: WeeklyCommitment;
  modules: CurriculumModule[];
  musicBusinessModule: MusicBusinessModule;
  markdownSyllabus: string;
  createdDate?: string;
}

export interface CourseParams {
  targetAudience: string;
  durationWeeks: CourseDuration;
  trackDaw: TrackDaw;
  genre: GenreFocus;
  focusArea: string;
  customNotes: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  tagline: string;
  trackDaw: TrackDaw;
  genre: GenreFocus;
  durationWeeks: CourseDuration;
  params: CourseParams;
  curriculum: Curriculum;
}

export interface GroovePreset {
  id: string;
  name: string;
  genre: GenreFocus;
  bpm: number;
  description: string;
}

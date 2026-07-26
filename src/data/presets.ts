import { PresetTemplate } from "../types";

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "fl-amapiano-4w",
    name: "4-Week Amapiano Producer Bootcamp",
    tagline: "Master Log Drums, Piano Chords & Groove Programming in FL Studio",
    trackDaw: "FL Studio",
    genre: "Amapiano",
    durationWeeks: 4,
    params: {
      targetAudience: "Beginner to Intermediate Producers & DJs",
      durationWeeks: 4,
      trackDaw: "FL Studio",
      genre: "Amapiano",
      focusArea: "Log Drum Sound Design, 3-Step Rhythms, SAMRO & DistroKid Release",
      customNotes: "Focus on FL Studio Channel Rack, Gross Beat, Fruity Parametric EQ 2, and Amapiano pitch bending."
    },
    curriculum: {
      id: "cur-amapiano-4w",
      title: "The Amapiano Producer's Launchpad: 4-Week FL Studio Bootcamp",
      subtitle: "From Rhythmic Foundations & Log Drum Design to Streaming Distribution",
      academyName: "Lukulu Academy & Recordings",
      targetAudience: "Beginner to Intermediate Producers, Beatmakers & DJs",
      durationWeeks: 4,
      trackDaw: "FL Studio",
      genre: "Amapiano",
      deliveryFormat: "Remote Blended Learning (Video Modules + Live Studio Workshops + Discord Peer Reviews)",
      weeklyCommitment: {
        lessons: "3 Hours Video Modules",
        workshops: "2 Hours Live FL Studio Breakouts",
        practical: "10-12 Hours Studio Practice",
        community: "2 Hours Peer Review & Feedback",
        totalHours: "17-19 Hours/Week"
      },
      modules: [
        {
          id: "mod-1",
          weekRange: "Week 1",
          title: "Foundation & Groove — FL Studio Workflow & Amapiano Drums",
          objective: "Master FL Studio Channel Rack and Piano Roll to assemble authentic Amapiano drum patterns, rimshots, shakers, and syncopated percussion.",
          topics: [
            "FL Studio Navigation: Channel Rack, Piano Roll shortcuts, Pattern Selector, and Playlist gain staging",
            "Amapiano Percussion Blueprint: Programming the signature 3-step shaker loops and off-beat cabasa patterns",
            "Drum Layering & Tuning: Combining organic kicks with crisp woodblocks, rimshots, and low-end percussion",
            "Quantization vs. Humanization: Applying subtle swing and velocity shifts for natural groove flow"
          ],
          assignment: {
            title: "8-Bar Amapiano Rhythm Foundation",
            instructions: "Create a clean 8-bar drum & percussion loop in FL Studio (112-115 BPM) containing kick, shaker loop, rimshot pattern, and cabasa accents with clean gain staging.",
            deliverables: ["FL Studio .flp Project File", "24-bit WAV Audio Render (Unmastered, -6dB headroom)"],
            estimatedHours: "8 Hours"
          },
          tools: {
            dawPlugins: ["FL Studio Channel Rack", "Fruity Parametric EQ 2", "Fruity Reeverb 2"],
            synthesizers: ["Fruity DX10", "FLEX (Amapiano Essential Presets)"],
            samplesAndFx: ["Lukulu Amapiano Drum Kit Vol. 1", "Percussive Shaker Loops", "Amapiano Rimshots"]
          },
          assessmentRubric: [
            { criteria: "Groove & Timing", weight: "30%", description: "Authentic Amapiano swing and syncopated shaker placement" },
            { criteria: "Mix Balance & Gain Staging", weight: "40%", description: "Clean headroom with no clipping or muddy frequencies" },
            { criteria: "Sound Selection", weight: "30%", description: "Genre-appropriate drum and percussion samples" }
          ]
        },
        {
          id: "mod-2",
          weekRange: "Week 2",
          title: "Log Drum Mastery & Harmonic Progression",
          objective: "Synthesize and program the iconically expressive Amapiano Log Drum using sub-bass synthesis, pitch slides, and jazzy chord extensions.",
          topics: [
            "Log Drum Sound Design: Understanding sub-oscillators, transient click layers, and pitch envelopes in FL Studio",
            "Piano Roll Pitch Bending: Executing smooth slides and glissando notes using FL Studio slide notes",
            "Jazz Harmonies for Amapiano: Constructing 7th, 9th, and minor 11th chord progressions using electric pianos",
            "Bass & Kick Coexistence: High-pass filtering chords and dynamic sidechain ducking in Fruity Limiter"
          ],
          assignment: {
            title: "1-Minute Log Drum & Chords Section Builder",
            instructions: "Develop your Week 1 groove by adding a custom Log Drum bassline with pitch slides, accompanied by a rich 4-bar electric piano chord progression.",
            deliverables: ["Updated FL Studio Project File", "Audio Render WAV", "Log Drum MIDI Clip"],
            estimatedHours: "10 Hours"
          },
          tools: {
            dawPlugins: ["Fruity Limiter (Sidechain mode)", "Fruity Stereo Shaper", "Fruity Delay 3"],
            synthesizers: ["FLEX (Log Drum Master Kit)", "Sytrus Sub-Bass", "Lounge Lizard EP"],
            samplesAndFx: ["Amapiano Log Drum Samples", "Rhodes EP Samples", "Saxophone FX Chops"]
          },
          assessmentRubric: [
            { criteria: "Log Drum Technique", weight: "40%", description: "Precise pitch slides, transient punch, and low-end clarity" },
            { criteria: "Harmonic Quality", weight: "35%", description: "Sophisticated jazz chords with proper voicing and smooth transitions" },
            { criteria: "Low-End Separation", weight: "25%", description: "Clear separation between kick drum and sub log drum frequencies" }
          ]
        },
        {
          id: "mod-3",
          weekRange: "Week 3",
          title: "Atmosphere, Arrangement & Vocal Chops",
          objective: "Transform short section loops into a full 4-minute club arrangement featuring tension builds, atmospheric sweeps, and vocal chops.",
          topics: [
            "Amapiano Track Structure: Intro (DJ Friendly), Rollout, Drop 1, Piano Breakdown, Drop 2, and Outro",
            "Arrangement in FL Studio Playlist: Automation clips for filter sweeps, volume swells, and Gross Beat stutter FX",
            "Vocal Chopping & Processing: Pitch-shifting, time-stretching, and processing vocal hooks with delay & reverb",
            "Transitions & FX: Crafting custom risers, reverse cymbals, log drum fills, and subtle drop pauses"
          ],
          assignment: {
            title: "Full 4-Minute Arrangement & Static Mixdown",
            instructions: "Arrange your track into a complete 3:30 - 4:30 arrangement in FL Studio. Apply automation clips, vocal chops, and build an initial static mix.",
            deliverables: ["Full Arrangement FLP File", "Stems Zip Archive", "Static Mix WAV Render"],
            estimatedHours: "12 Hours"
          },
          tools: {
            dawPlugins: ["FL Studio Playlist Automation Clips", "Gross Beat", "Fruity Chorus", "Fruity Parametric EQ 2"],
            synthesizers: ["Serum / Vital", "Patcher Custom FX Chains"],
            samplesAndFx: ["Amapiano Vocal FX", "Atmospheric Pads", "Riser & Impact FX"]
          },
          assessmentRubric: [
            { criteria: "Arrangement Flow & Energy", weight: "35%", description: "Seamless transitions between breakdown, builds, and drops" },
            { criteria: "Creative FX & Vocal Work", weight: "35%", description: "Tasteful use of Gross Beat, vocal chops, and filter sweeps" },
            { criteria: "Structural Balance", weight: "30%", description: "Adherence to club-ready DJ structure" }
          ]
        },
        {
          id: "mod-4",
          weekRange: "Week 4",
          title: "Polishing, Master Bus & Release Readiness",
          objective: "Apply dynamic mixing and mastering techniques in FL Studio, while preparing track metadata for global digital release.",
          topics: [
            "Advanced Mixing in FL Studio: Parallel compression on drums, stereo imaging on percussion, EQ notch filtering",
            "Mastering Bus Chain: Subtle bus compression, multiband stereo shaping, and transparent limiting to -14 LUFS",
            "Export Formats & File Delivery: 24-bit 44.1kHz WAV vs MP3 320kbps, stems export for label submission",
            "Release Strategy: Choosing digital distributors (DistroKid / TuneCore) and metadata preparation"
          ],
          assignment: {
            title: "Final Master & Release Pack Submission",
            instructions: "Submit your finalized, mastered Amapiano track alongside complete metadata (ISRC, title, artwork specs, split sheet) ready for submission.",
            deliverables: ["Mastered 24-bit WAV File", "Streaming MP3", "Complete Metadata & Split Sheet PDF"],
            estimatedHours: "12 Hours"
          },
          tools: {
            dawPlugins: ["Fruity Limiter / Maximus", "YOULEAN Loudness Meter", "Fruity Soft Clipper"],
            synthesizers: ["FL Studio Stock Master Chain"],
            samplesAndFx: ["Reference Tracks: Kabza De Small, Maphorisa, Kelvin Momo"]
          },
          assessmentRubric: [
            { criteria: "Final Mix & Mastering", weight: "40%", description: "Loudness target hit (-14 LUFS) without clipping or distortion" },
            { criteria: "Overall Musical Execution", weight: "40%", description: "Polished, commercial-standard Amapiano production quality" },
            { criteria: "Release Readiness", weight: "20%", description: "Complete file deliverables, stems, and accurate metadata" }
          ]
        }
      ],
      musicBusinessModule: {
        title: "From Studio to Stream: South African & Global Music Rights",
        objective: "Understand copyright ownership, Performance Rights Organizations (SAMRO, CAPASSO, SAMPRA), mechanical royalties, and distribution strategies.",
        topics: [
          "Music Copyright Essentials: Composition rights vs Sound Recording (Master) rights",
          "PRO Registrations: Setting up SAMRO (Songwriters), CAPASSO (Mechanicals), and SAMPRA (Master Performers)",
          "Split Sheets & Collaborations: Defining ownership percentages before track release",
          "Digital Distribution: Uploading to DistroKid/TuneCore with accurate ISRC codes and metadata"
        ],
        practicalProject: "Complete a official Lukulu Academy Track Metadata & SAMRO Split Sheet Registration Form for your final bootcamp release."
      },
      markdownSyllabus: `# Lukulu Academy & Recordings: 4-Week Amapiano Producer Bootcamp

## Overview
Transform from a beatmaker into a release-ready Amapiano artist using FL Studio. This 4-week intensive bootcamp covers drum programming, log drum sub-synthesis, jazz chord voicings, arrangement automation, and music publishing rights.

### Key Milestones
- **Week 1:** 8-Bar Amapiano Rhythm & Shaker Foundation
- **Week 2:** Log Drum Synthesis, Pitch Bends & Jazz Chords
- **Week 3:** 4-Minute Arrangement & Gross Beat Automation
- **Week 4:** Final Mix, Master Bus (-14 LUFS) & Release Pack

---
`
    }
  },
  {
    id: "cubase-afrohouse-8w",
    name: "8-Week Afro House Production & Sound Design",
    tagline: "Master Polyrhythms, Organic Synthesis & Mixing in Steinberg Cubase",
    trackDaw: "Cubase",
    genre: "Afro House",
    durationWeeks: 8,
    params: {
      targetAudience: "Intermediate Producers & Sound Engineers",
      durationWeeks: 8,
      trackDaw: "Cubase",
      genre: "Afro House",
      focusArea: "Cubase MixConsole, Organic Polyrhythms, Analog Synth Textures & Sync Licensing",
      customNotes: "In-depth Cubase Control Room, VariAudio, Groove Agent SE, Padshop, Retrologue 2."
    },
    curriculum: {
      id: "cur-afrohouse-8w",
      title: "Afro House Architect: 8-Week Cubase Production & Mix Academy",
      subtitle: "Deep Polyrhythmic Percussion, Atmospheric Analog Synthesis & Commercial Mix Standards",
      academyName: "Lukulu Academy & Recordings",
      targetAudience: "Intermediate Producers, Electronic Musicians & Sound Engineers",
      durationWeeks: 8,
      trackDaw: "Cubase",
      genre: "Afro House",
      deliveryFormat: "Hybrid Online Academy (Structured Video Lessons + Weekly Live Masterclasses + Master Stem Reviews)",
      weeklyCommitment: {
        lessons: "4 Hours Video Content",
        workshops: "2 Hours Live Cubase Mix Workshops",
        practical: "12-15 Hours Studio Project Work",
        community: "2 Hours Peer & Instructor Stem Reviews",
        totalHours: "20-23 Hours/Week"
      },
      modules: [
        {
          id: "mod-1",
          weekRange: "Weeks 1-2",
          title: "Polyrhythmic Percussion & Cubase Groove Agent SE",
          objective: "Harness Steinberg Cubase's Groove Agent SE and Quantize panel to program complex 3-against-2 Afro House percussion layerings, congas, and shaker beds.",
          topics: [
            "Cubase Project Setup: Sample rate, 32-bit float processing, Control Room setup, and track routing",
            "Afro House Polyrhythms: Programming 3-against-2 and 6/8 polyrhythmic patterns with organic feeling",
            "Groove Agent SE & Sample Layering: Tuning percussive heads, adjusting decay envelopes, velocity randomization",
            "Stereo Field & Panning: Panning congas, bongos, and shakers to create wide, immersive rhythmic pockets"
          ],
          assignment: {
            title: "16-Bar Polyrhythmic Afro House Rhythm Core",
            instructions: "Construct an intricate 16-bar Afro House percussion groove in Cubase (120-123 BPM) featuring kick, woodblock, layer congas, shakers, and rimshots with custom velocity humanization.",
            deliverables: ["Cubase Project File (.cpr)", "24-bit Multi-Track Stems", "Group Bus Audio Render"],
            estimatedHours: "14 Hours"
          },
          tools: {
            dawPlugins: ["Groove Agent SE", "Frequency EQ", "Cubase Envelope Shaper"],
            synthesizers: ["Padshop 2", "Retrologue 2"],
            samplesAndFx: ["Lukulu Afro House Tribal Percussion Kit", "Organic Live Conga Samples"]
          },
          assessmentRubric: [
            { criteria: "Polyrhythmic Complexity", weight: "40%", description: "Intricate interplay between 3/4 and 4/4 syncopated elements" },
            { criteria: "Frequency Balance", weight: "30%", description: "Clean low-mid separation between kick and conga resonance" },
            { criteria: "Dynamic Velocity", weight: "30%", description: "Natural, non-robotic feel across percussion layers" }
          ]
        },
        {
          id: "mod-2",
          weekRange: "Weeks 3-4",
          title: "Warm Analog Bass, Pads & Vocal Harmonies",
          objective: "Design deep, resonant Afro House sub-bass and lush organic pads in Retrologue 2 & Padshop 2, complemented by vocal pitch correction in VariAudio.",
          topics: [
            "Sub-Bass & Synth Lead Design: Crafting warm analog bass patches in Retrologue 2 with subtle drive",
            "Granular Pad Textures: Using Padshop 2 to convert organic soundscapes into evolving atmospheric pads",
            "VariAudio Vocal Editing: Pitch-correcting, time-aligning, and creating spiritual Afro House vocal harmonies",
            "Harmonic Modulations: Modulating filter cutoffs with LFOs to maintain evolving interest over extended sections"
          ],
          assignment: {
            title: "2-Minute Afro House Musical Core with Vocals",
            instructions: "Combine your Week 1-2 drums with a rich Retrologue 2 bassline, Padshop pad, and a processed VariAudio vocal hook.",
            deliverables: ["Cubase CPR File", "Vocal Stem WAV", "Audio Preview Mix"],
            estimatedHours: "16 Hours"
          },
          tools: {
            dawPlugins: ["Cubase VariAudio", "REVerence Convolution Reverb", "Squasher Multiband FX"],
            synthesizers: ["Retrologue 2", "Padshop 2", "HALion Sonic SE"],
            samplesAndFx: ["Spiritual Afro House Vocal Chops", "African Flute Samples"]
          },
          assessmentRubric: [
            { criteria: "Vocal Processing Quality", weight: "35%", description: "Natural pitch correction and rich spatial reverb tail" },
            { criteria: "Synthesizer Sound Design", weight: "35%", description: "Warm, non-harsh bass and atmospheric pad depth" },
            { criteria: "Arrangement Coherence", weight: "30%", description: "Harmonic alignment between bass, pads, and vocal scale" }
          ]
        },
        {
          id: "mod-3",
          weekRange: "Weeks 5-6",
          title: "Extended Club Arrangements & Cubase MixConsole",
          objective: "Structure extended 6-minute Afro House club mixes utilizing Cubase's MixConsole routing, VCA faders, and dynamic sidechain compression.",
          topics: [
            "Afro House Club Structure: Extended 16-bar intro for DJs, main breakdown, spiritual drop, second breakdown, and outro",
            "Cubase MixConsole Routing: Setting up Group Tracks, FX Channels, VCA Faders, and Parallel Compressors",
            "Dynamic Sidechaining: Ducking bass and pads against kick and snare using Cubase Compressor sidechain input",
            "Automating Spatial FX: Creating dramatic buildup moments with automated REVerence delay throws"
          ],
          assignment: {
            title: "Extended 6-Minute Club Mix & Group Stem Mixdown",
            instructions: "Deliver a full 6-minute club arrangement in Cubase with complete MixConsole bus routing, automation, and stem exports.",
            deliverables: ["Cubase Project CPR", "Drums, Bass, Synth, FX, Vocal Stems", "Static Mixdown WAV"],
            estimatedHours: "18 Hours"
          },
          tools: {
            dawPlugins: ["Cubase MixConsole", "VCA Faders", "Frequency 2 Dynamic EQ", "PingPong Delay"],
            synthesizers: ["Retrologue 2", "Padshop 2"],
            samplesAndFx: ["Atmospheric Shaker Loops", "Club FX Impacts & Sweeps"]
          },
          assessmentRubric: [
            { criteria: "Club Structure & Flow", weight: "35%", description: "DJ-friendly build-ups, breakdowns, and energy progression" },
            { criteria: "MixConsole Bus Architecture", weight: "35%", description: "Proper grouping, gain staging, and dynamic sidechaining" },
            { criteria: "Spatial & Depth Control", weight: "30%", description: "3D soundstage created through panning, reverb, and delay" }
          ]
        },
        {
          id: "mod-4",
          weekRange: "Weeks 7-8",
          title: "Stem Mastering, Metadata & International Music Rights",
          objective: "Finalize high-resolution stem masters and navigate global publishing, performance rights, and sync licensing opportunities for Afro House.",
          topics: [
            "Stem Mastering Techniques: Applying bus processing to group stems for punch, clarity, and stereo control",
            "Loudness & Dynamics: Mastering to -12 to -14 LUFS with minimal distortion using Cubase MasterRig",
            "Global Music Rights & Sync: Publishing deals, sync licensing for film/commercials, and international PRO collection",
            "Label Submission Strategy: Pitching demo tracks to premier Afro House labels (Keinemusik, Black Coffee's Soulistic, Defected)"
          ],
          assignment: {
            title: "Final Master & Professional Pitch Package",
            instructions: "Provide a 24-bit 44.1kHz WAV master, stems, electronic press kit (EPK) draft, and SAMRO/PRS split sheet.",
            deliverables: ["Mastered WAV Track", "Full Stem Archive", "Demo Pitch PDF with EPK & Split Sheet"],
            estimatedHours: "18 Hours"
          },
          tools: {
            dawPlugins: ["Cubase MasterRig", "LinVG Limiter", "SuperVision Metering"],
            synthesizers: ["Mastering Bus Chain"],
            samplesAndFx: ["Reference Tracks: Black Coffee, Shimza, Keinemusik, Sun-El Musician"]
          },
          assessmentRubric: [
            { criteria: "Mastering Clarity & Loudness", weight: "40%", description: "Optimal commercial punch and spectral balance" },
            { criteria: "Stem Completeness", weight: "30%", description: "Clean, aligned, clip-free stem export" },
            { criteria: "Industry Pitch Package", weight: "30%", description: "Professional EPK, metadata, and copyright split documentation" }
          ]
        }
      ],
      musicBusinessModule: {
        title: "Afro House Global Export & Licensing",
        objective: "Master global publishing administration, sync licensing pitching, mechanical rights, and performance royalty collection.",
        topics: [
          "International PROs: Registering songs across SAMRO, PRS, ASCAP, and BMI",
          "Sync Licensing: Pitching electronic music to Netflix, games, and commercial sync libraries",
          "Record Contracts: Understanding licensing vs master ownership deals with independent record labels",
          "Metadata Precision: Encoding ISRC, UPC, writer CAE/IPI numbers, and publisher splits"
        ],
        practicalProject: "Create an International Sync Licensing Pitch Sheet and complete PRO Registration Document for your track."
      },
      markdownSyllabus: `# Lukulu Academy & Recordings: 8-Week Afro House Master Academy

## Overview
An intensive 8-week program for intermediate producers mastering Steinberg Cubase, polyrhythmic drum design, analog synthesis, VariAudio vocal tuning, and global music publishing.

### Key Milestones
- **Weeks 1-2:** 16-Bar Polyrhythmic Percussion in Groove Agent SE
- **Weeks 3-4:** Retrologue 2 Bass & VariAudio Vocal Harmony
- **Weeks 5-6:** 6-Minute Extended Club Mix & MixConsole VCA Routing
- **Weeks 7-8:** Stem Mastering (-12 LUFS), EPK & International Sync Pitch
`
    }
  },
  {
    id: "reason-edm-12w",
    name: "12-Week Reason EDM Electronic Masterclass",
    tagline: "Master Complex Synthesis, Modular Routing & Mainstage Sound in Propellerhead Reason",
    trackDaw: "Reason",
    genre: "Electronic Dance Music",
    durationWeeks: 12,
    params: {
      targetAudience: "Producers & Electronic Sound Designers",
      durationWeeks: 12,
      trackDaw: "Reason",
      genre: "Electronic Dance Music",
      focusArea: "Reason Rack Modular Routing, Combinators, Thor Synthesis, Mainstage EDM Sound Design",
      customNotes: "In-depth Reason Rack Extensions, Kong Drum Designer, RV7000 Reverb, Scream 4 Distortion."
    },
    curriculum: {
      id: "cur-edm-12w",
      title: "Electronic Sound Architect: 12-Week Reason EDM Masterclass",
      subtitle: "Modular Synth Routing, Mainstage Sound Design, Complex Drops & Global Touring Rights",
      academyName: "Lukulu Academy & Recordings",
      targetAudience: "Producers, Electronic Composers & Sound Designers",
      durationWeeks: 12,
      trackDaw: "Reason",
      genre: "Electronic Dance Music",
      deliveryFormat: "Comprehensive Online Studio Academy (Video Modules + Live Modular Patching Labs + Stem Critiques)",
      weeklyCommitment: {
        lessons: "4 Hours Video Modules",
        workshops: "2.5 Hours Live Reason Rack Patching Labs",
        practical: "14-16 Hours Studio Design",
        community: "2.5 Hours Feedback & Mod Patch Swaps",
        totalHours: "23-27 Hours/Week"
      },
      modules: [
        {
          id: "mod-1",
          weekRange: "Weeks 1-3",
          title: "The Reason Rack & High-Impact EDM Drum Design",
          objective: "Master Reason's flip-rack CV/Gate routing, Kong Drum Designer, and micro-editing to engineer thunderous EDM kicks, snares, and top-loop energy.",
          topics: [
            "Reason Rack Essentials: Cables, Control Voltage (CV), Gate routing, and Combinator 2 building",
            "EDM Drum Architecture: Designing punchy sub-kicks and transient top-kicks using Kong and SubTractor",
            "Snare Layering & Processing: Gated reverbs, pitch-stretching, and Scream 4 Tape Distortion",
            "Micro-Quantize & Fill Design: Creating double-time snare builds and pitch-dropping drum rolls"
          ],
          assignment: {
            title: "EDM Mainstage Drum & Build Engine",
            instructions: "Build a custom Combinator 2 instrument containing a complete Kong EDM drum kit with custom CV modulation and a 16-bar build-up drum section.",
            deliverables: ["Reason Song File (.reason)", "Combinator Patch File (.cmb)", "Drum Stems WAV"],
            estimatedHours: "18 Hours"
          },
          tools: {
            dawPlugins: ["Reason Rack", "Kong Drum Designer", "Scream 4 Distortion", "RV7000 MKII"],
            synthesizers: ["Thor Polyphonic Synthesizer", "SubTractor", "Grain Sample Manipulator"],
            samplesAndFx: ["Lukulu EDM Mainstage Sample Pack", "White Noise Sweeps"]
          },
          assessmentRubric: [
            { criteria: "Drum Punch & Low-End Control", weight: "40%", description: "Kick transient clarity and sub-bass weight without boominess" },
            { criteria: "Modular Patching Efficiency", weight: "35%", description: "Clean, intelligent CV/Gate routing inside the Reason Rack" },
            { criteria: "Combinator UX & Controls", weight: "25%", description: "Well-mapped macro controls for live performance" }
          ]
        },
        {
          id: "mod-2",
          weekRange: "Weeks 4-6",
          title: "Complex Synthesis — Thor, Europa & Supersaw Lead Design",
          objective: "Harness Thor and Europa wave-building synthesis to create colossal supersaw leads, FM drop basses, and vocal synth chops.",
          topics: [
            "Wavetable & FM Synthesis in Europa: Custom wavetables, spectral filter shaping, and envelope modulation",
            "Thor Multi-Oscillator Patching: Combining wavetable, phase modulation, and analog oscillators for massive supersaws",
            "Stereo Width & Unison: Layering multi-voiced synths with chorus, micro-detuning, and Haas delay",
            "Sidechain Ducking in Reason: Setting up MClass Compressor sidechain input triggered by kick CV"
          ],
          assignment: {
            title: "Mainstage EDM Lead & Synth Drop Section",
            instructions: "Design a 32-bar EDM drop featuring custom Thor/Europa supersaw leads, heavy FM sub-bass, and sidechain compression.",
            deliverables: ["Reason Project File", "Synthesizer CMB Patches", "Drop Audio Render WAV"],
            estimatedHours: "20 Hours"
          },
          tools: {
            dawPlugins: ["MClass Compressor", "CF101 Chorus", "Sweeper Modulation Effect"],
            synthesizers: ["Thor", "Europa Wavetable Synth", "Complex 1 Modular Synth"],
            samplesAndFx: ["EDM Vocal Chops", "Impact Drums"]
          },
          assessmentRubric: [
            { criteria: "Synthesis Craftsmanship", weight: "40%", description: "Rich, cutting lead sounds without harsh high frequencies" },
            { criteria: "Sidechain Pumping Action", weight: "35%", description: "Rhythmic pumping that creates breathing room for the kick" },
            { criteria: "Sonic Energy & Width", weight: "25%", description: "Wide stereo image with solid mono compatibility" }
          ]
        },
        {
          id: "mod-3",
          weekRange: "Weeks 7-9",
          title: "Full Arrangement, Tension Dynamics & Vocal Processing",
          objective: "Construct a dynamic 3:30 festival-ready EDM track featuring euphoric breakdowns, automated risers, and vocal lead hooks.",
          topics: [
            "EDM Song Structure: Intro, Verse, Euphoric Build, Main Drop, Mid-Breakdown, Second Drop, Outro",
            "Reason Sequencer Automation: Automating filter cutoffs, reverb wetness, pitch bends, and tempo ramps",
            "Vocal Tuning & Harmonizer: Using Reason Pitch Edit to align vocals and construct 3-part vocal stacks",
            "Tension & Release Mechanics: Using risers, noise sweeps, pitch-shifted impacts, and silence gaps"
          ],
          assignment: {
            title: "Complete 3:30 Festival Track Arrangement",
            instructions: "Deliver a complete festival-ready EDM track arrangement in Reason with automation, breakdown vocals, and high-impact drops.",
            deliverables: ["Full Reason Song File", "Unmastered Mixdown WAV (-6dB headroom)", "Automation Overview Document"],
            estimatedHours: "22 Hours"
          },
          tools: {
            dawPlugins: ["Reason Pitch Edit", "Alligator Triple Filter", "Pulveriser Demolition Unit"],
            synthesizers: ["Thor", "Europa", "Radical Piano"],
            samplesAndFx: ["Vocal Lead Stems", "Riser Sweep FX"]
          },
          assessmentRubric: [
            { criteria: "Tension & Release Balance", weight: "40%", description: "Emotional breakdown leading into explosive drop payoff" },
            { criteria: "Vocal Pitch & Alignment", weight: "30%", description: "In-key vocal tuning and tight timing" },
            { criteria: "Arrangement Polish", weight: "30%", description: "Professional song transitions with zero drop in energy" }
          ]
        },
        {
          id: "mod-4",
          weekRange: "Weeks 10-12",
          title: "Commercial Mixing, Loudness Mastering & Global DJ Rights",
          objective: "Mix and master EDM tracks for club sound systems (-8 to -10 LUFS) and understand global festival performance royalties, PRO registration, and label submission.",
          topics: [
            "EDM Mixing Protocols: Dynamic EQ for mid-range clash, multiband compression, and stereo low-end monoing",
            "Loudness Mastering: Pushing peak limiters for competitive commercial loudness without crushing transients",
            "Global Festival Royalties: How DJs report setlists to collecting societies (ASCAP, BMI, GEMA, SAMRO) for performance payout",
            "Release Planning: Pitching to premier EDM labels (Spinnin', Monstercat, Revealed, Armada)"
          ],
          assignment: {
            title: "Commercial Master, Stems & Global Label Pitch Package",
            instructions: "Submit your final mastered track (-9 LUFS), complete stems, press kit, and PRO setlist registration documentation.",
            deliverables: ["Mastered 24-bit WAV & MP3", "Full Stem Archive", "Global Label Submission Pitch Sheet"],
            estimatedHours: "24 Hours"
          },
          tools: {
            dawPlugins: ["MClass Master Suite", "Selig Gain", "Master Bus Compressor"],
            synthesizers: ["Reason Master Rack"],
            samplesAndFx: ["Reference Tracks: Martin Garrix, Avicii, David Guetta, Tiësto"]
          },
          assessmentRubric: [
            { criteria: "Commercial Loudness & Punch", weight: "40%", description: "Loud, impactful mix that translates clean to massive sound systems" },
            { criteria: "Frequency & Clarity", weight: "35%", description: "Zero distortion or harshness even at peak club volumes" },
            { criteria: "Rights & Pitch Preparation", weight: "25%", description: "Thorough label pitch, metadata, and performance royalty setup" }
          ]
        }
      ],
      musicBusinessModule: {
        title: "Mainstage Touring, Festival Setlists & Performance Royalties",
        objective: "Understand live performance royalty collection, DJ setlist reporting, international publishing administration, and electronic record deals.",
        topics: [
          "DJ Setlist Royalties: How writers collect performance royalties when DJs play their tracks at festivals",
          "International Collection Societies: ASCAP, BMI, PRS, GEMA, SACEM, and SAMRO cross-border flows",
          "Remix Rights & Clearances: Master clearances vs Bootlegs vs Official Label Remixes",
          "Recording Contracts: Option clauses, royalty rates (15-50%), and advance recoupment"
        ],
        practicalProject: "Prepare an Official Track Clearance & DJ Setlist Reporting File for International Performance Royalty Submission."
      },
      markdownSyllabus: `# Lukulu Academy & Recordings: 12-Week Reason EDM Masterclass

## Overview
A comprehensive 12-week diploma program in Propellerhead Reason covering modular rack patching, Thor & Europa synthesis, mainstage drop dynamics, club loudness mastering (-9 LUFS), and global DJ setlist performance royalties.

### Key Milestones
- **Weeks 1-3:** Kong Drum Architecture & Flip-Rack CV Routing
- **Weeks 4-6:** Thor & Europa Supersaw Synthesis & Sidechain Setup
- **Weeks 7-9:** Festival Track Arrangement & Vocal Tuning
- **Weeks 10-12:** Mainstage Master (-9 LUFS) & Global Label Pitch Pack
`
    }
  },
  {
    id: "music-biz-24w",
    name: "24-Week Music Rights & Record Executive Academy",
    tagline: "Comprehensive Diploma in Music Business, Copyright, Publishing & Label Operations",
    trackDaw: "Music Business",
    genre: "Music Rights & Business",
    durationWeeks: 24,
    params: {
      targetAudience: "Independent Artists, Music Managers, Label Owners & Music Executives",
      durationWeeks: 24,
      trackDaw: "Music Business",
      genre: "Music Rights & Business",
      focusArea: "Copyright Law, PRO Registration, Publishing Administration, Distribution, Sync Licensing, Record Label Operations",
      customNotes: "Full 6-month executive diploma with real contract drafting, split sheets, royalty audits, and release campaigns."
    },
    curriculum: {
      id: "cur-biz-24w",
      title: "Executive Diploma in Music Business & Global Copyright Administration",
      subtitle: "Copyright Law, Royalty Accounting, Publishing, Sync Licensing & Label Management",
      academyName: "Lukulu Academy & Recordings",
      targetAudience: "Independent Artists, Record Label Executives, Managers & Music Lawyers",
      durationWeeks: 24,
      trackDaw: "Music Business",
      genre: "Music Rights & Business",
      deliveryFormat: "Executive Hybrid Online Academy (Live Seminars + Case Study Audits + Contract Workshops)",
      weeklyCommitment: {
        lessons: "5 Hours Executive Seminars",
        workshops: "3 Hours Contract & Legal Workshops",
        practical: "10 Hours Case Studies & Audits",
        community: "2 Hours Industry Networking",
        totalHours: "20 Hours/Week"
      },
      modules: [
        {
          id: "mod-1",
          weekRange: "Weeks 1-6",
          title: "Foundations of Music Copyright & Intellectual Property Law",
          objective: "Master the twin pillars of music copyright: Musical Works (Composition/Publishing) vs Sound Recordings (Master Rights), registration protocols, and moral rights.",
          topics: [
            "Dual Copyright Architecture: Section 101 laws, underlying composition vs master recording",
            "Moral & Economic Rights: Paternity rights, integrity rights, public performance, mechanical, and adaptation rights",
            "Copyright Registration: Registering with national copyright offices, SAMRO, ASCAP, BMI, and PRS",
            "Infringement & Fair Use: Sampling legalities, interpolations, copyright infringement lawsuits (blurred lines case studies)"
          ],
          assignment: {
            title: "Comprehensive Copyright Registration & Audit Report",
            instructions: "Conduct a full copyright audit of a 5-track EP, classifying composition vs master rights, registering metadata, and identifying potential clearance risks.",
            deliverables: ["Copyright Audit PDF", "Metadata Manifest Spreadsheet", "Sample Clearance Request Letters"],
            estimatedHours: "20 Hours"
          },
          tools: {
            dawPlugins: ["Copyright Registration Portals", "SAMRO Online Portal", "US Copyright Office"],
            synthesizers: ["Contract Generator Suite"],
            samplesAndFx: ["Standard Music Legal Contracts"]
          },
          assessmentRubric: [
            { criteria: "Legal Accuracy", weight: "40%", description: "Precise distinction between composition and master rights" },
            { criteria: "Risk Identification", weight: "35%", description: "Thorough analysis of sample clearance and interpolation liabilities" },
            { criteria: "Documentation Quality", weight: "25%", description: "Professional legal and administrative formatting" }
          ]
        },
        {
          id: "mod-2",
          weekRange: "Weeks 7-12",
          title: "Publishing Administration, PROs & Royalty Accounting",
          objective: "Understand performance rights organizations (SAMRO, ASCAP, BMI, CAPASSO, Mechanical Rights), publisher split deals, and royalty accounting.",
          topics: [
            "PRO Architecture: How performance royalties are collected from radio, TV, clubs, and live venues",
            "Mechanical Royalties & Statutory Rates: Physical sales, digital downloads, and interactive streaming mechanicals",
            "Publishing Deal Structures: Full Publishing, Co-Publishing (50/50), and Administration Deals (10-15% fee)",
            "Royalty Accounting & Statement Audits: Recoupment calculations, advance structures, reserves, and audit rights"
          ],
          assignment: {
            title: "Royalty Statement Audit & Publishing Contract Drafting",
            instructions: "Audit a complex 6-month streaming royalty statement, calculate artist vs publisher net payouts, and draft a Co-Publishing Agreement.",
            deliverables: ["Audited Financial Statement Excel", "Co-Publishing Agreement Contract PDF", "Executive Audit Summary"],
            estimatedHours: "24 Hours"
          },
          tools: {
            dawPlugins: ["Royalty Accounting Software (Excel/Airtable)", "CAPASSO Mechanical Portal"],
            synthesizers: ["Publishing Calculator"],
            samplesAndFx: ["Sample Royalty Statements"]
          },
          assessmentRubric: [
            { criteria: "Mathematical & Accounting Accuracy", weight: "45%", description: "Flawless calculation of advances, recoupment, and net splits" },
            { criteria: "Contract Drafting Rigor", weight: "35%", description: "Enforceable legal clauses protecting writer and publisher rights" },
            { criteria: "Executive Presentation", weight: "20%", description: "Clear executive summary for board/investor presentation" }
          ]
        },
        {
          id: "mod-3",
          weekRange: "Weeks 13-18",
          title: "Record Label Operations, Contracts & Digital Distribution",
          objective: "Run an independent record label: master licensing deals, digital distribution logistics (DistroKid, TuneCore, FUGA), ISRC/UPC encoding, and marketing campaigns.",
          topics: [
            "Record Deal Models: Traditional Master Deals, 360 Deals, Licensing Agreements, and Profit-Split Deals",
            "Distribution Pipeline: Supply chain from aggregator (FUGA/DistroKid) to DSPs (Spotify, Apple Music, YouTube Music)",
            "Metadata Integrity: ISRC, UPC, ISWC, songwriter IPI numbers, and playlist pitching metadata",
            "Digital Marketing & DSP Pitching: Editorial playlist pitching, social media strategy, TikTok virality, and EPKs"
          ],
          assignment: {
            title: "Label Release Campaign & Master Licensing Agreement",
            instructions: "Formulate a complete 8-week release campaign for a single, draft an Artist Master Licensing Contract, and design a DSP pitch deck.",
            deliverables: ["Release Campaign Timeline PDF", "Master Licensing Contract", "DSP Pitch Deck Presentation"],
            estimatedHours: "26 Hours"
          },
          tools: {
            dawPlugins: ["Spotify for Artists", "Apple Music for Artists", "Chartmetric / Soundcharts"],
            synthesizers: ["ISRC Generator"],
            samplesAndFx: ["EPK Templates", "Label Pitch Decks"]
          },
          assessmentRubric: [
            { criteria: "Strategic Marketing Scope", weight: "40%", description: "Realistic, high-impact marketing timeline and budget allocation" },
            { criteria: "Contract Validity", weight: "35%", description: "Comprehensive master licensing contract with exit clauses" },
            { criteria: "Data Analytics Usage", weight: "25%", description: "Use of analytics tools to target audience demographics" }
          ]
        },
        {
          id: "mod-4",
          weekRange: "Weeks 19-24",
          title: "Sync Licensing, Global Business Operations & Capstone Project",
          objective: "Pitch music for film, television, games, and advertising, negotiate sync fee structures, and defend a complete Music Business Capstone Project.",
          topics: [
            "Sync Licensing Mechanics: Master Use License + Synchronization License pairing",
            "Pricing & Negotiation: Standard sync fees for indie films, TV series, AAA video games, and national TV commercials",
            "Sync Clearance Fast-Tracking: Pre-cleared instrumental mixes, stems, and unencumbered ownership structures",
            "Capstone Defense: Presenting a fully operational record label launch plan or music publishing company business model"
          ],
          assignment: {
            title: "Executive Capstone Project — Record Label or Publishing Enterprise Launch",
            instructions: "Deliver a 30-page executive business proposal detailing legal entity setup, artist roster contracts, 3-year financial forecasts, and international rights strategy.",
            deliverables: ["Executive Business Plan PDF", "Sync Licensing Catalogue Pitch", "Live Defense Presentation Slides"],
            estimatedHours: "35 Hours"
          },
          tools: {
            dawPlugins: ["Sync Licensing Portals (Disco.ac)", "Financial Forecasting Models"],
            synthesizers: ["Executive Capstone Suite"],
            samplesAndFx: ["Licensing Agreement Templates"]
          },
          assessmentRubric: [
            { criteria: "Business Feasibility & Financials", weight: "40%", description: "Sound financial forecasting and realistic revenue streams" },
            { criteria: "Legal Rigor & Protection", weight: "35%", description: "Bulletproof contract architecture across roster agreements" },
            { criteria: "Executive Presentation", weight: "25%", description: "Mastery demonstrated during live capstone defense" }
          ]
        }
      ],
      musicBusinessModule: {
        title: "Executive Business Administration & Global Royalty Portfolio",
        objective: "Manage multi-jurisdictional copyright portfolios, international royalty collection, tax withholding treaties, and sync catalogue licensing.",
        topics: [
          "Cross-Border Royalty Taxation: Double taxation treaties, US W-8BEN forms, and international withholding taxes",
          "Catalog Valuations: Evaluating music catalogues for buyout acquisitions (Multiple of Net Publisher Share)",
          "Neighbouring Rights: SoundExchange, PPL UK, SAMPRA, and global performer royalty collection",
          "Web3 & Direct-to-Fan: Smart contract royalties, music NFTs, and decentralized publishing"
        ],
        practicalProject: "Build an Audited 3-Year Music Catalogue Valuation Model & Global Royalty Collection Architecture."
      },
      markdownSyllabus: `# Lukulu Academy & Recordings: 24-Week Executive Music Business Diploma

## Overview
A premier 24-week executive diploma covering copyright law, PRO administration (SAMRO, ASCAP, BMI, PRS), royalty statement auditing, master licensing contracts, sync placement, and independent record label operations.

### Key Milestones
- **Weeks 1-6:** Copyright Law & Dual Asset Audit
- **Weeks 7-12:** Publishing Administration & Royalty Statement Audit
- **Weeks 13-18:** Record Label Operations & Master Licensing Contracts
- **Weeks 19-24:** Sync Licensing & Executive Capstone Business Plan Defense
`
    }
  }
];

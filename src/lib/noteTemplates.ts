export interface NoteTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  content: string
  tags: string[]
}

export const noteTemplates: NoteTemplate[] = [
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Structure for productive meeting documentation',
    category: 'Business',
    icon: '🏢',
    content: `# Meeting Notes - [Date]

## Attendees
- 

## Agenda
- 

## Key Discussion Points
- 

## Action Items
- [ ] 
- [ ] 

## Next Steps
- 

## Notes
`,
    tags: ['meeting', 'business', 'work']
  },
  {
    id: 'project-planning',
    name: 'Project Planning',
    description: 'Comprehensive project planning template',
    category: 'Planning',
    icon: '📋',
    content: `# Project: [Project Name]

## Overview
**Goal:** 
**Timeline:** 
**Budget:** 

## Objectives
- 

## Key Stakeholders
- 

## Milestones
- [ ] 
- [ ] 
- [ ] 

## Resources Needed
- 

## Risks & Mitigation
- **Risk:** 
  **Mitigation:** 

## Success Metrics
- 

## Notes
`,
    tags: ['project', 'planning', 'work']
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    description: 'Reflect on your day and plan ahead',
    category: 'Personal',
    icon: '📔',
    content: `# Daily Journal - [Date]

## How I'm Feeling
😊 😐 😔 😴 😤

## Today's Highlights
- 

## Challenges Faced
- 

## What I Learned
- 

## Grateful For
- 

## Tomorrow's Focus
- 

## Random Thoughts
`,
    tags: ['journal', 'personal', 'reflection']
  },
  {
    id: 'book-notes',
    name: 'Book Notes',
    description: 'Capture insights from your reading',
    category: 'Learning',
    icon: '📚',
    content: `# Book Notes: [Book Title]

**Author:** 
**Genre:** 
**Rating:** ⭐⭐⭐⭐⭐
**Date Read:** 

## Summary
Brief overview of the book's main points.

## Key Insights
- 
- 
- 

## Favorite Quotes
> "Quote here"

> "Another quote here"

## Action Items
- [ ] 
- [ ] 

## Personal Reflection
What did this book teach me? How will I apply these insights?

## Recommendation
Would I recommend this book? To whom?
`,
    tags: ['book', 'reading', 'learning', 'notes']
  },
  {
    id: 'research-notes',
    name: 'Research Notes',
    description: 'Organize research findings and sources',
    category: 'Academic',
    icon: '🔬',
    content: `# Research Notes: [Topic]

## Research Question
What am I trying to find out?

## Hypothesis
What do I expect to find?

## Sources
1. [Source Title](URL) - Author, Date
2. [Source Title](URL) - Author, Date

## Key Findings
- **Finding 1:** Description and source
- **Finding 2:** Description and source
- **Finding 3:** Description and source

## Evidence
### Supporting Evidence
- 

### Contradicting Evidence
- 

## Conclusions
Based on the research, what can I conclude?

## Next Steps
- [ ] 
- [ ] 

## Bibliography
`,
    tags: ['research', 'academic', 'study']
  },
  {
    id: 'travel-planning',
    name: 'Travel Planning',
    description: 'Plan your perfect trip',
    category: 'Travel',
    icon: '✈️',
    content: `# Travel Plan: [Destination]

## Trip Details
**Dates:** 
**Duration:** 
**Budget:** 
**Travelers:** 

## Itinerary
### Day 1
- 

### Day 2
- 

### Day 3
- 

## Accommodations
**Hotel/Airbnb:** 
**Address:** 
**Check-in:** 
**Check-out:** 

## Transportation
- **Flights:** 
- **Local transport:** 
- **Car rental:** 

## Must-See Attractions
- [ ] 
- [ ] 
- [ ] 

## Restaurants to Try
- 
- 
- 

## Packing List
- [ ] 
- [ ] 
- [ ] 

## Important Documents
- [ ] Passport
- [ ] Tickets
- [ ] Hotel confirmations
- [ ] Travel insurance

## Emergency Contacts
- 

## Notes
`,
    tags: ['travel', 'planning', 'vacation']
  },
  {
    id: 'recipe',
    name: 'Recipe',
    description: 'Document your favorite recipes',
    category: 'Cooking',
    icon: '👨‍🍳',
    content: `# Recipe: [Dish Name]

**Prep Time:** 
**Cook Time:** 
**Total Time:** 
**Servings:** 
**Difficulty:** ⭐⭐⭐

## Ingredients
- 
- 
- 

## Equipment
- 
- 

## Instructions
1. 
2. 
3. 

## Tips & Variations
- 
- 

## Nutritional Info
**Calories per serving:** 

## Source
Where did this recipe come from?

## Rating & Notes
⭐⭐⭐⭐⭐

Personal notes about the recipe:
`,
    tags: ['recipe', 'cooking', 'food']
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    description: 'Set and track your goals effectively',
    category: 'Personal Development',
    icon: '🎯',
    content: `# Goal: [Goal Name]

## Vision
What do I want to achieve and why?

## SMART Goal
**Specific:** 
**Measurable:** 
**Achievable:** 
**Relevant:** 
**Time-bound:** 

## Action Plan
### Phase 1 (Dates)
- [ ] 
- [ ] 

### Phase 2 (Dates)
- [ ] 
- [ ] 

### Phase 3 (Dates)
- [ ] 
- [ ] 

## Resources Needed
- 
- 

## Potential Obstacles
- **Obstacle:** 
  **Solution:** 

## Success Metrics
How will I know I've achieved this goal?
- 
- 

## Motivation
Why is this goal important to me?

## Accountability
Who will help me stay on track?

## Review Schedule
- [ ] Weekly check-in
- [ ] Monthly review
- [ ] Quarterly assessment

## Progress Log
`,
    tags: ['goals', 'planning', 'personal-development']
  }
]

export const getTemplatesByCategory = () => {
  const categories = Array.from(new Set(noteTemplates.map(t => t.category)))
  return categories.reduce((acc, category) => {
    acc[category] = noteTemplates.filter(t => t.category === category)
    return acc
  }, {} as Record<string, NoteTemplate[]>)
}

export const getTemplateById = (id: string): NoteTemplate | undefined => {
  return noteTemplates.find(t => t.id === id)
}